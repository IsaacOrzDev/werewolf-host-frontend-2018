<template>
  <ScreenContainer :className="'game-container'">
    <SpeechText>{{badCharacterSpeech}}狼人請選擇殺害對象</SpeechText>
    <HintText>[主持請選擇對象]</HintText>
    <HintText v-if="lastKill !== -1">[不能重複選擇{{lastKill}}號]</HintText>
    <NumberCardList
      :playerCount="playerTotal"
      :selected="[selected]"
      :onSelect="onSelectNum"
      :disableList="[...deadPlayers.map(x => x.no), lastKill]"
      mode="kill"
    />
    <NextButton :disabled="buttonDisable" :label="label" @click="onConfirm()" />
  </ScreenContainer>
</template>

<script>
import NextButton from '@/components/buttons/NextButton';
import ScreenContainer from '@/components/layout/ScreenContainer';
import NumberCardList from '@/components/NumberCardList';
import HintText from '@/components/text/HintText';
import SpeechText from '@/components/text/SpeechText';
import { characterNames } from '@/configs/characters';
import { mapActions, mapGetters } from 'vuex';
import { nightActionType } from '@/configs/actionType';

export default {
  name: 'WolfKillSelector',
  components: {
    ScreenContainer,
    SpeechText,
    HintText,
    NumberCardList,
    NextButton,
  },
  data: () => ({
    selected: -1,
    label: '下一步',
  }),
  computed: {
    ...mapGetters({
      badCharacter: 'setup/badCharacter',
      playerCount: 'setup/playerCount',
      playerTotal: 'setup/playerTotal',
      round: 'game/round',
      deadPlayers: 'game/deadPlayers',
      nightActions: 'game/nightActions',
    }),
    buttonDisable: function() {
      return this.selected === -1;
    },
    lastKill: function() {
      const lastKillAction = this.nightActions.find(
        (x) =>
          x.round === this.round - 1 &&
          x.name === characterNames.wolf &&
          x.action === nightActionType.wolfKill
      );
      if (lastKillAction) {
        return lastKillAction.target;
      }
      return -1;
    },
    badCharacterSpeech: function() {
      if(this.round == 0 && this.badCharacter.length > 0){
        return this.badCharacter.length > 1 ? '[主持請讓狼確認互相身份]' : this.badCharacter[0] + '請舉起手指公，';
      }
      return '';
    }
  },
  methods: {
    ...mapActions('game', ['addNightAction', 'nextNight']),
    onSelectNum: function(num) {
      this.selected = num;
    },
    onConfirm: function() {
      this.addNightAction({
        round: this.round,
        name: characterNames.wolf,
        target: this.selected,
        action: nightActionType.wolfKill,
      });
      this.nextNight();
    },
  },
};
</script>

<style lang="scss" scoped>
.game-container {
  background: linear-gradient(90deg, rgba(#111, 0.7) 0%, rgba(#111, 0.7) 100%),
    url(../../assets/bad.png);
  background-position: left top;
  background-repeat: no-repeat;
}
</style>
