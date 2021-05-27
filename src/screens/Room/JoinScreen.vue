<template>
  <div class="main-container">
    <div v-if="character && no" class="card-section">
      <h1>玩家{{name}}</h1>
      <HintText>[點擊卡牌{{toggleLabel}}]</HintText>
      <div class="card" @click="toggleCard">
        <!-- v-if="card == 'no'" -->
        <div class="number-card card-side" :class="{active: card === 'no'}">
          <div class="icon">{{no}}</div>
          <div class="number">{{romanize(no)}}</div>
        </div>
        <!-- v-if="card == 'character' && cardImage" -->
        <div
          class="character-card card-side"
          :class="{active: card === 'character' && cardImage, init}"
          :style="{backgroundImage: 'url(' + require('@/assets/character/' + cardImage) + ')'}"
        />
      </div>
      <!-- <Button class="toggle" v-on:click="toggleCard" :label="toggleLabel" /> -->
      <div style="margin-bottom: 16px" />
      <Button :disabled="loading" class="submit" v-on:click="exit" label="退出" />
    </div>
    <div v-else-if="playerId" class="waiting-section">
      <div class="card">
        <h1>請等待主持人發牌</h1>
        <div class="content">
          <h2>房號: {{roomId}}</h2>
          <h2>玩家: {{name}}</h2>
        </div>
        <div class="button-group">
          <Button class="button refresh" v-on:click="refresh" label="更新" />
          <Button :disabled="loading" class="button submit" v-on:click="exit" label="退出" />
        </div>
      </div>
    </div>
    <div v-else class="input-section">
      <md-field class="name-input">
        <label>房間號碼</label>
        <md-input v-model="inputId"></md-input>
      </md-field>
      <md-field class="name-input">
        <label>你的名字</label>
        <md-input v-model="name"></md-input>
      </md-field>
      <Button :disabled="loading" class="submit" v-on:click="submit" label="加入" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button';
import HintText from '@/components/text/HintText';
import apiService from '@/services/apiService';
import commonService from '@/services/commonService';
import { mapActions, mapGetters } from 'vuex';
import characterService from '../../services/characterService';

export default {
  name: 'JoinScreen',
  components: {
    Button,
    HintText,
  },
  props: ['id'],
  data: () => ({
    inputId: null,
    name: null,
    character: null,
    no: null,
    card: 'no',
    toggleLabel: '查看角色卡',
    loading: false,
    timer: null,
    init: true,
  }),
  computed: {
    ...mapGetters({
      roomId: 'setup/roomId',
      playerId: 'setup/playerId',
      playerName: 'setup/playerName',
    }),
    cardImage: function() {
      let info = characterService.getCharacter(this.character);
      return info ? info.image : null;
    },
  },
  watch: {
    playerId: function(newValue, oldValue) {
      if (!!newValue && !oldValue && newValue != null) {
        this.setTimer();
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params && to.params.id) {
      this.inputId = to.params.id;
      this.setRoomId(to.params.id);
    }
    this.stopTimer();
  },
  methods: {
    ...mapActions('setup', ['joinRoom', 'exitRoom', 'setRoomId']),
    async submit() {
      if (this.inputId && this.name) {
        this.loading = true;
        await this.joinRoom({ roomId: this.inputId, name: this.name });
        this.loading = false;
      }
    },
    async refresh() {
      if (this.roomId) {
        let roomInfo = await apiService.getRoom(this.roomId);
        if (roomInfo.Players) {
          const currentPlayer = roomInfo.Players.find((item) => item.id == this.playerId);
          if (!currentPlayer) {
            this.exitRoom();
            this.stopTimer();
          } else if (currentPlayer.character && currentPlayer.no) {
            this.character = currentPlayer.character;
            this.no = currentPlayer.no;
            this.stopTimer();
          }
        }
      }
    },
    timerApp() {
      this.timer = setInterval(
        function() {
          this.refresh();
        }.bind(this),
        5000
      );
    },
    setTimer() {
      this.stopTimer();
      this.timerApp();
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    exit() {
      this.stopTimer();
      this.character = null;
      this.no = null;
      this.exitRoom();
    },
    romanize: function(num) {
      return commonService.romanize(num);
    },
    toggleCard: function() {
      this.card = this.card == 'no' ? 'character' : 'no';
      this.toggleLabel = this.card == 'no' ? '查看角色身份' : '隱藏角色身份';
      if (this.init) {
        this.init = false;
      }
    },
  },
  created() {
    if (this.id && this.roomId != this.id) {
      this.inputId = this.id;
      this.setRoomId(this.id);
    }

    if (this.playerName) {
      this.name = this.playerName;
    }
    if (this.playerId && !this.no && !this.character) {
      this.setTimer();
    }
  },
};
</script>

<style lang="scss" scoped>
$bottomContainerHeight: 60px;
.main-container {
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    color: #fff;
  }

  .input-section {
    width: 70%;
    background: #eee;
    padding: 20px;

    .name-input {
      border-bottom: 1px solid black;
    }
  }

  .waiting-section {
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .card {
      margin: 0 5%;
      min-height: 50vh;
      background: #eee;
      background-position: bottom;
      background-size: cover;
      background-repeat: no-repeat;
      border: 4px solid #000;
      padding: 10px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      h1,
      h2,
      p {
        color: #2c3e50;
        line-height: 1;
      }
      .content {
        font-weight: normal;
        margin-top: 20px;
        text-align: left;
      }
    }
  }

  .card-section {
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .card {
      width: 60vw;
      height: 85vw;
      perspective: 200vw;
      -moz-perspective: 200vw;
      position: relative;

      .card-side {
        transition: transform 0.8s ease;
        -webkit-transition: transform 0.8s ease;
        position: absolute;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        backface-visibility: hidden;
        overflow: hidden;
      }
    }

    .number-card {
      width: 60vw;
      height: 85vw;
      background: radial-gradient(#b1a657, #4e3934);
      background-position: bottom;
      background-size: cover;
      background-repeat: no-repeat;
      border: 4px solid #000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      transform: rotateY(-180deg);

      &.active {
        transform: rotateY(0);
      }

      .icon {
        position: absolute;
        top: 1vw;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 10vw;
        line-height: 10vw;
        background-color: rgba(#000, 0.3);
        padding: 1.5vw;
        color: #fff;
      }

      .number {
        color: #211a0b;
        font-size: 35vw;
      }
    }

    .character-card {
      width: 60vw;
      height: 85vw;
      background-position: bottom;
      background-size: cover;
      background-repeat: no-repeat;
      border: 4px solid #000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      transform: rotateY(180deg);

      &.init {
        transition: none !important;
        -webkit-transition: none !important;
      }

      &.active {
        transform: rotateY(0);
      }
    }
  }

  .button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    .button {
      margin: 0 10px;
    }
  }
}
</style>
