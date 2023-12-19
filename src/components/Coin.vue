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
      "BCAF9E81-1287-45AA-A60C-6F2567001353",
      "BCAF9E81-1287-45AA-A60C-6F2567001353",
      "2B1744AE-30E2-4FB1-9A60-965DCC09DD36",
      "E8417C59-5614-4131-B05D-1F8C954AE3E7",
      "BA76A633-8E74-457A-831C-BABCC55E9D49",
      "B1D929A5-CD16-4BB1-870C-AD15D45CA8FC",
      "7CC5348C-4060-4852-8435-06B79001DD78",
      "0976B27F-E685-4E4F-B1F8-6B2C675DD728",
      "E24E1DE3-47F4-492C-AB76-4B435DC17DD6",
      "5AA858B3-A9AB-467C-86B3-00B79D4671F0",
      "884D3A26-760D-4414-A1FF-EC40191EE7D7",
      "8AD3C912-794F-407B-93AF-426E6258D875",
      "B2F31BFD-70CE-4E0C-BEB8-75933E884F5C",
      "2921B34D-5661-42DE-891F-3333C595A432",
      "F28600C7-C6C2-4D2C-8057-1C2D4D3763D9",
      "55568643-CFAE-46D5-9084-1C87B3EBE786",
      "9B4AF285-455A-4719-AE3E-85785925C503",
      "CA49F727-5B64-43E6-A950-DC8ABBEB743D",
    ];
    var ranNum = Math.floor(Math.random() * apis.length);
    var ranAPI = apis[ranNum];
    Vue.axios
      .get(
        `https://rest.coinapi.io/v1/exchangerate/${ticker}/USD?apikey=${ranAPI}`
      )

      .then((response) => {
        this.coin = response.data;
      });
  },
};
</script>
