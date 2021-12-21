<template>
  <div id="app">
    <Header />
    <div id="nologin" v-if="!loggedin">
      <div id="loginform">
        <form v-on:submit.prevent="handleLogin">
          <fieldset>
            <legend class="text">LOGIN</legend>
            <input
              class="login"
              type="text"
              placeholder="username"
              v-model="loginUsername"
            />
            <input
              class="login"
              type="password"
              placeholder="password"
              v-model="loginPassword"
            />
            <input class="btn" type="submit" value="login" />
          </fieldset>
        </form>
        <form v-on:submit.prevent="handleSignup">
          <fieldset>
            <legend class="text">SIGN UP</legend>
            <input
              class="signup"
              type="text"
              placeholder="username"
              v-model="createUsername"
            />
            <input
              class="signup"
              type="password"
              placeholder="password"
              v-model="createPassword"
            />
            <input class="btn" type="submit" value="create user" />
          </fieldset>
        </form>
      </div>
    </div>
    <div id="login" v-if="loggedin">
      <div id="newupdateforms">
        <article>
          <legend class="text">New Coin</legend>
          <input class="new" type="text" v-model="newCoin" />
          <button class="btn" v-on:click.prevent="createCoin">ADD</button>
        </article>
        <article>
          <legend class="text">Update Coin</legend>
          <input class="update" type="text" v-model="updateCoin" />
          <button class="btn" v-on:click.prevent="editCoin" v-bind:id="editID">
            UPDATE
          </button>
        </article>
      </div>
      <div id="coins">
        <div class="coin" v-for="coin of coins" :key="coin.id">
          <Coin v-bind:ticker="coin.ticker" />
          <button class="btn" v-bind:id="coin.id" v-on:click="deleteCoin">
            delete
          </button>
          <button class="btn" v-bind:id="coin.id" v-on:click="editSelect">
            update
          </button>
        </div>
      </div>
      <button class="btn" v-on:click="handleLogout" id="logout">logout</button>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import Coin from "./components/Coin";
