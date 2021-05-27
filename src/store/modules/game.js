import { dayActionType, nightActionType } from '@/configs/actionType';
import { characterNames } from '@/configs/characters';
import { deadType } from '@/configs/deadType';
import gameMode from '@/configs/gameMode';
import { GameRoutes, MainRoutes } from '@/configs/routeNames';
import teams from '@/configs/teams';
import router from '@/router';
import apiService from '@/services/apiService';
import characterService from '@/services/characterService';
import commonService from '@/services/commonService';

const types = {
  SET_STATE: 'SET_STATE',
  SET_MODE: 'SET_MODE',
  SET_PLAYERS: 'SET_PLAYERS',
  SET_NIGHT_ROUTES: 'SET_NIGHT_ROUTES',
  SET_CURRENT_ROUTE: 'SET_CURRENT_ROUTE',
  SET_NIGHT_ACTIONS: 'SET_NIGHT_ACTIONS',
  SET_DAY_ACTIONS: 'SET_DAY_ACTIONS',
  SET_DAY_SPEECH: 'SET_DAY_SPEECH',
  SET_ROUND: 'SET_ROUND',
  SET_WINNER: 'SET_WINNER',
  SET_ITEMS: 'SET_ITEMS',
  SET_START_PLAYER: 'SET_START_PLAYER',
  SET_MATCH_ID: 'SET_MATCH_ID',
};

const state = {
  mode: gameMode.virtual,
  players: [],
  nightRoutes: [],
  currentRoute: '',
  nightActions: [],
  items: [],
  daySpeech: [],
  dayActions: [],
  round: 0,
  winner: 'unknown',
  startPlayer: 1,
};

const getters = {
  mode: (state) => state.mode,
  players: (state) => state.players,
  godPlayers: (state) =>
    state.players.filter((x) => x.team === teams.good && x.name !== characterNames.civilian),
  civilianPlayers: (state) => state.players.filter((x) => x.name === characterNames.civilian),
  wolfPlayers: (state) => state.players.filter((x) => x.team === teams.bad),
  deadPlayers: (state) => state.players.filter((x) => x && x.dead),
  firstPlayer: (state) => {
    const startPlayerIndex = state.startPlayer ? state.startPlayer - 1 : 0;
    let index;
    for (let i = 0; i < state.players.length; i++) {
      index = (i + startPlayerIndex) % state.players.length;
      if (state.players[index] && !state.players[index].dead) {
        return state.players[index];
      }
    }
    return null;
  },
  currentRoute: (state) => state.currentRoute,
  nightRoutes: (state) => state.nightRoutes,
  nightActions: (state) => state.nightActions,
  daySpeech: (state) => state.daySpeech,
  dayActions: (state) => state.dayActions,
  incompleteDayActions: (state) =>
    state.dayActions.filter((x) => x.round === state.round && x.target === -1),
  round: (state) => state.round,
  winner: (state) => state.winner,
  items: (state) => state.items,
  shouldGoToNextRound: (state) =>
    Boolean(
      state.dayActions.find(
        (x) => x.action === dayActionType.voted && x.round === state.round && x.done
      ) ||
        state.dayActions.find(
          (x) => x.action === dayActionType.knightKill && x.round === state.round && x.done
        )
    ),
};

const _isEndGame = (state) => {
  const { players } = state;
  let winner = '';
  const godPlayers = players.filter(
    (x) => x.team === teams.good && x.name !== characterNames.civilian && !x.dead
  );
  const civilianPlayers = players.filter((x) => x.name === characterNames.civilian && !x.dead);
  const wolfPlayers = players.filter((x) => x.team === teams.bad && !x.dead);
  if ((godPlayers.length === 0 || civilianPlayers.length === 0) && wolfPlayers.length === 0) {
    winner = teams.good;
  } else if (godPlayers.length === 0 || civilianPlayers.length === 0) {
    winner = teams.bad;
  } else if (wolfPlayers.length === 0) {
    winner = teams.good;
  }
  return winner;
};

