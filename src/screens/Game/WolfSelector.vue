<template>
  <ScreenContainer :className="'game-container'">
    <SpeechText>狼人張開眼</SpeechText>
    <HintText>[主持請選擇狼人]</HintText>
    <NumberCardList
      :numberList="numberList"
      :selected="selected"
      :onSelect="onSelectNum"
      :disableList="[]"
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

export default {
  name: 'WolfSelector',
  components: {
    ScreenContainer,
    SpeechText,
    HintText,
    NumberCardList,
    NextButton,
  },
  data: () => ({
    selected: [],
    total: 0,
    label: '',
  }),
  computed: {
    ...mapGetters({
      players: 'game/players',
      badCharacter: 'setup/badCharacter',
      playerCount: 'setup/playerCount',
      playerTotal: 'setup/playerTotal',
    }),
    buttonDisable: function() {
      return this.total - this.selected.length > 0;
    },
    numberList: function() {
      return [...Array(this.playerTotal).keys()].map(i => i + 1);
    }
  },
  created: function() {
    const selectedPlayers = this.players.filter((x) => x && x.name === characterNames.wolf);
    if (selectedPlayers.length > 0) {
      this.selected = selectedPlayers.map((x) => x.no);
    }
    this.total = this.playerCount.bad;
    if (this.total - this.selected.length > 0) {
      this.label = '剩餘 ' + (this.total - this.selected.length);
    } else {
      this.label = '下一步';
    }
  },
  methods: {
    ...mapActions('game', ['assignCharacter', 'nextNight']),
    onSelectNum: function(num) {
      if (this.selected.includes(num)) {
        this.selected = this.selected.filter((item) => item !== num);
      } else if (this.selected.length < this.total) {
        this.selected.push(num);
      }

      if (this.selected.length == this.total) {
        this.label = '下一步';
      } else {
        this.label = '剩餘 ' + (this.total - this.selected.length);
      }
    },
    onConfirm: function() {
      this.assignCharacter({ name: characterNames.wolf, noList: this.selected });
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
