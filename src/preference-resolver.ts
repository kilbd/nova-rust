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
    if (e) {
      let env = e.trim()
      let splitIndex = env.indexOf('=')
      if (splitIndex > 0) {
        map.set(
          env.substring(0, splitIndex).trim(),
          env.substring(splitIndex + 1).trim()
        )
      }
    }
  })
  return Object.fromEntries(map)
}

function splitArgString(str: string): string[] {
  let args = []
  let start = 0
  while (start < str.length) {
    let nextSpace = str.indexOf(' ', start)
    let nextSingleQuote = str.indexOf("'", start)
    let nextDoubleQuote = str.indexOf('"', start)
    if (nextSpace === -1) {
      // No more spaces, add the rest of the string as an argument.
      args.push(str.substring(start))
      start = str.length
    } else if (
      (nextSingleQuote === -1 || nextSpace < nextSingleQuote) &&
      (nextDoubleQuote === -1 || nextSpace < nextDoubleQuote)
    ) {
      // No quote marks in next chunk. Split at next space.
      args.push(str.substring(start, nextSpace))
      start = nextSpace + 1
    } else if (
      nextSingleQuote !== -1 &&
      (nextDoubleQuote === -1 || nextSingleQuote < nextDoubleQuote) &&
      (nextSpace === -1 || nextSingleQuote < nextSpace)
    ) {
      // Single quote before a space or double quote. Chop at next single quote.
      let closingQuote = str.indexOf("'", nextSingleQuote + 1)
      args.push(str.substring(start, closingQuote + 1))
      start = closingQuote + 1
    } else if (
      nextDoubleQuote !== -1 &&
      (nextSingleQuote === -1 || nextDoubleQuote < nextSingleQuote) &&
      (nextSpace === -1 || nextDoubleQuote < nextSpace)
    ) {
      // Double quote before a space or single quote. Chop at next double quote.
      let closingQuote = str.indexOf('"', nextDoubleQuote + 1)
      args.push(str.substring(start, closingQuote + 1))
      start = closingQuote + 1
    }
  }
  return args
}

export { onPreferenceChange, envVarObject, splitArgString }
