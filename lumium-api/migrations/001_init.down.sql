BEGIN;

DROP TABLE profiles CASCADE;
DROP TABLE emails CASCADE;
DROP TABLE sessions CASCADE;
DROP TABLE session_secret_ttl CASCADE;
DROP FUNCTION update_session_secret();
DROP FUNCTION gen_session_id();
DROP TABLE session_secrets CASCADE;
DROP TYPE session_secret_status;
DROP TABLE workspaces CASCADE;
DROP TABLE end_to_end_keys CASCADE;
DROP TABLE end_to_end_key_variants CASCADE;
DROP TABLE workspace_admins CASCADE;
DROP TABLE workspace_members CASCADE;
DROP TABLE workspace_visitors CASCADE;
DROP TABLE pages CASCADE;
DROP TABLE page_admins CASCADE;
DROP TABLE page_members CASCADE;
DROP TABLE page_visitors CASCADE;

END;
