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
    return new Promise<void>((resolve, _reject) => {
      let savedDoc = editor.document.path
      if (this.enabled && savedDoc?.substr(-3) === '.rs') {
        let formatConfig = this.findFormatFile(
          savedDoc.substring(0, savedDoc.lastIndexOf('/'))
        )
        console.log(`Format config to use: ${formatConfig.path}`)
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

  private findFormatFile(path: string): FmtConfig {
    let fmtToml: string | null = null
    let cargoToml: string | null = null
    const items = nova.fs.listdir(path)
    items.forEach((item: string) => {
      const itemPath = `${path}/${item}`
      const stats = nova.fs.stat(itemPath)
      if (
        stats?.isFile() &&
        (item === 'rustfmt.toml' || item === '.rustfmt.toml')
      ) {
        fmtToml = itemPath
      } else if (stats?.isFile() && item === 'Cargo.toml') {
        cargoToml = itemPath
      }
    })
    // rustfmt config has the highest precedence
    if (fmtToml) {
      return { isFmtFile: true, path: path }
    } else if (cargoToml) {
      return { isFmtFile: false, path: cargoToml }
    } else {
      // If none found, search parent directory.
      return this.findFormatFile(path.substring(0, path.lastIndexOf('/')))
    }
  }
}

interface FmtConfig {
  isFmtFile: Boolean
  path: string
}
