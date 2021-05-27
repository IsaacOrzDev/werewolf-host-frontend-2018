<template>
    <div class="root">
        <md-button class="btn minus" v-on:click="updateValue(false)">-</md-button>
        <input disabled class="input" type="number" min="1" :max="max" :value="theNumber"/>
        <md-button class="btn plus" v-on:click="updateValue(true)">+</md-button>
    </div>
</template>

<script>
  export default {
    name: 'NumberInput',
    data: function() {
      return {
        theNumber: this.defaultNumber,
      };
    },
    props: {
      max: {
        type: Number,
        default: 10,
      },
      defaultNumber: {
        type: Number,
        default: 1,
      }
    },
    methods: {
      updateValue: function(plus) {
        if (plus) {
          this.theNumber++;
        }
        else if (this.theNumber > 1) {
          this.theNumber--;
        }
        this.$emit('value', this.theNumber);
      },
    },
  };
</script>

<style lang="scss" scoped>
    $color-border: #d9d9d9;

    .root {
        width: 100%;
        justify-content: center;
        display: flex;

        .input {
            width: 60px;
            height: 60px;
            padding: 0px;
            line-height: 1.65;
            text-align: center;
            margin: 0;
            border: none !important;
            font-size: 20px;
            border-radius: 0;

            &:focus {
                outline: 0;
            }

            &:disabled {
                color: #000;
                opacity: 1;
            }
        }

        .btn {
            margin: 0;
            width: 60px;
            height: 60px;
            line-height: 1.65;
            font-size: 20px;
            background-color: #fff;
            border: 1px solid $color-border;
            padding: 0;
            min-width: 60px;

            &.minus {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }

            &.plus {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }

            &:focus {
                outline: 0;
            }

            &:active {
                background: #eee;
            }
        }
    }
</style>
