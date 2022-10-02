mod utils;

use katex::{self, OutputType};
use pulldown_cmark::{html, Options, Parser};
use seed::{prelude::*, *};
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
    let mut md_katex = String::new();
    let mut start = 0;
    let mut end = false;
    let indices: Vec<(usize, &str)> = markdown.match_indices("$$").into_iter().collect();
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
$$

If $E$ is an event, then we define $\\bar{E} = \\Omega \\setminus E$ as the *complementary event* of $E$.

</aside>

<aside>
📌 *For events $A, B$ the following hold:*

1. $\\Pr[\\varnothing] = 0, \\Pr[\\Omega]=1$
2. $0 \\leq \\Pr[A] \\leq 1$
3. $\\Pr[\\bar{A}] = 1-\\Pr[A]$
4. *If $A \\sube B$, then it follows that $\\Pr[A] \\leq \\Pr[B].$*
</aside>

<aside>
📖 (Addition theorem).

*If the events $A_1,...,A_n$ are pairwise disjoint (i.e., if it holds for all pairs $i \\neq j$ that $A_i \\cap A_j = \\varnothing$), then it holds that*

$$
\\Pr\\bigg[\\bigcup_{i=1}^n A_i \\bigg] = \\sum_{i=1}^n \\Pr[A_i].
$$

*For an infinite set of disjoint events $A_1, A_2,...$ it holds analogously*

$$
\\Pr\\bigg[\\bigcup_{i=1}^\\infty A_i \\bigg] = \\sum_{i=1}^\\infty \\Pr[A_i].
$$

</aside>

<aside>
📖 (The sieve formula, Inclusion-Exclusion principle).

*For events $A_1,...,A_n \\quad (n \\geq 2)$ the following holds:*

$$
\\begin{align*}
        \\Pr\\bigg[\\bigcup_{i = 1}^n A_i  = \\bigg] & = \\sum_{l=1}^n (-1)^{l+1} \\sum_{1 \\leq i_1 \\lt ...\\lt i_l \\leq n} \\Pr[A_{i_1}\\cap...\\cap A_{i_l}] \\\\
& = \\sum_{i=1}^n \\Pr[A_i] - \\sum_{1 \\leq i_1 \\lt i_2 \\leq n} \\Pr[A_{i_1}\\cap A_{i_2}] \\\\
& \\quad\\quad + \\sum_{1 \\leq i_1 \\lt i_2\\lt i_3 \\leq n} \\Pr[A_{i_1}\\cap A_{i_2} \\cap A_{i_3}] - ... \\\\
& \\quad\\quad + (-1)^{n+1} \\cdot \\Pr[A_1 \\cap ... \\cap A_n].
\\end{align*}
$$

</aside>

<aside>
📎 (Boole’s Inequality, Union Bound).

*For events $A_1, ..., A_n$ the following holds:*

$$
\\Pr\\bigg[\\bigcup_{i=1}^n A_i \\bigg] \\leq \\sum_{i=1}^n \\Pr[A_i].
$$

*Analogously, the following holds for an infinite sequence of events $A_1, A_2,...$:*

$$
\\Pr\\bigg[\\bigcup_{i=1}^\\infty A_i \\bigg] \\leq \\sum_{i=1}^\\infty \\Pr[A_i].
$$

</aside>

<aside>
💡 (Principle of Laplace).

*If nothings indicates otherwise, we assume that all elementary events are equally likely.*

Therefore, $\\Pr[\\omega] = \\frac{1}{\\lvert \\Omega \\rvert}$ for all elementary events $\\omega$.

It immediately follows for an arbitrary event $E$ that

$$
\\Pr[E] = \\frac{\\lvert E \\rvert}{\\lvert \\Omega \\rvert}.
$$

We say, the event of the modeled experiment on $\\Omega$ is *uniformly distributed* or *equally distributed*.

</aside>

<aside>
💡 In an information-theoretical sense such a probability space ($\\Pr[\\omega] = \\frac{1}{\\lvert \\Omega \\rvert}$ for all $\\omega \\in \\Omega$) has the largest-possible entropy. Every deviation from uniform probability distribution requires that we put more information into the model (and therefore decrease entropy).

