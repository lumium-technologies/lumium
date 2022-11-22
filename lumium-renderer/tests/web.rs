//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use std::vec::Vec;

use lumium_renderer::get_random_nonce;
use lumium_renderer::*;
use ring::rand::SecureRandom;
use ring::rand::SystemRandom;
use wasm_bindgen_test::console_log;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn random_nonce() {
    let _ = get_random_nonce();
}

#[wasm_bindgen_test]
fn encryption_decryption() {
    const MSG: &str = "this is a super secret message, that nobody will ever be able to decrypt";
    console_log!("msg-plain: {:?}", MSG);
    let data = MSG.as_bytes().to_vec();
    console_log!("msg-utf8: {:?}", data);
    let mut key: [u8; 32] = [0; 32];
    let rand_gen = SystemRandom::new();
    rand_gen.fill(&mut key).unwrap();
    console_log!("key: {:?}", key);
    let nonce = get_random_nonce();
    console_log!("nonce: {:?}", nonce.to_string());
    let cipher = encrypt_data(&key, nonce.clone(), data.clone());
    console_log!("cipher: {:?}", cipher);
    let plain = decrypt_data(&key, nonce, cipher);
    console_log!("decrypt: {}", std::str::from_utf8(&plain).unwrap());
    assert_eq!(std::str::from_utf8(&plain).unwrap(), MSG);
}
