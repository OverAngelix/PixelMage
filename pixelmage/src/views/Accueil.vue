<template>
  <div>
    Catégorie <select v-if="host && partieCommencee != true" v-model="categorieSelected" class ="custom-select col-md-1">
      <option v-for="categorie in categories" :value="categorie" :key="categorie.id">
        {{ categorie }}
      </option>
    </select>
    <div class="row justify-content-center">
      <ul
        class="listePersonnes col-1"
        v-for="(personne, index) in listePersonne"
        :key="index"
      >
        <li class="list-group-item active" v-if="personne.user == user">
          {{ personne.user }} <br />
          {{ personne.score }}
          <div v-if="host && partieCommencee != true">
            <button type="button" @click="lancerPartie" class="btn btn-danger">
              Commencer !
            </button>
          </div>
          
        </li>
        <li class="list-group-item" v-else>
          {{ personne.user }} <br />
          {{ personne.score }}
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
      room: "",
      host: false,
      partieCommencee: false,
      categorieSelected: "TOUTES",
      categories: [],
    };
  },

  created() {
    window.addEventListener("beforeunload", this.beforeunloadFn);
    this.categories = this.$store.state.categories;
    this.room = this.$route.query.room;
    if (this.$store.state.connected == false) {
      this.$router.push("/connexion");
    }
  },

  destroyed() {
    window.removeEventListener("beforeunload", this.beforeunloadFn);
  },

  methods: {
    lancerPartie() {
      if (this.room !== undefined) {
        this.$store.state.socket.emit("lancementChrono", {
          categorie : this.categorieSelected,
          imagessize: this.$store.state.images.length,
          images: this.$store.state.images,
          room: this.room,
        });
        this.partieCommencee = true;
      }
    },

    beforeunloadFn() {
      this.$store.state.socket.emit("deconnexionServeur", {
        user: this.user,
        room: this.room,
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
          room: this.room,
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

    this.$store.state.socket.on("messageRoom", (data) => {
      console.log(data);
    });

    this.$store.state.socket.on("partyFinish", () => {
      this.partieCommencee = false;
    });

    if (localStorage.username) {
      this.user = localStorage.username;
    }

    this.$store.state.socket.emit("envoiInfosServeur", {
      room: this.room,
    });

    this.$store.state.socket.on("miseAJourChat", (data) => {
      this.messages = [];
      for (let i = 0; i < data.length; i++) {
        this.messages = [...this.messages, data[i]];
      }
    });

    this.$store.state.socket.on("RAZ", () => {
      this.dejaRepondu = false;
    });

    this.$store.state.socket.on("miseAJourPersonnes", (data) => {
      this.listePersonne = data;
      this.host = data.filter((e) => e.user == this.user)[0].host;
    });

    this.$store.state.socket.on("miseAJourScore", (data) => {
      this.listePersonne = data;
    });

    this.$store.state.socket.on("miseAJourRepondus", (data) => {
      if (this.user == data.user) {
        this.dejaRepondu = true;
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