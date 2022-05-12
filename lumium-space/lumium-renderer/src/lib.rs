mod utils;

use katex;
use pulldown_cmark::{html, Options, Parser};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

fn render_inline_tex(tex: &str) -> String {
    let opts = katex::Opts::builder().display_mode(false).build().unwrap();
    match katex::render_with_opts(tex, &opts) {
        Ok(html) => html,
        Err(_) => {
            log!("TeX rendering error");
            "".to_string()
        }
    }
}

fn render_block_tex(tex: &str) -> String {
    let opts = katex::Opts::builder().display_mode(true).build().unwrap();
    match katex::render_with_opts(tex, &opts) {
        Ok(html) => html,
        Err(_) => {
            log!("TeX rendering error");
            "".to_string()
        }
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn render_markdown(markdown: &str) {
    log!("Initializing Markdown Render Engine...");
    let window = web_sys::window().expect("global window does not exists");
    let document = window.document().expect("expecting a document on window");
    let val = document.get_element_by_id("page-canvas").unwrap();
    val.set_inner_html(markdown);
    let mut md_katex = String::new();
    let mut start = 0;
    let mut end = false;
    let indices: Vec<_> = markdown.match_indices("$$").into_iter().collect();
    for (index, _) in indices {
        if !end {
            md_katex.push_str(&markdown[start..index]);
            start = index;
            end = true;
        } else {
            md_katex.push_str(&render_block_tex(&markdown[(start + 2)..index]));
            end = false;
        }
    }
    val.set_inner_html(md_katex.as_str());
    let mut start = 0;
    let mut end = false;
    let mut preprocessed_markdown = String::new();
    let indices: Vec<_> = md_katex.match_indices("$").into_iter().collect();
    for (index, _) in indices {
        if !end {
            preprocessed_markdown.push_str(&md_katex[start..index]);
            start = index;
            end = true;
        } else {
            preprocessed_markdown.push_str(&render_inline_tex(&md_katex[(start + 1)..index]));
            end = false;
        }
    }
    val.set_inner_html(preprocessed_markdown.as_str());
    let parser = Parser::new_ext(&preprocessed_markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    val.set_inner_html(&html_out);
    log!("Finished rendering to DOM");
}
