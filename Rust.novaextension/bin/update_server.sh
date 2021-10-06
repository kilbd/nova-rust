#!/bin/bash
version_regex="^rust\-analyzer[[:space:]][[:alnum:]]+[[:space:]]([[:digit:]]{4}\-[[:digit:]]{2}\-[[:digit:]]{2})[[:space:]]"
download=false
if [[ ! -f "./rust-analyzer" ]]; then
    download=true
elif [[ "$(./rust-analyzer --version)" =~ $version_regex ]]; then
    if [[ "${BASH_REMATCH[1]}" != "$1" ]]; then
        download=true
    fi
fi

if [[ $download = true ]]; then
    echo "downloading new binary..."
    binary="rust-analyzer-x86_64-apple-darwin.gz"
    if [[ "$(uname -p)" = "arm" ]]; then
        binary="rust-analyzer-aarch64-apple-darwin.gz"
    fi
    curl -L https://github.com/rust-analyzer/rust-analyzer/releases/latest/download/$binary \
        | gunzip -c - > ./rust-analyzer-new
    chmod +x ./rust-analyzer-new
fi
