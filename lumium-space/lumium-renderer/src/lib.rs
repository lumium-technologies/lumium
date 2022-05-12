mod utils;

use pulldown_cmark::{html, Options, Parser};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn render_markdown(markdown: &str) {
    let parser = Parser::new_ext(markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    let window = web_sys::window().expect("global window does not exists");
    let document = window.document().expect("expecting a document on window");
    let val = document.get_element_by_id("page-canvas").unwrap();
    val.set_inner_html(&html_out);
}
