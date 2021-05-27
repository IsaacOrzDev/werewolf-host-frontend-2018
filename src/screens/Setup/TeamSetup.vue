<template>
    <div class="main-container">
        <div class="good card">
            <NumberInput v-on:value="updateGoodCount" :defaultNumber="playerCount.good"/>
            <p class="title">好人陣營</p>
        </div>
        <div class="bad card">
            <NumberInput v-on:value="updateBadCount" :defaultNumber="playerCount.bad"/>
            <p class="title">壞人陣營</p>
        </div>
    </div>
</template>

<script>
  import NumberInput from '@/components/NumberInput';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'TeamSetup',
    data: function() {
      return {
        good: 1,
        bad: 1,
      };
    },
    components: {
      NumberInput,
    },
    computed: {
      ...mapGetters({
        playerCount: 'setup/playerCount',
      }),
    },
    created() {
      this.good = this.playerCount.good || 1;
      this.bad = this.playerCount.bad || 1;
    },
    methods: {
      ...mapActions('setup', ['initCount']),
      updateGoodCount: function(value) {
        this.good = value;
        this.initCount({ good: this.good, bad: this.bad });
      },
      updateBadCount: function(value) {
        this.bad = value;
        this.initCount({ good: this.good, bad: this.bad });
      },
    },
  };
</script>

<style lang="scss" scoped>
    .main-container {
        padding: 10px 5%;

        .card {
            height: 30vh;
            display: flex;
            margin: 5% 0;
            width: 100%;
            align-items: center;
            box-shadow: 0px 1px 2px 1px rgba(#ddd, 0.15);

            &.good {
                background: linear-gradient(90deg, rgba(#111, 0.5) 0%, rgba(#0d4ea6, 0.5) 100%),
                url(../../assets/good.png);
                background-position: left top;
                background-repeat: no-repeat;
            }

            &.bad {
                background: linear-gradient(90deg, rgba(#111, 0.5) 0%, rgba(#cf1132, 0.5) 100%),
                url(../../assets/bad.png);
                background-position: left top;
                background-repeat: no-repeat;
            }

            .title {
                width: 50%;
                font-size: 1.5rem;
                color: #fff;
            }
        }
    }
</style>