const actions = {
  setMode({ commit }, mode) {
    commit(types.SET_MODE, mode);
  },
  initNightRoutes({ commit, rootState, state }) {
    const { goodCharacter, badCharacter } = rootState.setup;
    const { round, items, mode } = state;
    let routes = [GameRoutes.start];
    const wolf = characterService.getCharacter(characterNames.wolf);
    if (round === 0 && mode === gameMode.real) {
      routes.push(wolf.init.route);
      let badOrders = badCharacter.map((name) => {
        return characterService.getCharacter(name);
      });
      badOrders.sort((a, b) => {
        return a.nightOrder - b.nightOrder;
      });
      badOrders.forEach((c) => {
        routes.push(c.init.route);
      });
    }
    routes = routes.concat(wolf.nightActions.map((x) => x.route));
    let goodOrders = goodCharacter.map((name) => {
      return characterService.getCharacter(name);
    });
    goodOrders.sort((a, b) => {
      return a.nightOrder - b.nightOrder;
    });
    goodOrders.forEach((c) => {
      if (round === 0 && mode === gameMode.real) {
        routes.push(c.init.route);
      }
      c.nightActions.forEach((a) => {
        if (a.requiredItem) {
          const item = items.find((i) => i.name === c.name && i.item === a.requiredItem);
          if (!item || !item.used) {
            routes.push(a.route);
          }
        } else {
          routes.push(a.route);
        }
      });
    });
    commit(types.SET_NIGHT_ROUTES, routes);
  },
  setCurrentRoute({ commit }, route) {
    commit(types.SET_CURRENT_ROUTE, route);
  },
  addItem({ commit, state }, params) {
    const items = state.items.slice(0);
    items.push(params);
    commit(types.SET_ITEMS, items);
  },
  useItem({ commit, state }, params) {
    const items = state.items.slice(0);
    const index = items.findIndex((x) => x.name === params.name && x.item === params.item);
    items[index] = { ...params, used: true };
    commit(types.SET_ITEMS, items);
  },
  setPlayers({ commit }, players) {
    commit(types.SET_PLAYERS, players);
  },
  setupRoomPlayers({ dispatch, rootState }, roomInfo) {
    const userList = commonService.shuffle(roomInfo.Players);
    const { playerCount, goodCharacter, badCharacter } = rootState.setup;
    const civilianCharacter = Array(playerCount.good - goodCharacter.length).fill(
      characterNames.civilian
    );
    const wolfCharacter = Array(playerCount.bad - badCharacter.length).fill(characterNames.wolf);
    const characters = commonService.shuffle([
      ...goodCharacter,
      ...badCharacter,
      ...civilianCharacter,
      ...wolfCharacter,
    ]);
    let newPlayers = [];
    characters.forEach((character, index) => {
      const no = index + 1;
      newPlayers.push({
        name: userList[index].name,
        id: userList[index].id,
        no: no,
        character: character,
      });
    });
    dispatch('assignCharacters', newPlayers);
    apiService.updateRoom(roomInfo.RoomId, newPlayers);
    return newPlayers;
  },
  resetRoomPlayers({ dispatch }, roomInfo) {
    const userList = roomInfo.Players;
    let newPlayers = [];
    if (userList) {
      userList.forEach((character) => {
        newPlayers.push({
          name: character.name,
          id: character.id,
        });
      });
      apiService.updateRoom(roomInfo.RoomId, newPlayers);
    }
  },
  setState({ commit }, state) {
    commit(types.SET_STATE, state);
  },
  assignCharacters({ commit, state }, list) {
    let players = state.players.slice(0);
    list.forEach((player) => {
      const characterInfo = characterService.getCharacter(player.character);
      players[player.no - 1] = {
        no: player.no,
        team: characterInfo.team,
        name: player.character,
        dead: false,
        realName: player.name || 'unknown',
      };
      if (characterInfo.items) {
        const items = state.items.slice(0);
        characterInfo.items.forEach((item) => {
          items.push({
            name: characterInfo.name,
            item: item,
            used: false,
          });
        });
        commit(types.SET_ITEMS, items);
      }
    });
    commit(types.SET_PLAYERS, players);
  },
  assignCharacter({ commit, state }, params) {
    const { name, noList, realName } = params;
    const characterInfo = characterService.getCharacter(name);
    const players = state.players.slice(0);
    const exist = players.filter((x) => x && x.name === name);
    if (exist) {
      exist.forEach((x) => {
        players[x.no] = undefined;
      });
    }
    noList.forEach((num) => {
      players[num - 1] = {
        no: num,
        team: characterInfo.team,
        name: name,
        dead: false,
        realName: realName || 'unknown',
      };
      if (characterInfo.items) {
        const items = state.items.slice(0);
        characterInfo.items.forEach((item) => {
          items.push({
            name: name,
            item: item,
            used: false,
          });
        });
        commit(types.SET_ITEMS, items);
      }
    });
    commit(types.SET_PLAYERS, players);
  },
  addNightAction({ commit, state }, params) {
    const { round } = state;
    const nightActions = state.nightActions.slice(0);
    const index = nightActions.findIndex(
      (x) => x.name === params.name && x.action === params.action && x.round === round
    );
    if (index !== -1) {
      nightActions[index] = params;
    } else {
      nightActions.push({ ...params, round: state.round });
    }
    commit(types.SET_NIGHT_ACTIONS, nightActions);
  },
  fillCivilian({ commit, state, rootState }) {
    const { playerCount } = rootState.setup;
    const total = playerCount.good + playerCount.bad;
    let { players } = state;
    for (let i = 0; i < total; i++) {
      if (players[i] == undefined) {
        players[i] = {
          no: i + 1,
          team: teams.good,
          name: characterNames.civilian,
          dead: false,
        };
      }
    }
    commit(types.SET_PLAYERS, players);
  },
  nextNight({ commit, state, dispatch }) {
    const { nightRoutes, currentRoute, round, mode } = state;
    if (
      (mode === gameMode.virtual && nightRoutes.length === 0) ||
      (mode === gameMode.real && nightRoutes.length === 0)
    ) {
      router.replace(`${MainRoutes.game}/${GameRoutes.start}`);
      commit(types.SET_CURRENT_ROUTE, GameRoutes.start);
    } else {
      const currentIndex = nightRoutes.indexOf(currentRoute);
      if (currentIndex !== -1 && currentIndex + 1 < nightRoutes.length) {
        const nextRoute = nightRoutes[currentIndex + 1];
        router.replace(`${MainRoutes.game}/${nextRoute}`);
      } else if (currentIndex == nightRoutes.length - 1) {
        if (round === 0 && mode === gameMode.real) {
          dispatch('fillCivilian');
        }
        dispatch('endNight');
      }
    }
  },
  async endNight({ commit, dispatch, state }) {
    const { round } = state;
    let nightActions = state.nightActions.slice(0);
    let players = state.players.slice(0);
    const daySpeech = state.daySpeech.slice(0);
    const dayActions = state.dayActions.slice(0);
    daySpeech.push('天光了，所有人張開眼');
    let cureTarget = -1;
    nightActions
      .filter((action) => action.round === round)
      .forEach((action) => {
        switch (action.action) {
          case nightActionType.wolfKill:
            players[action.target - 1].dead = true;
            players[action.target - 1].deadRound = round;
            players[action.target - 1].deadType = deadType.wolfKill;
            break;
          case nightActionType.witchCure:
            players[action.target - 1].dead = false;
            players[action.target - 1].deadRound = -1;
            players[action.target - 1].deadType = '';
            cureTarget = action.target - 1;
            dispatch('useItem', { name: action.name, item: action.item });
            break;
          case nightActionType.witchPoison:
            players[action.target - 1].dead = true;
            players[action.target - 1].deadRound = round;
            players[action.target - 1].deadType = deadType.witchKill;
            dispatch('useItem', { name: action.name, item: action.item });
            break;
          case nightActionType.elderMute:
            daySpeech.push(`${action.target}號被禁言了`);
            break;
          case nightActionType.bearShout:
            const trainer = players.find(p => p.name === characterNames.trainer);
            if(!trainer.dead) {
              const livePlayers = players.filter((x) => !x.dead);
              const trainerIndex = livePlayers.findIndex(p => p.name === characterNames.trainer);
              const checkIndex = { left: trainerIndex - 1, right: trainerIndex + 1 };
              if (trainerIndex == 0) {
                checkIndex.left = livePlayers.length - 1;
              }
              if (trainerIndex == livePlayers.length - 1) {
                checkIndex.right = 0;
              }
              if(livePlayers[checkIndex.left].team == teams.bad || livePlayers[checkIndex.right].team == teams.bad) {
                daySpeech.push(`熊咆吼了`);
              } else {
                daySpeech.push(`熊沒有咆吼`);
              }
            } else {
              daySpeech.push(`熊沒有咆吼`);
            }
            break;
          case nightActionType.guard:
            const targetPlayer = players[action.target - 1];
            if(targetPlayer.dead && targetPlayer.deadRound == round && targetPlayer.deadType == deadType.wolfKill) {
              players[action.target - 1].dead = false;
              players[action.target - 1].deadRound = -1;
              players[action.target - 1].deadType = '';
            } else if(cureTarget == action.target - 1) {
              players[action.target - 1].dead = true;
              players[action.target - 1].deadRound = round;
              players[action.target - 1].deadType = deadType.guardCure;
            }
            break;
        }
      });
    commit(types.SET_PLAYERS, players);
    const winner = _isEndGame(state);
    if (winner !== '') {
      dispatch('endGame', winner);
      return;
    }
    const deadPlayers = players.filter((x) => x.dead && x.deadRound === round);
    if (deadPlayers.length > 0) {
      daySpeech.push(`尋晚${deadPlayers.map((x) => x.no).join('，')}號死了`);
      deadPlayers
        .filter((x) => x.deadType !== deadType.witchKill)
        .forEach((p) => {
          const deadCharacter = characterService.getCharacter(p.name);
          if (deadCharacter.dieActions) {
            dayActions.push({
              name: deadCharacter.name,
              target: -1,
              action: deadCharacter.dieActions[0].action,
              done: false,
              round,
            });
          }
        });
      commit(types.SET_DAY_ACTIONS, dayActions);
    } else {
      daySpeech.push(`尋晚沒有人死`);
    }
    commit(types.SET_DAY_SPEECH, daySpeech);
    router.replace(`${MainRoutes.game}/${GameRoutes.daySpeech}`);
    //If first night
    // if (round == 0) {
    //   let startPlayer = Math.floor(Math.random() * players.length + 1);
    //   commit(types.SET_START_PLAYER, startPlayer);
    //   let resp = await apiService.addMatch(state);
    //   commit(types.SET_MATCH_ID, resp.matchId);
    // }
  },
  setDaySpeech({ commit }, speech) {
    commit(types.SET_DAY_SPEECH, speech);
  },
  addDayAction({ commit, state }, params) {
    const { round } = state;
    const dayActions = state.dayActions.slice(0);
    dayActions.push({ ...params, round: round });
    commit(types.SET_DAY_ACTIONS, dayActions);
  },
  addOrReplaceDayAction({ commit, state }, params) {
    const { round } = state;
    const dayActions = state.dayActions.slice(0);
    const index = dayActions.findIndex(
      (x) => x.name === params.name && x.action === params.action && x.round === round
    );
    if (index !== -1) {
      dayActions[index] = params;
    } else {
      dayActions.push({ ...params });
    }
    commit(types.SET_DAY_ACTIONS, dayActions);
  },
  deleteDayAction({ commit, state }, params) {
    const { round } = state;
    let dayActions = state.dayActions.slice(0);
    const index = dayActions.findIndex(
      (x) => x.name === params.name && x.action === params.action && x.round === round
    );
    if (index !== -1) {
      dayActions = [...dayActions.slice(0, index), ...dayActions.slice(index + 1)];
      commit(types.SET_DAY_ACTIONS, dayActions);
    }
  },
  doDayAction({ commit, dispatch, state, getters }) {
    const { round } = state;
    const daySpeech = state.daySpeech.slice(0);
    let dayActions = state.dayActions.slice(0);
    let players = state.players.slice(0);
    const currentRoundActions = dayActions.filter((x) => x.round === round && !x.done);
    if (currentRoundActions.length > 0) {
      const action = currentRoundActions[0];
      if (action.target === -1 && !action.done) {
        const activeCharacter = characterService.getCharacter(action.name);
        router.replace(activeCharacter.dieActions[0].route);
      } else {
        const actionIndex = dayActions.findIndex((a) => a === action);
        switch (action.action) {
          case dayActionType.voted:
            players[action.target - 1].dead = true;
            players[action.target - 1].deadRound = action.round;
            players[action.target - 1].deadType = deadType.voteToKill;
            daySpeech.push(`${action.target}號被投票處決`);
            daySpeech.push(`${action.target}號請發表遺言`);
            break;
          case dayActionType.hunterShot:
            players[action.target - 1].dead = true;
            players[action.target - 1].deadRound = action.round;
            players[action.target - 1].deadType = deadType.hunterKill;
            break;
          case dayActionType.wolfKingShot:
            players[action.target - 1].dead = true;
            players[action.target - 1].deadRound = action.round;
            players[action.target - 1].deadType = deadType.wolfKingKill;
            break;
          case dayActionType.knightKill:
            if (players[action.target - 1].team === teams.good) {
              const knightIndex = players.findIndex((x) => x.name === characterNames.knight);
              players[knightIndex].dead = true;
              players[knightIndex].deadRound = action.round;
              players[knightIndex].deadType = deadType.knightKill;
              daySpeech.push(`${action.target}號不是狼人，${players[knightIndex].name}以死謝罪`);
              action.target = -1;
              action.action = dayActionType.knightSuicide;
            } else {
              players[action.target - 1].dead = true;
              players[action.target - 1].deadRound = action.round;
              players[action.target - 1].deadType = deadType.knightKill;
              daySpeech.push(`${action.target}號是狼人`);
            }
        }
        commit(types.SET_PLAYERS, players);
        action.done = true;
        dayActions[actionIndex] = action;
        commit(types.SET_DAY_ACTIONS, dayActions);
        commit(types.SET_DAY_SPEECH, daySpeech);
        const winner = _isEndGame(state);
        if (winner !== '') {
          dispatch('endGame', winner);
          return;
        }
        switch (action.action) {
          case dayActionType.voted:
          case dayActionType.hunterShot:
          case dayActionType.wolfKingShot:
          case dayActionType.knightKill:
            // eslint-disable-next-line no-case-declarations
            const deadPlayer = players.find((x) => x.no === action.target);
            if (deadPlayer) {
              const character = characterService.getCharacter(deadPlayer.name);
              if (character.dieActions) {
                router.replace(character.dieActions[0].route);
                return;
              }
            }
            break;
          default:
            break;
        }
        // if (getters.shouldGoToNextRound) {
        //   dispatch('nextRound');
        //   return;
        // }
        if (daySpeech.length === 0) {
          router.replace(`${MainRoutes.game}/${GameRoutes.day}`);
        } else {
          router.replace(`${MainRoutes.game}/${GameRoutes.daySpeech}`);
        }
      }
    } else {
      router.replace(`${MainRoutes.game}/${GameRoutes.day}`);
    }
  },
  nextRound({ commit, state }) {
    const { round } = state;
    commit(types.SET_ROUND, round + 1);
    commit(types.SET_NIGHT_ROUTES, []);
    commit(types.SET_DAY_SPEECH, []);
    router.replace(`${MainRoutes.game}/${GameRoutes.start}`);
  },
  endGame({ state, commit }, winner) {
    let playersResult = [];
    state.players.forEach((player) => {
      playersResult.push({ ...player, winner: winner });
    });
    apiService.saveRecord(playersResult);
    commit(types.SET_WINNER, winner);
    router.replace(`${MainRoutes.game}/${GameRoutes.endGame}`);
  },
  resetGame({ commit }, route) {
    commit(types.SET_PLAYERS, []);
    commit(types.SET_NIGHT_ROUTES, []);
    commit(types.SET_CURRENT_ROUTE, '');
    commit(types.SET_NIGHT_ACTIONS, []);
    commit(types.SET_DAY_SPEECH, []);
    commit(types.SET_DAY_ACTIONS, []);
    commit(types.SET_ROUND, 0);
    commit(types.SET_ITEMS, []);
    commit(types.SET_WINNER, '');
    commit(types.SET_START_PLAYER, 1);
    if (route) {
      router.replace(route);
    }
  },
};

