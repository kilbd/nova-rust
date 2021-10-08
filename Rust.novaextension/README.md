🦀 Hello Rustaceans! 🦀

This extension provides deep integration with [**the Rust Language**](https://www.rust-lang.org/) through the [Rust Analyzer](https://rust-analyzer.github.io/) language server, syntax highlighting, error checking, and formatting on save.

<!-- ![Usage Sample](./Images/extension/usage_example.gif) -->

## Requirements

This extension assumes you have common Rust tools installed on your Mac:

- **Rust** (the `rustc` compiler)
- **Cargo** for managing projects
- **Rustfmt** for formatting documents

The best way to install these requirements and keep them updated is by using the [rustup](https://rustup.rs/) tool. Copy the command at that link into a terminal and run it. Rustup also allows you to switch between Rust versions (e.g., stable or nightly). In-depth documentation on how to use it can be found [here](https://rust-lang.github.io/rustup/).

## Usage

Syntax highlighting, completion assistance from Rust Analyzer, and error checking happen automatically when you open a Rust project. You can find errors and warnings in Nova's **Issues** sidebar and the editor gutter (checks currently happen after each save). When enabled (_see "Configuration" below_), your documents can be automatically formatted using Rustfmt whenever you save them.

### Hover Info

View descriptions or type info by hovering your mouse cursor over identifiers.
![Hovering over symbols or keywords displays a box with more information about the item.](https://github.com/kilbd/nova-rust/blob/main/img/hover.gif?raw=true)

### Jump to Definition

Right click an identifier and select **Jump to Definition** from the menu to be taken to the file location where the selected symbol is defined.
![Selecting 'Jump to Definition' from the right-click menu to navigate to the definition of the symbol.](https://github.com/kilbd/nova-rust/blob/main/img/jump_to_def.gif?raw=true)

## Configuration

To configure global preferences, open **Extensions → Extension Library...** then select Rust's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

### Save on Format

Checking this checkbox will run `rustfmt` on a Rust document when you save it. A `rustfmt.toml` configuration file in you project is highly encouraged!

## Entitlements

Here's why this extension uses the following entitlements:

- **Read/Write File System Access** - needed to update the Rust Analyzer binary, as well as to let this server do its thing.
- **Network Access** - used to check for updates for Rust Analyzer, and download updates if available.
- **Processes** - used to run the language server, update the language server, check for errors, and format documents.

## Help Me Help You

🃏 Cards on the table 🃏 I'm still new to Rust and there may be a lot that I missed or got wrong. Does some syntax highlighting look wonky? Something not working as expected? Is it missing a feature you need? If you see something, say something! Mash that **Bug Reports** link for this extension and create an Issue to let me know. Thanks for being a user!
