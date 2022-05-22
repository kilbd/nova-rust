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
    const resp = (await langServer?.client?.sendRequest('textDocument/rename', {
      newName: newName,
      textDocument: { uri: editor.document.uri },
      position: indexToPosition(editor.document, position.start),
    })) as WorkspaceEdit
    applyWorkspaceEdit(resp)
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

function positionToIndex(documentLines: string[], position: Position): number {
  let prevLinesLength = 0
  for (let i = 0; i < position.line; i++) {
    prevLinesLength += documentLines[i].length
  }
  return prevLinesLength + position.character
}

async function applyWorkspaceEdit(edit: WorkspaceEdit) {
  for (let doc of edit.documentChanges) {
    const editor = await nova.workspace.openFile(doc.textDocument.uri)
    if (!editor) continue
    const lines = editor.document
      .getTextInRange(new Range(0, editor.document.length))
      .split(editor.document.eol)
      .map((line) => line + editor.document.eol)
    editor.edit((edits: TextEditorEdit) => {
      // Work in reverse order so edits don't throw off range indexes
      // for subsequent edits
      for (let change of doc.edits.reverse()) {
        edits.replace(
          new Range(
            positionToIndex(lines, change.range.start),
            positionToIndex(lines, change.range.end)
          ),
          change.newText
        )
      }
    })
  }
}

interface Position {
  line: number
  character: number
}

interface LspRange {
  start: Position
  end: Position
}

interface DocumentEdit {
  range: LspRange
  newText: string
}

interface DocumentVersion {
  uri: string
  version: number
}

interface DocumentChange {
  textDocument: DocumentVersion
  edits: DocumentEdit[]
}

interface WorkspaceEdit {
  documentChanges: DocumentChange[]
}

export { rename }
