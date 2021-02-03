<template>
  <div class="row">
    <div class="col-md-9">
      <form @submit.prevent="connexion">
        <div class="form-group">
          <label for="user">Nom d'utilisateur:</label>
          <input type="text" v-model="user" class="form-control" />
        </div>
        <div class="form-group">
          <label for="user">room:</label>
          <input type="text" v-model="room" class="form-control" />
        </div>
        <button type="submit" class="btn btn-success">Envoyer</button>
      </form>
    </div>
    <DarkTheme />
  </div>
</template>


<script>
import DarkTheme from "../components/DarkTheme.vue";
export default {
  components: {
    DarkTheme,
  },
  data() {
    return {
      user: "",
      room: "",
    };
  },

  methods: {
    connexion(e) {
      e.preventDefault();
       if (this.user != "" && this.room != "") {
        this.$store.state.socket.emit("connexionServeur", {
          user: this.user,
          score: 0,
          dejaRepondu: false,
          room: this.room,
        });
      }
    },
  },

  mounted() {
    if (localStorage.username) {
      this.user = localStorage.username;
    }
    this.$store.state.socket.on("accessDenied", (data) => {
      if (this.user == data) {
        alert(
          "Ce pseudo est déjà présent dans la partie ! Veuillez le changer."
        );
      }
    });

    this.$store.state.socket.on("accessAuthorized", () => {
      localStorage.username = this.user;
      this.$store.commit("connection");
      this.$router.push({ path: "/game", query: { room: this.room } });
    });
  },
};
</script>
