export class RustLanguageServer {
  languageClient: LanguageClient | null = null

  constructor() {
    // Observe the configuration setting for the server's location, and restart the server on change
    nova.config.observe(
      'com.kilb.rust.language-server-path',
      (path: string) => {
        this.start(path)
      }
    )
  }

  deactivate() {
    this.stop()
  }

  start(path: string) {
    if (this.languageClient) {
      this.languageClient.stop()
      nova.subscriptions.remove(this.languageClient)
    }

    // Use the default server path
    if (!path) {
      path = '/usr/local/bin/rust-analyzer'
    }

    var serverOptions: ServerOptions = {
      path: path,
    }
    if (nova.inDevMode()) {
      serverOptions = {
        path: '/bin/bash',
        args: [
          '-c',
          `${path} | tee "${nova.workspace.path}/logs/rust-lang-server.log"`,
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
      'Rust Language Server',
      serverOptions,
      clientOptions
    )
    client.onDidStop((err) => {
      console.error(err)
      console.log('onDidStop happened.')
    })

    try {
      // Start the client
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
