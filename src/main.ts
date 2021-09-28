import { RustIssueProvider } from './rust-issue-provider'
import { RustLanguageServer } from './rust-lang-server'

let langServer: RustLanguageServer | null = null

export function activate() {
  // Do work when the extension is activated
  langServer = new RustLanguageServer()
  let issueProvider = new RustIssueProvider()
  nova.workspace.onDidAddTextEditor((editor: TextEditor) => {
    editor.onDidSave(() => {
      issueProvider.run()
    })
  })
  issueProvider.run()
}

export function deactivate() {
  // Clean up state before the extension is deactivated
  if (langServer) {
    langServer.deactivate()
    langServer = null
  }
}
