import apiService from '@/services/apiService';

const types = {
  INIT_COUNT: 'INIT_COUNT',
  INIT_GOOD: 'INIT_GOOD',
  INIT_BAD: 'INIT_BAD',
  SET_ROOM_ID: 'SET_ROOM_ID',
  INIT_ROOM: 'INIT_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  EXIT_ROOM: 'EXIT_ROOM',
};

const state = {
  playerCount: {
    good: 1,
    bad: 1,
  },
  goodCharacter: [],
  badCharacter: [],
  roomId: null,
  playerId: null,
  playerName: null,
};

const getters = {
  playerCount: (state) => state.playerCount,
  goodCharacter: (state) => state.goodCharacter,
  badCharacter: (state) => state.badCharacter,
  playerTotal: (state) => state.playerCount.good + state.playerCount.bad,
  roomId: (state) => state.roomId,
  playerId: (state) => state.playerId,
  playerName: (state) => state.playerName,
};

const actions = {
  initCount({ commit }, params) {
    commit(types.INIT_COUNT, params);
  },
  initGood({ commit }, params) {
    commit(types.INIT_GOOD, [...params]);
  },
  initBad({ commit }, params) {
    commit(types.INIT_BAD, [...params]);
  },
  initTestingData({ commit }) {
    commit(types.INIT_COUNT, { good: 2, bad: 1 });
    commit(types.INIT_GOOD, ['獵人']);
    // commit(types.INIT_GOOD, ['獵人', '預言家', '女巫', '騎士']);
    // commit(types.INIT_BAD, ['狼王']);
  },
  setRoomId({ commit }, id) {
    commit(types.SET_ROOM_ID, id);
  },
  async initRoom({ commit }) {
    const roomId = await apiService.createRoom();
    commit(types.INIT_ROOM, roomId);
  },
  async joinRoom({ commit }, params) {
    const { roomId, name } = params;
    const player = await apiService.joinRoom(roomId, name);
    commit(types.JOIN_ROOM, { roomId, playerId: player.id, playerName: name });
  },
  exitRoom({ commit }) {
    commit(types.EXIT_ROOM);
    // router.back();
  },
};

const mutations = {
  [types.INIT_COUNT](state, params) {
    state.playerCount = params;
  },
  [types.INIT_GOOD](state, params) {
    state.goodCharacter = params || [];
  },
  [types.INIT_BAD](state, params) {
    state.badCharacter = params || [];
  },
  [types.SET_ROOM_ID](state, id) {
    state.playerId = null;
    state.roomId = id;
  },
  [types.INIT_ROOM](state, roomId) {
    state.playerId = null;
    state.roomId = roomId;
  },
  [types.JOIN_ROOM](state, obj) {
    state.playerId = obj.playerId;
    state.playerName = obj.playerName;
    state.roomId = obj.roomId;
  },
  [types.EXIT_ROOM](state) {
    state.playerId = null;
    state.roomId = null;
  },
};

const setup = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default setup;