</aside>

# Conditional Probability

<aside>
💡 Let $A$ and $B$ be events with $\\Pr[B] \\gt 0$. The *conditional probability* $\\Pr[A \\vert B]$ of $A$ given $B$ is defined by

$$
\\Pr[A \\vert B] = \\frac{\\Pr[A \\cap B]}{\\Pr[B]}.
$$

</aside>

<aside>
💡 The conditional probabilities of the form $\\Pr[\\cdot \\vert B]$ form a new probability space over $\\Omega$ for an arbitrary event $B \\sube \\Omega$ with $\\Pr[B] \\gt 0$.

The probabilities of the elementary events $\\omega_i$ are calculated through $\\Pr[\\omega_i \\vert B]$. Then

$$
\\sum_{\\omega \\in \\Omega}\\Pr[\\omega \\vert B] = \\sum_{\\omega \\in \\Omega} \\frac{\\Pr[\\omega \\cap B]}{\\Pr[B]} = \\sum_{\\omega \\in B} \\frac{\\Pr[\\omega]}{\\Pr[B]} = \\frac{\\Pr[B]}{\\Pr[B]} = 1.
$$

the definition of a discrete probability space is still fulfilled and therefore all rules for probabilities still apply to conditional probabilities.

</aside>

<aside>
📖 (Multiplication theorem).

*Let the events $A_1, ..., A_n$ be given. If $\\Pr[A_1 \\cap ... \\cap A_n] \\gt 0$ then the following holds:*

$$
\\Pr[A_1 \\cap...\\cap A_n] = \\Pr[A_1] \\cdot \\Pr[A_2 \\vert A_1] \\cdot \\Pr[A_3 \\vert A_1 \\cap A_2] \\cdot ... \\cdot \\Pr[A_1 \\cap ... \\cap A_{n-1}].
$$

</aside>

<aside>
📖 (Law of total probability).

*Let the events $A_1,...,A_n$ be pairwise disjoint and let $B \\sube A_1 \\cup ... \\cup A_n.$ Then it follows that*

$$
\\Pr[B] = \\sum_{i = 1}^n \\Pr[B \\vert A_i] \\cdot \\Pr[A_i].
$$

*Analogously, for pairwise disjoint events $A_1, A_2,...$ with $B \\sube \\bigcup_{i=1}^\\infty A_i$ it follows that*

$$
\\Pr[B] = \\sum_{i=1}^\\infty \\Pr[B \\vert A_i] \\cdot \\Pr[A_i].
$$

</aside>

<aside>
📖 (Bayes’ theorem).

*Let the events $A_1, ..., A_n$ be pairwise disjoint. Furthermore, let $B \\sube A_1 \\cup ... \\cup A_n$ be an event with $\\Pr[B] \\gt 0$. Then it holds for an arbitrary $i = 1,...,n$ that*

$$
\\Pr[A_i \\vert B] = \\frac{\\Pr[A_i \\cap B]}{\\Pr[B]} = \\frac{\\Pr[B \\vert A_i] \\cdot \\Pr[A_i]}{\\sum_{j=1}^n \\Pr[B \\vert A_j] \\cdot \\Pr[A_j]}.
$$

*Analogously, for pairwise disjoint events $A_1, A_2, ...$ with $B \\sube \\bigcup_{i=1}^\\infty A_i$ it holds that*

$$
\\Pr[A_i \\vert B] = \\frac{\\Pr[A_i \\cap B]}{\\Pr[B]} = \\frac{\\Pr[B \\vert A_i] \\cdot \\Pr[A_i]}{\\sum_{j=1}^\\infty \\Pr[B \\vert A_j] \\cdot \\Pr[A_j]}.
$$

</aside>

# Independence

<aside>
💡 The events $A$ and $B$ are called *independent* if

$$
\\Pr[A \\cap B] = \\Pr[A] \\cdot \\Pr[B]
$$

</aside>

<aside>
💡 The events $A_1, ...,A_n$ are called *independent* if it holds for all subsets $I \\sube \\{1,...,n\\}$ with $I = \\{i_1, ...,i_k\\}$ that

