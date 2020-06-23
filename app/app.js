import Vue from "nativescript-vue";
import Home from "./components/Home";
import RadListView from 'nativescript-ui-listview/vue';
import firebase from "nativescript-plugin-firebase";
import Vuex from 'vuex'
Vue.use(RadListView);
Vue.use(Vuex);
firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}).then(
  () => {
    console.log("firebase.init done");
  },
  error => {
    console.log(`firebase.init error: ${error}`);
  }
);

Vue.config.silent = (TNS_ENV === 'production');

new Vue({
    render: h => h('frame', [h(Home)])
  }).$start()

