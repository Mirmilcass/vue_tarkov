<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItemsByType} from "@/store/TarkovQueries.js";
import {computed} from "vue";
import SlotSelect from "@/components/SlotSelect.vue";
import WeaponStat from "@/components/WeaponStat.vue";

const {result, error, loading} = useQuery(GetItemsByType, {
  lang : "ko", gameMode : 'pve', type : 'mods'
})

const item = computed(() => history.state.item)

</script>

<template>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <div style="text-align: center">
      <h1>{{ item.name }}</h1>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-around;">
      <div style="display: flex; flex-direction: column; align-items: center; margin: 5px 2px">
        <img :src="item.image512pxLink ?? ''" :alt="item.normalizedName"/>
      </div>
      <WeaponStat :item="item"/>
    </div>
    <SlotSelect :item="item" :mods="result.items"/>
  </div>
</template>

<style scoped>

</style>