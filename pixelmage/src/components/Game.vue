<template>
  <div>
    <div v-if="drawGame && myTimer>=1"
      class="offset-md-2 col-md-8 offset-md-2 bg-warning mt-3 mb-3 text-center"
    >
      {{ response }} {{ myTimer }}
    </div>
    <div v-if="drawGame && myTimer>=1" class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0">
      <div class="row justify-content-md-center">
        <canvas id="canvas" class="img-fluid" />
      </div>
    </div>
    <div v-else class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0">
      <div class="row justify-content-md-center">AFFICHER LEADERBOARD</div>
    </div>
  </div>
  
</template>



<script>
var eightBit = require("8bit");
export default {
  data() {
    return {
      myImageIndex: -1,
      myTimer: 0,
      timeRound: 60,
      timeFinalRound: 65,
      response: "",
      room: "",
      drawGame: true,
    };
  },
  created() {
    this.room = this.$route.query.room;
  },
  methods: {
    pixelateImage(intensite) {
      var img = new Image();
      if (this.myTimer < this.timeRound) {
        img.onload = function () {
          eightBit(document.getElementById("canvas"), img, intensite); //on va de 0 à 50
        };
        img.src = require("../assets/images/" +
          this.$store.state.images[this.myImageIndex].image);
      }
      if (
        this.myTimer >= this.timeRound &&
        this.myTimer < this.timeFinalRound
      ) {
        img.onload = function () {
          eightBit(document.getElementById("canvas"), img, 50); //on va de 0 à 50
        };
        img.src = require("../assets/images/" +
          this.$store.state.images[this.myImageIndex].image);
      } else if (this.myTimer >= this.timeRound) {
        this.$store.state.socket.emit("newRound", {
          imagessize: this.$store.state.images.length,
          images: this.$store.state.images,
          room: this.room,
        });
      }
    },
    replaceAllCharacter(chaine) {
      let hiddenResponse = "";
      for (var i = 0; i < chaine.length; i++) {
        if (chaine.charAt(i) == "'") {
          hiddenResponse += "' ";
        } else if (chaine.charAt(i) == "-") {
          hiddenResponse += "- ";
        } else if (chaine.charAt(i) != " ") {
          hiddenResponse += "__ ";
        } else {
          hiddenResponse += "\xa0\xa0\xa0\xa0";
        }
      }
      return hiddenResponse;
    },
  },

  mounted() {
    this.$store.state.socket.on("pixeliserImage", (data) => {
      this.myTimer = data.imageprogress;
      this.myImageIndex = data.imageselected;
      if (this.room !== undefined) {
        this.$store.state.socket.emit("reponseImage", {
          reponseImage: this.$store.state.images[this.myImageIndex].reponse,
          room: this.room,
        });
      }
      if (
        this.myTimer >= this.timeRound &&
        this.myTimer <= this.timeFinalRound
      ) {
        this.response = this.$store.state.images[this.myImageIndex].reponse;
      } else {
        this.response = this.replaceAllCharacter(
          this.$store.state.images[this.myImageIndex].reponse
        );
      }
    });
    this.$store.state.socket.on("toutLeMondeATrouve", () => {
      this.myTimer = this.timeRound;
    });

    this.$store.state.socket.on("partyFinish", () => {
      this.drawGame = false;
    });

     this.$store.state.socket.on("partyBegin", () => {
      this.myTimer = 0;
      this.response = "";
       this.drawGame = true;
    });
  },

  watch: {
    myTimer(newTimer) {
      this.pixelateImage(newTimer / 10 + 0.2);
    },
  },
};
</script>

<style >
</style>