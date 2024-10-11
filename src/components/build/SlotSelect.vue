<script setup>
import _ from "lodash";
import {computed} from "vue";

const props = defineProps({
  item          : Object,
  mods          : Array,
  depth         : {
    type : Number, default : 0
  },
  containsItems : {
    type : Object, default : {
      value : []
    }
  }
})

const containsItems = computed(() => {
  return props.containsItems.value.length > 0
         ? props.containsItems.value
         : props.item.containsItems.flatMap(v => v.item.id)
})

const left = computed(() => {
  return {
    'margin-left' : (props.depth * 15) + 'px'
  }
})

function getSlots() {
  let slots = [];
  const properties = props.item.properties;
  if (properties && Object.keys(properties).includes("slots") && properties.slots.length > 0) {
    properties.slots.forEach(slot => {
      let slotInfo = _.cloneDeep(slot)
      if (Object.keys(slot.filters).includes("allowedItems")) {
        slotInfo.filters.allowedItems = slot.filters.allowedItems.map(allowedItem => props.mods.find(v => v.id === allowedItem.id))
      }
      slots.push(slotInfo)
    })
  }
  return slots
}

function inChild(item) {
  return Object.keys(item).includes("properties") && Object.keys(item.properties).includes('slots') && item.properties.slots.length > 0;
}

function selValue(slot, isVal) {
  const find = slot.filters.allowedItems.find(v => containsItems.value.includes(v.id));
  if (!find) return 'null';
  return isVal ? find.normalizedName : find;
}

function updateContainsItems(oldItem, normalName) {
  let filter = containsItems.value.filter(v => v !== oldItem.id)
  if (normalName !== "null") {
    const find = props.mods.find(v => v.normalizedName === normalName)
    filter.push(find.id)
  }
  props.containsItems.value = filter
}

</script>

<template>
  <div v-for="(slot, index) in getSlots()" :key="index" :style="left">
    <div style="display: flex; flex-direction: column;">
      <span style="margin: 2px 0">{{ slot.name }}</span>
      <select
          :value="selValue(slot, true)"
          @change="event => updateContainsItems(selValue(slot), event.target.value)"
          style="margin-left: 5px; color: var(--color-text); background-color: var(--color-background-soft)"
      >
        <option :key="0" :value="'null'">미장착</option>
        <option v-for="(part, index) in slot.filters.allowedItems" :key="index+1" :value="part.normalizedName">{{ part.name }}</option>
      </select>
    </div>
    <SlotSelect
        v-if="inChild(selValue(slot))"
        :item="selValue(slot)"
        :mods="props.mods"
        :depth="props.depth + 1"
        :containsItems="{value: containsItems}"
    />
  </div>
</template>

<style scoped>

</style>