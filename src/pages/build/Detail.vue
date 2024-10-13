<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItemsByType} from "@/store/TarkovQueries.js";
import {computed, reactive} from "vue";
import SlotSelect from "@/components/SlotSelect.vue";
import WeaponStat from "@/components/WeaponStat.vue";

const {result, error, loading} = useQuery(GetItemsByType, {
  lang : "ko", gameMode : 'pve', type : 'mods'
})

const item = computed(() => history.state.item)

function keyCheck(key) {
  const denied = ['__typename', 'slots']
  return !denied.includes(key);
}

// TODO 상위 부품 분해시 계산되지 않는 값 확인 조치 필요
function cal(item, isPlus = false) {
  for (const key of Object.keys(item.properties)) {
    if (keyCheck(key)) {
      modifiers[key] = isPlus
                       ? (((modifiers[key] ?? 0) * 1000) + (item.properties[key] * 1000)) / 1000
                       : (((modifiers[key] ?? 0) * 1000) - (item.properties[key] * 1000)) / 1000

      if (modifiers[key] === 0) {
        delete modifiers[key]
      }
    }
  }
}

const {slotInfo, modifiers, bus} = reactive({
  slotInfo  : {type : Object, default : {}},
  modifiers : {},
  bus       : {
    setModStat : (oldItem, newItem) => {
      if (oldItem && oldItem.normalizedName !== 'null')
        cal(oldItem);

      if (newItem.normalizedName !== 'null')
        cal(newItem, true);
    }
  }
})

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
    <div style="display: flex; flex-direction: row; justify-content: space-around">
      <div v-for="(key, index) in Object.keys(modifiers).sort()" :key="index">
        <div>{{ key }}</div>
        <div>{{ modifiers[key] }}</div>
      </div>
    </div>
    <SlotSelect :item="item" :mods="result.items" :bus="bus" :slot-info="slotInfo"/>
  </div>
</template>

<style scoped>

</style>