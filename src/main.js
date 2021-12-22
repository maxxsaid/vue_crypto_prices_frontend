import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import $ from 'jquery'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faInfoCircle, faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

$('#info').on('click', () => $('#modal-bg').css('display', 'block'))