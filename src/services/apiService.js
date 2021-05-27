import axios from 'axios';

const basePath = 'https://api.thomaswong.site';

const createRoom = (state) => {
  const app = "/room/";
  const data = {};
  return new Promise((resolve, reject) => {
    axios.post(basePath + app, data).then((res) => {
      if(res.status == 201) {
        let result = res.data.RoomId;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const updateRoom = (roomId, players) => {
  const app = "/room/";
  const data = {
    players: players
  };
  return new Promise((resolve, reject) => {
    axios.put(basePath + app + roomId, data).then((res) => {
      if(res.status == 200) {
        let result = res.data.RoomId;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const getRoom = (roomId) => {
  const app = "/room/";
  const data = {};
  return new Promise((resolve, reject) => {
    axios.get(basePath + app + roomId, data).then((res) => {
      if(res.status == 200) {
        let result = res.data.Item;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const joinRoom = (roomId, name) => {
  const app = "/join/";
  const data = {name: name};
  return new Promise((resolve, reject) => {
    axios.post(basePath + app + roomId, data).then((res) => {
      if(res.status == 200) {
        let result = res.data;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const kickRoom = (roomId, playerIndex) => {
  const app = "/kick/";
  const data = {index: playerIndex};
  return new Promise((resolve, reject) => {
    axios.post(basePath + app + roomId, data).then((res) => {
      if(res.status == 200) {
        let result = res.data.Attributes;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const getMatch = (matchId) => {
  const app = "/match/";
  return new Promise((resolve, reject) => {
    axios.get(basePath + app + matchId, ).then((res) => {
      if(res.status == 200) {
        let result = res.data.Item;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const addMatch = (state) => {
  const app = "/match/";
  const data = {
    state: {...state, },
    group: 'ccc'
  }
  return new Promise((resolve, reject) => {
    axios.post(basePath + app, data).then((res) => {
      if(res.status == 201) {
        let result = res.data.MatchId;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const saveRecord = (players) => {
  const app = "/record/";
  const data = {
    players: players,
    group: 'ccc'
  }
  return new Promise((resolve, reject) => {
    axios.post(basePath + app, data).then((res) => {
      if(res.status == 200) {
        let result = res.data.MatchId;
        resolve(result)
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const apiService = {
  getMatch,
  addMatch,
  saveRecord,
  createRoom,
  getRoom,
  joinRoom,
  kickRoom,
  updateRoom
}

export default apiService;
