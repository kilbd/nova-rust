let binPath = `${nova.extension.path}/bin`

// Panic strips execute permissions for files uploaded for extensions
export function makeScriptsExecutable(): Promise<void> {
  return new Promise((resolve, reject) => {
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

export function getLatestBinary(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    let raVersion = 'none'
    if (
      nova.fs.access(`${binPath}/rust-analyzer`, nova.fs.F_OK + nova.fs.X_OK)
    ) {
      let data: GitHubReleaseData[] = []
      try {
        let ghResponse = await fetch(
          'https://api.github.com/repos/rust-lang/rust-analyzer/releases',
          {
            method: 'GET',
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        )
        if (ghResponse.ok) {
          data = await ghResponse.json()
        } else {
          console.error(
            `Rust Analyzer version check returned status ${ghResponse.status}`
          )
          // If response status isn't 2xx, don't proceed with update.
          resolve(false)
        }
      } catch (err) {
        console.error(err)
        // If this version query failed, the update should not proceed.
        resolve(false)
      }
      let latest = data.find(
        (item) => !item.draft && !item.prerelease && item.tag_name !== 'nightly'
      )
      raVersion = latest?.target_commitish || 'none'
      console.log(`Latest Rust Analyzer version: ${latest?.name}`)
    }
    // Replacing a file while running in dev mode causes the extension to
    // restart. Replacing a file during activation gets you stuck in a loop.
    if (nova.inDevMode()) {
      resolve(false)
    } else {
      let newBinary = false
      let downloadProcess = new Process('./update_server.sh', {
        args: [raVersion],
        cwd: binPath,
        shell: true,
      })
      downloadProcess.onStdout((line: string) => {
        if (line.includes('downloading new binary...')) {
          newBinary = true
        }
      })
      downloadProcess.onStderr((err: string) => console.error(err))
      downloadProcess.onDidExit((status: number) => {
        if (status === 0) {
          resolve(newBinary)
        } else {
          reject()
        }
      })
      downloadProcess.start()
    }
  })
}

export function replaceBinary() {
  console.log('attempting to replace Rust Analyzer')
  nova.fs.remove(`${binPath}/rust-analyzer`)
  nova.fs.move(`${binPath}/rust-analyzer-new`, `${binPath}/rust-analyzer`)
}

interface GitHubReleaseData {
  draft: boolean
  name: string
  prerelease: boolean
  tag_name: string
  target_commitish: string
}
