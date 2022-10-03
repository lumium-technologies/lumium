mod utils;

use katex_renderer::render_katex;
use pulldown_cmark::{html, Options, Parser};
use seed::{prelude::*, *};
use wasm_bindgen::prelude::*;

extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn render_markdown(markdown: &str) -> String {
    let preprocessed_markdown = render_katex(markdown.to_string()).expect("Failed to render katex");
    let parser = Parser::new_ext(&preprocessed_markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    html_out
}

fn init(_: Url, _: &mut impl Orders<Msg>) -> Model {
    utils::set_panic_hook();
    Model {
        page: "# Probability Theory
# Definitions and Basic Terms
<aside>
💡 A *discrete probability space* is defined by the *sample space/possibility space* $\\Omega = \\{\\omega_1, \\omega_2,...\\}$ of *elementary events*. An (elementary-) probability $\\Pr[\\omega_i]$ is assigned to every elementary event $\\omega_i$, where we require $0\\leq \\Pr[\\omega_i] \\leq 1$ and
$$
\\sum_{\\omega \\in \\Omega} \\Pr[\\omega]=1.
$$
A set $E \\sube \\Omega$ is called an *event*. The probability $\\Pr[E]$ of an event is defined by
$$
\\Pr[E] = \\sum_{\\omega \\in E} \\Pr[\\omega].
$$".to_string()
    }
}

struct Model {
    page: String,
}

enum Msg {
    Page(String),
}

fn update(msg: Msg, model: &mut Model, _: &mut impl Orders<Msg>) {
    match msg {
        Msg::Page(md) => model.page = md,
    }
}

fn view(model: &Model) -> Node<Msg> {
    div![Node::from_html(
        Some(&Namespace::Html),
        &render_markdown(model.page.as_str()),
    )]
}

#[wasm_bindgen]
pub fn render_page() {
    App::start("page-canvas", init, update, view);
}
