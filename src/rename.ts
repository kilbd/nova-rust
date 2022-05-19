async function rename(editor: TextEditor) {
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
  console.log(newName)
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

export { rename }
