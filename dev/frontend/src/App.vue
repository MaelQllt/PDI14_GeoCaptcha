<template>
  <div id="app">
    <Header /> 
    <router-view /> 
    <Scheme />
    <Footer /> 
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Scheme from './components/Scheme.vue';

export default {
  components: {
    Header,
    Footer,
    Scheme,
  }
}
</script>

<style scoped>
#app {
  overflow-x: hidden; 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>