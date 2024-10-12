<script setup>
import {computed, reactive} from "vue";

const props = defineProps({
  // 상위 아이템 (최상위는 총몸)
  item : Object,
  // 부품 목록
  mods : Array,
  // 깊이
  depth : {
    type    : Number,
    default : 0
  }
})

const state = reactive({
  slots        : undefined,
})

// 자식 슬롯 여백을 위한 computed
const left = computed(() => {
  return {
    'margin-left' : (props.depth * 15) + 'px'
  }
})

// 슬롯 정보 기록
function setSlots() {
  let result = []
  const properties = props.item.properties;
  if (properties && Object.keys(properties).includes("slots") && properties.slots.length > 0) {
    properties.slots.forEach(slot => {
      const temp = {
        key          : 0,
        id           : (props.depth + '.' + result.length) * 1,
        name         : slot.name,
        nameId       : slot.nameId,
        containsItem : {normalizedName : 'null'}
      }
      // 결합 가능 아이템 목록 생성
      if (Object.keys(slot.filters).includes("allowedItems")) {
        temp.allowedItems = slot.filters.allowedItems.map(allowedItem => props.mods.find(v => v.id === allowedItem.id))
      }
      result.push(temp)
    })
  }
  state.slots = result
  return result
}

const slots = computed(() => {
  return state.slots ?? setSlots()
})

function inChild(slot) {
  const item = slot.containsItem
  return item.normalizedName !== 'null'
      && Object.keys(item).includes("properties")
      && Object.keys(item.properties).includes('slots')
      && item.properties.slots.length > 0
}

function updateContainsItems(slot, normalName) {
  const find = props.mods.find(v => v.normalizedName === normalName);
  state.slots = state.slots.map(v => {
    if (v.id === slot.id) {
      v.containsItem = find ?? {normalizedName : 'null'}
      v.key++
    }
    return v
  })
}
</script>

<template>
  <div>
    <div v-for="(slot, index) in slots" :key="index" :style="left">
      <div style="display: flex; flex-direction: column;">
        <span style="margin: 2px 0">{{ slot.name }}</span>
        <select
            :value="slot.containsItem.normalizedName"
            @change="event => updateContainsItems(slot, event.target.value)"
            style="margin-left: 5px; color: var(--color-text); background-color: var(--color-background-soft)"
        >
          <option :key="0" :value="'null'">미장착</option>
          <option v-for="(part, index) in slot.allowedItems" :key="index+1" :value="part.normalizedName">{{ part.name }}</option>
        </select>
      </div>
      <SlotSelect
          v-show="inChild(slot)"
          :key="slot.id+'-'+slot.nameId+'-'+slot.key"
          :item="slot.containsItem"
          :mods="props.mods"
          :depth="props.depth + 1"
      />
    </div>
  </div>
</template>

<style scoped>

</style>