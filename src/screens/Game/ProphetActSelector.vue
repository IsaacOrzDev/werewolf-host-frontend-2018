<template>
  <ScreenContainer :className="'game-container'">
    <SpeechText>預言家請選擇查看的對象</SpeechText>
    <HintText v-if="characterPlayer && !characterPlayer.dead">[主持請選擇對象]</HintText>
    <HintText v-if="characterPlayer && characterPlayer.dead">[由於預言家已死，所以不能發動能力]</HintText>
    <NumberCardList
      v-if="characterPlayer && !characterPlayer.dead"
      :playerCount="playerTotal"
      :selected="[selected]"
      :onSelect="onSelectNum"
      :disableList="deadPlayers.map(x => x.no)"
      :players="players"
      mode="check"
    />
    <NextButton :disabled="buttonDisable" label="下一步" @click="onConfirm()" />
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
  name: 'ProphetActSelector',
  components: {
    ScreenContainer,
    SpeechText,
    HintText,
    NumberCardList,
    NextButton,
  },
  data: () => ({
    selected: -1,
    characterPlayer: null,
  }),
  computed: {
    ...mapGetters({
      players: 'game/players',
      badCharacter: 'setup/badCharacter',
      playerCount: 'setup/playerCount',
      playerTotal: 'setup/playerTotal',
      deadPlayers: 'game/deadPlayers',
    }),
    buttonDisable: function() {
      if (this.characterPlayer && this.characterPlayer.dead) {
        return false;
      }
      return this.selected === -1;
    },
  },
  methods: {
    ...mapActions('game', ['addNightAction', 'nextNight']),
    onSelectNum: function(num) {
      this.selected = num;
    },
    onConfirm: function() {
      this.addNightAction({
        name: characterNames.prophet,
        target: this.selected,
        action: nightActionType.prophetCheck,
      });
      this.nextNight();
    },
  },
  created() {
    this.characterPlayer = this.players.find((x) => x && x.name === characterNames.prophet);
  },
};
</script>

<style lang="scss" scoped>
</style>