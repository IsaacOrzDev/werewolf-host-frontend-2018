<template>
  <div class="root">
    <router-link
        v-if="showBack"
        class="back"
        :to="{ path: backPath }"
    >
      <md-icon class="md-primary" style="color:#fff">keyboard_arrow_left</md-icon>
    </router-link>
    <a class="main-logo" href="/">狼人殺助手</a>
  </div>
</template>

<script>
import { MainRoutes, GameRoutes } from '@/configs/routeNames';

export default {
  name: 'Header',
  data: () => ({
    showBack: false,
    backPath: '/',
    disableBackPaths: [
      `${MainRoutes.game}/${GameRoutes.start}`,
      `${MainRoutes.game}/${GameRoutes.daySpeech}`,
      `${MainRoutes.game}/${GameRoutes.day}`,
      `${MainRoutes.game}/${GameRoutes.endGame}`
    ],
  }),
  watch:{
    $route (to, from){
      this.showBack = this.$routerHistory.hasPrevious();
      this.backPath = this.$routerHistory.previous().path;
      if(this.disableBackPaths.includes(this.$route.path)) {
        this.showBack = false;
      }
    }
  },
  created() {
    this.showBack = this.$routerHistory.hasPrevious();
    this.backPath = this.$routerHistory.previous().path;
    if(this.disableBackPaths.includes(this.$route.path)) {
      this.showBack = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  background: #2b2b2b;
  flex: none;
  padding: 0px 5%;
  height: 60px;
  line-height: 60px;
  position: relative;
  /* display: flex; */

  .back {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    margin: 0;
    padding: 0 20px;
    &:hover, &:active {
      text-decoration: none;
    }
  }

  img {
    height: 100%;
    width: auto;
  }

  .main-logo {
    margin: 0;
    color: #fff;
    font-size: 18px;
    padding: 16px;
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
