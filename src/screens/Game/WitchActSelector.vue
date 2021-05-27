<template>
  <ScreenContainer :className="'game-container'">
    <div v-if="skill === 'cure'">
      <SpeechText v-if="characterPlayer && !characterPlayer.dead">今晚[{{killed}}號]死了</SpeechText>
      <SpeechText>女巫要使用解藥嗎？</SpeechText>
      <HintText v-if="characterPlayer && !characterPlayer.dead && canUseCure">[主持請選擇是或否]</HintText>
      <HintText v-if="characterPlayer && characterPlayer.dead">[由於女巫已死，所以不能發動能力]</HintText>
      <HintText v-if="!canUseCure">[女巫只能第一晚自救，所以不能發動能力]</HintText>
      <SelectInput
        v-if="characterPlayer && !characterPlayer.dead && canUseCure"
        :options="options"
        :onSelect="selectCureYesNo"
        :value="useCure"
      />
    </div>
    <div v-if="skill === 'poison'">
      <SpeechText>女巫要使用毒藥嗎？</SpeechText>
      <HintText v-if="characterPlayer && !characterPlayer.dead && canUsePoison">[主持請選擇對象，可以不選擇]</HintText>
      <HintText v-if="characterPlayer && characterPlayer.dead">[由於女巫已死，所以不能發動能力]</HintText>
      <HintText v-if="!canUsePoison">[由於女巫已使用解藥，所以不能發動能力]</HintText>
      <NumberCardList
        v-if="characterPlayer && !characterPlayer.dead && canUsePoison"
        :playerCount="playerTotal"
        :selected="[poisonTarget]"
        :onSelect="onSelectNumForPoison"
        :disableList="deadPlayers.map(x => x.no)"
        mode="kill"
      />
    </div>
    <NextButton :disabled="false" label="下一步" @click="onConfirm()" />
  </ScreenContainer>
</template>

<script>
import NextButton from '@/components/buttons/NextButton';
import ScreenContainer from '@/components/layout/ScreenContainer';
import NumberCardList from '@/components/NumberCardList';
import HintText from '@/components/text/HintText';
import SpeechText from '@/components/text/SpeechText';
import SelectInput from '@/components/SelectInput';
import { characterNames } from '@/configs/characters';
import { mapActions, mapGetters } from 'vuex';
import { nightActionType } from '@/configs/actionType';

export default {
  name: 'WitchActSelector',
  components: {
    ScreenContainer,
    SpeechText,
    HintText,
    NumberCardList,
    NextButton,
    SelectInput,
  },
  props: {
    skill: {
      type: String,
    },
  },
  data: () => ({
    options: [{ label: '是', value: 'y' }, { label: '否', value: 'n' }],
    killed: -1,
    useCure: '',
    poisonTarget: -1,
    characterPlayer: null,
  }),
  computed: {
    ...mapGetters({
      playerCount: 'setup/playerCount',
      playerTotal: 'setup/playerTotal',
      nightActions: 'game/nightActions',
      players: 'game/players',
      deadPlayers: 'game/deadPlayers',
      round: 'game/round',
    }),
    canUseCure: function() {
      if (this.round > 0 && this.characterPlayer && this.killed === this.characterPlayer.no) {
        return false;
      }
      return true;
    },
    canUsePoison: function() {
      const cureAction = this.nightActions.find(
        (x) =>
          x.round === this.round &&
          x.name === characterNames.witch &&
          x.action === nightActionType.witchCure
      );
      if (cureAction) {
        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions('game', ['addNightAction', 'nextNight']),
    selectCureYesNo(value) {
      this.useCure = value;
    },
    onConfirm: function() {
      if (this.skill === 'cure' && this.useCure === 'y') {
        this.addNightAction({
          name: characterNames.witch,
          target: this.killed,
          action: nightActionType.witchCure,
          item: 'cure',
        });
      }
      if (this.skill === 'poison' && this.poisonTarget !== -1) {
        this.addNightAction({
          name: characterNames.witch,
          target: this.poisonTarget,
          action: nightActionType.witchPoison,
          item: 'poison',
        });
      }
      this.nextNight();
    },
    onSelectNumForPoison: function(num) {
      if (this.poisonTarget === num) {
        this.poisonTarget = -1;
      } else {
        this.poisonTarget = num;
      }
    },
  },
  created() {
    this.characterPlayer = this.players.find((x) => x && x.name === characterNames.witch);
    if (this.skill === 'cure') {
      const killAction = this.nightActions.find(
        (x) =>
          x.name === characterNames.wolf &&
          x.action === nightActionType.wolfKill &&
          x.round === this.round
      );
      if (killAction) {
        this.killed = killAction.target;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
