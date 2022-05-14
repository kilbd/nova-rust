function rename(editor: TextEditor) {
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
  nova.workspace.showInputPalette(
    `Rename: Enter a new name for '${oldName}' (ESC to cancel)`,
    { value: oldName },
    (input) => {
      if (input) {
        console.log(`new name: ${input}`)
      }
    }
  )
}

export { rename }
