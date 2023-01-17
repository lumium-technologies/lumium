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

CREATE TABLE sessions
(
	id            BIGSERIAL PRIMARY KEY,

	session_token TEXT NOT NULL UNIQUE,
	ip_address    TEXT NOT NULL,
	user_agent    TEXT NOT NULL, -- DEFAULT NULL instead?

	profile_id    UUID REFERENCES profiles (id)
);
