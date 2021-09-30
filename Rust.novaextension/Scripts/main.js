"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const rust_formatter_1 = require("./rust-formatter");
const rust_issue_provider_1 = require("./rust-issue-provider");
const rust_lang_server_1 = require("./rust-lang-server");
let langServer = null;
function activate() {
    // Do work when the extension is activated
    langServer = new rust_lang_server_1.RustLanguageServer();
    let issueProvider = new rust_issue_provider_1.RustIssueProvider();
    let formatter = new rust_formatter_1.RustFormatter();
    nova.workspace.onDidAddTextEditor(async (editor) => {
        editor.onDidSave(async (editor) => {
            await formatter.format(editor);
            issueProvider.run();
        });
    });
    issueProvider.run();
}
exports.activate = activate;
function deactivate() {
    // Clean up state before the extension is deactivated
    if (langServer) {
        langServer.deactivate();
        langServer = null;
    }
}
exports.deactivate = deactivate;
