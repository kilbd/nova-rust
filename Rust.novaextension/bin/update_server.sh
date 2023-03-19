#!/bin/bash

# As of 2023-03-18, `rust-analyzer --version` outputs the following format:
# rust-analyzer 0.3.1435-standalone (f1e51afa4 2023-03-12)
# We want to compare the commit SHA to check for new version
version_regex="\(([[:alnum:]]+)[[:space:]][[:digit:]]{4}\-[[:digit:]]{2}\-[[:digit:]]{2}\)"
download=false
if [[ ! -f "./rust-analyzer" ]]; then
    download=true
elif [[ "$(./rust-analyzer --version)" =~ $version_regex ]]; then
    if [[ "$1" != "${BASH_REMATCH[1]}"* ]]; then
        download=true
    fi
fi

if [[ $download = true ]]; then
    echo "downloading new binary..."
    binary="rust-analyzer-x86_64-apple-darwin.gz"
    if [[ "$(uname -p)" = "arm" ]]; then
        binary="rust-analyzer-aarch64-apple-darwin.gz"
    fi
    curl -L --fail --silent --show-error \
        https://github.com/rust-lang/rust-analyzer/releases/latest/download/$binary \
        | gunzip -c - > ./rust-analyzer-new
    chmod +x ./rust-analyzer-new
fi
