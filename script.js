TODAY = (new Date()).setHours(0, 0, 0, 0);

function parseDate(title) {
  try {
    var dateStart = title.indexOf("[") + 1;
    var dateEnd = title.indexOf("]");
    var dateText = title.slice(dateStart, dateEnd);
    var split = dateText.split("/");
    if (split.length != 3) {
      throw "Invalid date";
    }
    var day = parseInt(split[0]);
    var month = parseInt(split[1]) - 1;
    var parsedYear = parseInt(split[2]);
    var year = parsedYear > 2000 ? parsedYear : parsedYear + 2000;
    return new Date(year, month, day);
  } catch (err) {
    console.log(`Failed to parse date from title "${title}"`);
    return null;
  }
}

const App = {

  data() {
    return {
      text: "No!",
      upcomingEvents: [],
      pastEvents: [],
      loaded: false,
    }
  },

  methods: {
    getPosts() {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText);
          let events = response.data.children;
          let boardgames = events.filter(e => e.data.author.toLowerCase() === "bullseye_bailey" && e.data.title.toLowerCase().includes("boardgames"));
          boardgames.forEach(bg => {
            let title = bg.data.title;
            let date = parseDate(title);
            if (date < TODAY) {
              this.pastEvents.push({ title: bg.data.title, url: bg.data.url });
            } else {
              this.upcomingEvents.push({ title: bg.data.title, url: bg.data.url });
            }
            this.text = this.upcomingEvents.length > 0 ? "Yes!" : "No!";
            this.loaded = true;
          })
          
        }
      }.bind(this);
      xhr.open("GET", "https://www.reddit.com/r/londonsocialclub/new.json?limit=100");
      xhr.send();
    },
  },

  created() {
    this.getPosts();
  }
}

Vue.createApp(App).mount("#app")
