<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>玩家{{player.no}}:{{player.realName}}</md-dialog-title>
      <md-dialog-content class="content-container">
        <md-button
          md-with-hover
          v-for="(action, index) in options"
          :key="index"
          class="md-fab-bottom-center action-button"
          @click="onSelectItem(action)"
        >{{action.label}}</md-button>
      </md-dialog-content>
      <md-dialog-actions class="bottom-container">
        <md-button class="primary-button" @click="onComplete">確定</md-button>
        <md-button class="primary-button" @click="onClose">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { dayActionType } from '@/configs/actionType';
import { characterNames } from '@/configs/characters';
import teams from '@/configs/teams';

export default {
  name: 'ActionDialog',
  props: ['show', 'player', 'options'],
  data: () => ({
    options: [],
    action: null,
    showDialog: false,
  }),
  created() {
    this.showDialog = this.show;
  },
  watch: {
    show: function(newValue, oldValue) {
      this.showDialog = newValue;
    },
    showDialog: function(newValue, oldValue) {
      if (newValue == false) {
        this.$emit('actionConfirm');
      }
    },
    player: function(player) {
      if (player.dead) {
        // this.options = [{ label: '復活', type: dayActionType.rebirth }];
      } else {
        // this.options = [
        //   { label: '投票處決', type: dayActionType.voted },
        //   { label: '獵人槍殺', type: dayActionType.hunterShot },
        //   { label: '狼王槍殺', type: dayActionType.wolfKingShot },
        // ];
        // if (player.team == teams.bad) {
        //   this.options.push({ label: '騎士查殺', type: dayActionType.knightKill });
        // }
        // if (player.name == characterNames.knight) {
        //   this.options.push({ label: '騎士自殺', type: dayActionType.knightSuicide });
        // }
      }
    },
  },
  methods: {
    onSelectItem: function(action) {
      this.action = action;
    },
    onComplete: function() {
      if (this.action) {
        this.$emit('actionConfirm', { player: this.player, action: this.action });
      }
    },
    onClose: function() {
      this.$emit('actionConfirm');
    },
  },
};
</script>

<style lang="scss" scoped>
.md-dialog {
  background: rgba(#4e3934, 1);
  color: #fff;
  width: 50%;
  max-height: 50vh;

  .content-container {
    overflow-x: hidden;
    .action-button {
      background: rgba(0, 0, 0, 0.05);
      color: #fff;
      width: 100%;
      &:first-child {
        margin-left: 0 !important;
      }
    }
  }

  .bottom-container {
    padding: 0 8px;
    min-height: 0;

    .primary-button {
      background: rgba(0, 0, 0, 0.1);
      width: 50%;
      color: #fff;
      &:first-child {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
