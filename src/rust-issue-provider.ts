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
    let note = data.message.children.find(
      (item) => item.level == 'note'
    )?.message
    let code = data.message.code?.code
    issues.push(this.generateIssue(data.message, code, note))
    let hint = data.message.children.find((item) => item.level == 'help')
    if (hint) {
      issues.push(this.generateIssue(hint))
    }
    let filename = data.message.spans.find((item) => item.is_primary)?.file_name
    if (filename) {
      const file = `${nova.workspace.path}/${filename}`
      if (this.collection.has(file)) {
        this.collection.append(file, issues)
      } else {
        this.collection.set(file, issues)
      }
    }
  }

  private generateIssue(data: IssueData, code?: string, note?: string): Issue {
    let issue = new Issue()
    if (note) {
      issue.message = `${data.message}\n${note}`
    } else {
      issue.message = data.message
    }
    if (code) issue.code = code
    issue.source = 'rustc'
    switch (data.level) {
      case 'error':
        issue.severity = IssueSeverity.Error
        break
      case 'warning':
        issue.severity = IssueSeverity.Warning
        break
      case 'help':
        issue.severity = IssueSeverity.Hint
        break
      default:
        issue.severity = IssueSeverity.Info
        break
    }
    const issueSpan = data.spans.find((item) => item.is_primary)
    issue.line = issueSpan?.line_start
    issue.endLine = issueSpan?.line_end
    issue.column = issueSpan?.column_start
    issue.endColumn = issueSpan?.column_end
    return issue
  }
}

interface CargoCheckData {
  target: {
    src_path: string
  }
  message: {
    children: IssueData[]
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

interface IssueData {
  level: string
  message: string
  spans: {
    column_end: number
    column_start: number
    file_name: string
    is_primary: boolean
    line_end: number
    line_start: number
    suggested_replacement?: string | null
  }[]
}
