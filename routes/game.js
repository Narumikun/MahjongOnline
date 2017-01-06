var express = require('express');
var router = express.Router();
require('../scripts/constants');
var RoomModel = require('../scripts/room');

router.get('/', function (req, res, next) {
  // isWechatBrowser?
  if (process.env.NODE_ENV != 'development' && false) {
    // mylog('NODE_ENV='+process.env.NODE_ENV);
    if (req.headers["user-agent"].indexOf('MicroMessenger') < 0) {
      res.render('error', {info: 'WeChat environment is required.'});
      return;
    }
  }

  var user_id = req.query.user_id;
  var room_id = req.query.room_id;
  RoomModel.sync(function (err, db) {
    var Room = db.models.room;
    Room.isUserInRoom(user_id, room_id, function (result_code) {
      switch (result_code) {
        case RESULT_CODE.RoomNotExist:
          res.render('error', {info: 'Sorry, Room ' + room_id + ' doesn\'t exist.'});
          break;
        case RESULT_CODE.UserNotInRoom:
          res.render('error', {info: 'It seems that you are not in Room ' + room_id + '.'});
          break;
        case RESULT_CODE.UserInRoom:
          // successful
          res.render('game', {room_id: room_id, user_id: user_id});
          break;
        default:
          res.render('error', {info: 'Something went wrong.'});
          break;
      }
    });//end Room.isUserInRoom
  });
});

module.exports = router;

