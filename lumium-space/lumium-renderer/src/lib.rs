mod utils;

use pulldown_cmark::{html, Options, Parser};
use regex::{Captures, Regex};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn render_inline_tex(cap: &Captures) -> String {
    String::new()
}

fn render_block_tex(cap: &Captures) -> String {
    let thing = cap.get(1).unwrap().as_str();
    web_sys::console::log_2(&"%s".into(), &thing.into());
    thing.to_string()
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn render_markdown(markdown: &str) {
    let parser = Parser::new_ext(markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    let window = web_sys::window().expect("global window does not exists");
    let document = window.document().expect("expecting a document on window");
    let val = document.get_element_by_id("page-canvas").unwrap();
    let re = Regex::new(r"\$\$.+\$\$").unwrap();
    let mut count = 0;
    re.replace_all(&mut html_out, |cap: &Captures| {
        if count % 2 != 0 {
            return "".to_string();
        }
        count += 1;
        render_block_tex(cap)
    });
    let re = Regex::new(r"\$.+\$").unwrap();
    let mut count = 0;
    re.replace_all(&mut html_out, |cap: &Captures| {
        if count % 2 != 0 {
            return "".to_string();
        }
        count += 1;
        render_inline_tex(cap)
    });
    val.set_inner_html(&html_out);
}
