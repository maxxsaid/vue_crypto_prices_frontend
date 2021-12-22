<template>
  <div>
    <p>{{ this.$attrs.ticker }}</p>
    <p v-if="coin.rate > 1">
      ${{ coin.rate.toFixed(2) }} {{ coin.asset_id_quote }}
    </p>
    <p v-else>${{ coin.rate.toFixed(5) }} {{ coin.asset_id_quote }}</p>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
export default {
  name: "Coin",
  data() {
    return { coin: undefined, ticker: this.$route.params.ticker };
  },

  mounted() {
    var ticker = this.$attrs.ticker;
    var apis = [
      "FDDC9085-A4CF-4358-A7B0-766E21BDD355",
      "FDF09546-EED0-4FE8-A640-5F1E57F639ED",
      "BCAF9E81-1287-45AA-A60C-6F2567001353",
      "BCAF9E81-1287-45AA-A60C-6F2567001353",
      "2B1744AE-30E2-4FB1-9A60-965DCC09DD36",
      "E8417C59-5614-4131-B05D-1F8C954AE3E7",
      "BA76A633-8E74-457A-831C-BABCC55E9D49",
      "B1D929A5-CD16-4BB1-870C-AD15D45CA8FC",
      "7CC5348C-4060-4852-8435-06B79001DD78",
      "0976B27F-E685-4E4F-B1F8-6B2C675DD728",
      "E24E1DE3-47F4-492C-AB76-4B435DC17DD6",
      "A1533371-E945-4FCC-B42B-D3F6A1BCED89",
      "07B863D5-4C18-4DD2-ADAB-41980572AC7C",
      "0D7FC7CB-B57C-453D-BFB0-A18A075AF709",
    ];
    var ranNum = Math.floor(Math.random() * apis.length);
    var ranAPI = apis[ranNum];
    Vue.axios
      .get(
        `https://rest-sandbox.coinapi.io/v1/exchangerate/${ticker}/USD?apikey=${ranAPI}`
      )

      .then((response) => {
        this.coin = response.data;
      });
  },
};
</script>
