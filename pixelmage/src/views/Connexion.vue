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
        <div class="bg-secondary mt-5 text-white p-2">
          <!--  Mon frere me casse les couilles avec sa musique TRES FORTE de merde -->
          <div>
            <p style="text-align: center"><u>Salons</u></p>

            <table class="table table-striped">
              <tr>
                <td>Salon</td>
                <td>Joueurs</td>
              </tr>
              <tbody
                v-for="(informations, index) in informationsSalles"
                :key="index"
              >
                <tr>
                  <td class="col-md-8">{{ informations.salon }}</td>
                  <td class="col-md-4">{{ informations.personnesParSalon }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
      informationsSalles: [],
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
          host: false,
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

    this.$store.state.socket.emit("getSalonsCrees", () => {});

    this.$store.state.socket.on("envoiSalonsCrees", (data) => {
      this.informationsSalles = data;
    });
  },
};
</script>
