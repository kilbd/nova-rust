class CargoTaskAssistant {
  // Required, but unused, method. Tasks are configured in extension.json.
  provideTasks(): AssistantArray<Task> {
    return []
  }

  resolveTaskAction(context: TaskActionResolveContext<any>): TaskProcessAction {
    console.log(context.config)
    return new TaskProcessAction('cargo', {
      shell: true,
      args: ['build'],
    })
  }
}

export { CargoTaskAssistant }
