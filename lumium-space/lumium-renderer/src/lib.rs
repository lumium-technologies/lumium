mod utils;

use katex::{self, OutputType};
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
    let opts = katex::Opts::builder()
        .display_mode(false)
        .output_type(OutputType::Html)
        .build()
        .unwrap();
    match katex::render_with_opts(tex, &opts) {
        Ok(html) => html,
        Err(err) => {
            log!("TeX rendering error: {}", err);
            tex.to_string()
        }
    }
}

fn render_block_tex(tex: &str) -> String {
    let opts = katex::Opts::builder()
        .display_mode(true)
        .output_type(OutputType::Html)
        .build()
        .unwrap();
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
pub fn render_markdown(markdown: &str) -> String {
    log!("Raw Markdown: {}", &markdown);
    log!("Initializing Markdown/KaTeX Render Engine...");
    let mut md_katex = String::new();
    let mut start = 0;
    let mut end = false;
    let indices: Vec<(usize, &str)> = markdown.match_indices("$$").into_iter().collect();
    log!("Indices: {:#?}", &indices);
    for (index, _) in &indices {
        if !end {
            md_katex.push_str(&markdown[start..*index]);
            end = true;
            start = *index;
        } else {
            md_katex.push_str(&render_block_tex(&markdown[(start + 2)..*index]));
            end = false;
            start = *index + 2;
        }
    }
    md_katex.push_str(&markdown[start..]);
    log!("Block KaTeX: {}", &md_katex);
    let mut start = 0;
    let mut end = false;
    let mut preprocessed_markdown = String::new();
    let indices: Vec<(usize, &str)> = md_katex.match_indices("$").into_iter().collect();
    for (index, _) in &indices {
        if !end {
            preprocessed_markdown.push_str(&md_katex[start..*index]);
            end = true;
            start = *index;
        } else {
            preprocessed_markdown.push_str(&render_inline_tex(&md_katex[(start + 1)..*index]));
            end = false;
            start = *index + 1;
        }
    }
    preprocessed_markdown.push_str(&md_katex[start..]);
    log!("Inline KaTeX: {}", &preprocessed_markdown);
    let parser = Parser::new_ext(&preprocessed_markdown, Options::all());
    let mut html_out = String::new();
    html::push_html(&mut html_out, parser);
    log!("Finished rendering markdown/KaTeX to HTML");
    log!("Output HTML: {}", &html_out);
    html_out
}
