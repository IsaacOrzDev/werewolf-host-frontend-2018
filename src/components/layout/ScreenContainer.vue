<template>
  <div :class="['screen-container', className]">
    <div class="screen-container-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenContaienr',
  props: {
    className: {
      type: String,
    },
    scrollable: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.screen-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;

  &-content {
    width: 100%;
    position: absolute;
  }
}
</style>