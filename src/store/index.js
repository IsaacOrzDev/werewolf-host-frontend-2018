import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import setup from './modules/setup';
import game from './modules/game';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    setup,
    game,
  },
  strict: debug,
  plugins: [
    createPersistedState({
      paths: ['setup', 'game'],
    }),
  ],
});

export default store;
