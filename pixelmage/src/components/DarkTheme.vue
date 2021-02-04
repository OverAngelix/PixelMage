<template>
  <div>
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitch1" @click="changerTheme">
      <label class="custom-control-label" for="customSwitch1"
        >Dark Theme</label
      >
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (localStorage.theme) {
      document.getElementById("liencss").href = localStorage.theme;
       if (localStorage.theme=="https://pixelmage-front.herokuapp.com/bootstrap.dark.css"){
          document.getElementById("customSwitch1").checked=true;
      } 
    }
  },
  methods: {
    changerTheme() {
        
      if (
        document.getElementById("liencss").href ==
        "https://pixelmage-front.herokuapp.com/bootstrap.min.css"
      ) {
        document.getElementById("liencss").href =
          "https://pixelmage-front.herokuapp.com/bootstrap.dark.css";
        localStorage.theme = "https://pixelmage-front.herokuapp.com/bootstrap.dark.css";
      } else {
        document.getElementById("liencss").href =
          "https://pixelmage-front.herokuapp.com/bootstrap.min.css";
        localStorage.theme = "https://pixelmage-front.herokuapp.com/bootstrap.min.css";
      }
    },
  },
};
</script>