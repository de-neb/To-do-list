export default class TodoList {
  title = "Shopping";
  due = 1;
  priority = "low";
  details = "lorem";

  constructor(title, due, priority, details) {
    this.title = title;
    this.due = due;
    this.priority = priority;
    this.details = details;
  }

  getTitle() {
    return this.title;
  }

  getDue() {
    return this.due;
  }

  getPriority() {
    return this.priority;
  }

  getDetails() {
    return this.details;
  }
}
