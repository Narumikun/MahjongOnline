/**
 * socketio.js
 * 处理websocket请求
 */
var Socket = require('socket.io');
var io = Socket(18081);
var RoomModel = require('../scripts/room');
var timer_manager = require('../scripts/timer');
var AI = require('../scripts/ai');


io.sendToAllInRoom = function (room) {
  if (!room) {
    mylog('room:' + room);
    return;
  }
  var user_ids = room.user_ids;

  var user_has_action = false, i;
  for (i = 0; i < 4; i++) {
    if (room.user_ids[i].indexOf('AI') < 0 && room.next_players[i].actions.length > 0) {
      user_has_action = true;
    }
  }

  for (i = 0; i < user_ids.length; i++) {
    if (user_ids[i] == '') {
      continue;
    }
    var state = room.getState(user_ids[i]);
    if (user_ids[i].indexOf("AI") == 0 && user_ids[i].length < 5) {
      // is AI
      AI.general(state, function (err, message) {
        if (err) {
          mylog(err);
          return;
        }
        RoomModel.handleMessage(message, function (err, room) {
          io.sendToAllInRoom(room);
        });
      }, user_has_action);
    }
    else {
      state.time_stamp = TIME_OUT - (new Date().getTime() - state.time_stamp);
      io.to(room.room_id + user_ids[i]).emit('state', state);
    }
  }// end for

};

var server = io.on('connection', function (socket) {

  socket.on('join', function (message) {
    var room_id = message.room_id;
    var user_id = message.user_id;
    socket.join(room_id + user_id);
    console.log('room_id=' + room_id);
    RoomModel.queryOneRoom({room_id: room_id}, function (err, room) {
      if (err) {
        mylog("socket.on join, error:");
        mylog(err);
        return false;
      }
      if (!room) {
        mylog('ROOM_NULL_io.join');
        return false;
      }
      io.sendToAllInRoom(room);
      var index = room.user_ids.indexOf('');
      if (index < 0) {
        timer_manager.reset(room_id, function (err, updated_room) {
          if (err) {
            mylog(err);
            return;
          }
          io.sendToAllInRoom(updated_room);
        });
      }
    });
  });

  socket.on('start', function (message) {
    // remained
  });

  socket.on('restart', function (message) {
    var room_id = message.room_id;
    RoomModel.queryOneRoom({room_id: room_id}, function (err, room) {
      if (err) {
        mylog("socket.on restart, error:");
        mylog(err);
        return;
      }
      if (room.winner.indexOf(GAME_RESULT_S.Playing) < 0) {
        room.initRoom();
        io.sendToAllInRoom(room);
      }

    });
  });

  socket.on('disconnect', function () {

  });

  socket.on('action', function (message) {
    RoomModel.handleMessage(message, function (err, room) {
      if (err) {
        mylog(err);
        return;
      }
      io.sendToAllInRoom(room);
    });

    // RoomModel.queryOneRoom({room_id: room_id}, function (err, room) {
    //   if (err) {
    //     mylog("socket.on action error:");
    //     mylog(err);
    //     return;
    //   }
    //   if (!room.receiveAction(user_id, action, tile)) {
    //     mylog(user_id + " failed to action " + action);
    //   }
    //   io.sendToAllInRoom(room);
    //   if (action == ACTION_S.Win) {
    //     timer_manager.stop(room_id);
    //   }
    //   timer_manager.reset(room_id, function (room) {
    //     io.sendToAllInRoom(room);
    //   });
    // });


  });//end action
});

module.exports = server;
