BEGIN;

CREATE TABLE profiles
(
	id         UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),

	username   TEXT                     NOT NULL UNIQUE,
	pwd_hash   TEXT                     NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE emails
(
	id          BIGSERIAL PRIMARY KEY,
	profile_id  UUID                     NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,

	address     TEXT                     NOT NULL,
	is_primary  BOOLEAN                  NOT NULL DEFAULT FALSE,
	is_verified BOOLEAN                  NOT NULL DEFAULT FALSE,

	created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX emails_one_primary_per_profile
    ON emails (profile_id, is_primary)
    WHERE is_primary IS TRUE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sessions
(
	id            BIGSERIAL PRIMARY KEY,
	profile_id    UUID                     NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,

	session_token BYTEA                    NOT NULL UNIQUE DEFAULT digest(gen_random_bytes(1024), 'sha512'),
    session_id    TEXT                     NOT NULL UNIQUE,
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
    NEW.session_id := encode(hmac(NEW.session_token, (SELECT s.value FROM session_secrets s WHERE s.status = 'active'), 'sha512'), 'hex');
    RETURN NEW;
END
$func$;

CREATE TRIGGER gen_session_id_before_insert BEFORE INSERT ON sessions FOR EACH ROW EXECUTE FUNCTION gen_session_id();

CREATE TYPE session_secret_status AS ENUM ('active', 'phase_out', 'inactive');

CREATE TABLE session_secrets
(
    id         BIGSERIAL PRIMARY KEY,

    value      BYTEA                    NOT NULL UNIQUE DEFAULT digest(gen_random_bytes(1024), 'sha512'),
    status     session_secret_status    NOT NULL        DEFAULT 'active',

    issued_at  TIMESTAMP WITH TIME ZONE NOT NULL        DEFAULT now()
);

CREATE UNIQUE INDEX session_secrets_active_unique
    ON session_secrets (status)
    WHERE status = 'active';

CREATE TABLE workspaces
(
    id          UUID PRIMARY KEY    DEFAULT gen_random_uuid(),
    owner_id    UUID                NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,

    name        TEXT                NOT NULL
);

CREATE TABLE end_to_end_keys
(
    workspace_id    UUID PRIMARY KEY    REFERENCES workspaces (id) ON DELETE CASCADE,

    activator       BYTEA               NOT NULL UNIQUE
);

CREATE TABLE end_to_end_key_variants
(
    id          UUID PRIMARY KEY    DEFAULT gen_random_uuid(),
    key_id      UUID                NOT NULL        REFERENCES end_to_end_keys (workspace_id) ON DELETE CASCADE,

    activator   BYTEA               NOT NULL UNIQUE,
    value       BYTEA               NOT NULL UNIQUE
);

CREATE TABLE workspace_admins
(
    workspace_id UUID NOT NULL REFERENCES workspaces (id)   ON DELETE CASCADE,
    profile_id   UUID NOT NULL REFERENCES profiles (id)     ON DELETE CASCADE,
    CONSTRAINT pk_workspace_admins PRIMARY KEY (workspace_id, profile_id)
);

CREATE TABLE workspace_members
(
    workspace_id UUID NOT NULL REFERENCES workspaces (id)   ON DELETE CASCADE,
    profile_id   UUID NOT NULL REFERENCES profiles (id)     ON DELETE CASCADE,
    CONSTRAINT pk_workspace_members PRIMARY KEY (workspace_id, profile_id)
);

CREATE TABLE workspace_visitors
(
    workspace_id UUID NOT NULL REFERENCES workspaces (id)   ON DELETE CASCADE,
    profile_id   UUID NOT NULL REFERENCES profiles (id)     ON DELETE CASCADE,
    CONSTRAINT pk_workspace_visitors PRIMARY KEY (workspace_id, profile_id)
);

CREATE TABLE pages
(
    id          UUID PRIMARY KEY    DEFAULT gen_random_uuid(),
    owner_id    UUID                NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,

    content     TEXT,
    name        TEXT NOT NULL
);

CREATE TABLE page_admins
(
    page_id      UUID NOT NULL REFERENCES pages (id)    ON DELETE CASCADE,
    profile_id   UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT pk_page_admins PRIMARY KEY (page_id, profile_id)
);

CREATE TABLE page_members
(
    page_id      UUID NOT NULL REFERENCES pages (id)    ON DELETE CASCADE,
    profile_id   UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT pk_page_members PRIMARY KEY (page_id, profile_id)
);

CREATE TABLE page_visitors
(
    page_id      UUID NOT NULL REFERENCES pages (id)    ON DELETE CASCADE,
    profile_id   UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT pk_page_visitors PRIMARY KEY (page_id, profile_id)
);

END;
