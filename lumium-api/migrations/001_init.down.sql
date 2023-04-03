BEGIN;

DROP TABLE profiles CASCADE;
DROP TABLE emails CASCADE;
DROP TABLE sessions CASCADE;
DROP TABLE session_secrets CASCADE;
DROP TYPE session_secret_status;
DROP TABLE session_secret_ttl CASCADE;
DROP FUNCTION gen_session_id();
DROP FUNCTION update_session_secret();

END;
