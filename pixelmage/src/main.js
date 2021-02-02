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
    socket : io("localhost:3001"),
    connected: false,
    images: [
      { image: "roi_lion.jpg", reponse: "Le Roi Lion" },
      { image: "hercule.jpg", reponse: "Hercule" },
      { image: "mister_jack.jpg", reponse: "L'étrange Noël de Monsieur Jack" },
      { image: "reine_des_neiges.jpg", reponse: "La Reine des Neiges" },
      { image: "le_bossu_de_notre_dame.jpg", reponse: "Le Bossu de Notre-Dame" },
      { image: "malefique.jpg", reponse: "Maléfique" },
      { image: "raiponce.jpg", reponse: "Raiponce" },
      { image: "peter_pan.jpg", reponse: "Peter Pan" },
      { image: "bambi.jpg", reponse: "Bambi" },
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
