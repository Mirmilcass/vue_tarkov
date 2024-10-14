import {defineStore} from "pinia";

export const useCounterStore = defineStore('counter', {
  state   : () => ({count : 0, name : 'Eduardo'}),
  getters : {
    doubleCount : (state) => state.count * 2,
  },
  actions : {
    increment() {
      this.count++
    },
  },
})

export const useBuildStore = defineStore('build', {
  state   : () => ({}),
  getters : {},
  actions : {}
})