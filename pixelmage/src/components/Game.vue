<template>
  <div>
    <div
      class="offset-md-2 col-md-8 offset-md-2 bg-warning mt-3 mb-3 text-center"
    >
      BLABLA {{ myTimer }}
    </div>

    <div class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0">
      <canvas id="canvas" class="img-fluid" />
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
    };
  },
  created() {
    this.$store.state.socket.emit("lancementChrono", {
      imagessize: this.$store.state.images.length,
    });
  },
  methods: {
    pixelateImage(intensite) {
      var img = new Image();
      if (this.myTimer < 60) {
        img.onload = function () {
          eightBit(document.getElementById("canvas"), img, intensite); //on va de 0 à 50
        };
        img.src = require("../assets/images/" +
          this.$store.state.images[this.myImageIndex].image);
      }
      if (this.myTimer >= 60 && this.myTimer < 70) {
        intensite = 50;
      } else if (this.myTimer >= 60) {
        this.$store.state.socket.emit("newRound", {
          imagessize: this.$store.state.images.length,
        });
      }
    },
  },

  mounted() {
    this.$store.state.socket.on("pixeliserImage", (data) => {
      this.myTimer = data.imageprogress;
      this.myImageIndex = data.imageselected;
      this.$store.state.socket.emit("reponseImage", {
        reponseImage: this.$store.state.images[this.myImageIndex].reponse,
      });
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