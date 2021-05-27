<template>
    <div class="main-container">
        <div class="info">
            <p class="title">
                <img src="@/assets/good_icon.png" />
                {{playerCount.good - selectedGoodTeam.length}}民{{selectedGoodTeam.length}}神
            </p>
            <p class="title">
                <img src="@/assets/bad_icon.png" />
                {{playerCount.bad}}狼
            </p>
        </div>
        <div class="character-list good-team">
            <md-button
                md-with-hover
                v-for="character in goodCharacters"
                class="md-fab-bottom-center character"
                :style="{backgroundImage: 'url(' + require('@/assets/character/' + character.image) + ')'}"
                v-bind:key="character.name"
                v-bind:class="{ active: selectedGoodTeam.includes(character.name)}"
                :disabled="character.name =='平民'"
                @click="toggleGoodCharacter(character.name)"
            >
                <div v-if="character.name =='平民'" class="number">{{playerCount.good - selectedGoodTeam.length}}名</div>
            </md-button>
        </div>
        <div class="border-line"></div>
        <div class="character-list bad-team">
            <md-button
                md-with-hover
                v-for="character in badCharacters"
                class="md-fab-bottom-center character"
                :style="{backgroundImage: 'url(' + require('@/assets/character/' + character.image) + ')'}"
                v-bind:key="character.name"
                v-bind:class="{ active: selectedBadTeam.includes(character.name)}"
                :disabled="character.name =='狼人'"
                @click="toggleBadCharacter(character.name)"
            >
                <div v-if="character.name =='狼人'" class="number">{{playerCount.bad - selectedBadTeam.length}}名  </div>
            </md-button>
        </div>
    </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import characters from '@/configs/characters';

  export default {
    name: 'FullSetup',
    data: () => ({
      goodCharacters: characters.filter((item) => item.team == 'good'),
      badCharacters: characters.filter((item) => item.team == 'bad'),
      charactersMediaPath: './assets/character/',
      selectedGoodTeam: [],
      selectedBadTeam: [],
    }),
    components: {},
    computed: {
      ...mapGetters({
        playerCount: 'setup/playerCount',
        goodCharacter: 'setup/goodCharacter',
        badCharacter: 'setup/badCharacter',
      }),
    },
    methods: {
      ...mapActions('setup', ['initGood','initBad']),
      toggleGoodCharacter: function(name) {
        if (this.selectedGoodTeam.includes(name)) {
          this.selectedGoodTeam = this.selectedGoodTeam.filter((item) => item !== name);
        } else {
          this.selectedGoodTeam.push(name);
          if(this.selectedGoodTeam.length +1 > this.playerCount.good){
            this.selectedGoodTeam.shift();
          }
        }
        this.initGood(this.selectedGoodTeam);
      },
      toggleBadCharacter: function(name) {
        if (this.selectedBadTeam.includes(name)) {
          this.selectedBadTeam = this.selectedBadTeam.filter((item) => item !== name);
        } else {
          this.selectedBadTeam.push(name);
          if(this.selectedBadTeam.length +1 > this.playerCount.bad){
            this.selectedBadTeam.shift();
          }
        }
        this.initBad(this.selectedBadTeam);
      },
    },
    created: function() {
      this.selectedGoodTeam = [...this.goodCharacter];
      this.selectedBadTeam = [...this.badCharacter];
    },
  };
</script>

<style lang="scss" scoped>
    @import '~@/scss/_variables.scss';
    .main-container {
        padding: 0 5%;

        .info {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;

            .title {
                margin: 0 3%;
                font-size: 1.5rem;
                color: $color-tint;
            }
        }

        .border-line {
            margin: 10px 0;
            width: 100%;
            height: 2px;
            background: $color-tint;
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