$$
\\Pr[A_{i_1} \\cap ... \\cap A_{i_k}] = \\Pr[A_{i_1}]\\cdot ... \\cdot \\Pr[A_{i_k}].
$$

An infinite family of events $A_i$ with $i \\in \\mathbb{N}$ is called independent if the above condition is met for all finite subsets $I \\sube \\mathbb{N}$.

</aside>

<aside>
📌 *The events $A_1,...,A_n$ are independent if and only if it holds for all $(s_1,...,s_n) \\in \\{0,1\\}^n$ that*

$$
\\Pr[A_1^{s_1}\\cap...\\cap A_n^{s_n}] = \\Pr[A_1^{s_1}] \\cdot ... \\cdot \\Pr[A_n^{s_n}],
$$

*where $A_i^0 = \\bar{A}_i$ and $A_i^1 = A_i$.*

</aside>

<aside>
📌 *Let $A$, $B$ and $C$ be independent events. Then $A \\cap B$ and $C$ respectively $A \\cup B$ and $C$ independent.*

</aside>

# Random Variables

<aside>
💡 A *random variable* is a transformation $\\Chi : \\Omega \\longrightarrow \\mathbb{R}$, where $\\Omega$ is the possibility space of a probability space.

</aside>

<aside>
💡 In discrete probability spaces the *codomain* of a random variable

$$
W_\\Chi = \\Chi(\\Omega) = \\{\\chi \\in \\mathbb{R} \\space \\vert \\space \\exists \\omega \\in \\Omega \\quad \\Chi(\\omega) = \\chi\\}
$$

is in all cases finite or countably infinite, depending on $\\Omega$ being finite or countably infinite.

</aside>

<aside>
💡 When researching a random variable $\\Chi$ one is interested in the probabilities with which $\\Chi$ assumes a specific value. For $W_{\\Chi} = \\{\\chi_1,...,\\chi_n\\}$ respectively $W_{\\Chi} = \\{\\chi_1,\\chi_2,...\\}$ for an arbitrary $1 \\leq i \\leq n$ respectively $\\chi_i \\in \\mathbb{N}$ we regard the event $\\Chi^{-1}(\\chi_i) = \\{\\omega \\in \\Omega \\space \\vert \\space \\Chi(\\omega) = \\chi_i\\}$. We abbreviate $\\Chi^{-1}(\\chi_i)$ as $\"\\Chi = \\chi_i\"$.

Therefore, we can define

$$
\\Pr[\\Chi \\leq \\chi_i] = \\sum_{\\chi \\in W_{\\Chi} \\space \\vert \\space \\chi \\leq \\chi_i} \\Pr[\\Chi = \\chi] = \\Pr[\\{\\omega \\in \\Omega \\space \\vert \\space \\Chi(\\omega) \\leq \\chi_i\\}].
$$

</aside>

<aside>
💡 The function

$$
\\begin{align*}
f_{\\Chi} : \\mathbb{R} & \\longrightarrow [0,1] \\\\
    \\chi & \\longmapsto \\Pr[\\Chi = \\chi]
    \\end{align*}
$$

is called the *density (function)* of $\\Chi$.

</aside>

<aside>
💡 The function

