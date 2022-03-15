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
