export class RustLanguageServer {
  private languageClient: LanguageClient | null = null
  private crashAlert: Disposable | null = null

  constructor() {}

  get client(): LanguageClient | null {
    return this.languageClient
  }

  deactivate() {
    this.stop()
  }

  restart() {
    this.stop()
    this.start()
  }

  start() {
    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
    }

    let path = `${nova.extension.path}/bin/rust-analyzer`
    // The Rust Analyzer binary won't exist when extension is first run
    // after installing.
    if (!nova.fs.access(path, nova.fs.F_OK + nova.fs.X_OK)) {
      console.log('Rust Analyzer binary not found. Aborting start process.')
      return
    }

    var serverOptions: ServerOptions = {
      path: path,
    }
    if (nova.inDevMode()) {
      serverOptions = {
        path: '/bin/bash',
        args: [
          '-c',
          `${path} | tee "${nova.extension.path}/../logs/rust-lang-server.log"`,
        ],
      }
    }
    var clientOptions = {
      // The set of document syntaxes for which the server is valid
      syntaxes: ['rust'],
      initializationOptions: {
        checkOnSave: {
          enable: false,
        },
      },
    }
    var client = new LanguageClient(
      'rust',
      'Rust Analyzer',
      serverOptions,
      clientOptions
    )
    this.crashAlert = client.onDidStop(async (err) => {
      console.error(err)
      let crashMsg = new NotificationRequest('server-crash')
      crashMsg.title = nova.localize('Language Server Crash')
      crashMsg.body = nova.localize(
        'Rust Analyzer has crashed. If this issue persists after restarting, ' +
          'please open a bug report and include console messages.'
      )
      crashMsg.actions = [nova.localize('Restart'), nova.localize('Ignore')]
      let resp = await nova.notifications.add(crashMsg)
      if (resp.actionIdx === 0) {
        this.restart()
      } else {
        this.stop()
      }
    })

    try {
      client.start()

      // Add the client to the subscriptions to be cleaned up
      nova.subscriptions.add(client)
      this.languageClient = client
    } catch (err) {
      // If the .start() method throws, it's likely because the path to the language server is invalid
      if (nova.inDevMode()) {
        console.error(err)
      }
    }
  }

  stop() {
    // Don't treat as crash if intentionally stopping it.
    if (this.crashAlert) {
      this.crashAlert.dispose()
      this.crashAlert = null
    }
    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
      this.languageClient = null
    }
  }
}

interface ServerOptions {
  path: string
  args?: string[]
}
