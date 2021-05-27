<template>
  <div class="main-container">
    <img class="loading-img" src="../../assets/preLoading.gif" />
  </div>
</template>

<script>
export default {
  name: 'PreLoading',
  props: [],
};
</script>

<style lang="scss" scoped>
@mixin transform($value) {
  -webkit-transform: $value;
  -moz-transform: $value;
  -ms-transform: $value;
  -o-transform: $value;
  transform: $value;
}

.main-container {
  min-height: 200px;
  position: relative;

  .loading-img {
    position: absolute;
    top: 50%;
    left: 50%;
    @include transform(translate(-50%, -50%));
  }
}
</style>
