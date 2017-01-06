// var express = require('express');
var router = require('express').Router();
var RoomModel = require('../scripts/room');
require('../scripts/constants');

router.get('/', function (req, res, next) {
  // res.render('error');
  if (process.env.NODE_ENV != 'development') {
    res.render('error', {info: 'The page is not found.'});
  }
  else {
    res.redirect('/test/1024/3');
  }
});

var random_str = function () {
  var crypto = require('crypto');
  var md5 = crypto.createHash('md5');
  var str = new Date().toLocaleString() + 'asdTghjKlb'[Math.floor(Math.random() * 10)];
  return md5.update(str).digest('hex');
};


// for test
router.get('/test/:room_id/:ai_num', function (req, res, next) {
  // only for test rooms
  mylog('req=' + req.originalUrl);
  var room_id = req.params['room_id'];
  var ai_num = req.params['ai_num'];

  RoomModel.sync(function (err, db) {
    if (err) {
      mylog(err);
      return;
    }
    var Room = db.models.room;
    var user_id = 'user' + Math.floor(Math.random() * 9999999);
    if (Room) {
      Room.one({room_id: room_id}, function (err, room) {
        if (!room) {
          Room.createRoom(user_id, ai_num, function (err, room_id) {
            if (err) {
              mylog(err);
              return;
            }
            res.redirect('/game?user_id=' + user_id + '&room_id=' + room_id)

          });
        }
        else {
          //加入已有房间
          if (room.user_ids.indexOf('') >= 0) {
            room.joinRoom(user_id);
          }
          res.redirect('/game?user_id=' + user_id + '&room_id=' + room_id);
        }
      });//end one
    }
  });
});

module.exports = router;
