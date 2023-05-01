use paste::paste;
use wasm_bindgen::prelude::*;

macro_rules! gen_ts_mapping {
    ($t:ty) => {
        paste! {
            #[wasm_bindgen]
            extern "C" {
                #[wasm_bindgen(typescript_type = $t)]
                pub type [<T $t>];
            }

            impl From<$t> for [<T $t>] {
                fn from(value: $t) -> Self {
                    Self {
                        obj: serde_wasm_bindgen::to_value(&value).unwrap(),
                    }
                }
            }

            impl From<[<T $t>]> for $t {
                fn from(value: [<T $t>]) -> Self {
                    serde_wasm_bindgen::from_value(value.obj).unwrap()
                }
            }

            impl From<JsValue> for $t {
                fn from(value: JsValue) -> Self {
                    serde_wasm_bindgen::from_value(value).unwrap()
                }
            }
        }
    };
}

pub(crate) use gen_ts_mapping;

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
