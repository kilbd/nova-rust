<!--
👋 Hello! As Nova users browse the extensions library, a good README can help them understand what your extension does, how it works, and what setup or configuration it may require.

Not every extension will need every item described below. Use your best judgement when deciding which parts to keep to provide the best experience for your new users.

💡 Quick Tip! As you edit this README template, you can preview your changes by selecting **Extensions → Activate Project as Extension**, opening the Extension Library, and selecting "Rust" in the sidebar.

Let's get started!
-->

<!--
🎈 Include a brief description of the features your extension provides. For example:
-->

The **Rust** extension provides deep integration with [**the Rust Language**](https://www.rust-lang.org/) through the [Rust Analyzer](https://rust-analyzer.github.io/) language server, syntax highlighting, error checking, and formatting on save.

<!--
🎈 It can also be helpful to include a screenshot or GIF showing your extension in action:
-->

![](https://nova.app/images/en/dark/editor.png)

## Requirements

<!--
🎈 If your extension depends on external processes or tools that users will need to have, it's helpful to list those and provide links to their installers:
-->

This Rust extension assumes you have common Rust tools installed on your Mac:

- **Rust** (the `rustc` compiler)
- **Cargo** for managing projects
- **Rustfmt** for formatting documents

The best way to install these requirements and keep them updated is by using the [rustup](https://rustup.rs/) tool. Copy the command at that link into a terminal and run it. Rustup also allows you to switch between Rust versions (e.g., stable or nightly). In-depth documentation on how to use it can be found [here](https://rust-lang.github.io/rustup/).

<!--
✨ Providing tips, tricks, or other guides for installing or configuring external dependencies can go a long way toward helping your users have a good setup experience:
-->

## Usage

<!--
🎈 If your extension provides features that are invoked manually, consider describing those options for users:
-->

Syntax highlighting, completion assistance from Rust Analyzer, and error checking happen automatically when you open a Rust project. You can find errors and warnings in Nova's **Issues** sidebar and the editor gutter (checks currently happen after each save). When enabled (see "Configuration" below), your documents can be automatically formatted using Rustfmt whenever you save them.

<!--
🎈 Alternatively, if your extension runs automatically (as in the case of a validator), consider showing users what they can expect to see:
-->

### Hover Info

View descriptions or type info by hovering your mouse cursor over identifiers.

### Jump to Definition

Right click an identifier and select **Jump to Definition** from the menu to be taken to the file location where the selected symbol is defined.

## Configuration

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library...** then select Rust's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

### Save on Format

Checking this checkbox will run `rustfmt` on a Rust document when you save it. A `rustfmt.toml` configuration file in you project is highly encouraged!

## Entitlements

Here's why this extension uses the following entitlements:

- **Read/Write File System Access** - needed to update the Rust Analyzer binary, as well as to let this server do its thing.
- **Network Access** - used to check for updates for Rust Analyzer, and download updates if available.
- **Processes** - used to run the language server, update the language server, check for errors, and format documents.
