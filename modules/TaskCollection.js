export default class TaskCollection {
  name = "My First Task";
  id = 0;
  todos = [];

  constructor(taskName, taskId, todosObj) {
    this.name = taskName;
    this.id = taskId;
    this.todos = todosObj;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }
}
