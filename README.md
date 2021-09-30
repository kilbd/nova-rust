A Rust extension for Nova that uses Rust Analyzer and Rustfmt

## Requirements
- [The binary for Rust Analyzer](https://github.com/rust-analyzer/rust-analyzer/releases)

> Don't forget to rename it and run `chmod +x rust-analyzer`

- Rustfmt (Unless `Format on Save` setting is turned off)

> Make sure it works when you type `rustfmt` in your terminal

## Usage

**You have to tell it where the Rust Analyzer binary is first!**

> You can do that by clicking on **Preferences** right next to **Details** in this page

Then all you need is to have a `Cargo.toml` file in the current workspace and tada!

To format the file, just save it!
