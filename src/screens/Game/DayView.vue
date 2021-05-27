<template>
  <ScreenContainer>
    <div class="day-container">
      <SpeechText>{{firstPlayer.no}}號請開始發言</SpeechText>
      <HintText>[選擇玩家以進行投票，或發動角色技能]</HintText>
      <div class="tool-section">
        <div class="status-board">
          <img src="@/assets/good_icon.png" />
          <span>{{teamLeft.god}}神{{teamLeft.civilian}}民</span>
          <img src="@/assets/bad_icon.png" />
          <span>{{teamLeft.wolf}}狼</span>
        </div>
        <md-button
          class="history-button"
          @click="onClickHistory"
          :style="{backgroundImage: 'url(' + require('@/assets/history.svg') + ')'}"
        ></md-button>
        <md-button
          class="user-button"
          @click="onClickUsers"
          :style="{backgroundImage: 'url(' + require('@/assets/users.svg') + ')'}"
        ></md-button>
      </div>
      <PlayerList />
    </div>
    <HistoryDialog :show="showHistory" @complete="onCompleteHistory" v-on:cancel="onCancelHistory" />
    <UsersDialog
      :players="players"
      :show="showUsers"
      @complete="onCompleteUsers"
      v-on:cancel="onCancelUsers"
    />
    <NextButton label="不投票，直接進入天黑" @click="nextRound()" />
  </ScreenContainer>
</template>

<script>
import NextButton from '@/components/buttons/NextButton';
import HistoryDialog from '@/components/HistoryDialog';
import UsersDialog from '@/components/UsersDialog';
import PlayerList from '@/containers/PlayerList';
import SpeechText from '@/components/text/SpeechText';
import HintText from '@/components/text/HintText';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DayView',
  components: {
    PlayerList,
    NextButton,
    HistoryDialog,
    UsersDialog,
    SpeechText,
    HintText,
  },
  data: () => ({
    showHistory: false,
    showUsers: false,
  }),
  computed: {
    ...mapGetters({
      players: 'game/players',
      firstPlayer: 'game/firstPlayer',
      godPlayers: 'game/godPlayers',
      civilianPlayers: 'game/civilianPlayers',
      wolfPlayers: 'game/wolfPlayers',
    }),
    teamLeft: function() {
      return {
        civilian: this.civilianPlayers.filter((item) => !item.dead).length,
        god: this.godPlayers.filter((item) => !item.dead).length,
        wolf: this.wolfPlayers.filter((item) => !item.dead).length,
      };
    },
  },
  methods: {
    ...mapActions('game', ['nextRound', 'setPlayers']),
    onCompleteHistory: function() {
      this.showHistory = false;
    },
    onCancelHistory: function() {
      this.showHistory = false;
    },
    onClickHistory: function() {
      this.showHistory = true;
    },
    onCompleteUsers: function(players) {
      if (players) {
        this.setPlayers(players);
      }
      this.showUsers = false;
    },
    onCancelUsers: function() {
      this.showUsers = false;
    },
    onClickUsers: function() {
      this.showUsers = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';
.day-container {
  /*width: 100%;*/
  /*height: calc(100vh - 120px);*/
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*flex-direction: column;*/

  .tool-section {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .status-board {
      span {
        font-size: 1rem;
        font-weight: bold;
        padding: 0 10px 0 10px;
        color: $color-tint;
      }
    }
    .history-button {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 40px;
      min-width: 40px;
    }

    .user-button {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      min-width: 35px;
      margin-top: 8px !important;
    }
  }
}
</style>
