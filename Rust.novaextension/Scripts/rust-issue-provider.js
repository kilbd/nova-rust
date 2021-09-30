"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustIssueProvider = void 0;
/* Because issues from the language server are not yet handled reliably, I'm
 * manually providing issues from the compiler. I hope to someday deprecate
 * this class and just rely on the language server.
 */
class RustIssueProvider {
    constructor() {
        this.collection = new IssueCollection();
    }
    run() {
        this.collection.clear();
        let process = new Process('cargo', {
            args: ['check', '--message-format=json'],
            cwd: nova.workspace.path,
            shell: true,
        });
        process.onStdout((line) => {
            this.parseIssues(line);
        });
        process.onStderr((line) => {
            console.error(line);
        });
        process.start();
    }
    parseIssues(line) {
        var _a, _b, _c;
        let issues = [];
        let data = JSON.parse(line);
        // Not all output is issues from the compiler
        if (data.reason === 'compiler-message') {
            let note = (_a = data.message.children.find((item) => item.level == 'note')) === null || _a === void 0 ? void 0 : _a.message;
            let code = (_b = data.message.code) === null || _b === void 0 ? void 0 : _b.code;
            issues.push(this.generateIssue(data.message, code, note));
            let hint = data.message.children.find((item) => item.level == 'help');
            if (hint) {
                issues.push(this.generateIssue(hint));
            }
            let filename = (_c = data.message.spans.find((item) => item.is_primary)) === null || _c === void 0 ? void 0 : _c.file_name;
            if (filename) {
                const file = `${nova.workspace.path}/${filename}`;
                if (this.collection.has(file)) {
                    this.collection.append(file, issues);
                }
                else {
                    this.collection.set(file, issues);
                }
            }
        }
    }
    generateIssue(data, code, note) {
        let issue = new Issue();
        if (note) {
            issue.message = `${data.message}\n${note}`;
        }
        else {
            issue.message = data.message;
        }
        if (code)
            issue.code = code;
        issue.source = 'rustc';
        switch (data.level) {
            case 'error':
                issue.severity = IssueSeverity.Error;
                break;
            case 'warning':
                issue.severity = IssueSeverity.Warning;
                break;
            case 'help':
                issue.severity = IssueSeverity.Hint;
                break;
            default:
                issue.severity = IssueSeverity.Info;
                break;
        }
        const issueSpan = data.spans.find((item) => item.is_primary);
        issue.line = issueSpan === null || issueSpan === void 0 ? void 0 : issueSpan.line_start;
        issue.endLine = issueSpan === null || issueSpan === void 0 ? void 0 : issueSpan.line_end;
        issue.column = issueSpan === null || issueSpan === void 0 ? void 0 : issueSpan.column_start;
        issue.endColumn = issueSpan === null || issueSpan === void 0 ? void 0 : issueSpan.column_end;
        return issue;
    }
}
exports.RustIssueProvider = RustIssueProvider;
