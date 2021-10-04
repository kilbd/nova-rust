// Panic strips execute permissions for files uploaded for extensions
export function makeScriptsExecutable(): Promise<void> {
  return new Promise((resolve, reject) => {
    let binPath = `${nova.extension.path}/bin`
    if (
      !nova.fs.access(
        `${binPath}/update_server.sh`,
        nova.fs.F_OK + nova.fs.X_OK
      )
    ) {
      let chmodProcess = new Process('chmod', {
        args: ['+x', 'update_server.sh'],
        cwd: binPath,
        shell: true,
      })
      chmodProcess.onDidExit((status: number) => {
        if (status === 0) {
          resolve()
        } else {
          reject()
        }
      })
      chmodProcess.start()
    } else {
      resolve()
    }
  })
}
