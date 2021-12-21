<template>
  <div>
    <p>{{ this.$attrs.ticker }}</p>
    <p>${{ Math.floor(coin.rate) }} {{ coin.asset_id_quote }}</p>
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
    Vue.axios
      .get(
        `http://rest-sandbox.coinapi.io/v1/exchangerate/${ticker}/USD?apikey=FDDC9085-A4CF-4358-A7B0-766E21BDD355`
      )

      .then((response) => {
        this.coin = response.data;
        console.log(JSON.stringify(response.data));
      });
  },
};
</script>
