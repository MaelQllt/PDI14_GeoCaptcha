<template>
  <div id="app">
    <Header /> 
    <router-view /> 
    <DarkMode />
    <Footer /> 
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import DarkMode from './components/DarkMode.vue';

export default {
  components: {
    Header,
    Footer,
    DarkMode,
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