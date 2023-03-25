## Version 2.3.1

### Fixed

- Rust Analyzer should no longer be replaced after download errors
- Use more reliable commit SHA for update checks
- Check `RA_PATH` env var in extension settings for custom Rust Analyzer path

## Version 2.3.0

### New

- Support for Tree Sitter language parsing introduced in Nova 10

## Version 2.2.1

### Fixed

- Fixes activation error when new preferences are empty

## Version 2.2.0

### New

- Task template for Cargo commands
- Extension and workspace preferences for adding environment variables. Values are shared with the Cargo task template AND Rust Analyzer.

### Improved

- Rust Analyzer restarts when there are changes to `Cargo.toml` or `rust-project.json`
- Comments and strings are now spell-checked (thank you **@illegalhex**!)

## Version 2.1.0

### New

- Rename Symbol command - can be triggered with F2 key like VS Code
- Restart Rust Analyzer command - for when RA seems wonky

### Fixed

- Activates extension for `rust-project.json` in workspace

## Version 2.0.2

### Fixed

- Method parsing no longer broken by `async` keyword
- Generics now parsed in return types
- Keywords parsed in generics and return types

## Version 2.0.1

### Improved

Syntax improvements:

- Better parsing of `impl` blocks for highlighting and symbols
- Highlight more escaped characters and format characters in strings
- Fix hex literals with underscores and `const` functions

## Version 2.0.0

The full version bump is mostly due to setting the minimum Nova version to 9, which contains many language server client fixes.

### New

- Preference for using Clippy for generating issues; can be configured per project.

### Improved

- Inspects the nearest Cargo.toml for the Rust edition to use with `rustfmt` so a rustfmt.toml isn't required to avoid format-on-save errors caused by editions.
- Nova language server client is now reliable enough to use Rust Analyzer for generating issues instead of my custom provider (breaking change and reason for version bump).

### Fixed

- Syntax no longer highlights 'impl' within words

## Version 1.0.5

### Fixed

- Syntax fixes for structs, enums, and more – mostly from a user! Thanks @mirnovov!

## Version 1.0.4

### Fixed

- Syntax fixes for impl and struct blocks

## Version 1.0.3

### Fixed

- Runs `rustfmt` from the project directory so that it picks up the `rustfmt.toml` I recommended you have. Oops.
- Those Rustfmt failure notifications were annoying, weren't they? Sorry about that.

## Versions 1.0.1 & 1.0.2

### Fixed

- Fixes issue where binary isn't renamed if language server isn't running. Sorry for the rapid updates, folks. I can't test this feature in development.
- Better checking that Rust Analyzer binary was downloaded.

## Version 1.0.0

🎉 Initial Release 🎉

- Syntax definitions
- Rust Analyzer integration
- Error checking
- Format on Save
