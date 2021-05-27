<template>
  <div class="main-container">
    <p class="title">
      <img src="@/assets/good_icon.png" />
      總數: {{playerCount.good}}
    </p>
    <div class="character-list">
      <md-button
        md-with-hover
        v-for="character in characters"
        class="md-fab-bottom-center character"
        :style="{backgroundImage: 'url(' + require('@/assets/character/' + character.image) + ')'}"
        v-bind:key="character.name"
        v-bind:class="{ active: selectedTeam.includes(character.name)}"
        :disabled="character.name =='平民'"
        @click="toggleCharacter(character.name)"
      >
        <div v-if="character.name =='平民'" class="number">{{playerCount.good - selectedTeam.length}}</div>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import characters from '@/configs/characters';

export default {
  name: 'GoodSetup',
  data: () => ({
    characters: characters.filter((item) => item.team == 'good'),
    charactersMediaPath: './assets/character/',
    selectedTeam: [],
  }),
  components: {},
  computed: {
    ...mapGetters({
      playerCount: 'setup/playerCount',
      goodCharacter: 'setup/goodCharacter',
    }),
  },
  methods: {
    ...mapActions('setup', ['initGood']),
    toggleCharacter: function(name) {
      if (this.selectedTeam.includes(name)) {
        this.selectedTeam = this.selectedTeam.filter((item) => item !== name);
      } else {
        this.selectedTeam.push(name);
        if(this.selectedTeam.length +1 > this.playerCount.good){
            this.selectedTeam.shift();
        }
      }
      this.initGood(this.selectedTeam);
    },
  },
  created: function() {
    this.selectedTeam = [...this.goodCharacter];
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables.scss';
.main-container {
  padding: 0 5%;

  .title {
    font-size: 1.5rem;
    color: $color-tint;
  }

  .character-list {
    position: relative;

    .character {
      width: 30%;
      height: 21vh;
      margin: 1.5%;
      background-color: #444455;
      background-position: bottom;
      background-size: cover;
      background-repeat: no-repeat;
      border: 4px solid #000;

      &.active {
        border: 4px solid $color-tint;
      }

      .number {
        color: #fff;
        background: rgba(#000, 0.7);
        padding: 0.5rem 1rem;
        font-size: 2rem;
      }
    }
  }
}
</style>
