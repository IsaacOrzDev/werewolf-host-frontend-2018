<template>
  <ScreenContainer :className="'game-container'">
    <SpeechText v-if="characterPlayer">{{characterPlayer.no}}號死了，請發動能力</SpeechText>
    <!-- <HintText>[獵人發動能力，將一位玩家槍殺]</HintText> -->
    <HintText>[主持請選擇對象，可以不選擇]</HintText>
    <NumberCardList
      :playerCount="playerTotal"
      :selected="[selected]"
      :onSelect="onSelectNum"
      :disableList="deadPlayers.map(x => x.no)"
      mode="kill"
    />
    <NextButton :disabled="false" :label="label" @click="onConfirm()" />
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
import { dayActionType } from '@/configs/actionType';

export default {
  name: 'HunterActSelector',
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
    characterPlayer: null,
  }),
  computed: {
    ...mapGetters({
      badCharacter: 'setup/badCharacter',
      playerCount: 'setup/playerCount',
      playerTotal: 'setup/playerTotal',
      round: 'game/round',
      players: 'game/players',
      deadPlayers: 'game/deadPlayers',
    }),
  },
  created: function() {
    this.characterPlayer = this.players.find((x) => x.name === characterNames.hunter);
  },
  methods: {
    ...mapActions('game', ['addOrReplaceDayAction', 'doDayAction', 'deleteDayAction']),
    onSelectNum: function(num) {
      if (this.selected === num) {
        this.selected = -1;
      } else {
        this.selected = num;
      }
    },
    onConfirm: function() {
      if (this.selected !== -1) {
        this.addOrReplaceDayAction({
          round: this.round,
          name: characterNames.hunter,
          target: this.selected,
          action: dayActionType.hunterShot,
        });
      } else {
        this.deleteDayAction({
          name: characterNames.hunter,
          action: dayActionType.hunterShot,
        });
      }
      this.doDayAction();
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
