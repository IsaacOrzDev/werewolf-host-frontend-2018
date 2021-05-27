<template>
  <p class="text" :style="{fontSize: fontSize}" >
    <slot />
  </p>
</template>

<script>
export default {
  name: 'SpeechText',
  props: {
    fontSize: {
      type: String,
      default: '32px',
    },
  }
};
</script>

<style lang="scss" scoped>
.text {
  padding: 0 5%;
  color: #fff;
  line-height: 1.2;
  font-size: 30px;
  margin-top: 18px;
  margin-bottom: 18px;
}
</style>
