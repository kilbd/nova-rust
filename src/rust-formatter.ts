export class RustFormatter {
  private enabled: boolean = false

  constructor() {
    nova.config.observe('com.kilb.rust.rustfmt-on-save', (enabled: boolean) => {
      this.enabled = enabled
    })
  }

  format(editor: TextEditor): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.enabled) {
        let fmtProcess = new Process('rustfmt', {
          args: [editor.document.path as string],
          shell: true,
        })
        fmtProcess.onStderr((err: string) => console.error(err))
        fmtProcess.onDidExit((status: number) => {
          if (status !== 0) {
            console.error("Rustfmt stopped with non-zero code: " + status)
          }
        })
        fmtProcess.start()
      } else {
        resolve()
      }
    })
  }
}
