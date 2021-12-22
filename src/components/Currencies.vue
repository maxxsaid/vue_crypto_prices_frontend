<template>
  <div id='currencies'>
    <ul v-for="currency of currencies" :key="currency.name">
        <li>{{currency.name}}</li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
export default {
  name: "Currencies",
  data() {
    return { currencies: undefined};
  },
  mounted() {
    var apis = [
        'FDDC9085-A4CF-4358-A7B0-766E21BDD355', 'FDF09546-EED0-4FE8-A640-5F1E57F639ED', 'BCAF9E81-1287-45AA-A60C-6F2567001353', 'BCAF9E81-1287-45AA-A60C-6F2567001353',
        '2B1744AE-30E2-4FB1-9A60-965DCC09DD36',
        'E8417C59-5614-4131-B05D-1F8C954AE3E7',
        'BA76A633-8E74-457A-831C-BABCC55E9D49',
        'B1D929A5-CD16-4BB1-870C-AD15D45CA8FC',
        '7CC5348C-4060-4852-8435-06B79001DD78'
        ]
    var ranNum = Math.floor(Math.random() * apis.length)
    var ranAPI = apis[ranNum]
    Vue.axios
      .get(
        `https://rest-sandbox.coinapi.io/v1/assets?apikey=${ranAPI}`
      )

      .then((response) => {
        this.currencies = response.data;
      });
  },
  watch: {
      // sortedCurrencies: function () {
      //   return this.currencies.sort((a, b) => {
      //   if(a.firstname < b.firstname) { return -1; }
      //   if(a.firstname > b.firstname) { return 1; }
      //   return 0;
      //   })
      //   }
    }
};
</script>
