<template>
  <div class="container">
    <div class="main-container">
      <template v-if="tab =='card'">
        <Button class="landing-button" to="/setup" label="佈局設置" />
        <Button class="landing-button" to="/game" label="開始新局" />
      </template>
      <template v-if="tab =='room'">
        <Button class="landing-button" to="/host" label="創建房間" />
        <Button class="landing-button" to="/join" label="加入房間" />
      </template>
      <!--      <div class="match-section">-->
      <!--        <md-field class="match-input">-->
      <!--          <label>room id</label>-->
      <!--          <md-input v-model="matchId"></md-input>-->
      <!--        </md-field>-->
      <!--        <md-button @click="loadMatch">confirm</md-button>-->
      <!--      </div>-->
    </div>
    <!-- <div class="bottom-viewport">
      <md-bottom-bar class="md-accent">
        <md-bottom-bar-item @click="switichTab('room')" md-label="房間模式" md-icon="home"></md-bottom-bar-item>
        <md-bottom-bar-item @click="switichTab('card')" md-label="實卡模式" md-icon="credit_card"></md-bottom-bar-item>
      </md-bottom-bar>
    </div>-->
  </div>
</template>

<script>
import Button from '@/components/buttons/Button';
import apiService from '@/services/apiService';
import { mapActions } from 'vuex';
import gameMode from '../configs/gameMode';

export default {
  name: 'LandingScreen',
  components: {
    Button,
  },
  data: () => ({
    matchId: null,
    playerResult: [],
    tab: 'room',
  }),
  methods: {
    ...mapActions('game', ['setState', 'setMode']),
    async loadMatch() {
      let result = await apiService.getMatch(this.matchId);
      if (result.State) {
        await this.setState(result.State);
        this.$router.push('/game');
      }
    },
    switichTab: function(value) {
      this.tab = value;
      if (value === 'room') {
        this.setMode(gameMode.virtual);
      } else {
        this.setMode(gameMode.real);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bottomContainerHeight: 60px;
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .main-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .landing-button {
      width: 50vw;
      margin: 20px 0;
    }
    .match-section {
      background: #fff;
    }
  }

  .bottom-viewport {
    width: 100%;
    background: #4e3937;
    .md-bottom-bar-item {
      max-width: 50%;
      color: #fff;
    }
  }
}
</style>
