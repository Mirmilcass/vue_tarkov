<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItems} from "@/store/TarkovQueries.js";

const {result, error, loading} = useQuery(GetItems, {
  lang : "ko", gameMode : 'pve', limit : 10, offset : 0,
})
</script>

<template>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <p v-else v-for="item in result.items" :key="item.id" style="display: flex; align-items: center; margin: 5px 2px">
    <img :src="item.iconLink" :alt="item.normalizedName"/>
    <span style="margin-left: 5px">{{ item.name }}</span>
  </p>
</template>

<style scoped>

</style>