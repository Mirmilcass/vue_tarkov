<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItemById} from "@/store/TarkovQueries.js";

const {result, error, loading} = useQuery(GetItemById, {
  lang : "ko", gameMode : 'pve', id : ""
})
</script>

<template>

</template>

<style scoped>

</style>