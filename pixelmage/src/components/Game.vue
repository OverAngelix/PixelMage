<template>
  <div>
    <div
      class="offset-md-2 col-md-8 offset-md-2 bg-warning mt-3 mb-3 text-center"
    >
      {{ response }} {{ myTimer }}
    </div>
    <div class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0">
      <div class="row justify-content-md-center">
        <canvas id="canvas" class="img-fluid" />
      </div>
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
      timeFinalRound: 70,
      response: "",
    };
  },
  created() {
    this.$store.state.socket.emit("lancementChrono", {
      imagessize: this.$store.state.images.length,
      images: this.$store.state.images,
    });
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
          images:this.$store.state.images,
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
      console.log(this.$store.state.images[this.myImageIndex].reponse);
      this.$store.state.socket.emit("reponseImage", {
        reponseImage: this.$store.state.images[this.myImageIndex].reponse,
      });
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