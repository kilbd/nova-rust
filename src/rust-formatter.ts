export class RustFormatter {
  private enabled: boolean = false

  constructor() {
    nova.config.observe('com.kilb.rust.rustfmt-on-save', (enabled: boolean) => {
      this.enabled = enabled
    })
  }

  format(editor: TextEditor): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.enabled && editor.document.path?.substr(-3) === '.rs') {
        let fullRange = new Range(0, editor.document.length)
        let docText = editor.getTextInRange(fullRange)
        let formatOutput: string[] = []
        let fmtProcess = new Process('rustfmt', {
          shell: true,
        })
        fmtProcess.onStderr((err: string) => console.error(err))
        fmtProcess.onStdout((line: string) => formatOutput.push(line))
        fmtProcess.onDidExit(async (status: number) => {
          if (status !== 0) {
            let notification = new NotificationRequest('rustfmt.error')
            notification.title = nova.localize('rustfmt Failed')
            notification.body = nova.localize(
              'If this error persists, please create a bug report/issue.'
            )
            // No user actions configured, so I'm ignoring the returned promise.
            nova.notifications.add(notification)
          } else {
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
