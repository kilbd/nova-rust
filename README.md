# Rust Extension for the Nova Text Editor

This project brings [Rust Language](https://www.rust-lang.org/) support to the [Nova text editor](https://nova.app/) (macOS only). It is written in TypeScript for static typing, but transpiled to run in the macOS JavaScript environment using [Nova's API](https://docs.nova.app/) for extensions. This extension provides Rust developers with syntax highlighting, assistance from the Rust Analyzer language server, error checking, and automatic formatting.

## Users

Nova users can install this extension from Nova's [Extension Library](https://extensions.panic.com/), available within the app. More information for users is available in the [extension details](https://github.com/kilbd/nova-rust/blob/main/Rust.novaextension/README.md).

## Developers

### Requirements

- The Nova app, of course.
- [Node](https://nodejs.org/) (and the **npm** package manager that comes with it): to build the scripts for this extension
- **XCode**: to build the Tree Sitter library (Command Line Tools from Apple may suffice)

### Setting Up the Dev Environment

This project depends on the `tree-sitter-rust` project, so you'll need to pull down the submodule when you clone or after cloning:

```shell
git clone --recurse-submodules https://github.com/kilbd/nova-rust
# OR after cloning you can run
git submodule update --init --recursive
```

Start by running the `update_server.sh` script to download the Rust Analyzer binary, then rename it manually:

```shell
cd Rust.novaextension/bin/
./update_server.sh
mv rust-analyzer-new rust-analyzer
cd ../..
```

This is done for users automatically, but in Nova's Developer Mode for extensions any file change triggers a reload of the extension, and thus you'd get stuck in an endless loop. In Dev Mode, I have the extension skip attempts to update Rust Analyzer.

While you're running scripts, you might as well build the Tree Sitter library used for syntax highlighting and symbols. Then move the library to the `Syntaxes` folder. From the project root, run:

```shell
./tree-sitter/compile_parser.sh "$(pwd)/tree-sitter/tree-sitter-rust" /Applications/Nova.app
mv ./tree-sitter/libtree-sitter-rust.dylib ./Rust.novaextension/Syntaxes/libtree-sitter-rust.dylib
```

Now you can install dependencies and build the scripts:

```shell
npm install
npm run build
```

After the scripts are transpiled, you can test the extension in Nova by selecting **Extensions -> Activate Project as Extension**. Open a Rust project to see it in action. You can monitor logs and errors by selecting **Extensions -> Show Extension Console** from the menus in the Rust project.

### Contributing

If you'd like to contribute code, please see the [CONTRIBUTING.md](https://github.com/kilbd/nova-rust/blob/main/CONTRIBUTING.md) document for tips.
