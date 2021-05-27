<template>
  <ScreenContainer :className="'game-container'">
    <SpeechText>禁言長老請選擇禁言對象</SpeechText>
    <HintText>[主持請選擇對象，可不選擇]</HintText>
    <HintText v-if="lastMute !== -1">[不能重複選擇{{lastMute}}號]</HintText>
    <NumberCardList
      :playerCount="playerTotal"
      :selected="[selected]"
      :onSelect="onSelectNum"
      :disableList="[...deadPlayers.map(x => x.no), lastMute]"
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
  name: 'ElderActSelector',
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
    lastMute: function() {
      const lastAction = this.nightActions.find(
        (x) =>
          x.round === this.round - 1 &&
          x.name === characterNames.elder &&
          x.action === nightActionType.elderMute
      );
      if (lastAction) {
        return lastAction.target;
      }
      return -1;
    },
  },
  methods: {
    ...mapActions('game', ['addNightAction', 'nextNight']),
    onSelectNum: function(num) {
      if (this.selected === num) {
        this.selected = -1;
      } else {
        this.selected = num;
      }
    },
    onConfirm: function() {
      if (this.selected !== -1) {
        this.addNightAction({
          round: this.round,
          name: characterNames.elder,
          target: this.selected,
          action: nightActionType.elderMute,
        });
      }
      this.nextNight();
    },
  },
};
</script>

<style lang="scss" scoped>
.game-container {
  /* background: linear-gradient(90deg, rgba(#111, 0.7) 0%, rgba(#111, 0.7) 100%),
    url(../../assets/bad.png); */
  background-position: left top;
  background-repeat: no-repeat;
}
</style>
