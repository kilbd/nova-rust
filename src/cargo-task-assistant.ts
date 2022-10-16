import {
  envVarObject,
  onPreferenceChange,
  splitArgString,
} from './preference-resolver'

class CargoTaskAssistant {
  private envVars: Object = {}

  constructor() {
    onPreferenceChange('com.kilb.rust.env-vars', true, (varList: string[]) => {
      this.envVars = envVarObject(varList)
    })
  }

  // Required, but unused, method. Tasks are configured in extension.json.
  provideTasks(): AssistantArray<Task> {
    return []
  }

  resolveTaskAction(context: TaskActionResolveContext<any>): TaskProcessAction {
    let args: string[] = []
    let cmdPref = 'com.kilb.rust.cargo.build.subcommand'
    let argPref = 'com.kilb.rust.cargo.build.args'
    if (context.action === Task.Run) {
      cmdPref = 'com.kilb.rust.cargo.run.subcommand'
      argPref = 'com.kilb.rust.cargo.run.args'
    }
    args.push(context.config?.get(cmdPref) as string)
    let comArgs = context.config?.get(argPref)
    console.log(comArgs)
    if (comArgs) args = args.concat(splitArgString(comArgs as string))
    console.log(args)

    return new TaskProcessAction('cargo', {
      shell: true,
      args: args,
      env: this.envVars as { [key: string]: string },
    })
  }
}

export { CargoTaskAssistant }
