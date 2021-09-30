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
            let notification = new NotificationRequest('rustfmt.error')
            notification.title = nova.localize('rustfmt Failed')
            notification.body = nova.localize(
              'If this error persists, please create a bug report/issue.'
            )
            // No user actions configured, so I'm ignoring the returned promise.
            nova.notifications.add(notification)
          }
          resolve()
        })
        fmtProcess.start()
      } else {
        resolve()
      }
    })
  }
}
