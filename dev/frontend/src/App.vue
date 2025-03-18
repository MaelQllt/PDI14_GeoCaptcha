<template>
  <div id="app">
    <component :is="currentHeader" />
    <router-view /> 
    <Footer /> 
  </div>
</template>

<script>
import Header_Initial from './components/Header_Initial.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header_Initial,
    Header,
    Footer
  },

  computed: {
    currentHeader() {
      return this.$route.meta.requiresAuth ? 'Header' : 'Header_Initial';
    }
  }
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
