<script setup>

import {computed} from "vue";

const {item} = defineProps({
  item : Object
})

const properties = computed(() => {
  return item.properties
})

function keyCheck(key) {
  const denied = ['__typename', 'convergence', 'cameraRecoil', 'slots', 'defaultPreset', 'presets', 'defaultAmmo']
  return !denied.includes(key);
}

function toPascalCase(str) {
  return str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join(" ")
}
</script>

<template>
  <div>
    <table>
      <tbody>
      <tr v-for="(key, index) in Object.keys(properties)" :key="index"
          v-show="keyCheck(key)"
      >
        <td>{{ toPascalCase(key) }}</td>
        <td style="text-align: right">{{ properties[key] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>