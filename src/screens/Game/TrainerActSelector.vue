<template>
    <ScreenContainer :className="'game-container'">
        <SpeechText>[馴熊師無需任何動作]</SpeechText>
        <NextButton :label="label" @click="onConfirm()"/>
    </ScreenContainer>
</template>

<script>
  import NextButton from '@/components/buttons/NextButton';
  import ScreenContainer from '@/components/layout/ScreenContainer';
  import SpeechText from '@/components/text/SpeechText';
  import { nightActionType } from '@/configs/actionType';
  import { characterNames } from '@/configs/characters';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'TrainerActSelector',
    components: {
      ScreenContainer,
      SpeechText,
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
    },
    methods: {
      ...mapActions('game', ['addNightAction', 'nextNight']),
      onConfirm: function() {
        this.addNightAction({
          round: this.round,
          target: -1,
          name: characterNames.trainer,
          action: nightActionType.bearShout,
        });
        this.nextNight();
      },
    },
    created() {
      this.onConfirm();
    }
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
