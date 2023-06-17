use paste::paste;
use wasm_bindgen::prelude::*;

// Constants
gen_bindings!(X_LUMIUM_SESSION_HEADER, "x-lumium-session");
gen_bindings!(LOCAL_STORAGE_PASSWORD_KEY, "lumium-workspace-password");

// Frontend routes
gen_bindings!(SPACE_ROOT, "/");
gen_bindings!(SPACE_AUTH, "/auth");
gen_bindings!(SPACE_AUTH_SIGNIN, "/auth/signin");
gen_bindings!(SPACE_AUTH_SIGNUP, "/auth/signup");
gen_bindings!(SPACE_SPACES_CREATE, "/spaces/create");
gen_bindings!(SPACE_WORKSPACE_ID, "/");

// API routes
gen_bindings!(API_V1_DOCS, "/v1/docs");

gen_bindings!(API_V1_AUTH_SIGNOUT, "/v1/auth/signout");
gen_bindings!(API_V1_AUTH_SIGNUP, "/v1/auth/signup");
gen_bindings!(API_V1_AUTH_SIGNIN, "/v1/auth/signin");
gen_bindings!(API_V1_PROFILE, "/v1/profile");
gen_bindings!(API_V1_PROFILE_USERNAME, "/v1/profile/username");
gen_bindings!(API_V1_PROFILE_PASSWORD, "/v1/profile/password");
gen_bindings!(API_V1_PROFILE_EMAIL, "/v1/profile/email");
gen_bindings!(API_V1_WORKSPACE, "/v1/workspace");