$$
\\begin{align*}
F_{\\Chi}: \\mathbb{R} & \\longrightarrow [0, 1] \\\\
    \\chi & \\longmapsto \\Pr[\\Chi \\leq \\chi] = \\sum_{\\chi' \\in W_{\\Chi} \\space \\vert \\space \\chi' \\leq \\chi} \\Pr[\\Chi = \\chi']
    \\end{align*}
$$

is called the *distribution (function) of $\\Chi$.*

</aside>

## Expected Value

<aside>
💡 For a random variable $\\Chi$ we define the *expected value* $\\mathbb{E}[\\Chi]$ as

$$
\\mathbb{E}[\\Chi] = \\sum_{\\chi \\in W_\\Chi} \\chi \\cdot \\Pr[\\Chi = \\chi]
$$

if that sum converges absolutely. Otherwise the expected value is said to be undefined.

</aside>

<aside>
📌 *If $\\Chi$ is a random variable then the following holds:*

$$
\\mathbb{E}[\\Chi]=\\sum_{\\omega \\in \\Omega} \\Chi(\\omega) \\cdot \\Pr[\\omega].
$$

</aside>

<aside>
📖 *Let $\\Chi$ a random variable with $W_{\\Chi} \\sube \\mathbb{N}_0$. Then it holds that*

$$
\\mathbb{E}[\\Chi] = \\sum_{i=1}^\\infty \\Pr[\\Chi \\leq i].
$$

</aside>

<aside>
💡 **Conditional Random Variables**

Let $\\Chi$ be a random variable and $A$ an event with $\\Pr[A] \\gt 0$. By $\\Chi \\vert A$ we denote that we calculate probabilities with which the random variable $\\Chi$ assumes specific values with respect to the on $A$ conditional probabilities. It thus holds that

$$
\\Pr[(\\Chi \\vert A) \\leq \\chi] = \\Pr[\\Chi \\leq \\chi \\vert A] = \\frac{\\Pr[\\{\\omega \\in A \\space \\vert \\space \\Chi(\\omega) \\leq \\chi\\}]}{\\Pr[A]}
$$

</aside>

<aside>
📖 *Let $\\Chi$ be a random variable. For pairwise disjoint events $A_1,...,A_n$ with $A_1 \\cup ...\\cup A_n = \\Omega$ and $\\Pr[A_1],...,\\Pr[A_n] \\gt 0$ it holds that*

$$
\\mathbb{E}[\\Chi] = \\sum_{i=1}^n \\mathbb{E}[\\Chi \\vert A_i] \\cdot \\Pr[A_i].
$$

*For pairwise disjoint events $A_1, A_2,...$ with $\\bigcup_{i=1}^\\infty A_k = \\Omega$ and $\\Pr[A_1], \\Pr[A_2],..\\gt 0$ it holds analogously that*

$$
\\mathbb{E}[\\Chi] = \\sum_{i = 1} ^\\infty \\mathbb{E}[\\Chi \\vert A_i] \\cdot \\Pr[A_i].
$$

</aside>

<aside>
💡 **Linearity of the Expected Value**

Assume, we have defined $n$ random variables:

$$
\\Chi_1,...,\\Chi_n : \\Omega \\longrightarrow \\mathbb{R}.
$$

For an $\\omega \\in \\Omega$ we thus receive $n$ real numbers $\\Chi_1(\\omega),...,\\Chi_n(\\omega)$. When we define a function $f : \\mathbb{R}^n \\longrightarrow \\mathbb{R}$ we immediately see that the concatenation $f(\\Chi_1,...,\\Chi_n)$ in turn is also a random variable, for it holds that:

$$
f(\\Chi_1, ..., \\Chi_n):\\Omega \\longrightarrow \\mathbb{R}.
$$

This holds for arbitrary functions $f : \\mathbb{R}^n \\longrightarrow \\mathbb{R}$, in particular for affine linear functions:

$$
\\begin{align*}
f : \\mathbb{R}^n & \\longrightarrow \\mathbb{R} \\\\
(\\chi_1,...,\\chi_n) & \\longmapsto a_1\\chi_1 + ... + a_n\\chi_n + b,
\\end{align*}
$$

where $a_1,...,a_n,b \\in \\mathbb{R}$ are arbitrary real numbers. In this case we usually denote the random variable $f(\\Chi_1,...,\\Chi_n)$ explicitly as

$$
\\Chi = a_1\\Chi_1 + ...+ a_n\\Chi_n + b.
$$

</aside>

<aside>
📖 (Linearity of the Expected Value).

*For random variables $\\Chi_1,...,\\Chi_n$ and $\\Chi = a_1\\Chi_1+...+a_n\\Chi_n+b$ with $a_1,..,a_n,b \\in \\mathbb{R}$ it holds that*

$$
\\mathbb{E}[\\Chi] = a_1 \\mathbb{E}[\\Chi] + ... + a_n \\mathbb{E}[\\Chi_n] + b.
$$

</aside>

<aside>
💡 For an event $A \\sube \\Omega$ the corresponding *indicator variable $\\Chi_A$* is defined by:

$$
\\Chi_A(\\omega) = \\begin{cases}
1, & \\text{if} \\quad \\omega \\in A, \\\\
0, & \\text{else}.
\\end{cases}
$$

For the expected value of $\\Chi_A$ it holds that: $\\mathbb{E}[\\Chi_A] = \\Pr[A]$.

</aside>

## Variance

<aside>
💡 For a random variable $\\Chi$ with $\\mu = \\mathbb{E}[X]$ we define the *variance* $\\text{Var}[\\Chi]$ as

$$
\\text{Var}[\\Chi] = \\mathbb{E}[(\\Chi - \\mu)^2] = \\sum_{\\chi \\in W_\\Chi} (\\chi - \\mu)^2 \\cdot \\Pr[\\Chi = \\chi].
$$

The quantity $\\sigma = \\sqrt{\\text{Var}[\\Chi]}$ is called the *standard deviation* of $\\Chi$.

</aside>

<aside>
📖 *For an arbitrary random variable $\\Chi$ it holds that*

$$
\\text{Var}[\\Chi] = \\mathbb{E}[\\Chi^2] - \\mathbb{E}[\\Chi]^2.
$$

</aside>

<aside>
📖 *For an arbitrary random variable $\\Chi$ and $a,b \\in \\mathbb{R}$ it holds that*

$$
\\text{Var}[a \\cdot \\Chi+ b] = a^2 \\cdot \\text{Var}[\\Chi].
$$

</aside>

<aside>
💡 For a random variable $\\Chi$ we call $\\mathbb{E}[\\Chi^k]$ the $*k$-th moment* and $\\mathbb{E}[(\\Chi - \\mathbb{E}[\\Chi])^k]$ the $k$*-th central moment*.

The expected value is therefore identical to the first moment, and the variance identical to the second central moment.

</aside>

# Important Discrete Probability Distributions

<aside>
💡 Recall the probability density function $f_\\Chi$ and the probability distribution function $F_\\Chi$:

$$
\\begin{align*}
f_{\\Chi} : \\mathbb{R} & \\longrightarrow [0,1] \\\\
    \\chi & \\longmapsto \\Pr[\\Chi = \\chi]  = \\Pr[\\{\\omega \\space \\vert \\space \\Chi(\\omega) = \\chi\\}]. \\\\
F_{\\Chi}: \\mathbb{R} & \\longrightarrow [0, 1] \\\\
\\chi & \\longmapsto \\Pr[\\Chi \\leq \\chi] = \\Pr[\\{\\omega \\space \\vert \\space \\Chi(\\omega) \\leq \\chi\\}].
\\end{align*}
$$

</aside>

## Bernoulli Distribution

<aside>
💡 A random variable $\\Chi$ with $W_\\Chi = \\{0, 1\\}$ and density

$$
f_\\Chi(\\chi) = \\begin{cases}
p & \\text{for} \\quad \\chi = 1, \\\\
1 - p & \\text{for} \\quad \\chi = 0, \\\\
0 & \\text{else}
\\end{cases}
$$

is called *Bernoulli distributed*. The parameter $p$ is called the *probability of success* of the Bernoulli distribution.

If a random variable $\\Chi$ is Bernoulli distributed with parameter $p$, then it is denoted by

$$
\\Chi \\sim \\text{Bernoulli}(p).
$$

For a Bernoulli distributed random variable $\\Chi$ the following hold:

$$
\\mathbb{E}[\\Chi] = p \\quad \\text{and} \\quad \\text{Var}[\\Chi] = p(1-p).
$$

</aside>

## Binomial Distribution

<aside>
💡 A random variable $\\Chi$ with $W_\\Chi = \\{0, 1, ..., n\\}$ and density

$$
f_\\Chi(\\chi) = \\begin{cases}
\\binom{n}{\\chi}p^\\chi (1-p)^{n-\\chi} & \\text{for} \\quad \\chi \\in \\{0, 1, ..., n\\}, \\\\
0 & \\text{else}
\\end{cases}
$$

is called binomially distributed. The parameter $n$ is called the *number of trials*, the parameter $p$ is called the *probability of success* of the binomial distribution.

If a random variable $\\Chi$ is binomially distributed with parameters $n$ and $p$, then it is denoted by

$$
\\Chi \\sim \\text{Bin}(n,p).
$$

For a binomially distributed random variable $\\Chi$ the following hold:

$$
\\mathbb{E}[\\Chi] = np \\quad \\text{and} \\quad \\text{Var}[\\Chi] = np(1-p).
$$

</aside>

## Geometric Distribution

<aside>
💡 A random variable $\\Chi$ with density

$$
f_\\Chi = \\begin{cases}
p(1-p)^{i-1} & \\text{for} \\quad i \\in \\mathbb{N}, \\\\
0 & \\text{else}
\\end{cases}
$$

is called geometrically distributed. The parameter $p$ is called the *probability of success* of the geometric distribution.

If a random variable $\\Chi$ is geometrically distributed with parameter $p$, then it is denoted by

$$
\\Chi \\sim \\text{Geo}(p).
$$

For a geometrically distributed random variable $\\Chi$ the following hold:

$$
\\mathbb{E}[\\Chi] = \\frac{1}{p} \\quad \\text{and} \\quad \\text{Var}[\\Chi] = \\frac{1-p}{p^2}.
$$

</aside>

<aside>
📖 *If $\\Chi \\sim \\text{Geo}(p)$, then for all $s,t \\in \\mathbb{N}$ the following holds:*

$$
\\Pr[\\Chi \\geq s + t \\vert \\Chi \\gt s] = \\Pr[\\Chi \\geq t].
$$

</aside>

### Waiting for the $n$-th Success - Negative Binomial Distribution

<aside>
💡 Let $Z$ be the random variable that counts how often we have to repeat an experiment with probability of success $p$ until the $n$-th success. For $n = 1$, $Z \\sim \\text{Geo}(p)$. For $n \\geq 2$, $Z$ is called *negatively binomially distributed* with order $n$.

The density of $Z$ is

$$
f_Z(z) = \\binom{z-1}{n-1} \\cdot p^n(1-p)^{z-n}.
$$

Let $\\Chi_i$ denote the number of experiments strictly after the $(i - 1)$-st success up until (including) the $i$-th success. Then, each of the $\\Chi_i$ is geometrically distributed with parameter $p$.

If a random variable $Z$ is negatively binomially distributed with parameters $n$ and $p$, then it is denoted by

$$
Z \\sim \\text{NB}(n, p).
$$

Thus, by linearity of the expected value, it holds for the expected value $\\mathbb{E}[Z]$ that

$$
\\mathbb{E}[Z] = \\sum_{i=1}^n \\mathbb{E}[\\Chi_i] = \\frac{n}{p}.
$$

</aside>

### Application: Coupon-Collector Problem

[Coupon-Collector Problem](Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17/Coupon-Collector%20Problem%208b5e0f9e298643c98675b803b7c39005.md)

## Poisson Distribution

<aside>
💡 A random variable $\\Chi$ with density

$$
f_\\Chi = \\begin{cases}
\\frac{e^{-\\lambda}\\lambda^i}{i!} & \\text{for} \\quad i \\in \\mathbb{N}_0, \\\\
0 & \\text{else}
\\end{cases}
$$

is called *Poisson distributed*. The parameter $\\lambda$ is equal to the mean and variance of the Poisson distribution.

If a random variable $\\Chi$ is Poisson distributed with parameter $\\lambda$, then it is denoted by

$$
\\Chi \\sim \\text{Po}(\\lambda).
$$

For a Poisson distributed random variable $\\Chi$ the following hold:

$$
\\mathbb{E}[\\Chi] = \\text{Var}[\\Chi] = \\lambda.
$$

</aside>

### Poisson Distribution as Limit of Binomial Distribution

<aside>
💡 The binomial distribution $\\text{Bin}(n, \\frac{\\lambda}{n})$ converges towards the Poisson distribution $\\text{Po}(\\lambda)$ for $n \\to \\infty$.

</aside>

# Multiple Random Variables

<aside>
💡 We are interested in random variables $\\Chi$ and $Y$ and probabilities of the form

$$
\\Pr[\\Chi = \\chi, Y = y] = \\Pr[\\{\\omega \\in \\Omega \\space \\vert \\space \\Chi(\\omega) = \\chi, Y(\\omega) = y\\}].
$$

</aside>

<aside>
💡 The function

$$
f_{\\Chi, Y} = \\Pr[\\Chi = \\chi, Y = y]
$$

is called *joint density* of the random variables $\\Chi$ and $Y$.

If the joint density is given one can extract the density of the random variables themselves using

$$
f_\\Chi(\\chi) = \\sum_{y \\in W_Y} f_{\\Chi, Y}(\\chi, y) \\quad \\text{respectively} \\quad f_Y(y) = \\sum_{x \\in W_\\Chi} f_{\\Chi, Y}(\\chi, y).
$$

The functions $f_\\Chi$ and $f_Y$ are called *marginal densities*.

</aside>

<aside>
💡 The function

$$
\\begin{align*}
F_{\\Chi, Y}(\\chi, y) & = \\Pr[\\Chi \\leq \\chi, Y \\leq y] = \\Pr[\\{\\omega \\in \\Omega \\space \\vert \\space \\Chi(\\omega) \\leq \\chi, Y(\\omega) \\leq y\\}] \\\\
& = \\sum_{\\chi' \\leq \\chi} \\sum_{y' \\leq y} f_{\\Chi, Y}(\\chi', y').
\\end{align*}
$$

is called *joint distribution* of the random variables $\\Chi$ and $Y$.

If the joint distribution is given one can extract the distribution of the random variables themselves using

$$
F_{\\Chi}(\\chi) = \\sum_{\\chi' \\leq \\chi} f_{\\Chi}(\\chi') = \\sum_{\\chi' \\leq \\chi} \\sum_{y \\in W_Y}f_{\\Chi, Y}(\\chi', y).
$$

The functions $F_\\Chi$ and $F_Y$ are called *marginal distributions*.

</aside>

## Independence of Random Variables

<aside>
💡 Random variables $\\Chi_1,...,\\Chi_n$ are called independent, if and only if it holds for all $(\\chi_1,...,\\chi_n) \\in W_{\\Chi_1} \\times ... \\times W_{\\Chi_n}$ that

$$
\\Pr[\\Chi_1 = \\chi_1,..., \\Chi_n = \\chi_n] = \\Pr[\\Chi_1 = \\chi_1]\\cdot ... \\cdot \\Pr[\\Chi_n = \\chi_n].
$$

</aside>

<aside>
📌 *For independent random variables $\\Chi_1,...,\\Chi_n$ and arbitrary sets $S_1,...,S_n$ with $S_i \\sube W_\\Chi$ it holds that*

$$
\\Pr[\\Chi_1 \\in S_1,..., \\Chi_n \\in S_n] = \\Pr[\\Chi_1 \\in S_1] \\cdot ... \\cdot \\Pr[\\Chi_n \\in S_n].
$$

</aside>

<aside>
📎 *For independent random variables $\\Chi_1, ..., \\Chi_n$ and the set $I = \\{i_1,...,i_k\\} \\sube [n]$, then $\\Chi_{i_1},...,\\Chi_{i_k}$ are also independent.*

</aside>

<aside>
📖 *Let $f_1,...,f_n$ be real-values functions ($f_i : \\mathbb{R} \\longrightarrow \\mathbb{R}$ for $i = 1,...,n$). If the random variables $\\Chi_1,...,\\Chi_n$ are independent then so are $f_1(\\Chi_1),...,f_n(\\Chi_n)$.*

</aside>

## Composite Random Variables

<aside>
📖 *For two independent random variables $\\Chi$ and $Y$ let $Z = \\Chi + Y$. It holds that*

$$
f_Z(z) = \\sum_{\\chi \\in W_\\Chi} f_\\Chi (\\chi) \\cdot f_Y(z - \\chi).
$$

</aside>

<aside>
💡 The expression $\\sum_{\\chi \\in W_\\Chi} f_\\Chi (\\chi) \\cdot f_Y(z - \\chi)$ is called *convolution*, analogously to the corresponding terms for power series.

</aside>

## Moments of Composite Random Variables

<aside>
📖 (Linearity of the Expected Value).

*For random variables $\\Chi_1,...,\\Chi_n$ and $\\Chi = a_1\\Chi_1 + ... + a_n \\Chi_n$ with $a_1,...,a_n \\in \\mathbb{R}$ it holds that*

$$
\\mathbb{E}[\\Chi] = a_1\\mathbb{E}[\\Chi_1]+...+a_n \\mathbb{E}[\\Chi_n].
$$

</aside>

<aside>
📖 (Multiplicativity of the Expected Value).

*For independent random variables $\\Chi_1,...,\\Chi_n$ it holds that*

$$
\\mathbb{E}[\\Chi_1 \\cdot ... \\cdot  \\Chi_n] = \\mathbb{E}[\\Chi_1] \\cdot ... \\cdot \\mathbb{E}[\\Chi_n].
$$

</aside>

<aside>
📖 *For independent random variables $\\Chi_1,...,\\Chi_n$ and $\\Chi = \\Chi_1 + ... + \\Chi_n$ it holds that*

$$
\\text{Var}[\\Chi] = \\text{Var}[\\Chi_1] + ... + \\text{Var}[\\Chi_n].
$$

</aside>

## Wald’s Identity

<aside>
📖 (Wald’s Identity).

*Let $N$ and $\\Chi$ be two independent random variables, where $W_N \\sube \\mathbb{N}$ holds for the codomain of $N$. Furthermore, let*

$$
Z = \\sum_{i = 1} ^ N \\Chi_i,
$$

*where $\\Chi_1, \\Chi_2,...$ are independent copies of $\\Chi$. Then the following holds:*

$$
\\mathbb{E}[Z] = \\mathbb{E}[N] \\cdot \\mathbb{E}[\\Chi].
$$

</aside>

# Estimating Probabilities

## Inequalities of Markov and Chebyshev

<aside>
📖 (Markov’s Inequality).

*Let $\\Chi$ be a random variable, that only assumes non-negative values. Then it holds for all $t \\in \\mathbb{R}$ with $t \\gt 0$ that*

$$
\\Pr[\\Chi \\geq t] \\leq \\frac{\\mathbb{E}[\\Chi]}{t}.
$$

Or equivalently: $\\Pr[\\Chi \\geq t \\cdot \\mathbb{E}[\\Chi]] \\leq \\frac{1}{t}$.

</aside>

<aside>
📖 (Chebyshev’s Inequality).

*Let $\\Chi$ be a random variable and $t \\in \\mathbb{R}$ with $t \\gt 0$. It then holds that*

$$
\\Pr[\\lvert \\Chi - \\mathbb{E}[\\Chi] \\rvert \\geq t] \\leq \\frac{\\text{Var}[\\Chi]}{t^2}.
$$

Or equivalently: $\\Pr[\\lvert\\Chi - \\mathbb{E}[\\Chi] \\rvert \\geq t \\sqrt{\\text{Var}[\\Chi]}] \\leq \\frac{1}{t^2}.$

</aside>

## Chernoff’s Inequality

<aside>
📖 (Chernoff-Bounds).

*Let $\\Chi_1, ..., \\Chi_n$ be independent Bernoulli distributed random variables with $\\Pr[\\Chi_i = 1]=p_i$ and $\\Pr[\\Chi_i = 0] = 1-p_i$.*

For $\\Chi = \\sum_{i=1}^n \\Chi_i:$

1. $\\Pr[\\Chi \\geq (1+\\delta)\\mathbb{E}[\\Chi]] \\leq e^{-\\frac{1}{3}\\delta^2\\mathbb{E}[\\Chi]}$ for all $0 \\lt \\delta \\leq 1$,
2. $\\Pr[\\Chi \\leq (1-\\delta)\\mathbb{E}[\\Chi]] \\leq e^{-\\frac{1}{2}\\delta^2\\mathbb{E}[\\Chi]}$ for all $0 \\lt \\delta \\leq 1$,
3. $\\Pr[\\Chi \\geq t] \\leq 2^{-t}$ for $t \\geq 2e\\mathbb{E}[\\Chi]$.
</aside>".to_string(),
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
