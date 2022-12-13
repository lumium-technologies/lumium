mod utils;

extern crate katex_renderer;
extern crate web_sys;

use js_sys::Uint8Array;
use ring::aead::UnboundKey;
use ring::digest;
use ring::digest::digest;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

use katex_renderer::render_katex;
use passwords::PasswordGenerator;
use pulldown_cmark::{html, Options, Parser};
use ring::aead::{
    self, Aad, BoundKey, Nonce, NonceSequence, OpeningKey, SealingKey, AES_256_GCM, NONCE_LEN,
};
use ring::error;
use ring::rand::{SecureRandom, SystemRandom};
use seed::{self, prelude::*, *};
use serde::{Deserialize, Serialize};

#[wasm_bindgen(module = "/js/download.js")]
extern "C" {
    fn download(file: String, content: String);
}

const MASTER_KEY_BYTE_LENGTH: usize = 32;
const ACTIVATOR_KEY_BYTE_LENGTH: usize = 32;
const RECOVERY_CODES_FILE_NAME: &str = "lumium_recovery_codes.txt";

fn render_markdown(page: Option<JsValue>) -> String {
    let markdown = "".to_string();
    return markdown;
    let preprocessed_markdown = render_katex(markdown.to_string()).expect("Failed to render katex");
    let parser = Parser::new_ext(&preprocessed_markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    html_out
}

#[derive(Serialize)]
struct KeyVariantCreateDTO {
    activator: Vec<u8>,
    activator_nonce: Vec<u8>,
    value: Vec<u8>,
    value_nonce: Vec<u8>,
}

#[derive(Serialize)]
struct KeyCreateDTO {
    keys: Vec<KeyVariantCreateDTO>,
    activator: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
pub struct ContentElement {
    content: String,
    r#type: String,
}

#[derive(Serialize, Deserialize)]
pub struct PageContent {
    position: u32,
    content_element: ContentElement,
}

#[derive(Serialize, Deserialize)]
pub struct Page {
    contents: Vec<PageContent>,
}

async fn query(url: Url) -> Result<JsValue, JsValue> {
    let origin = format!(
        "{}/{}",
        env!("RENDERER_API_HOST").to_string(),
        url.path().join("/").as_str()
    );
    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let request = Request::new_with_str_and_init(origin.as_str(), &opts)?;

    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();

    let json = JsFuture::from(resp.json()?).await?;

    Ok(json)
}

fn get_page(url: Url, orders: &mut impl Orders<Msg>) {
    orders
        .skip()
        .perform_cmd(async { Msg::Loaded(Some(query(url).await)) });
}

fn init(url: Url, orders: &mut impl Orders<Msg>) -> Model {
    utils::set_panic_hook();
    get_page(url.clone(), orders);
    Model { url, page: None }
}

struct Model {
    url: Url,
    page: Option<JsValue>,
}

enum Msg {
    Loaded(Option<Result<JsValue, JsValue>>),
}

fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::Loaded(page) => {
            if let Some(res) = page {
                if let Ok(content) = res {
                    model.page = Some(content);
                }
            }
        }
    }
}

fn view(model: &Model) -> Node<Msg> {
    div![Node::from_html(
        Some(&Namespace::Html),
        &render_markdown(model.page.clone()),
    )]
}

#[wasm_bindgen]
pub fn render_page() {
    App::start("page-canvas", init, update, view);
}

