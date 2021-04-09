import TaskCollection from "./modules/TaskCollection.js";
import TodoList from "./modules/TodoList.js";
// import  TodoList  from "./modules/TodoList";

const app = Vue.createApp({
  data() {
    return {
      title: "TO-DO LIST",
      weekday: null,
      weekDayArr: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      date: null,
      month: null,
      monthArr: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      year: null,
      hours: null,
      minutes: null,
      seconds: null,
      period: null,
      taskListName: "",
      taskListId: 0,
      itemName: "",
      taskList: ["My Task"],
      todoList: [],
      todoCollection: [],
      collection: [
        { name: "My Task", id: 0, isActive: true, todos: [], isDone: false },
      ],
      isShow: false,
      isExpand: false,
      toDelete: false,
      toAdd: false,
      setPriority: false,
      noteTitle: "",
      noteDetails: "",
      notes: [
        { title: "3rd note", details: "", hidden: false, notesIndex: 0 },
        { title: "2nd note", details: "", hidden: false, notesIndex: 1 },
        { title: "1st note", details: "", hidden: false, notesIndex: 2 },
      ],
      menuActive: false,
    };
  },
  methods: {
    padZero(num) {
      return num < 10 ? String(num).padStart(2, "0") : num;
    },
    setPeriod(hour) {
      return hour < 12 ? "AM" : "PM";
    },

    addTask() {
      //not yet on the list and tasklistname is not empty
      if (this.taskListName && !this.taskList.includes(this.taskListName)) {
        const task = new TaskCollection(this.taskListName, null, []);
        this.collection.push(task);
        this.taskList = this.collection.map((el) => el.name);
        this.taskListId = this.taskList.indexOf(this.taskListName);
        this.collection.forEach((obj) => {
          obj.id = this.taskList.indexOf(obj.name);
          if (this.taskListName === obj.name) {
            obj.isActive = true;
          } else {
            obj.isActive = false;
          }
        });
        this.title = this.taskListName;
        this.taskListName = "";
      }
    },

    changeList(id) {
      //set active item to true and rest inactive item false
      this.collection.forEach((obj) => {
        let isActive = false;
        if (obj.id === id) {
          this.title = obj.name;
          isActive = true;
        } else {
          isActive = false;
        }
        obj.isActive = isActive;
      });
      this.taskListId = id;

      //hides notes
      const notes = document.getElementById("notes");
      const list = document.getElementById("notes-list");
      const tag = document.getElementById("notes-tag");
      const main = document.querySelector(".main");
      notes.classList.add("hidden");
      list.classList.remove("active");
      tag.classList.remove("notes-tag");
      main.classList.remove("hidden");
    },

    deleteList(id) {
      this.taskList = this.taskList.filter((item, index) => index !== id);
      this.collection = this.collection.filter((obj) => obj.id !== id);
      this.collection.forEach((obj, index) => {
        obj.id = index;
      });

      //if list is deleted set the previous or next item as active
      if (id === 0) {
        this.taskListId = 0;
        this.title = this.taskList[0];
      } else {
        this.taskListId = id - 1;
        this.title = this.taskList[id - 1];
      }
      this.collection.forEach((obj) => {
        if (this.taskListId == obj.id) {
          obj.isActive = true;
        } else {
          obj.isActive = false;
        }
      });
    },

    addTodoItem() {
      this.todoList = this.todoTitles;
      this.todoCollection = this.activeTaskTodos;
      this.collection.forEach((list) => {
        if (list.isActive) {
          if (this.itemName && !this.todoList.includes(this.itemName)) {
            this.todoList.push(this.itemName); // track if todo already exisits
            const todoItem = new TodoList(this.itemName);
            todoItem.id =
              this.itemName + "-" + this.todoList.indexOf(this.itemName);
            todoItem.isDone = false;
            todoItem.deleted = false;
            list.todos.push(todoItem);
            this.itemName = "";
            this.toAdd = true;
          }
        }
      });
    },

    expandItem(title) {
      this.activeTaskTodos.forEach((todo, i) => {
        if (todo.title == title && !todo.isExpandItem) {
          todo.isExpandItem = !this.isExpand;
        } else {
          todo.isExpandItem = this.isExpand;
        }
      });
    },

    deleteTodoItem(title) {
      this.animationDelete(title);
      setTimeout(() => {
        this.todoCollection = this.activeTaskTodos.filter((obj) => {
          return obj.title !== title;
        });
        this.todoList = this.todoCollection.map((todo) => todo.title);
        this.collection.forEach((task) => {
          if (task.isActive) {
            task.todos.forEach((todo) => {
              if (todo.title === title) {
                todo.deleted = true;
              }
            });
          }
        });
      }, 300);
      //timing set to 300 for smoother transition
    },

    animationDelete(title) {
      const itemBar = document.getElementById("todo-" + title);
      const itemDet = document.getElementById("expanded-cont-" + title);
      const itemCont = document.getElementById("item-cont-" + title);
      itemBar.classList.add("deleting");
      itemDet.classList.add("deleting");
      itemCont.classList.add("shrink");
    },

    appearItem() {
      //to make sure that the animation will only play when adding a unique todo item
      if (!this.todoList.includes(this.itemName))
        setTimeout(() => {
          const addedItem = this.todoList[this.todoList.length - 1];
          const itemCont = document.getElementById("item-cont-" + addedItem);
          itemCont.classList.add("appear");
        }, 20);
    },

    clearDoneItems() {
      this.collection.forEach((task) => {
        if (task.isActive) {
          task.todos.forEach((todo) => {
            if (todo.isDone && !todo.deleted) {
              const item = document.getElementById("item-cont-" + todo.title);
              item.classList.add("done");
              setTimeout(() => {
                item.classList.add("hidden");
                this.todoCollection = this.todoCollection.filter(
                  (el) => !el.isDone
                );
                todo.deleted = true;
                const index = this.todoList.indexOf(todo.title);
                this.todoList.splice(index, 1);
              }, 502);
            }
          });
        }
      });
    },

    deleteAllItems() {
      this.collection.forEach((task) => {
        if (task.isActive)
          task.todos.forEach((todo) => {
            if (!todo.deleted) {
              this.animationDelete(todo.title);
              setTimeout(() => {
                todo.deleted = true;
              }, 400);
            }
          });
      });
      console.log(this.collection);
    },

    //notes
    showNotes() {
      const notes = document.getElementById("notes");
      const list = document.getElementById("notes-list");
      const tag = document.getElementById("notes-tag");
      const main = document.querySelector(".main");
      notes.classList.remove("hidden");
      list.classList.add("active");
      tag.classList.add("notes-tag");
      main.classList.add("hidden");

      if (this.collection.length)
        this.collection.forEach((task) => {
          if (task.isActive) task.isActive = false;
        });
    },

    addNote() {
      const colNum = 0;
      const note = {
        title: this.noteTitle,
        details: this.noteDetails,
        group: colNum,
        hidden: true,
      };
      this.notes.unshift(note);

      this.notes[0].hidden = false;
      setTimeout(() => {
        //always index 0 at column 0
        this.addNoteAnimation(colNum, note.notesIndex);
      }, 10);

      this.noteTitle = "";
      this.noteDetails = "";
    },

    addNoteAnimation(group, index) {
      const newNote = document.getElementById(`group${group}-note${index}`);
      newNote.classList.add("show-note");
    },

    deleteNote(index, group) {
      const note = document.getElementById(`group${group}-note${index}`);
      note.classList.add("remove-note");
      setTimeout(() => {
        this.notes.splice(index, 1);
        console.log(this.notes);
        // this.notes[group].splice(index, 1);
      }, 300);
    },

    handleInput(event, index, group, prop) {
      this.notes.forEach((note) => {
        if (note.notesIndex === index)
          note[prop] = event.target.innerHTML.replace(/<\/*div>/g, "");
      });
    },

    setItem(obj, name) {
      const parsed = JSON.stringify(obj);
      localStorage.setItem(name, parsed);
    },

    saveLocally() {
      this.setItem(this.collection, "collection");
      this.setItem(this.todoCollection, "todoCollection");
      this.setItem(this.notes, "notes");
    },
  },
  computed: {
    //returns todo items // todoCollection
    activeTaskTodos: function () {
      try {
        let [{ todos: todos }] = this.collection.filter((obj) => obj.isActive);
        return todos.filter((obj) => !obj.deleted);
      } catch (error) {
        return [];
      }
    },
    //todoList
    todoTitles: function () {
      return this.activeTaskTodos.map((todo) => todo.title);
    },

    notes0: function () {
      return this.notes.filter((el, i) => i % 3 === 0);
    },

    notes1: function () {
      return this.notes.filter((el, i) => i % 3 === 1);
    },

    notes2: function () {
      return this.notes.filter((el, i) => i % 3 === 2);
    },
  },
  updated() {
    this.saveLocally();

    this.notes.forEach((note, i) => {
      note.notesIndex = i;
    });
  },
  mounted() {
    setInterval(() => {
      const d = new Date();
      this.weekday = this.weekDayArr[d.getDay()];
      this.date = d.getDate();
      this.month = this.monthArr[d.getMonth()];
      this.year = d.getFullYear();
      this.hours = this.padZero(((d.getHours() + 11) % 12) + 1);
      this.minutes = this.padZero(d.getMinutes());
      this.period = this.setPeriod(d.getHours());
    }, 900);
    // get saved data from local storage
  },
  created() {
    if (localStorage.getItem("collection")) {
      try {
        //task list
        this.collection = JSON.parse(localStorage.getItem("collection"));
        this.taskList = this.collection.map((item) => item.name);
        this.todoCollection = JSON.parse(
          localStorage.getItem("todoCollection")
        );
        this.todoList = this.todoCollection.map((item) => item.title);
        let [{ isActive: active, name: list }] = this.collection.filter(
          (obj) => obj.isActive
        );
        this.title = list;
      } catch (error) {
        // localStorage.removeItem("collection");
        // localStorage.removeItem("todoCollection");
        this.collection[0].isActive = true;
        this.title = this.collection[0].name;
        console.log("errorblock:" + error);
      }
    }

    if (localStorage.getItem("notes")) {
      try {
        this.notes = JSON.parse(localStorage.getItem("notes"));
      } catch (error) {
        localStorage.removeItem("notes");
        console.log("problem in getting 'notes' from localStorage");
      }
    }
  },
});

app.mount("#app");
