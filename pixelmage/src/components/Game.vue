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
    this.$store.state.socket.on("pixeliserImage", (data) => {
      this.myTimer = data.imageprogress;
      this.myImageIndex = data.imageselected;
    });
  },
  methods: {
    pixelateImage(intensite) {
      var img = new Image();
      img.onload = function () {
        eightBit(document.getElementById("canvas"), img, intensite); //on va de 0 à 50
      };
      img.src = require("../assets/images/" +
        this.$store.state.images[this.myImageIndex].image);
        console.log(img.src)
    },
  },
    watch: {
    myTimer(newTimer) {
      this.pixelateImage(newTimer / 10 + 1);
    },
  },
};
</script>

<style >
</style>