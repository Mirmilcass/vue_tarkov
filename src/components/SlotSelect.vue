<script setup>
import {computed, onMounted, onUpdated, reactive} from "vue";

const {item, slotInfo, mods, depth, bus} = defineProps({
  // 상위 아이템 (최상위는 총몸)
  item     : Object,
  slotInfo : {type : Object, required : true},
  // 부품 목록
  mods : {type : Array, required : true},
  // 깊이
  depth : {
    type    : Number,
    default : 0
  },
  bus   : {type : Object, required : true}
})

// 자식 슬롯 여백을 위한 computed
const left = computed(() => {
  return {
    'margin-left' : (depth * 15) + 'px'
  }
})

// 슬롯 정보 기록
function setSlots() {
  let result = []
  let properties

  if (depth === 0) {
    slotInfo['id'] = 0
    slotInfo['name'] = item.name
    slotInfo['nameId'] = item.normalizedName
    properties = item.properties
  } else if (slotInfo && slotInfo.containsItem.normalizedName !== 'null') {
    properties = slotInfo.containsItem.properties
  } else {
    return result
  }

  if (properties && Object.keys(properties).includes("slots") && properties.slots.length > 0) {
    properties.slots.forEach(slot => {
      const temp = {
        key          : 0,
        id           : (depth + '.' + result.length) * 1,
        name         : slot.name,
        nameId       : slot.nameId,
        containsItem : {normalizedName : 'null'}
      }
      // 결합 가능 아이템 목록 생성
      if (Object.keys(slot.filters).includes("allowedItems")) {
        temp.allowedItems = slot.filters.allowedItems.map(allowedItem => mods.find(v => v.id === allowedItem.id))
      }
      result.push(temp)
    })
  }
  slotInfo['children'] = result
  return result
}

const inChild = computed(() => {
  return (depth === 0 || slotInfo.containsItem.normalizedName !== 'null')
      && slotInfo.children
      && slotInfo.children.length
})

function isSel(slot) {
  return slot.containsItem && slot.containsItem.normalizedName !== 'null'
}

function keyCheck(key) {
  const denied = ['__typename', 'slots']
  return !denied.includes(key);
}

function updateContainsItems(slot, normalName) {
  const find = mods.find(v => v.normalizedName === normalName) ?? {normalizedName : 'null'};
  bus.setModStat(slotInfo.containsItem, find)
  slotInfo.containsItem = find
  slotInfo.key++
  setSlots()
}

setSlots()
</script>

<template>
  <div>
    <div v-if="depth !== 0" :style="left">
      <div style="display: flex; align-items: end">
        <div style="display: flex; flex-direction: column; flex-basis: 50%">
          <span style="margin: 2px 0">{{ slotInfo.name }}</span>
          <select
              :value="slotInfo.containsItem.normalizedName"
              @change="event => updateContainsItems(slotInfo, event.target.value)"
              style="margin-left: 5px; color: var(--color-text); background-color: var(--color-background-soft)"
          >
            <option :key="0" :value="'null'">미장착</option>
            <option v-for="(part, index) in slotInfo.allowedItems" :key="index+1" :value="part.normalizedName">{{ part.name }}</option>
          </select>
        </div>
        <div v-if="isSel(slotInfo)" style="display: flex; flex-direction: row;">
          <div
              v-for="(key, index) in Object.keys(slotInfo.containsItem?.properties)"
              :key="index"
              v-show="keyCheck(key)"
              style="display: flex;"
          >
            <div>{{ key }}</div>
            <div>{{ slotInfo.containsItem.properties[key] }}</div>
          </div>
        </div>
      </div>
    </div>
    <SlotSelect
        v-show="inChild"
        v-for="slotData in slotInfo.children"
        :key="slotData.id+'-'+slotData.nameId+'-'+slotData.key"
        :mods="mods"
        :depth="depth + 1"
        :bus="bus"
        :slot-info="slotData"
    />
  </div>
</template>

<style scoped>

</style>