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
      isActive: false,

      collection: [{ name: "My Task", id: 0 }],
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
      this.taskListId = id;
      this.isActive = !this.isActive;
      const [current] = this.collection.filter((item) => item.id === id);
      current.isActive = true;
      console.log(current.isActive, current.id);
    },
    deleteList(id) {
      this.taskList = this.taskList.filter((item, index) => index !== id);
      this.collection = this.collection
        .filter((item) => item.id !== id)
        .map((item, index) => {
          return { name: item.name, id: index };
        });
      this.saveLocally();
      this.taskListId = id - 1;
    },
    saveLocally() {
      const parsedList = JSON.stringify(this.collection);
      localStorage.setItem("collection", parsedList);
      // console.log(parsedList);
    },
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

    // save data locally
    if (localStorage.getItem("collection")) {
      try {
        this.collection = JSON.parse(localStorage.getItem("collection"));
        this.taskList = this.collection.map((item) => item.name);
      } catch (error) {
        localStorage.removeItem("collection");
        console.log("errorblock:" + error);
        console.log(JSON.stringify(this.collection));
      }
    }
  },
});

app.mount("#app");
