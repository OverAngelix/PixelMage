<template>
  <div>
    <div class="row justify-content-md-center" style="height: 800px">
      <div
        class="col-md-4 bg-secondary pl-5 pr-5 pb-3 pt-3 rounded"
        style="top: 40%; height: 30%"
      >
        <form @submit.prevent="connexion">
          <div class="form-group register-form" style="text-align: center">
            <label for="user">Nom d'utilisateur :</label>
            <input type="text" v-model="user" class="form-control" />
          </div>
          <div class="form-group" style="text-align: center">
            <label for="user">Salon :</label>
            <input type="text" v-model="room" class="form-control" />
          </div>
          <div class="row">
            <button type="submit" class="btn btn-success col align-self-start">
              Envoyer
            </button>
            <DarkTheme class="col align-self-end ml-5 col-4" />
          </div>
        </form>
      </div>
    </div>
    <div class="bg-secondary text-white p-2">
      <p>Salons :</p>
      <ul class="list-group" v-for="(room, index) in listeRooms" :key="index">
        <li class="list-group-item"><a href="">{{room}}</a></li>
      </ul>
    </div>
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
      listeRooms:[],
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

    this.$store.state.socket.emit("getSalonsCrees",()=>{
    });

    this.$store.state.socket.on("envoiSalonsCrees",(data)=>{
      this.listeRooms=data;
      console.log(this.listeRooms);
    });
  },
};
</script>
