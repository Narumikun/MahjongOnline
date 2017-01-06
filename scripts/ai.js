require('../scripts/constants');


var AI = {};

AI.general = function (state, callback, wait_for_user) {
  // 游戏AI，比较垃圾
  var actions = state.actions;
  if (actions.length == 0) {
    return null;
  }
  // mylog(state.user_id+"'s"+'actions'+actions);
  // mylog(state.user_id+"'s"+'handtiles'+state.hand_tiles[0]);
  var action = 0, tile = -1;
  if (actions.indexOf(ACTION_S.Win) >= 0) {
    action = ACTION_S.Win;
  }
  else if (actions.length == 1) {
    action = actions[0];
  }
  else if (actions.length > 1) {
    var len = actions.indexOf(ACTION_S.Pass) >= 0 ? actions.length - 1 : actions.length;
    action = actions[Math.floor(Math.random() * len)];
  }
  // select chow_tile or discard_tile
  if (action == ACTION_S.Chow) {
    tile = Math.floor(Math.random() * Math.floor(state.option_tiles.length / 3));
  }
  else if (action == ACTION_S.Discard) {
    tile = state.hand_tiles[0][Math.floor(Math.random() * state.hand_tiles[0].length)]
  }
  var message = {
    'user_id': state.user_id,
    'room_id': state.room_id,
    'action': action,
    'tile': tile
  };
  if (action >= 0) {
    setTimeout(function () {
      callback(null, message);
    }, AI_TIME + wait_for_user * (TIME_OUT - 1000));
  }
};

AI.colocation = function (room_id, callback) {
  // 用户掉线或超时时托管，更垃圾
  var RoomModel = require('./room');
  RoomModel.queryOneRoom({room_id: room_id}, function (err, room) {
    if (err) {
      callback(err, null);
      return false;
    }
    if (!room) {
      callback(new Error('ROOMNULL'), null);
      return false;
    }

    var active_users = [];
    for (var i = 0; i < 4; i++) {
      if (room.next_players[i].actions.length != 0) {
        active_users.push(i);
      }
    }

    for (var i = 0; i < active_users.length; i++) {//actions, optiontiles

      var actions = room.next_players[active_users[i]].actions, action = -1, tile = -1;
      if (actions.length != 0) {
        // 获取默认操作 Pass or Discard最后一张牌
        if (actions.indexOf(ACTION_S.Pass) >= 0) {
          action = ACTION_S.Pass;
        }
        else if (actions.indexOf(ACTION_S.Discard) >= 0) {
          action = ACTION_S.Discard;
          var hand_tile = room.hand_tiles[active_users[i]];
          tile = hand_tile[hand_tile.length - 1];
        }
        else {
          mylog('err, no Pass or Discard???' + actions);
          return false;
        }
        // 操作
        room.receiveAction(room.user_ids[active_users[i]], action, tile);
      }
    }//end for ,updated state
    callback(null, room);
  });
};

module.exports = AI;