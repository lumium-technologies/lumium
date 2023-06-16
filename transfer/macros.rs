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
