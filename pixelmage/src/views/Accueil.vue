<template>
  <div>
    <div class="row justify-content-center">
      <ul
        class="listePersonnes col-1"
        v-for="(personne, index) in listePersonne"
        :key="index"
      >
        <li class="list-group-item active" v-if="personne.user == user">
          {{ personne.user }} <br> {{personne.score}}
        </li>
        <li class="list-group-item" v-else>
            {{ personne.user }} <br> {{personne.score}}
        </li>
      </ul>
    </div>
    <div class="row pt-5 pl-3">
      <div class="col-md-9 bg-primary">
        <Game />
      </div>
      <div class="col-md-3">
        <DarkTheme />
        <perfect-scrollbar id="ps-container">
          <div class="messages" v-for="(msg, index) in messages" :key="index">
            <p>
              <span class="font-italic" v-if="msg.timeInfo"
                >({{ msg.timeInfo }})
              </span>
              <span class="font-weight-bold" v-if="msg.user"
                >{{ msg.user }}:
              </span>
              {{ msg.message }}
            </p>
          </div>
        </perfect-scrollbar>
        <form @submit.prevent="sendMessage">
          <div class="gorm-group">
            <input type="text" v-model="message" class="form-control" />
          </div>
          <button type="submit" class="btn btn-success">Envoyer</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Game from "../components/Game.vue";
import DarkTheme from "../components/DarkTheme.vue";

export default {
  components: {
    Game,
    DarkTheme,
  },
  data() {
    return {
      user: "",
      message: "",
      messages: [],
      listePersonne: [],
      dejaRepondu: false,
    };
  },

  created() {
    window.addEventListener("beforeunload", () => this.beforeunloadFn());

    if (this.$store.state.connected == false) {
      this.$router.push("/connexion");
    }
  },

  destroyed() {
    window.removeEventListener("beforeunload", () => this.beforeunloadFn());
  },

  methods: {
    beforeunloadFn() {
      this.$store.state.socket.emit("deconnexionServeur", {
        user: this.user,
      });
    },

    scrollToEnd() {
      setTimeout(() => {
        const container = document.getElementById("ps-container");
        container.scrollTop = container.scrollHeight;
      }, 0);
    },

    currentTime() {
      let today = new Date();
      let hours = today.getHours();
      let minutes = today.getMinutes();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return hours + ":" + minutes;
    },

    sendMessage(e) {
      if (this.message != "" && this.user != "" && !this.dejaRepondu) {
        e.preventDefault();

        this.$store.state.socket.emit("SEND_MESSAGE", {
          user: this.user,
          message: this.message,
          timeInfo: this.currentTime(),
          dejaRepondu: this.dejaRepondu,
        });
        this.message = "";
      }
    },
  },

  mounted() {
    this.$store.state.socket.on("MESSAGE", (data) => {
      this.messages = [...this.messages, data];
      this.scrollToEnd();
    });

    if (localStorage.username) {
      this.user = localStorage.username;
    }
    this.$store.state.socket.emit("envoiInfosServeur");

    this.$store.state.socket.on("miseAJourChat", (data) => {
      this.messages = [];
      for (let i = 0; i < data.length; i++) {
        this.messages = [...this.messages, data[i]];
      }
    });

  this.$store.state.socket.on("RAZ", () => {
    this.dejaRepondu=false;
    });

    this.$store.state.socket.on("miseAJourPersonnes", (data) => {
      this.listePersonne = data;
    });

    this.$store.state.socket.on("miseAJourScore", (data) => {
      this.listePersonne = data;
    });

    this.$store.state.socket.on("miseAJourRepondus", (data) => {
      if (this.user==data.user){
        this.dejaRepondu=true;
      }      
    });

  },
};
</script>

<style >
.ps {
  height: 700px;
}
.listePersonnes {
  display: inline-block;
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>