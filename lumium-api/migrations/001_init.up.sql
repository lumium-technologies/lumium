BEGIN;

CREATE TABLE profiles
(
	id         UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),

	username   TEXT                     NOT NULL UNIQUE,
	pwd_hash   TEXT                     NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE          DEFAULT NULL,
	CONSTRAINT updated_after_created CHECK ( updated_at >= created_at ),
	CONSTRAINT deleted_after_created CHECK ( deleted_at IS NULL OR deleted_at >= created_at ),
	CONSTRAINT deleted_after_updated CHECK ( deleted_at IS NULL OR deleted_at >= updated_at )
);

CREATE TABLE emails
(
	id          BIGSERIAL PRIMARY KEY,
	profile_id  UUID REFERENCES profiles (id),

	address     TEXT                     NOT NULL,
	is_primary  BOOLEAN                  NOT NULL DEFAULT FALSE,
	is_verified BOOLEAN                  NOT NULL DEFAULT FALSE,

	created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at  TIMESTAMP WITH TIME ZONE          DEFAULT NULL,
	CONSTRAINT updated_after_created CHECK ( updated_at >= created_at ),
	CONSTRAINT deleted_after_created CHECK ( deleted_at IS NULL OR deleted_at >= created_at ),
	CONSTRAINT deleted_after_updated CHECK ( deleted_at IS NULL OR deleted_at >= updated_at )
);

CREATE UNIQUE INDEX email_address_unique
	ON emails (address)
	WHERE deleted_at IS NULL;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sessions
(
	id            BIGSERIAL PRIMARY KEY,
	profile_id    UUID REFERENCES profiles (id),

	session_token TEXT                     NOT NULL UNIQUE DEFAULT digest(gen_random_bytes(1024), 'sha512'),
    session_id    TEXT                     NOT NULL UNIQUE DEFAULT digest(gen_random_bytes(1024), 'sha512'),
	ip_address    INET                     NOT NULL,
	user_agent    TEXT                     NOT NULL,

	issued_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE session_secret_ttl
(
    ttl INTERVAL NOT NULL DEFAULT INTERVAL '12 hours' UNIQUE
);

INSERT INTO session_secret_ttl (ttl) VALUES (INTERVAL '12 hours');

ALTER TABLE session_secret_ttl ADD CHECK (ttl = INTERVAL '12 hours');

CREATE OR REPLACE FUNCTION update_session_secret() RETURNS void LANGUAGE plpgsql AS
$func$
BEGIN
    PERFORM 1 FROM session_secrets
        WHERE status = 'active' AND
        ((now() - issued_at) < (SELECT ttl FROM session_secret_ttl));
    IF NOT FOUND THEN
        UPDATE session_secrets SET status = 'inactive' WHERE status = 'phase_out';
        UPDATE session_secrets SET status = 'phase_out' WHERE status = 'active';
        INSERT INTO session_secrets DEFAULT VALUES;
    END IF;
END
$func$;

CREATE OR REPLACE FUNCTION gen_session_id() RETURNS trigger LANGUAGE plpgsql AS
$func$
BEGIN
    PERFORM update_session_secret();
    NEW.session_id := hmac(NEW.session_token, (SELECT s.value FROM session_secrets s WHERE s.status = 'active'), 'sha512');
    RETURN NEW;
END
$func$;

CREATE TRIGGER gen_session_id_before_insert BEFORE INSERT ON sessions FOR EACH ROW EXECUTE FUNCTION gen_session_id();

CREATE TYPE session_secret_status AS ENUM ('active', 'phase_out', 'inactive');

CREATE TABLE session_secrets
(
    id         BIGSERIAL PRIMARY KEY,

    value      TEXT                     NOT NULL UNIQUE DEFAULT digest(gen_random_bytes(1024), 'sha512'),
    status     session_secret_status    NOT NULL        DEFAULT 'active',

    issued_at  TIMESTAMP WITH TIME ZONE NOT NULL        DEFAULT now()
);

CREATE UNIQUE INDEX session_secrets_active_unique
    ON session_secrets (status)
    WHERE status = 'active';

END;
