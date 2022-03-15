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
      const savedDoc = editor.document.path
      if (this.enabled && savedDoc?.substr(-3) === '.rs') {
        const formatConfig = this.findFormatFile(
          savedDoc.substring(0, savedDoc.lastIndexOf('/'))
        )
        const formatDir = formatConfig.path.substring(
          0,
          formatConfig.path.lastIndexOf('/')
        )
        const fullRange = new Range(0, editor.document.length)
        const docText = editor.getTextInRange(fullRange)
        const formatOutput: string[] = []
        const fmtArgs = []
        if (this.nightly) {
          fmtArgs.push('+nightly')
        }
        if (!formatConfig.isFmtFile) {
          fmtArgs.push('--edition', this.extractEdition(formatConfig.path))
        }
        const fmtProcess = new Process('rustfmt', {
          args: fmtArgs,
          shell: true,
          cwd: formatDir,
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
        const stdin = (fmtProcess.stdin as any).getWriter()
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

  private extractEdition(cargoTomlPath: string): string {
    const fileText: string = nova.fs.open(cargoTomlPath).read() as string
    const regex = /edition\s*=\s*"(\d{4})"/
    const matches = fileText.match(regex)
    if (matches) {
      return matches[1]
    }
    // Default to 2021 edition
    return '2021'
  }
}

interface FmtConfig {
  isFmtFile: Boolean
  path: string
}
