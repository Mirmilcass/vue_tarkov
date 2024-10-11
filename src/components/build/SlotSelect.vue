<script setup>
import _ from "lodash";
import {computed, onUpdated} from "vue";

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

onUpdated(() => {
  props.containsItems.value = props.item.containsItems.flatMap(v => v.item.id)
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

function selValue(items, isVal) {
  const find = items.find(v => containsItems.value.includes(v.id));
  if (!find) return 'null';
  return isVal ? find.normalizedName : find;
}

function updateContainsItems(oldItem, normalName) {
  let filter = containsItems.value.filter(v => v !== oldItem.id)
  const find = props.mods.find(v => v.normalizedName === normalName)
  filter.push(find.id)
  props.containsItems.value = filter
}

</script>

<template>
  <div v-for="(slot, index) in getSlots()" :key="index" :style="left">
    <span>{{ slot.name }}</span>
    <select
        :value="selValue(slot.filters.allowedItems, true)"
        @change="event => updateContainsItems(selValue(slot.filters.allowedItems), event.target.value)"
    >
      <option :key="0" :value="'null'">미장착</option>
      <option v-for="(part, index) in slot.filters.allowedItems" :key="index+1" :value="part.normalizedName">{{ part.name }}</option>
    </select>
    <SlotSelect v-if="inChild(selValue(slot.filters.allowedItems))" :item="selValue(slot.filters.allowedItems)" :mods="props.mods" :depth="props.depth + 1" :containsItems="props.containsItems"/>
  </div>
</template>

<style scoped>

</style>