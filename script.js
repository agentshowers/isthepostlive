TODAY = (new Date()).setHours(0, 0, 0, 0);
BISCUIT_PICS = 11;
IMAGE_UPDATE_INTERVAL = 5000;

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
      picIndex: 0
    }
  },

  methods: {
    getPosts() {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText);
          let events = response.data.children;
          let boardgames = events.filter(e => e.data.title.toLowerCase().includes("boardgames @"));
          boardgames.forEach(bg => {
            let title = bg.data.title;
            let date = parseDate(title);
            if (date < TODAY) {
              this.pastEvents.push({ title: bg.data.title, url: bg.data.url });
            } else {
              this.upcomingEvents.push({ title: bg.data.title, url: bg.data.url });
            }
          })
          this.pastEvents.sort((a, b) => parseDate(b.title) - parseDate(a.title));
          this.pastEvents = this.pastEvents.slice(0, 4);
          if (this.upcomingEvents.length > 0) {
            this.text = "Yes!";
            let subtext = "His lordship Adam has graced us with the following post";
            if (this.upcomingEvents.length > 1) {
              subtext += "s";
            }
            this.subtext = subtext;
          } else {
            this.text = "No!";
            this.subtext = "Adam is being lazy. Here are some pets to cheer you up.";
          }
          this.loaded = true;
        }
      }.bind(this);
      xhr.open("GET", "https://www.reddit.com/r/londonsocialclub/new.json?limit=100");
      xhr.send();
    },

    updateImage() {
      this.picIndex = Math.floor(Math.random() * BISCUIT_PICS);
    },
  },

  created() {
    this.getPosts();
    this.updateImage();
    setInterval(() => this.updateImage(), IMAGE_UPDATE_INTERVAL);
  }
}

Vue.createApp(App).mount("#app")
