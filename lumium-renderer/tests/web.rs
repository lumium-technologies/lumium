//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use lumium_renderer::*;
use ring::rand::SecureRandom;
use ring::rand::SystemRandom;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn random_nonce() {
    let _ = get_random_nonce();
}

#[wasm_bindgen_test]
fn encryption_decryption() {
    const MSG: &str = "this is a super secret message";
    let data = MSG.as_bytes().to_vec();
    let mut key: [u8; 32] = [0; 32];
    let rand_gen = SystemRandom::new();
    rand_gen.fill(&mut key).unwrap();
    let cipher = encrypt_data(&key, data);
    let plain = decrypt_data(&key, cipher);
    assert_eq!(plain, MSG.as_bytes().to_vec());
}
