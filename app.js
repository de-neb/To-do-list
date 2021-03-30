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
      if (!this.taskList.includes(this.taskListName) && this.taskListName) {
        this.taskList.push(this.taskListName);
        this.taskListId = this.taskList.indexOf(this.taskListName);
        this.taskListName = "";
      }
      this.saveLocally();
    },
    changeList(id) {
      this.taskListId = id;
      this.isActive = !this.isActive;
    },
    deleteList(id) {
      this.taskList = this.taskList.filter((item, index) => index !== id);
      this.saveLocally();
      this.taskListId = id - 1;
      console.log("current id: " + this.taskListId);
    },
    saveLocally() {
      const parsed = JSON.stringify(this.taskList);
      localStorage.setItem("taskList", parsed);
      console.log(parsed);
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
    if (localStorage.getItem("taskList")) {
      try {
        this.taskList = JSON.parse(localStorage.getItem("taskList"));
        console.log("taskLit from storage: " + this.taskList);
      } catch (error) {
        console.log("errorblock:" + error);
        console.log(this.taskList);
      }
    }
  },
  watch: {},
});

app.mount("#app");
