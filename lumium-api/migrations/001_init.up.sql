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
	is_selected BOOLEAN                  NOT NULL DEFAULT FALSE,
	is_verified BOOLEAN                  NOT NULL DEFAULT FALSE,

	created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at  TIMESTAMP WITH TIME ZONE          DEFAULT NULL,
	CONSTRAINT updated_after_created CHECK ( updated_at >= created_at ),
	CONSTRAINT deleted_after_created CHECK ( deleted_at IS NULL OR deleted_at >= created_at ),
	CONSTRAINT deleted_after_updated CHECK ( deleted_at IS NULL OR deleted_at >= updated_at )
);

-- unique unless soft-deleted
CREATE UNIQUE INDEX email_address_unique
	ON emails (address)
	WHERE deleted_at IS NULL;

CREATE TABLE sessions
(
	id            BIGSERIAL PRIMARY KEY,
	profile_id    UUID REFERENCES profiles (id),

	session_token TEXT                     NOT NULL UNIQUE,
	ip_address    INET                     NOT NULL,
	user_agent    TEXT                     NOT NULL, -- DEFAULT NULL instead?

	issued_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE spaces
(
	id         UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),

	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE          DEFAULT NULL,
	CONSTRAINT updated_after_created CHECK ( updated_at >= created_at ),
	CONSTRAINT deleted_after_created CHECK ( deleted_at IS NULL OR deleted_at >= created_at ),
	CONSTRAINT deleted_after_updated CHECK ( deleted_at IS NULL OR deleted_at >= updated_at )
);

CREATE TABLE profile_spaces
(
	id         BIGSERIAL PRIMARY KEY,
	profile_id UUID REFERENCES profiles (id),
	space_id   UUID REFERENCES spaces (id),
	is_owner   BOOLEAN DEFAULT FALSE
);

CREATE TABLE pages
(
	id         UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),

	cargo      TEXT                     NOT NULL DEFAULT '',

	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE          DEFAULT NULL,
	CONSTRAINT updated_after_created CHECK ( updated_at >= created_at ),
	CONSTRAINT deleted_after_created CHECK ( deleted_at IS NULL OR deleted_at >= created_at ),
	CONSTRAINT deleted_after_updated CHECK ( deleted_at IS NULL OR deleted_at >= updated_at )
);

CREATE TABLE space_pages
(
	id    BIGSERIAL PRIMARY KEY,
	space UUID REFERENCES spaces (id),
	page  UUID REFERENCES pages (id)
);
