<template>
  <div class="player-list">
    <md-button
      md-with-hover
      v-for="player in players"
      :key="player.no"
      class="md-fab-bottom-center player"
      :class="{ dead: player.dead}"
      :style="{backgroundImage: 'url(' + require('@/assets/character/' + imageObj[player.name]) + ')'}"
      @click="onSelectPlayer(player)"
    >
      <div class="layer" />
      <div class="number">{{player.no}}</div>
    </md-button>
    <ActionDialog
      :player="selectPlayer"
      :options="options"
      :show="showDialog"
      @actionConfirm="onConfirmAction"
    />
  </div>
</template>

<script>
import HistoryDialog from '@/components/HistoryDialog';
import characterService from '@/services/characterService';
import { mapActions, mapGetters } from 'vuex';
import ActionDialog from '@/components/ActionDialog';
import { dayActionType } from '../configs/actionType';
import { characterNames } from '../configs/characters';
import commonService from '@/services/commonService';

export default {
  name: 'PlayerList',
  components: {
    ActionDialog,
  },
  props: {},
  data: () => ({
    selectPlayer: {},
    options: [],
    showDialog: false,
  }),
  computed: {
    ...mapGetters({
      players: 'game/players',
      dayActions: 'game/dayActions',
    }),
    imageObj: function() {
      let imageObj = {};
      this.players.forEach((player) => {
        let info = characterService.getCharacter(player.name);
        if (info) {
          imageObj[player.name] = info.image;
        }
      });
      return imageObj;
    },
  },
  methods: {
    ...mapActions('game', ['addDayAction', 'doDayAction', 'setDaySpeech']),
    onSelectPlayer: function(player) {
      const options = [{ label: '投票處決', type: dayActionType.voted }];
      this.selectPlayer = player;
      this.showDialog = true;
      if (
        this.players.find((x) => x && x.name === characterNames.knight && !x.dead) &&
        player.name !== characterNames.knight &&
        !this.dayActions.find(
          (x) => x.name === characterNames.knight && x.action === dayActionType.knightKill && x.done
        )
      ) {
        options.push({ label: '騎士查殺', type: dayActionType.knightKill });
      }
      this.options = options;
    },
    onConfirmAction: function(params) {
      if (params) {
        let { player, action } = params;
        if (player) {
          this.setDaySpeech([]);
          switch (action.type) {
            case dayActionType.voted:
              this.addDayAction({
                name: '有人',
                target: player.no,
                action: action.type,
              });
              break;
            case dayActionType.knightKill:
              this.addDayAction({
                name: characterNames.knight,
                target: player.no,
                action: action.type,
              });
              break;
          }
          this.doDayAction();
        }
      }
      this.showDialog = false;
    },
    romanize: function(num) {
      return commonService.romanize(num);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';

.player-list {
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .player {
    width: 25%;
    height: 15vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border: 4px solid #4e3934;
    touch-action: manipulation;

    &:first-child {
      margin-left: 0 !important;
    }

    &:after {
      background: rgba(#000, 0.2);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      content: ' ';
      background-size: 50% 50%;
      background-position: center;
      background-repeat: no-repeat;
    }

    .number {
      position: absolute;
      background: #4e3934;
      color: #fff;
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 25px;
      top: -6vh;
      left: 50%;
      transform: translate(-50%, 0);
    }

    &.dead {
      &:after {
        background-color: rgba(107, 14, 12, 0.9);
        background-image: url('../assets/dead.png');
      }
    }
  }
}
</style>
