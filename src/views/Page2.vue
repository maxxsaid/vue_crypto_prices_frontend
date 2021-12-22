<template>
  <div class="home">
    <HelloWorld msg="Another Page" />
    <Collapse />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "../components/HelloWorld.vue";
import Collapse from "../components/Collapse.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
    Collapse,
  },
};
</script>
