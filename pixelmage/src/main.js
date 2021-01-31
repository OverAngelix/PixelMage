import Vue from 'vue'
import App from './App.vue'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import PerfectScrollbar from 'vue2-perfect-scrollbar'
Vue.use(PerfectScrollbar)

import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import router from './router'

import Vuex from 'vuex'
Vue.use(Vuex)


Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    connected: false,
    images : [
      { image: "roi_lion.jpg", reponse: "Le Roi Lion" },
      { image: "hercule.jpg", reponse: "Hercule" },
      { image: "mister_jack.jpg", reponse: "L'étrange Noël de Monsieur Jack" },
      { image: "reine_des_neiges.jpg", reponse: "La Reine des Neiges" },
    ],
  },
  mutations: {
    connection (state) {
      state.connected=true;
    }
  }
})




new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
