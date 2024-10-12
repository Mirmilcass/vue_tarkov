import {createRouter, createWebHistory} from "vue-router";
import List from "@/components/build/List.vue";
import Detail from "@/components/build/Detail.vue";

const routes = [
  {path : '/', component : List},
  {path : '/build', name : 'buildDetail', component : Detail},
]

const router = createRouter({
  history : createWebHistory(), routes : routes
})

export default router;