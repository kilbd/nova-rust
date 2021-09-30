"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustFormatter = void 0;
class RustFormatter {
    constructor() {
        this.enabled = false;
        nova.config.observe('com.kilb.rust.rustfmt-on-save', (enabled) => {
            this.enabled = enabled;
        });
    }
    format(editor) {
        return new Promise((resolve, reject) => {
            if (this.enabled) {
                let fmtProcess = new Process('rustfmt', {
                    args: [editor.document.path],
                    shell: true,
                });
                fmtProcess.onStderr((err) => console.error(err));
                fmtProcess.onDidExit((status) => {
                    if (status !== 0) {
                        console.error("Rustfmt stopped with non-zero code: " + status);
                    }
                });
                fmtProcess.start();
            }
            else {
                resolve();
            }
        });
    }
}
exports.RustFormatter = RustFormatter;
