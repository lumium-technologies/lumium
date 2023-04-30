use paste::paste;
use wasm_bindgen::prelude::*;

macro_rules! gen_bindings {
    ($t:ident, $val:literal) => {
        paste! {
            pub static $t: &str = $val;

            #[allow(dead_code)]
            #[wasm_bindgen]
            pub fn [<get_ $t:lower>]() -> String {
                $t.to_string()
            }
        }
    };
}

gen_bindings!(X_LUMIUM_SESSION_HEADER, "x-lumium-session");
gen_bindings!(LOCAL_STORAGE_PASSWORD_KEY, "lumium-workspace-password");

gen_bindings!(DOCS, "/v1/docs");

gen_bindings!(SIGNOUT, "/v1/auth/signout");
gen_bindings!(SIGNUP, "/v1/auth/signup");
gen_bindings!(SIGNIN, "/v1/auth/signin");
gen_bindings!(PROFILE, "/v1/profile");
gen_bindings!(USERNAME, "/v1/profile/username");
gen_bindings!(PASSWORD, "/v1/profile/password");
gen_bindings!(EMAIL, "/v1/profile/email");
gen_bindings!(WORKSPACE, "/v1/workspace");
