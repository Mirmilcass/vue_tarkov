<script setup>
import {useQuery} from "@vue/apollo-composable";
import {GetItemsByType, GetTraders} from "@/store/TarkovQueries.js";
import {reactive} from "vue";

const state = reactive({
                         searchInput : '', page : 1, offset : 10, data : []
                       })

const {result, error, loading} = useQuery(GetItemsByType, {
  lang : "ko", gameMode : 'pve', type : 'gun'
})

const trader = useQuery(GetTraders, {
  lang : "ko", gameMode : 'pve'
})

function getList() {
  let list = [...result.value.items]
  let input = state.searchInput;
  if (input.length > 0) {
    list = list.filter(item => {
      const split = input.split(' ');
      const normalizedName = item.normalizedName;
      let isIn = false
      for (let i = 0; i < split.length; i++) {
        if (normalizedName.indexOf(split[i]) > -1) {
          isIn = true;
          break
        }
      }
      return isIn
    })
  }
  list = list
      .sort((a, b) => a.normalizedName < b.normalizedName ? -1 : a.normalizedName > b.normalizedName ? 1 : 0)
      .slice(state.page, state.page * state.offset)
      .map(v => ({...v, traderInfo : setPrice(v.sellFor), fleaInfo : setPrice(v.sellFor, true)}))
  return list
}

function setPrice(prices, isFlea) {
  const result = {trader : {}, priceStr : ""}
  const priceInfo = prices
      .filter(info => isFlea ? info.vendor.normalizedName === "flea-market" : info.vendor.normalizedName !== "flea-market")
      .sort((a, b) => a.priceRUB - b.priceRUB)[0];
  if (!priceInfo) {
    result.priceStr = "SOLD OUT"
    return result
  }
  const price = priceInfo.price
  const currency = priceInfo.currency
  const formatPrice = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  switch (currency) {
    case "USD":
      result.priceStr = "$ " + formatPrice
      break
    case "RUB":
      result.priceStr = formatPrice + " ₽"
      break
    default:
      result.priceStr = currency + " " + formatPrice
  }
  result.trader = trader.result.value.traders.find(v => v.normalizedName === priceInfo.vendor.normalizedName)
  return result
}
</script>

<template>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <div>
      <input type="text" :value="state.searchInput" @input="event => state.searchInput = event.target.value"/>
      <select :value="state.offset" @change="event => state.offset = event.target.value">
        <option v-for="(item, index) in [10, 25, 50, 100]" :key="index" :value="item">{{ item }}</option>
      </select>
    </div>
    <hr/>
    <table>
      <thead>
      <tr>
        <th>총기</th>
        <th>상인</th>
        <th>플리마켓</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) of getList()" :key="index">
        <td>
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin: 5px 5px">
            <img :src="item.iconLink" :alt="item.name" width="64"/>
            <span style="flex-grow: 1; margin-left: 10px">{{ item.name }}</span>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin: 5px 5px">
            <img :src="item.traderInfo.trader.imageLink" :alt="item.traderInfo.trader.normalizedName" width="64"/>
            <div style="flex-grow: 1; margin-left: 10px">
              <span>{{ item.traderInfo.trader.name }}</span>
              <br/>
              <span>{{ item.traderInfo.priceStr }}</span>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin: 5px 5px">
            <img :src="item.fleaInfo.trader?.imageLink ?? 'https://tarkov.dev/images/traders/flea-market-portrait.png'" :alt="item.fleaInfo.trader?.normalizedName ?? '이미지 없음'" width="64"/>
            <span style="flex-grow: 1; margin-left: 10px; text-align: right">{{ item.fleaInfo.priceStr }}</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>