/* Because issues from the language server are not yet handled reliably, I'm
 * manually providing issues from the compiler. I hope to someday deprecate
 * this class and just rely on the language server.
 */
export class RustIssueProvider {
  private collection = new IssueCollection()
  constructor() {}

  run() {
    console.log('generating issues')
    this.collection.clear()
    let process = new Process('cargo', {
      args: ['check', '--message-format=json'],
      cwd: nova.workspace.path as string,
      shell: true,
    })
    process.onStdout((line: string) => {
      this.parseIssues(line)
    })
    process.onStderr((line: string) => {
      console.error(line)
    })
    process.start()
  }

  private parseIssues(line: string) {
    let issues: Issue[] = []
    let data: CargoCheckData = JSON.parse(line)
    let mainIssue = new Issue()
    if (data.message?.level) {
      mainIssue.message = data.message.message
      if (data.message.code) mainIssue.code = data.message.code.code
      switch (data.message.level) {
        case 'error':
          mainIssue.severity = IssueSeverity.Error
          break
        case 'warning':
          mainIssue.severity = IssueSeverity.Warning
          break
        case 'hint':
          mainIssue.severity = IssueSeverity.Hint
          break
        case 'info':
          mainIssue.severity = IssueSeverity.Info
          break
      }
      const issueSpan = data.message.spans.find((item) => item.is_primary)
      mainIssue.line = issueSpan?.line_start
      mainIssue.endLine = issueSpan?.line_end
      mainIssue.column = issueSpan?.column_start
      mainIssue.endColumn = issueSpan?.column_end
      issues.push(mainIssue)
      console.log(issueSpan?.file_name)
      if (issueSpan?.file_name) {
        const file = `${nova.workspace.path}/${issueSpan.file_name}`
        if (this.collection.has(file)) {
          this.collection.append(file, issues)
        } else {
          this.collection.set(file, issues)
        }
      }
    }
  }
}

interface CargoCheckData {
  target: {
    src_path: string
  }
  message: {
    children?: {
      level: string
      message: string
      spans: {
        column_end: number
        column_start: number
        file_name: string
        is_primary: boolean
        line_end: number
        line_start: number
        suggested_replacement: string | null
      }[]
    }[]
    code?: {
      code: string
    }
    level: string
    message: string
    spans: {
      column_end: number
      column_start: number
      file_name: string
      is_primary: boolean
      line_end: number
      line_start: number
    }[]
  }
}
