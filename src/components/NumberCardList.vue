<template>
  <div class="number-card-list">
    <md-button
      md-with-hover
      v-for="value in list"
      :key="value"
      class="md-fab-bottom-center character"
      :class="{ active: selected.includes(value), kill: mode == 'kill'}"
      :disabled="disableList.includes(value)"
      @click="onSelect(value)"
    >
      <div class="icon">{{value}}</div>
      <div v-if="selectedPlayerTeam && value === selected[0]" class="number">{{selectedPlayerTeam}}</div>
      <div v-else class="number">{{romanize(value)}}</div>
    </md-button>
  </div>
</template>

<script>
import teams from '../configs/teams';
import commonService from '@/services/commonService';
export default {
  name: 'NumberCardList',
  props: {
    numberList: {
      type: Array,
      default: function () { return [] }
    },
    playerCount: {
      type: Number,
    },
    selected: {
      type: Array,
    },
    disableList: {
      type: Array,
    },
    onSelect: {
      type: Function,
    },
    mode: {
      type: String,
    },
    players: {
      type: Array,
    },
  },
  computed: {
    selectedPlayerTeam: function() {
      if (this.players && this.mode === 'check' && this.selected[0] !== -1) {
        const selectedPlayer = this.players.find((x) => x && x.no === this.selected[0]);
        if (!selectedPlayer || (selectedPlayer && selectedPlayer.team === teams.good)) {
          return '好';
        }
        return '壞';
      }
      return '';
    },
    list: function() {
      return this.numberList.length ? this.numberList : [...Array(this.playerCount).keys()].map(i => i + 1);
    }
  },
  methods: {
    togglePlayer: function(num) {
      this.onSelect(num);
    },
    romanize: function(num) {
      return commonService.romanize(num);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';

.number-card-list {
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.character {
  width: 25%;
  height: 15vh;
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

  &:disabled {
    opacity: 0.55;
  }

  .icon {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translate(-50%, 0);
    /*background: #e6e1af;*/
    width: 22px;
    border-radius: 100px;
    color: #ddd;
  }
  .number {
    color: #211a0b;
    padding: 0.5rem 1rem;
    font-size: 2rem;
  }

  &.kill {
    &.active {
      border: 4px solid #5b060a;
      &:after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0.5;
        background: #5b060a;
        content: ' ';
      }
    }
  }
}
</style>
