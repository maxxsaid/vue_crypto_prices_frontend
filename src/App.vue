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
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1200' height='1000' preserveAspectRatio='none' viewBox='0 0 1200 1000'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1328%26quot%3b)' fill='none'%3e%3crect width='1200' height='1000' x='0' y='0' fill='url(%23SvgjsLinearGradient1329)'%3e%3c/rect%3e%3cpath d='M306.475%2c1086.184C374.199%2c1086.179%2c443.31%2c1068.292%2c480.902%2c1011.959C522.728%2c949.282%2c537.183%2c864.959%2c496.373%2c801.616C457.815%2c741.77%2c377.617%2c738.572%2c306.475%2c741.228C241.359%2c743.659%2c174.94%2c760.16%2c139.645%2c814.934C101.484%2c874.156%2c95.095%2c951.975%2c132.004%2c1011.985C167.49%2c1069.681%2c238.74%2c1086.189%2c306.475%2c1086.184' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1113.198%2c272.731C1155.561%2c273.813%2c1201.642%2c265.524%2c1223.559%2c229.255C1246.035%2c192.06%2c1235.272%2c145.227%2c1212.679%2c108.103C1191.083%2c72.618%2c1154.682%2c50.078%2c1113.198%2c47.913C1067.23%2c45.514%2c1016.862%2c56.767%2c993.944%2c96.687C971.092%2c136.492%2c986.449%2c185.855%2c1012.191%2c223.855C1034.675%2c257.046%2c1073.122%2c271.707%2c1113.198%2c272.731' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M156.103%2c804.044C191.502%2c806.546%2c233.026%2c803.807%2c250.414%2c772.872C267.627%2c742.248%2c245.053%2c707.63%2c227.352%2c677.285C209.858%2c647.295%2c190.798%2c612.501%2c156.103%2c611.195C119.988%2c609.836%2c90.88%2c639.125%2c74.919%2c671.55C60.757%2c700.319%2c65.611%2c733.653%2c82.364%2c760.995C98.302%2c787.006%2c125.674%2c801.893%2c156.103%2c804.044' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1229.104%2c1039.903C1311.317%2c1036.437%2c1389.431%2c999.455%2c1430.496%2c928.149C1471.487%2c856.972%2c1469.028%2c768.156%2c1425.84%2c698.29C1384.723%2c631.775%2c1307.272%2c604.521%2c1229.104%2c602.357C1146.088%2c600.058%2c1059.128%2c618.09%2c1012.548%2c686.846C960.419%2c763.794%2c947.384%2c867.243%2c995.98%2c946.47C1042.895%2c1022.956%2c1139.456%2c1043.683%2c1229.104%2c1039.903' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M872.473%2c843.994C921.786%2c840.413%2c957.331%2c801.12%2c980.431%2c757.405C1001.765%2c717.031%2c1007.777%2c669.674%2c985.709%2c629.697C962.915%2c588.405%2c919.63%2c562.701%2c872.473%2c561.832C823.746%2c560.934%2c778.364%2c584.548%2c751.771%2c625.388C722.321%2c670.616%2c707.363%2c728.091%2c733.45%2c775.339C760.225%2c823.832%2c817.224%2c848.006%2c872.473%2c843.994' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M617.305%2c75.326C647.651%2c75.14%2c680.84%2c70.092%2c696.235%2c43.94C711.788%2c17.52%2c702.963%2c-15.759%2c685.935%2c-41.254C670.826%2c-63.876%2c644.487%2c-75.323%2c617.305%2c-74.239C592.004%2c-73.23%2c571.736%2c-57.104%2c557.546%2c-36.132C540.79%2c-11.368%2c522.555%2c18.565%2c536.683%2c44.916C551.229%2c72.047%2c586.522%2c75.514%2c617.305%2c75.326' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M1275.29%2c1283.039C1357.356%2c1278.59%2c1431.541%2c1237.811%2c1474.275%2c1167.609C1518.915%2c1094.275%2c1535.977%2c1001.328%2c1491.457%2c927.921C1448.189%2c856.578%2c1358.728%2c839.253%2c1275.29%2c839.513C1192.434%2c839.771%2c1108.156%2c860.828%2c1061.442%2c929.26C1008.37%2c1007.006%2c986.372%2c1110.86%2c1035.067%2c1191.419C1082.584%2c1270.028%2c1183.571%2c1288.011%2c1275.29%2c1283.039' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M542.523%2c970.386C627.622%2c968.148%2c690.345%2c898.379%2c729.642%2c822.864C765.563%2c753.836%2c766.993%2c674.89%2c732.623%2c605.077C693.18%2c524.96%2c631.817%2c441.768%2c542.523%2c442.785C454.196%2c443.791%2c400.843%2c531.115%2c359.779%2c609.323C322.417%2c680.48%2c301.247%2c761.47%2c337.54%2c833.178C377.336%2c911.806%2c454.428%2c972.703%2c542.523%2c970.386' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1029.928%2c386.413C1102.71%2c386.383%2c1170.794%2c345.015%2c1203.71%2c280.102C1234.027%2c220.315%2c1209.746%2c153.316%2c1178.088%2c94.229C1143.871%2c30.365%2c1102.213%2c-39.319%2c1029.928%2c-44.247C951.318%2c-49.607%2c879.329%2c1.885%2c842.089%2c71.321C806.734%2c137.244%2c817.594%2c215.992%2c855.898%2c280.246C893.191%2c342.804%2c957.097%2c386.443%2c1029.928%2c386.413' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M936.52%2c843.564C1008.553%2c847.75%2c1079.711%2c807.565%2c1111.564%2c742.821C1140.701%2c683.598%2c1107.984%2c618.976%2c1075.194%2c561.696C1042.098%2c503.882%2c1003.137%2c436.848%2c936.52%2c437.043C870.079%2c437.237%2c828.854%2c503.024%2c799.243%2c562.502C773.459%2c614.294%2c768.099%2c672.352%2c793.49%2c724.338C822.686%2c784.114%2c870.107%2c839.705%2c936.52%2c843.564' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M333.409%2c599.518C415.194%2c598.161%2c483.965%2c543.529%2c523.513%2c471.929C561.669%2c402.848%2c561.727%2c321.356%2c525.883%2c251.048C486.085%2c172.984%2c420.966%2c102.441%2c333.409%2c99.04C241.006%2c95.45%2c156.516%2c153.332%2c113.165%2c235.014C72.275%2c312.058%2c86.949%2c403.77%2c132.057%2c478.423C175.469%2c550.269%2c249.478%2c600.91%2c333.409%2c599.518' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M634.99%2c1114.556C707.523%2c1114.624%2c780.586%2c1091.641%2c819.871%2c1030.668C862.425%2c964.622%2c869.639%2c879.174%2c830.563%2c811.012C791.301%2c742.525%2c713.881%2c705.302%2c634.99%2c708.171C560.758%2c710.87%2c499.476%2c759.916%2c462.593%2c824.393C426.001%2c888.36%2c413.065%2c966.967%2c450.707%2c1030.322C487.683%2c1092.556%2c562.6%2c1114.488%2c634.99%2c1114.556' fill='rgba(110%2c 102%2c 201%2c 0.13)' class='triangle-float2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1328'%3e%3crect width='1200' height='1000' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='95.83%25' y1='-5%25' x2='4.17%25' y2='105%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1329'%3e%3cstop stop-color='rgba(167%2c 131%2c 230%2c 0.24)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(209%2c 222%2c 250%2c 0.37)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 5s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 4s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 6s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e");
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
  color: rgb(174, 240, 199);
  text-decoration: none;
}
</style>
