<template>
    <div class="select-list">
        <md-button
            md-with-hover
            v-for="option in options"
            :key="option.value"
            class="md-fab-bottom-center select-item"
            :class="{ active: selectedValue === option.value}"
            :disabled="false"
            @click="select(option.value)"
        >
            <div class="text">{{option.label}}</div>
        </md-button>
    </div>
</template>

<script>
  export default {
    name: 'SelectInput',
    props: {
      options: {
        type: Array,
      },
      onSelect: {
        type: Function,
      },
      value: {
        type: String,
      }
    },
    data: function(){
      return {
        selectedValue: this.value
      };
    },
    methods: {
      select: function(value) {
        this.selectedValue = value;
        if(this.onSelect) {
          this.onSelect(value);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
    @import '~@/scss/_variables.scss';

    .select-list {
        position: relative;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .select-item {
        width: 35%;
        height: 20vh;
        /* margin: 1.5%; */
        background: radial-gradient(#b1a657, #4e3934);
        background-position: bottom;
        background-size: cover;
        background-repeat: no-repeat;
        border: 4px solid #000;
        touch-action: manipulation;

        &:first-child {
            margin-left: 0 !important;
        }

        &.active {
            border: 4px solid $color-tint;
        }

        .text {
            color: #211a0b;
            padding: 0.5rem 1rem;
            font-size: 2rem;
        }
    }
</style>
