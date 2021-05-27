<template>
    <div class="main-container">
        <div v-if="!setup" class="setup-container">
            <div class="info-container">
                <div v-if="path.text">
                    房間編號: {{roomId}}
                    <div v-if="path.qrCode">
                        <img :src="path.qrCode"/>
                    </div>
                    <div v-else>
                        <PreLoading/>
                    </div>
                    <div class="room-path-container">
                        <md-button class="copy button" v-clipboard="() => path.text"
                                   v-clipboard:success="clipboardSuccessHandler">
                            <md-icon class="md-primary">file_copy</md-icon>
                            複制連結
                        </md-button>
                        <md-button class="setup button" v-on:click="$router.push('/setup')">
                            <md-icon class="md-primary">filter_{{playerTotal > 9 ? '9_plus' : playerTotal}}</md-icon>
                            佈局設置
                        </md-button>
                    </div>
                </div>
            </div>
            <div class="player-list">
                <md-list>
                    <md-subheader>
                        <p>{{playerCount.good - goodCharacter.length}}民{{goodCharacter.length}}神{{playerCount.bad}}狼局(目前人數: {{roomInfo.Players ? roomInfo.Players.length : 0}})</p>
                        <md-button class="md-icon-button refresh" v-on:click="refresh()">
                            <md-icon class="md-primary">autorenew</md-icon>
                        </md-button>
                    </md-subheader>
                    <md-list-item v-for="(player, index) in roomInfo.Players" :key="index">
            <span class="md-list-item-text">
              <span style="flex:2">{{player.name}}</span>
              <span style="flex:1">{{player.no ? player.no + '號' : null}}</span>
              <span style="flex:2">{{player.character}}</span>
            </span>
                        <md-button class="md-icon-button md-list-action" v-on:click="deleteUser(index)">
                            <md-icon class="md-primary" style="color:#000;">delete</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
            </div>
            <NextButton :disabled="buttonObj.buttonDisable" :label="buttonObj.label" @click="setupPlayers()"/>
        </div>
        <div v-else class="complete-container">
            <SpeechText fontSize="24px">所有玩家請按數字順序坐下</SpeechText>
            <HintText>[當所有玩家準備好，請示意玩家查看自己身份牌]</HintText>
            <div class="player-list">
                <md-list>
                    <md-subheader>
                        <p>玩家名單</p>
                    </md-subheader>
                    <md-list-item v-for="(player, index) in roomInfo.Players" :key="index">
            <span class="md-list-item-text">
              <span style="flex:3">{{player.name}}</span>
              <span style="flex:1">{{player.no ? player.no + '號' : null}}</span>
              <span style="flex:2">{{player.character}}</span>
            </span>
                    </md-list-item>
                </md-list>
            </div>
            <NextButton :disabled="!setup || buttonObj.buttonDisable" label="開始遊戲" @click="start()"/>
        </div>
    </div>
</template>