const mutations = {
  [types.SET_STATE](state, obj) {
    state.players = obj.players;
    state.nightRoutes = obj.nightRoutes;
    state.currentRoute = obj.currentRoute;
    state.nightActions = obj.nightActions;
    state.dayActions = obj.dayActions;
    state.daySpeech = obj.daySpeech;
    state.round = obj.round;
    state.winner = obj.winner;
    state.items = obj.items;
    state.startPlayer = obj.startPlayer;
    state.matchId = obj.matchId;
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_PLAYERS](state, list) {
    state.players = list;
  },
  [types.SET_NIGHT_ROUTES](state, routes) {
    state.nightRoutes = routes;
  },
  [types.SET_CURRENT_ROUTE](state, route) {
    state.currentRoute = route;
  },
  [types.SET_NIGHT_ACTIONS](state, actions) {
    state.nightActions = actions;
  },
  [types.SET_DAY_ACTIONS](state, actions) {
    state.dayActions = actions;
  },
  [types.SET_DAY_SPEECH](state, speech) {
    state.daySpeech = speech;
  },
  [types.SET_ROUND](state, round) {
    state.round = round;
  },
  [types.SET_WINNER](state, winner) {
    state.winner = winner;
  },
  [types.SET_ITEMS](state, items) {
    state.items = items;
  },
  [types.SET_START_PLAYER](state, startPlayer) {
    state.startPlayer = startPlayer;
  },
  [types.SET_MATCH_ID](state, id) {
    state.matchId = id;
  },
};

const game = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default game;
