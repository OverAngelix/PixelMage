import Vue from 'vue'
import App from './App.vue'

//import 'bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';

import PerfectScrollbar from 'vue2-perfect-scrollbar'
Vue.use(PerfectScrollbar)

import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import router from './router'

import Vuex from 'vuex'
Vue.use(Vuex)

import  io from "socket.io-client";

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    socket : io("https://pixelmage-back.herokuapp.com"),
    connected: false,
    categories : ["TOUTES","Disney","Célébrités"],
    images: [
      { image: "roi_lion.jpg", reponse: "Le Roi Lion", categorie: "Disney" },
      { image: "hercule.jpg", reponse: "Hercule", categorie: "Disney"},
      { image: "mister_jack.jpg", reponse: "L'étrange Noël de Monsieur Jack", categorie: "Disney" },
      { image: "reine_des_neiges.jpg", reponse: "La Reine des Neiges", categorie: "Disney" },
      { image: "le_bossu_de_notre_dame.jpg", reponse: "Le Bossu de Notre-Dame", categorie: "Disney" },
      { image: "malefique.jpg", reponse: "Maléfique", categorie: "Disney" },
      { image: "raiponce.jpg", reponse: "Raiponce", categorie: "Disney" },
      { image: "peter_pan.jpg", reponse: "Peter Pan", categorie: "Disney" },
      { image: "bambi.jpg", reponse: "Bambi", categorie: "Disney" },
      { image: "101_dalmatiens.jpg", reponse: "101 dalmatiens", categorie: "Disney" },
      //{ image: "Capture.jpg", reponse: "OverAngelix & co", categorie: "Célébrités" },
      { image: "gilbert_montagne.jpg", reponse: "Gilbert Montagné", categorie: "Célébrités"},
      { image: "zidane.jpg", reponse: "Zinédine Zidane", categorie: "Célébrités"},
      { image: "at0mium.jpg", reponse: "At0mium", categorie: "Célébrités"},
      { image: "mcfly_et_carlito.png", reponse: "McFly et Carlito", categorie: "Célébrités"},
    ],
  },
  mutations: {
    connection(state) {
      state.connected = true;
    }
  }
})




new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
