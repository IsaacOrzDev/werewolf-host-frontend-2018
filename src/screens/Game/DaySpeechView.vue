<template>
  <div>
    <div class="start-container">
      <SpeechText v-for="speech in daySpeech" :key="speech">{{speech}}</SpeechText>
    </div>
    <NextButton :label="shouldGoToNextRound ? '進入天黑' : '下一步'" @click="onConfirm()" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SpeechText from '@/components/text/SpeechText';
import NextButton from '@/components/buttons/NextButton';
import { GameRoutes, MainRoutes } from '@/configs/routeNames';

export default {
  name: 'DaySpeechView',
  components: {
    SpeechText,
    NextButton,
  },
  computed: {
    ...mapGetters({
      daySpeech: 'game/daySpeech',
      shouldGoToNextRound: 'game/shouldGoToNextRound',
      incompleteDayActions: 'game/incompleteDayActions',
    }),
  },
  methods: {
    ...mapActions('game', ['nextRound', 'doDayAction', 'setDaySpeech']),
    onConfirm() {
      if (this.incompleteDayActions.length > 0) {
        this.setDaySpeech([]);
        this.doDayAction();
      } else if (this.shouldGoToNextRound) {
        this.nextRound();
      } else {
        this.$router.replace(`${MainRoutes.game}/${GameRoutes.day}`);
      }
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.start-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