export default {
  name: "App",
  components: {
    Header,
    Coin,
    Footer,
  },
  data: function() {
    return {
      loggedin: false,
      JWT: "",
      loginUsername: "",
      loginPassword: "",
      createUsername: "",
      createPassword: "",
      devURL: "http://localhost:3000",
      prodURL: "https://qb-ms-ruby-rails-backend.herokuapp.com",
      user: null,
      token: null,
      coins: [],
      newCoin: "",
      updateCoin: "",
      editID: 0,
    };
  },
  methods: {
    handleLogin: function() {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = {
        username: this.loginUsername,
        password: this.loginPassword,
      };
      fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("error logging in");
          } else {
            this.user = data.user;
            this.token = data.token;
            this.loggedin = true;
            this.getCoins();
            this.loginPassword = "";
            this.loginUsername = "";
            window.sessionStorage.setItem("login", JSON.stringify(data));
          }
        });
    },
    handleLogout: function() {
      this.loggedin = false;
      this.user = null;
      this.token = null;
      window.sessionStorage.removeItem("login");
    },
    handleSignup: function() {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const user = {
        username: this.createUsername,
        password: this.createPassword,
      };
      fetch(`${URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("sign up unsuccessul");
          } else {
            alert("sign up successful");
            this.createUsername = "";
            this.createPassword = "";
          }
        });
    },
    getCoins: function() {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      fetch(`${URL}/coins`, {
        method: "get",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.coins = data;
        });
    },
    createCoin: function() {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const coin = { ticker: this.newCoin };
      fetch(`${URL}/coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${this.token}`,
        },
        body: JSON.stringify(coin),
      }).then(() => {
        this.newCoin = "";
        this.getCoins();
      });
    },
    deleteCoin: function(event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;
      fetch(`${URL}/coins/${ID}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      }).then(() => {
        this.getCoins();
      });
    },
    editCoin: function(event) {
      const URL = this.prodURL ? this.prodURL : this.devURL;
      const ID = event.target.id;
      const updated = { ticker: this.updateCoin };
      fetch(`${URL}/coins/${ID}`, {
        method: "PUT",
        headers: {
          Authorization: `bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      }).then(() => {
        this.getCoins();
      });
    },
    editSelect: function(event) {
      this.editID = event.target.id;
      const theCoin = this.coins.find((coin) => {
        return coin.id == this.editID;
      });
      this.updateCoin = theCoin.ticker;
    },
  },
  created: function() {
    const getLogin = JSON.parse(window.sessionStorage.getItem("login"));
    if (getLogin) {
      this.user = getLogin.user;
      this.token = getLogin.token;
      this.loggedin = true;
      this.getCoins();
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Lato&family=Vujahday+Script&display=swap");
html {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1200' height='1000' preserveAspectRatio='none' viewBox='0 0 1200 1000'%3e%3cg mask='url(%26quot%3b%23SvgjsMask2308%26quot%3b)' fill='none'%3e%3crect width='1200' height='1000' x='0' y='0' fill='url(%23SvgjsLinearGradient2309)'%3e%3c/rect%3e%3cpath d='M837.95%2c994.896C873.49%2c994.989%2c901.856%2c967.715%2c918.253%2c936.184C933.331%2c907.19%2c931.34%2c873.614%2c916.036%2c844.739C899.554%2c813.642%2c873.142%2c784.195%2c837.95%2c784.677C803.3%2c785.152%2c779.634%2c816.168%2c763.485%2c846.828C748.653%2c874.988%2c744.07%2c907.333%2c758.37%2c935.767C774.284%2c967.411%2c802.53%2c994.804%2c837.95%2c994.896' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M771.007%2c727.643C802.78%2c727.017%2c833.947%2c717.002%2c851.987%2c690.84C872.893%2c660.522%2c883.572%2c621.57%2c866.732%2c588.819C848.657%2c553.667%2c810.534%2c533.3%2c771.007%2c533.346C731.559%2c533.392%2c694.387%2c554.318%2c675.665%2c589.04C657.784%2c622.203%2c662.956%2c663.101%2c684.308%2c694.142C703.128%2c721.501%2c737.806%2c728.297%2c771.007%2c727.643' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M894.807%2c1228.991C986.906%2c1223.21%2c1046.965%2c1141.97%2c1090.817%2c1060.775C1131.891%2c984.723%2c1153.969%2c897.583%2c1115.632%2c820.115C1072.842%2c733.65%2c991.279%2c664.148%2c894.807%2c664.695C799.067%2c665.238%2c726.036%2c739.616%2c678.28%2c822.597C630.666%2c905.331%2c606.087%2c1004.141%2c650.973%2c1088.386C698.258%2c1177.134%2c794.446%2c1235.291%2c894.807%2c1228.991' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M650.813%2c1246.441C732.39%2c1247.856%2c793.97%2c1181.372%2c834.259%2c1110.425C873.937%2c1040.555%2c892.661%2c957.592%2c855.214%2c886.501C815.379%2c810.876%2c736.263%2c760.107%2c650.813%2c762.163C568.388%2c764.146%2c499.934%2c822.348%2c462.769%2c895.945C429.133%2c962.554%2c442.789%2c1038.493%2c478.067%2c1104.247C515.858%2c1174.685%2c570.89%2c1245.055%2c650.813%2c1246.441' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M1111.394%2c1037.629C1212.425%2c1041.387%2c1304.126%2c981.901%2c1355.813%2c895.011C1408.746%2c806.026%2c1417.994%2c696.4%2c1368.459%2c605.48C1316.787%2c510.637%2c1219.371%2c448.88%2c1111.394%2c446.388C998.97%2c443.794%2c883.041%2c492.452%2c832.925%2c593.121C786.461%2c686.456%2c841.211%2c789.574%2c896.562%2c877.929C947.334%2c958.975%2c1015.824%2c1034.074%2c1111.394%2c1037.629' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M503.047%2c415.727C551.968%2c411.952%2c578.003%2c362.479%2c600.338%2c318.791C620.027%2c280.278%2c633.993%2c236.912%2c614.097%2c198.506C592.739%2c157.278%2c549.447%2c132.699%2c503.047%2c130.987C453.342%2c129.153%2c403.064%2c147.491%2c376.836%2c189.753C349.26%2c234.186%2c350.234%2c290.469%2c375.734%2c336.125C401.892%2c382.959%2c449.562%2c419.855%2c503.047%2c415.727' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M345.566%2c267.039C418.273%2c271.747%2c491.167%2c240.304%2c529.079%2c178.086C568.441%2c113.489%2c565.437%2c32.526%2c528.789%2c-33.648C490.914%2c-102.037%2c423.739%2c-153.905%2c345.566%2c-153.275C268.31%2c-152.653%2c200.396%2c-100.589%2c167.385%2c-30.738C138.364%2c30.671%2c164.193%2c98.432%2c199.068%2c156.716C232.71%2c212.939%2c280.183%2c262.805%2c345.566%2c267.039' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1202.326%2c1045.564C1275.556%2c1043.502%2c1345.656%2c1007.578%2c1379.727%2c942.724C1411.814%2c881.646%2c1394.532%2c808.9%2c1357.106%2c750.94C1323.073%2c698.235%2c1265.046%2c666.467%2c1202.326%2c667.99C1142.164%2c669.451%2c1094.077%2c708.523%2c1060.043%2c758.155C1019.185%2c817.74%2c974.681%2c888.479%2c1006.735%2c953.227C1041.019%2c1022.479%2c1125.083%2c1047.739%2c1202.326%2c1045.564' fill='rgba(50%2c 9%2c 202%2c 0.16)' class='triangle-float3'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask2308'%3e%3crect width='1200' height='1000' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='95.83%25' y1='-5%25' x2='4.17%25' y2='105%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient2309'%3e%3cstop stop-color='rgba(167%2c 131%2c 230%2c 0.24)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(171%2c 198%2c 209%2c 0.45)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 5s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 4s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 6s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}
#title {
  text-align: center;
  margin: 30px auto;
  font-size: 2.4em;
  font-family: "Jura", sans-serif;
  color: #4e3088;
}
.text {
  color: #4e3088;
  padding: 5px;
  text-align: center;
  font-family: "Lato", sans-serif;
}
#title span {
  font-family: "Vujahday Script", cursive;
  font-size: 1.5em;
  background-image: linear-gradient(135deg, #ee9ae5 10%, #5961f9 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#loginform {
  width: 40%;
  margin: 10px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  
}

#loginform .login {
  background-color: white;
  font-family: "Lato", sans-serif;
}
#loginform .signup {
  background-color: white;
  font-family: "Lato", sans-serif;
}
#newupdateforms {
  width: 65%;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
}
#newupdateforms .new {
  background-color: white;
  font-family: "Lato", sans-serif;
}
#newupdateforms .update {
  background-color: white;
  font-family: "Lato", sans-serif;
}
#coins {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  margin: 10px auto;
}

#coins div {
  margin: 15px;
  max-width: 300px;
  padding: 10px;
  border: 2px solid navy;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  font-family: "Lato", sans-serif;
}
#logout {
  text-align: center;
  display: block;
  margin: 50px auto;
}

.btn {
  background-image: linear-gradient(
    to right,
    #b993d6 0%,
    #8ca6db 51%,
    #b993d6 100%
  );
  margin: 10px;
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  font-family: "Lato", sans-serif;
}

.btn:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}
</style>
