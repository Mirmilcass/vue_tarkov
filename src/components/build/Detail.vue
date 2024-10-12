<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItemsByType} from "@/store/TarkovQueries.js";
import {computed} from "vue";
import SlotSelect from "@/components/build/SlotSelect.vue";

const {result, error, loading} = useQuery(GetItemsByType, {
  lang : "ko", gameMode : 'pve', type : 'mods'
})

const item = computed(() => history.state.item)

</script>

<template>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <SlotSelect :item="item" :mods="result.items"/>
  </div>
</template>

<style scoped>

</style>