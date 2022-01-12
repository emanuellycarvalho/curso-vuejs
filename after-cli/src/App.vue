<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <nav class="navbar navbar-dark bg-dark">
        <a class="navbar-brand" href="#">
            <img src="https://iconape.com/wp-content/png_logo_vector/git-icon.png" class="d-inline-block align-top" alt="">
            Git Issues
        </a>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
  #app .navbar a{
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 30px;
    font-weight: 500;
  }

  #app .navbar a img {
    width: 40px;
    height: 40px;
    margin-top: 3px;
  }
</style>
