<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItemsByType} from "@/store/TarkovQueries.js";
import {onUpdated, reactive} from "vue";
import SlotSelect from "@/components/build/SlotSelect.vue";

const state = reactive({
  item : {}, preset : {}, defaultPreset : {}, presetList : {}, mods : []
})

const {result, error, loading} = useQuery(GetItemsByType, {
  lang : "ko", gameMode : 'pve', type : 'mods'
})

onUpdated(() => {
  let item = history.state.item;
  if (item !== undefined) {
    state.item = item
    state.preset = item
    state.defaultPreset = item.properties.defaultPreset
    state.presetList = item.properties.presets
  }

  state.mods = result.value.items
})

</script>

<template>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <div>
      <select :value="state.defaultPreset.normalizedName" @change="setPreset($event.target.value)">
        <option v-for="(preset, index) in state.presetList" :key="index" :value="preset.normalizedName">{{ preset.name }}</option>
      </select>
    </div>
    <hr/>
    <div>
      <SlotSelect :item="state.preset" :mods="state.mods"/>
    </div>
  </div>
</template>

<style scoped>

</style>