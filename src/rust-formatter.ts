export class RustFormatter {
  private enabled: boolean = false

  constructor() {
    nova.config.observe('com.kilb.rust.rustfmt-on-save', (enabled: boolean) => {
      this.enabled = enabled
    })
  }

  format() {
    if (this.enabled) {
      console.log('Format!')
    }
  }
}
