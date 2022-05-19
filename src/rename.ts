import { RustLanguageServer } from './rust-lang-server'

async function rename(
  editor: TextEditor,
  langServer: RustLanguageServer | null
) {
  const position = editor.selectedRange
  // Commenting out next few lines but keeping in case they're later useful.
  // Nova only recognizes something as a symbol where it is defined. Users will
  // likely want to rename a variable from a later usage, so this isn't best.
  //
  // const symbol = editor.symbolAtPosition(position.start)
  // const oldName = symbol?.name

  editor.selectWordsContainingCursors()
  const oldName = editor.selectedText
  console.log(`rename ${oldName}`)
  let newName: string
  try {
    newName = await askForNewName(oldName)
  } catch {
    console.log('Rename aborted by user.')
    return
  }
  try {
    let resp = await langServer?.client?.sendRequest('textDocument/rename', {
      newName: newName,
      textDocument: { uri: editor.document.uri },
      position: indexToPosition(editor.document, position.start),
    })
    console.log(resp)
  } catch (err) {
    console.error(err)
  }
}

function askForNewName(oldName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    nova.workspace.showInputPalette(
      `Rename: Enter a new name for '${oldName}' (ESC to cancel)`,
      { value: oldName },
      (input) => {
        if (input) {
          resolve(input)
        } else {
          reject()
        }
      }
    )
  })
}

function indexToPosition(document: TextDocument, index: number): Position {
  const docText = document.getTextInRange(new Range(0, index))
  const matches = docText.match(new RegExp(document.eol, 'g')) || []
  return {
    line: matches.length,
    character: docText.length - docText.lastIndexOf(document.eol),
  }
}

interface Position {
  line: number
  character: number
}

export { rename }
