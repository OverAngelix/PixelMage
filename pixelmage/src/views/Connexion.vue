<template>
  <div class="row">
    <div class="col-md-9">
      <form @submit.prevent="connexion">
        <div class="gorm-group">
          <label for="user">Nom d'utilisateur:</label>
          <input type="text" v-model="user" class="form-control" />
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
    };
  },

  methods: {
    connexion(e) {
      e.preventDefault();
      if (this.user != "") {
        this.$store.state.socket.emit("connexionServeur", {
          user: this.user,
          score : 0,
          dejaRepondu: false,
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
      this.$router.push("/game");
    });
  },
};
</script>
