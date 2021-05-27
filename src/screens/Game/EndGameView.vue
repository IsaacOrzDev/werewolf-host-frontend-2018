<template>
  <div>
    <div class="start-container">
      <SpeechText v-if="winner === 'good'">遊戲結束，好人勝利</SpeechText>
      <SpeechText v-if="winner === 'bad'">遊戲結束，壞人勝利</SpeechText>
      <SpeechText v-if="winner === 'draw'">遊戲結束，和局</SpeechText>
    </div>
    <!-- <Button class="again-button" label="完結" @click="reset('host')" /> -->
    <Button label="再開一局" @click="reset('host')" />
  </div>
</template>

<script>
import Button from '@/components/buttons/Button';
import { MainRoutes } from '@/configs/routeNames';
import { mapActions, mapGetters } from 'vuex';
import SpeechText from '@/components/text/SpeechText';

export default {
  name: 'EndGameView',
  components: {
    SpeechText,
    Button,
  },
  computed: {
    ...mapGetters({
      winner: 'game/winner',
    }),
  },
  methods: {
    ...mapActions('game', ['resetGame']),
    reset: function(route) {
      this.resetGame(MainRoutes[route]);
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
.again-button {
  margin-bottom: 10px;
}
</style>
