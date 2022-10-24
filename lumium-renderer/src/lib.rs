mod utils;

extern crate katex_renderer;
extern crate web_sys;

use ring::aead::UnboundKey;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

use katex_renderer::render_katex;
use passwords::PasswordGenerator;
use pulldown_cmark::{html, Options, Parser};
use ring::aead::{
    self, Aad, BoundKey, Nonce, NonceSequence, OpeningKey, SealingKey, AES_256_GCM,
    CHACHA20_POLY1305, NONCE_LEN,
};
use ring::error;
use ring::rand::{SecureRandom, SystemRandom};
use seed::{self, prelude::*, *};
use serde::{Deserialize, Serialize};

const MASTER_KEY_BYTE_LENGTH: usize = 32;
const ACTIVATOR_KEY_BYTE_LENGTH: usize = 32;

fn render_markdown(page: Option<JsValue>) -> String {
    let markdown = "".to_string();
    return markdown;
    let preprocessed_markdown = render_katex(markdown.to_string()).expect("Failed to render katex");
    let parser = Parser::new_ext(&preprocessed_markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    html_out
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
pub fn generate_workspace_key_with_recovery(password: JsValue) {
    // let sr = SystemRandom::new();
    // let mut master_key: [u8; MASTER_KEY_BYTE_LENGTH] = [0; MASTER_KEY_BYTE_LENGTH];
    // sr.fill(&mut master_key).unwrap();
    // let mut activator_key: [u8; ACTIVATOR_KEY_BYTE_LENGTH] = [0; ACTIVATOR_KEY_BYTE_LENGTH];
    // sr.fill(&mut activator_key).unwrap();
    // let activator_master = encrypt_data(&master_key, activator_key);
    // let pg = PasswordGenerator {
    //     length: 8,
    //     numbers: true,
    //     lowercase_letters: true,
    //     uppercase_letters: true,
    //     symbols: true,
    //     spaces: true,
    //     exclude_similar_characters: false,
    //     strict: true,
    // };
    // let mut recovery_codes = pg.generate(10).unwrap();
    todo!()
}

pub fn encrypt_data(key: &[u8], mut data: Vec<u8>) -> Vec<u8> {
    let (nonce, raw_nonce) = get_random_nonce();
    let nonce_sequence = INonceSequence::new(nonce);
    let mut encryption_key =
        SealingKey::new(UnboundKey::new(&AES_256_GCM, &key).unwrap(), nonce_sequence);
    encryption_key
        .seal_in_place_append_tag(Aad::empty(), &mut data)
        .unwrap();
    data
}

pub fn decrypt_data(key: &[u8], mut data: Vec<u8>) -> Vec<u8> {
    let (nonce, raw_nonce) = get_random_nonce();
    let nonce_sequence = INonceSequence::new(nonce);
    let mut decryption_key =
        OpeningKey::new(UnboundKey::new(&AES_256_GCM, &key).unwrap(), nonce_sequence);
    decryption_key
        .open_in_place(Aad::empty(), &mut data)
        .unwrap();
    data
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

pub fn get_random_nonce() -> (Nonce, [u8; NONCE_LEN]) {
    let rand_gen = SystemRandom::new();
    let mut raw_nonce = [0u8; NONCE_LEN];
    rand_gen.fill(&mut raw_nonce).unwrap();
    (Nonce::assume_unique_for_key(raw_nonce), raw_nonce)
}
