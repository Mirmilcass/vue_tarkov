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
  slots     : undefined,
  modifiers : {}
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

function isSel(slot) {
  return slot.containsItem.normalizedName !== 'null'
}

function keyCheck(key) {
  const denied = ['__typename', 'slots']
  return !denied.includes(key);
}

function cal(item, isPlus = false) {
  for (const key of Object.keys(item.properties)) {
    if (keyCheck(key)) {
      if (isPlus)
        state.modifiers[key] = (state.modifiers[key] ?? 0) + item.properties[key]
      else
        state.modifiers[key] = (state.modifiers[key] ?? 0) - item.properties[key]
    }
  }
}

function setModifierValue(oldItem, newItem) {
  if (oldItem && oldItem.normalizedName !== 'null') cal(oldItem);

  if (newItem.normalizedName !== 'null')
    cal(newItem, true);
  else
    cal(newItem);
}

function updateContainsItems(slot, normalName) {
  const find = props.mods.find(v => v.normalizedName === normalName) ?? {normalizedName : 'null'};
  state.slots = state.slots.map(v => {
    if (v.id === slot.id) {
      setModifierValue(v.containsItem, find)
      v.containsItem = find
      v.key++
    }
    return v
  })
}
</script>

<template>
  <div>
    <div style="display: flex; flex-direction: row; justify-content: space-around">
      <div v-for="(key, index) in Object.keys(state.modifiers)" :key="index">
        <div>{{ key }}</div>
        <div>{{ state.modifiers[key] }}</div>
      </div>
    </div>
    <div v-for="(slot, index) in slots" :key="index" :style="left">
      <div style="display: flex; align-items: end">
        <div style="display: flex; flex-direction: column; flex-basis: 50%">
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
        <div v-if="isSel(slot)" style="display: flex; flex-direction: row;">
          <div
              v-for="(key, index) in Object.keys(slot.containsItem?.properties)"
              :key="index"
              v-show="keyCheck(key)"
              style="display: flex;"
          >
            <div>{{ key }}</div>
            <div>{{ slot.containsItem.properties[key] }}</div>
          </div>
        </div>
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