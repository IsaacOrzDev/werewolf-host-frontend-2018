<template>
  <div class="root">
    <md-button
      v-bind:to="to"
      class="md-primary main-button disable-dbl-tap-zoom"
      :class="{ disabled }"
      :disabled="disabled"
      @click="$emit('click')"
    >{{label}}</md-button>
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: ['label', 'to', 'disabled'],
};
</script>

<style lang="scss" scoped>
.root {
  height: 60px;
  min-height: 60px !important;

  .disable-dbl-tap-zoom {
    touch-action: manipulation;
  }

  .main-button {
    min-height: 60px !important;
    margin: 0px;
    background: #4e3934;
    width: 100%;
    height: 100%;
    font-size: 20px;
    color: #fff;
    border: none;
    &:focus {
      outline: 0;
    }
    &:active {
      background: #352724;
    }

    &:disabled {
      opacity: 0.7;
    }
  }
}
</style>
