<template>
  <div class="bottom-button">
    <div class="bottom-button-container">
      <Button class="button-inner" :disabled="disabled" :label="label" @click="$emit('click')" />
    </div>
    <div class="bottom-button-placeholder" />
  </div>
</template>

<script>
import Button from './Button';

export default {
  name: 'NextButton',
  components: {
    Button,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
    },
    click: {
      type: Function,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';
.bottom-button {
  width: 100%;

  &-container {
    position: fixed;
    width: 100%;
    bottom: env(safe-area-inset-bottom);
    height: $bottom-container-height;
    z-index: 99;
  }

  &-placeholder {
    height: $bottom-container-height;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

</style>
