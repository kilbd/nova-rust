import { RustFormatter } from './rust-formatter'
import { RustLanguageServer } from './rust-lang-server'
import {
  makeScriptsExecutable,
  getLatestBinary,
  replaceBinary,
} from './server-install'
import { rename } from './rename'

let langServer: RustLanguageServer | null = null

export async function activate() {
  // Do work when the extension is activated
  langServer = new RustLanguageServer()
  let formatter = new RustFormatter()
  nova.workspace.onDidAddTextEditor(async (editor: TextEditor) => {
    editor.onWillSave((editor: TextEditor) => {
      return formatter.format(editor)
    })
  })
  await makeScriptsExecutable()
  getLatestBinary().then((restart: boolean) => {
    console.log(`Update check finished.${restart ? ' Binary downloaded.' : ''}`)
    if (restart) {
      if (langServer?.client) {
        langServer.client.onDidStop(() => {
          console.log('Moving binary and restarting.')
          replaceBinary()
          langServer?.start()
        })
        langServer?.stop()
      } else {
        replaceBinary()
        langServer?.start()
      }
    }
  })
  nova.commands.register('com.kilb.rust.rename', rename)
  nova.commands.register('com.kilb.rust.restart', () => langServer?.restart())
}

export function deactivate() {
  // Clean up state before the extension is deactivated
  if (langServer) {
    langServer.deactivate()
    langServer = null
  }
}
