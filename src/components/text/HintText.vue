<template>
  <p class="text">
    <slot />
  </p>
</template>

<script>
export default {
  name: 'HintText',
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';
.text {
  padding: 0 5%;
  color: $color-tint;
  font-size: 18px;
}
</style>
