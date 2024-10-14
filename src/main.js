import './assets/main.css'

import {createApp, h, provide} from 'vue'
import App from './App.vue'
import {DefaultApolloClient} from "@vue/apollo-composable";
import {apolloClient} from "@/store/ApolloClient.js";
import router from "@/Router.js";
import {createPinia} from "pinia";

const pinia = createPinia()

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render : () => h(App),
})

app
  .use(router)
  .use(pinia)
  .mount('#app')
