mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;

use katex_renderer::render_katex;
use pulldown_cmark::{html, Options, Parser};
use seed::{self, prelude::*, *};
use serde::{Deserialize, Serialize};

fn render_markdown(page: &Page) -> String {
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

async fn query(url: Url) -> fetch::Result<Page> {
    let base_url = env!("API_HOST");
    Ok(Page { contents: vec![] })
}

fn get_page(url: Url, orders: &mut impl Orders<Msg>) {
    orders
        .skip()
        .perform_cmd(async { Msg::Loaded(Some(query(url).await)) });
}

fn init(url: Url, _: &mut impl Orders<Msg>) -> Model {
    utils::set_panic_hook();
    Model { url, page: None }
}

struct Model {
    url: Url,
    page: Option<Page>,
}

enum Msg {
    Load,
    Loaded(Option<fetch::Result<Page>>),
}

fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::Load => get_page(model.url.clone(), orders),
        Msg::Loaded(page) => model.page = Some(page.unwrap().ok().unwrap()),
    }
}

fn view(model: &Model) -> Node<Msg> {
    if model.page.is_none() {
        return div!(ev(Ev::Load, |f| Msg::Load));
    }
    div![Node::from_html(
        Some(&Namespace::Html),
        &render_markdown(model.page.as_ref().unwrap()),
    )]
}

#[wasm_bindgen]
pub fn render_page() {
    App::start("page-canvas", init, update, view);
}
