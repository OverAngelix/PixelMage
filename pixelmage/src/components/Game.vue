<template>
  <div>
    <div
      class="offset-md-2 col-md-8 offset-md-2 bg-warning mt-3 mb-3 text-center"
    >
      BLABLA {{timer}}
    </div>

    <div class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0">
      <canvas id="canvas" class="img-fluid" />
    </div>
  </div>
</template>



<script>
var eightBit = require("8bit");
export default {
  data(){
    return{
      index: 0,
    }
  },
  created() {
    this.index=Math.floor(Math.random() * Math.floor(this.$store.state.images.length))
    //console.log(this.$store.state.images[0].image);
    //setTimeout(10, 1);
    //this.pixelateImage(10);
  },
  methods: {
    pixelateImage(intensite) {
      var img = new Image();
      img.onload = function () {
        eightBit(document.getElementById("canvas"), img, intensite); //on va de 0 à 50
      };
      img.src = require('../assets/images/'+this.$store.state.images[this.index].image);
      console.log(img.src);
    },
  },
  props:['timer'],
  watch: {
    timer(newTimer) {
      this.pixelateImage(newTimer/10+1)
    },
  },

};
</script>

<style >
</style>