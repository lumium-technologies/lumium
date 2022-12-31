extern crate katex_renderer;
extern crate web_sys;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

use katex_renderer::render_katex;
use pulldown_cmark::{html, Options, Parser};
use seed::{self, prelude::*, *};
use serde::{Deserialize, Serialize};

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
pub struct Page {
    contents: Vec<String>,
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
