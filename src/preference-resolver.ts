// Function to reconcile global and local preferences
export function onPreferenceChange(
  name: string,
  append: boolean,
  callback: (value: any) => void
) {
  let global: any
  let local: any
  nova.config.observe(name, (newValue: any, _oldValue: any) => {
    global = newValue
    if (append && local) {
      callback(newValue.concat(local))
    } else if (newValue && !local) {
      callback(newValue)
    }
  })
  nova.workspace.config.observe(name, (newValue: any, _oldValue: any) => {
    local = newValue
    if (append && global) {
      callback(global.concat(newValue))
    } else if (newValue) {
      callback(newValue)
    } else {
      callback(global)
    }
  })
}
