<template>
  <div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>curensee</strong> by
          <a href="https://max-said.netlify.app/" target="_blank">Max Said</a>
          and
          <a href="https://github.com/tazmancooks" target="_blank">
            Quentin Bartholomew</a
          >
        </p>
        <p class="built">Built on Ruby on Rails and Vue</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
.footer {
  /* position: fixed; */
  height: 50px;
  background-color: white;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 0px;
  font-family: "Lato", sans-serif;
  font-size: 1.4em;
  margin-top: 100px;
}
.built {
  font-size: 0.6em;
  color: rgb(151, 150, 150);
}
</style>
