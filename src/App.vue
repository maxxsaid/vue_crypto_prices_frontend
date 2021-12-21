<template>
  <div id="app">
    <Header />
    <div id="nologin" v-if="!loggedin">
      <div id="loginform">
        <form v-on:submit.prevent="handleLogin">
          <fieldset>
            <legend>LOGIN</legend>
            <input type="text" placeholder="username" v-model="loginUsername" />
            <input
              type="password"
              placeholder="password"
              v-model="loginPassword"
            />
            <input type="submit" value="login" />
          </fieldset>
        </form>
        <form v-on:submit.prevent="handleSignup">
          <fieldset>
            <legend>Create User</legend>
            <input
              type="text"
              placeholder="username"
              v-model="createUsername"
            />
            <input
              type="password"
              placeholder="password"
              v-model="createPassword"
            />
            <input type="submit" value="create user" />
          </fieldset>
        </form>
      </div>
    </div>
    <div id="login" v-if="loggedin">
      <div id="forms">
        <Coin />
        <article>
          <h1>New Coin</h1>
          <input type="text" v-model="newCoin" />
          <button v-on:click.prevent="createCoin">Create Coin</button>
        </article>
        <article>
          <h1>Update Coin</h1>
          <input type="text" v-model="updateCoin" />
          <button v-on:click.prevent="editCoin" v-bind:id="editID">
            Update Coin
          </button>
        </article>
      </div>
      <div id="coins">
        <div class="coin" v-for="coin of coins" :key="coin.id">
          <h1>{{ coin.ticker }}</h1>
          <router-link :to="{ name: 'coin', params: coin.ticker }"
            >User</router-link
          >
          <button v-bind:id="coin.id" v-on:click="deleteCoin">delete</button>
          <button v-bind:id="coin.id" v-on:click="editSelect">update</button>
        </div>
      </div>
      <button v-on:click="handleLogout" id="logout">logout</button>
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
#title {
  text-align: center;
  margin: 50px auto;
  font-size: 4em;
}
#title span {
  color: rgb(155, 76, 202);
}
#loginform {
  display: flex;
  width: 60%;
  margin: 10px auto;
}
#forms {
  width: 60%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
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
}
#logout {
  text-align: center;
  display: block;
  margin: 10px auto;
}
</style>
