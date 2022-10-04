mod utils;

use katex_renderer::render_katex;
use pulldown_cmark::{html, Options, Parser};
use seed::{prelude::*, *};
use serde::Deserialize;
use wasm_bindgen::prelude::*;
use web_sys::Request;

extern crate web_sys;

#[wasm_bindgen]
pub fn render_markdown(markdown: &str) -> String {
    let preprocessed_markdown = render_katex(markdown.to_string()).expect("Failed to render katex");
    let parser = Parser::new_ext(&preprocessed_markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    html_out
}

#[derive(Deserialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
struct ContentElement {
    content: String,
    r#type: String,
}

#[derive(Deserialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
struct PageContent {
    position: u32,
    content_element: ContentElement,
}

#[derive(Deserialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
struct Page {
    contents: Vec<PageContent>,
}

fn get_page_contents() -> String {
    let url = env!("API_HOST");
    //let req = Request::new(url);
    "".to_string()
}

fn init(_: Url, _: &mut impl Orders<Msg>) -> Model {
    utils::set_panic_hook();
    let content = get_page_contents();
    Model { content }
}

struct Model {
    content: String,
}

enum Msg {
    Content(String),
}

fn update(msg: Msg, model: &mut Model, _: &mut impl Orders<Msg>) {
    match msg {
        Msg::Content(md) => model.content = md,
    }
}

fn view(model: &Model) -> Node<Msg> {
    div![Node::from_html(
        Some(&Namespace::Html),
        &render_markdown(model.content.as_str()),
    )]
}

#[wasm_bindgen]
pub fn render_page() {
    App::start("page-canvas", init, update, view);
}
