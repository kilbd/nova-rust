// Function to reconcile global and local preferences
function onPreferenceChange(
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

// Takes the string array of combined environment variable preferences, and returns
// an object that can be given to processes.
function envVarObject(envs: string[]): Object {
  let map = new Map()
  envs.forEach((e) => {
    let env = e.trim()
    let splitIndex = env.indexOf('=')
    map.set(
      env.substring(0, splitIndex).trim(),
      env.substring(splitIndex + 1).trim()
    )
  })
  return Object.fromEntries(map)
}

export { onPreferenceChange, envVarObject }
