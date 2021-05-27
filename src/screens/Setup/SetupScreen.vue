<template>
  <div class="container">
    <transition :name="transitionName" mode="out-in">
      <router-view class="child-view"></router-view>
    </transition>
    <NextButton :label="buttonLabel" @click="next()" />
  </div>
</template>

<script>
import NextButton from '@/components/buttons/NextButton';
export default {
  name: 'SetupScreen',
  data: () => ({
    transitionName: 'slide-left',
    buttonLabel: '下一步',
  }),
  components: {
    NextButton
  },
  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    next();
  },
  methods: {
    next: function() {
      const step = ['/setup', '/setup/full'];
      const index = step.indexOf(this.$router.currentRoute.path) || 0;
      let route = step[index + 1];
      if (index + 1 >= step.length - 1) {
        this.buttonLabel = '完成';
      } else {
        this.buttonLabel = '下一步';
      }

      this.$router.replace(index + 1 >= step.length ? '/host' : route);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';
$bottomContainerHeight: 60px;
.container {
  display: flex;
  flex-direction: column;

  .child-view {
    margin-bottom: $bottom-container-height;
  }

  .bottom-container {
    position: absolute;
    width: 100%;
    bottom: 0px;
    height: $bottom-container-height;
  }
}
</style>
