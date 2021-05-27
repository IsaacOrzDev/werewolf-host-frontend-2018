<template>
  <ScreenContainer :className="'game-container'">
    <SpeechText v-if="character">{{character.init.speech}}</SpeechText>
    <HintText v-if="character">{{character.init.hint}}</HintText>
    <NumberCardList
      :numberList="numberList"
      :selected="[selected]"
      :onSelect="onSelectNum"
      :disableList="disableList"
    />
    <NextButton :disabled="buttonDisable" :label="label" @click="onConfirm()" />
  </ScreenContainer>
</template>

<script>
import ScreenContainer from '@/components/layout/ScreenContainer';
import SelectInput from '@/components/SelectInput';
import SpeechText from '@/components/text/SpeechText';
import HintText from '@/components/text/HintText';
import NumberCardList from '@/components/NumberCardList';
import NextButton from '@/components/buttons/NextButton';
import teams from '@/configs/teams';
import { mapGetters, mapActions } from 'vuex';
import { characterNames } from '@/configs/characters';
import characterService from '@/services/characterService';

export default {
  name: 'GodSelector',
  components: {
    ScreenContainer,
    SpeechText,
    HintText,
    NumberCardList,
    NextButton,
  },
  props: {
    name: {
      type: String,
    },
  },
  data: () => ({
    selected: -1,
    label: '下一步',
  }),
  computed: {
    ...mapGetters({ players: 'game/players', playerTotal: 'setup/playerTotal' }),
    buttonDisable: function() {
      return this.selected === -1;
    },
    character: function() {
      return characterService.getCharacter(this.name);
    },
    numberList: function() {
      let numberList = [];
      if(this.character.team == teams.bad) {
        numberList = this.players.filter((x) => x && x.team === teams.bad).map(item => item.no);
      } else {
        numberList = [...Array(this.playerTotal).keys()].map(i => i + 1);
      }
      return numberList;
    },
    disableList: function() {
      let disableList = [];
      if(this.character.team == teams.bad) {
        disableList = this.players.filter((x) => x && x.name != characterNames.wolf).map(item => item.no);
      } else {
        disableList = this.players.filter(x => x && x.name !== name).map(item => item.no);
      }
      return disableList;
    }
  },
  created: function() {
    const selectedPlayer = this.players.find((x) => x && x.name === this.name);
    if (selectedPlayer) {
      this.selected = selectedPlayer.no;
    }
  },
  methods: {
    ...mapActions('game', ['assignCharacter', 'nextNight']),
    onSelectNum: function(num) {
      this.selected = num;
    },
    onConfirm: function() {
      this.assignCharacter({ name: this.name, noList: [this.selected] });
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