<script>
  import NextButton from '@/components/buttons/NextButton';
  import PreLoading from '@/components/preLoading/PreLoading';
  import HintText from '@/components/text/HintText';
  import SpeechText from '@/components/text/SpeechText';
  import { MainRoutes } from '@/configs/routeNames';
  import apiService from '@/services/apiService';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'HostScreen',
    components: {
      NextButton,
      SpeechText,
      HintText,
      PreLoading,
    },
    data: () => ({
      roomInfo: {},
      setup: false,
    }),
    props: ['id'],
    computed: {
      ...mapGetters({
        roomId: 'setup/roomId',
        playerTotal: 'setup/playerTotal',
        playerCount: 'setup/playerCount',
        goodCharacter: 'setup/goodCharacter',
      }),
      debug: function() {
        return false;
      },
      buttonObj: function() {
        const joinedNumber = this.roomInfo.Players ? this.roomInfo.Players.length : 0;
        if (this.playerTotal === joinedNumber) {
          return {
            buttonDisable: false,
            label: '派發身份',
          };
        }
        else {
          return {
            buttonDisable: true,
            label: '人數不符',
          };
        }
      },
      path: function() {
        let path = window.location.href;
        path = path.replace('/host', '/join/' + this.roomId);
        return {
          text: path,
          qrCode:
            'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
            encodeURIComponent(path),
        };
      },
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params && to.params.id) {
        this.setRoomId(to.params.id);
      }
    },
    methods: {
      ...mapActions('setup', ['initRoom', 'initTestingData', 'setRoomId']),
      ...mapActions('game', ['setupRoomPlayers', 'resetRoomPlayers', 'resetGame']),
      async refresh() {
        if (this.roomId) {
          this.roomInfo = !this.debug
            ? await apiService.getRoom(this.roomId)
            : {
              Players: [
                { name: 'tho1', id: 'aaaaaaa1' },
                { name: 'tho2', id: 'aaaaaaa2' },
                { name: 'tho3', id: 'aaaaaaa3' },
                { name: 'tho4', id: 'aaaaaaa4' },
                { name: 'tho5', id: 'aaaaaaa5' },
                { name: 'tho6', id: 'aaaaaaa6' },
                { name: 'tho7aaaaa', id: 'aaaaaaa7' },
                { name: 'tho8', id: 'aaaaaaa8' },
                { name: 'tho9', id: 'aaaaaaa9' },
                { name: 'tho10', id: 'aaaaaaa0' },
                { name: 'tho11', id: 'aaaaaaa9' },
                { name: 'tho12', id: 'aaaaaaa0' },
              ],
            };
        }
      },
      async setupPlayers() {
        const players = await this.setupRoomPlayers(this.roomInfo);
        this.setup = true;
        this.roomInfo = { ...this.roomInfo, Players: players };
        window.scrollTo(0,0);
      },
      async start() {
        await this.$router.replace(MainRoutes.game);
      },
      async deleteUser(index) {
        console.log('delete roomId userId: ', this.roomId, index);
        if (!this.debug) {
          let res = await apiService.kickRoom(this.roomId, index);
          this.roomInfo = { ...this.roomInfo, Players: res.Players };
        }
        else {
          let newPlayers = this.roomInfo.Players.filter((item, curIndex) => curIndex != index);
          this.roomInfo = { ...this.roomInfo, Players: newPlayers };
        }

      },
      clipboardSuccessHandler({ value, event }) {
        console.log('success', value);
      },
    },
    async created() {
      if (this.id) {
        this.inputId = this.id;
        this.setRoomId(this.id);
        await this.refresh();
      }
      else if (!this.roomId) {
        await this.initRoom();
      }
      else {
        await this.refresh();
      }

      if (this.roomInfo) {
        await this.resetRoomPlayers(this.roomInfo);
      }
      this.resetGame();
      // this.initTestingData();
    },
  };
</script>

<style lang="scss" scoped>
    $bottomContainerHeight: 60px;
    .main-container {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-bottom: 10px;

        .setup-container,.complete-container {
            width: 100%;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .info-container {
            margin: 10px 20px;
            color: #fff;
        }

        .room-path-container {
            margin: 10px 0;
            display: flex;
            flex-direction: row;
            align-items: center;

            .copy, .setup {
                margin: 0 10px;
                background: #4e3934;
                width: 100%;
                height: 100%;
                font-size: 20px;
                color: #fff;
                border: none;
                height: 60px;

                &:focus {
                    outline: 0;
                }

                &:active {
                    background: #352724;
                }

                &:disabled {
                    opacity: 0.7;
                }
            }

            .room-path-text {
                word-break: break-all;
            }
        }

        .md-button {
            &:hover {
                background: rgba($color: #ffffff, $alpha: 0.2);
            }

            .md-icon {
                color: #fff;
            }
        }

        .player-list {
            width: 80%;
            margin: 10px;
            background: #eee;
            color: #000;

            .md-subheader {
                justify-content: space-between;
                color: #fff;
                background: #4e3934;
                border-bottom: 1px solid #000;

                .refresh {
                    margin: 0 -10px 0 16px;
                }
            }

            .md-list-item-text {
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 16px;

                span {
                    font-size: 16px;
                }
            }
        }
    }
</style>
