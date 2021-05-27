<template>
  <div class="container">
    <transition :name="transitionName" mode="out-in">
      <router-view :key="$route.path" class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { GameRoutes, MainRoutes } from '@/configs/routeNames';

export default {
  name: 'GameScreen',
  data: () => ({
    transitionName: 'slide-left',
    buttonLabel: '下一步',
  }),
  components: {},
  beforeRouteUpdate(to, from, next) {
    // const toDepth = to.path.split('/').length;
    // const fromDepth = from.path.split('/').length;
    // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    this.transitionName = 'slide-left';
    this.setCurrentRoute(to.path.replace(`${MainRoutes.game}/`, ''));
    next();
  },
  computed: {
    ...mapGetters({
      currentRoute: 'game/currentRoute',
    }),
  },
  methods: {
    ...mapActions('game', ['nextNight', 'setCurrentRoute']),
  },
  created() {
    if(this.currentRoute) {
      this.$router.replace('/game/' + this.currentRoute);
    } else {
      this.nextNight();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';
.container {
  display: flex;
  flex-direction: column;
  .child-view {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
