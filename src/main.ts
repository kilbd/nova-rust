import { RustFormatter } from './rust-formatter'
import { RustIssueProvider } from './rust-issue-provider'
import { RustLanguageServer } from './rust-lang-server'
import { makeScriptsExecutable, getLatestBinary } from './server-install'

let langServer: RustLanguageServer | null = null

export async function activate() {
  // Do work when the extension is activated
  langServer = new RustLanguageServer()
  let issueProvider = new RustIssueProvider()
  let formatter = new RustFormatter()
  nova.workspace.onDidAddTextEditor(async (editor: TextEditor) => {
    editor.onWillSave((editor: TextEditor) => {
      return formatter.format(editor)
    })
    editor.onDidSave(async () => {
      issueProvider.run()
    })
  })
  issueProvider.run()
  await makeScriptsExecutable()
  getLatestBinary().then((restart: boolean) => {
    if (restart) {
      console.log('need to restart')
      // langServer?.stop()
      // langServer?.start('./bin/rust-analyzer')
    }
  })
}

export function deactivate() {
  // Clean up state before the extension is deactivated
  if (langServer) {
    langServer.deactivate()
    langServer = null
  }
}
