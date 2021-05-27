<template>
  <div>
    <div class="start-container">
      <SpeechText>天黑了，所有人眯上眼</SpeechText>
    </div>
    <NextButton label="下一步" @click="nextNight()" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SpeechText from '@/components/text/SpeechText';
import NextButton from '@/components/buttons/NextButton';

export default {
  name: 'StartGame',
  components: {
    SpeechText,
    NextButton,
  },
  computed: {
    ...mapGetters({
      round: 'game/round',
      players: 'game/players',
      nightRoutes: 'game/nightRoutes',
      playerCount: 'setup/playerTotal',
    }),
  },
  methods: {
    ...mapActions('game', ['initNightRoutes', 'nextNight']),
    ...mapActions('setup', ['initTestingData']),
  },
  created() {
    if (this.nightRoutes.length === 0) {
      this.initNightRoutes();
    }
  },
};
</script>

<style lang="scss" scoped>
.start-container {
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
