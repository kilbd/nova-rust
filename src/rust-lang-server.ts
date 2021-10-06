export class RustLanguageServer {
  private languageClient: LanguageClient | null = null

  constructor() {}

  get client(): LanguageClient | null {
    return this.languageClient
  }

  deactivate() {
    this.stop()
  }

  start() {
    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
    }

    let path = `${nova.extension.path}/bin/rust-analyzer`

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
    client.onDidStop((err) => {
      console.error(err)
      console.log('onDidStop happened.')
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
