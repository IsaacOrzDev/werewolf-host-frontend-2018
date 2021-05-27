<template>
  <div id="app">
    <Header />
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import router from '@/router';
import Header from '@/components/Header';

export default {
  name: 'App',
  router,
  components: {
    Header,
  },
};
</script>

<style>
@import './scss/_transition.scss';
body {
  margin: 0px;
}

#app {
  font-family: 'Noto Sans TC', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #08080d;
  min-height: -webkit-fill-available;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.view {
  flex: 1;
}
</style>
