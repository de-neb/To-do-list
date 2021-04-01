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
      taskList: ["My Task"],
      taskListId: 0,
      itemName: "",
      todoList: ["pay meralco"],
      todoCollection: [{ title: "pay meralco", id: 0 }],
      collection: [{ name: "My Task", id: 0 }],
      isShow: false,
      isExpand: false,
      check: false,
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
        this.taskList.push(this.taskListName);
        this.taskListId = this.taskList.indexOf(this.taskListName);
        const task = new TaskCollection(this.taskListName, this.taskListId);
        this.collection.push(task);
        this.taskListName = "";
      }

      this.saveLocally();
      // console.log("list: " + this.taskList);
    },
    changeList(id) {
      //set active item to true and rest inactive item false
      this.collection = this.collection.map((item) => {
        let isActive = false;
        if (item.id === id) {
          isActive = true;
        } else {
          isActive = false;
        }
        return {
          name: item.name,
          id: item.id,
          isActive: isActive,
        };
      });

      [{ id: this.taskListId }] = this.collection.filter(
        (item) => item.id === id
      );

      this.saveLocally();
    },
    deleteList(id) {
      this.taskList = this.taskList.filter((item, index) => index !== id);
      this.collection = this.collection
        .filter((item) => item.id !== id)
        .map((item, index) => {
          return { name: item.name, id: index };
        });
      //if list is deleted set the previous or next item as active
      if (id === 0) {
        this.taskListId = 0;
      } else {
        this.taskListId = id - 1;
      }
      this.collection.forEach((item) => {
        if (this.taskListId === item.id) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      this.saveLocally();
    },
    addTodoItem() {
      if (this.itemName && !this.todoList.includes(this.itemName)) {
        this.todoList.push(this.itemName); // track if todo already exisits
        const todoItem = new TodoList(this.itemName);
        todoItem.id = this.todoList.indexOf(this.itemName);
        this.todoCollection.push(todoItem);
        this.itemName = "";
        // console.log(JSON.stringify(this.todoCollection));
      } else {
        alert("else block triggered while adding todo item");
      }
      this.saveLocally();
    },
    expandItem(itemIndex) {
      this.todoCollection.forEach((obj) => {
        if (obj.id === itemIndex && !obj.isExpandItem) {
          obj.isExpandItem = !this.isExpand;
          console.log(obj.id, obj.isExpandItem);
        } else {
          obj.isExpandItem = this.isExpand;
        }
      });

      console.log(this.todoCollection);
    },
    saveLocally() {
      const parsedCollection = JSON.stringify(this.collection);
      const parsedTodoCollection = JSON.stringify(this.todoCollection);
      localStorage.setItem("collection", parsedCollection);
      localStorage.setItem("todoCollection", parsedTodoCollection);
      // console.log(parsedTodoCollection);
    },
  },

  mounted() {
    document.querySelector("#todo").focus();
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
    if (localStorage.getItem("collection")) {
      try {
        //task list
        this.collection = JSON.parse(localStorage.getItem("collection"));
        this.taskList = this.collection.map((item) => item.name);
        // [{ id: this.taskListId }] = this.collection.filter(
        //   (item) => item.isActive
        // );
        //todoList
        this.todoCollection = JSON.parse(
          localStorage.getItem("todoCollection")
        );
        this.todoList = this.todoCollection.map((item) => item.title);
      } catch (error) {
        localStorage.removeItem("collection");
        localStorage.removeItem("todoCollection");
        console.log("errorblock:" + error);
        console.log(JSON.stringify(this.todoCollection));
      }
    }
  },
});

app.mount("#app");
