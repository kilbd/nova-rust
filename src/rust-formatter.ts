export class RustFormatter {
  private enabled: boolean = false
  private nightly: boolean = false

  constructor() {
    nova.config.observe('com.kilb.rust.rustfmt-on-save', (enabled: boolean) => {
      this.enabled = enabled
    })
    nova.config.observe(
      'com.kilb.rust.rustfmt-nightly',
      (useNightly: boolean) => {
        this.nightly = useNightly
      }
    )
  }

  format(editor: TextEditor): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.enabled && editor.document.path?.substr(-3) === '.rs') {
        let fullRange = new Range(0, editor.document.length)
        let docText = editor.getTextInRange(fullRange)
        let formatOutput: string[] = []
        let fmtArgs = []
        if (this.nightly) {
          fmtArgs.push('+nightly')
        }
        let fmtProcess = new Process('rustfmt', {
          args: fmtArgs,
          shell: true,
          cwd: `${nova.workspace.path}`,
        })
        fmtProcess.onStderr((err: string) => console.error(err))
        fmtProcess.onStdout((line: string) => formatOutput.push(line))
        fmtProcess.onDidExit(async (status: number) => {
          if (status === 0) {
            await editor.edit((edit: TextEditorEdit) => {
              edit.replace(fullRange, formatOutput.join(''))
            })
          }
          resolve()
        })
        fmtProcess.start()
        let stdin = (fmtProcess.stdin as any).getWriter()
        stdin.write(docText)
        stdin.close()
      } else {
        resolve()
      }
    })
  }
}