#[wasm_bindgen]
pub async fn create_workspace(password: String) -> Result<JsValue, JsValue> {
    let sr = SystemRandom::new();
    let mut master_key: [u8; MASTER_KEY_BYTE_LENGTH] = [0; MASTER_KEY_BYTE_LENGTH];
    sr.fill(&mut master_key).unwrap();
    let mut activator_key: [u8; ACTIVATOR_KEY_BYTE_LENGTH] = [0; ACTIVATOR_KEY_BYTE_LENGTH];
    sr.fill(&mut activator_key).unwrap();
    let nonce_master_activator = get_random_nonce();
    let cipher_master_activator = encrypt_data(
        password.as_bytes(),
        nonce_master_activator.clone(),
        activator_key.to_vec(),
    );
    let nonce_master_value = get_random_nonce();
    let cipher_master_value = encrypt_data(
        password.as_bytes(),
        nonce_master_value.clone(),
        master_key.to_vec(),
    );
    let pg = PasswordGenerator {
        length: 8,
        numbers: true,
        lowercase_letters: true,
        uppercase_letters: true,
        symbols: true,
        spaces: true,
        exclude_similar_characters: false,
        strict: true,
    };
    let recovery_codes = pg.generate(10).unwrap();
    let mut variants = Vec::<KeyVariantCreateDTO>::new();
    variants.push(KeyVariantCreateDTO {
        activator_nonce: nonce_master_activator.to_vec(),
        activator: cipher_master_activator,
        value_nonce: nonce_master_value.to_vec(),
        value: cipher_master_value,
    });
    for recovery in &recovery_codes {
        let nonce_recovery_activator = get_random_nonce();
        let cipher_recovery_activator = encrypt_data(
            recovery.as_bytes(),
            nonce_recovery_activator.clone(),
            activator_key.to_vec(),
        );
        let nonce_recovery_value = get_random_nonce();
        let cipher_recovery_value = encrypt_data(
            recovery.as_bytes(),
            nonce_recovery_value.clone(),
            master_key.to_vec(),
        );
        variants.push(KeyVariantCreateDTO {
            activator_nonce: nonce_recovery_activator.to_vec(),
            activator: cipher_recovery_activator,
            value_nonce: nonce_recovery_value.to_vec(),
            value: cipher_recovery_value,
        });
    }
    let key_create_dto = KeyCreateDTO {
        keys: variants,
        activator: activator_key.to_vec(),
    };
    let mut opts = RequestInit::new();
    opts.method("PUT");
    opts.mode(RequestMode::Cors);
    opts.body(JsValue::from_serde(&key_create_dto).ok().as_ref());

    let origin = format!(
        "{}/{}",
        env!("RENDERER_API_HOST").to_string(),
        "v1/secure/workspace"
    );
    let request = Request::new_with_str_and_init(origin.as_str(), &opts)?;

    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    if resp.status() != 200 {
        return Err(JsValue::from("failed to create workspace"));
    }

    let json = JsFuture::from(resp.json()?).await?;

    download(
        RECOVERY_CODES_FILE_NAME.to_string(),
        recovery_codes.join("\n"),
    );

    Ok(json)
}

fn crypt_key(key: &[u8], nonce: Uint8Array) -> (UnboundKey, INonceSequence) {
    let digest = digest(&digest::SHA256, key);
    let key = digest.as_ref();
    let mut nonce_buf = [0; NONCE_LEN];
    nonce.copy_to(&mut nonce_buf);
    let nonce_sequence = INonceSequence::new(Nonce::assume_unique_for_key(nonce_buf));
    (UnboundKey::new(&AES_256_GCM, &key).unwrap(), nonce_sequence)
}

#[wasm_bindgen]
pub fn encrypt_data(key: &[u8], nonce: Uint8Array, mut data: Vec<u8>) -> Vec<u8> {
    let (key, nonce) = crypt_key(key, nonce);
    let mut encryption_key = SealingKey::new(key, nonce);
    encryption_key
        .seal_in_place_append_tag(Aad::empty(), &mut data)
        .unwrap();
    data
}

#[wasm_bindgen]
pub fn decrypt_data(key: &[u8], nonce: Uint8Array, mut data: Vec<u8>) -> Vec<u8> {
    let (key, nonce) = crypt_key(key, nonce);
    let mut decryption_key = OpeningKey::new(key, nonce);
    let length = data.len() - AES_256_GCM.tag_len();
    decryption_key
        .open_in_place(Aad::empty(), &mut data)
        .unwrap();
    data[..length].to_vec()
}

struct INonceSequence(Option<Nonce>);

impl INonceSequence {
    fn new(nonce: Nonce) -> Self {
        Self(Some(nonce))
    }
}

impl NonceSequence for INonceSequence {
    fn advance(&mut self) -> Result<Nonce, error::Unspecified> {
        self.0.take().ok_or(error::Unspecified)
    }
}

#[wasm_bindgen]
pub fn get_random_nonce() -> Uint8Array {
    let rand_gen = SystemRandom::new();
    let mut raw_nonce = [0u8; NONCE_LEN];
    rand_gen.fill(&mut raw_nonce).unwrap();
    let array = Uint8Array::new_with_length(NONCE_LEN as u32);
    array.copy_from(&raw_nonce);
    array
}
