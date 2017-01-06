/**
 * Created by Narumi on 2016/12/17.
 */
var async = require('async');
var WeChat = require('wechat');
var config = {
  token: 'S2FpRGluZ1hpYW9kaUFpU2hpVGVSdVlv',
  appid: 'wx2360cb4bbca21055'
  // encodingAESKey: 'eIbpCQnE5B4gynnqKVChPzEZ5bpvtZ74AdCSt6J7MuM'
};
var wechat = null;
var RoomModule = require('../scripts/room');
wechat = WeChat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  if(message.MsgType == 'text'){
    var ai_num =['a0','a1','a2','a3'].indexOf(message.Content.toLowerCase());
    var user_id = message.FromUserName;

    RoomModule.sync(function (err, db) {
      if(err){
        mylog(err);
        res.reply('出现错误，请重试！');
        return;
      }
      var Room = db.models.room;
      if (!Room) {
        mylog("Room not defined");
        res.reply('出现错误，请重试！');
        return;
      }
      if (ai_num >= 0) {
        //create
        Room.createRoom(user_id, ai_num, function (err, room_id) {
          if (err) {
            res.reply('房间创建失败，请重试。\r\n ');
            mylog(err);
            return;
          }
          // var room_id = room_ids[0];
          res.reply([
            {
              title: '房间' + room_id + '创建成功！点击开始麻将之旅！',
              description: '将房间号分享给小伙伴，一起游戏！',
              picurl: SERVER_NAME+'/images/wechat_mahjong.jpg',
              url: SERVER_NAME + '/game?user_id=' + user_id + '&room_id=' + room_id
            }
          ]);
        });
      }
      else {
        // joinRoom
        var room_id = Number(message.Content);
        if (Number.isInteger(room_id)) {
          Room.one({room_id: room_id}, function (err, room) {
            if (err) {
              mylog('at wechat.js/Room.one \r\n' + err);
              res.reply('出现错误，请重试！');
              return;
            }
            var join_code = room.joinRoom(user_id);
            switch (join_code) {
              case RESULT_CODE.Ok:
                res.reply([
                  {
                    title: '成功加入房间' + room_id + '！点击开始麻将之旅！',
                    description: '将房间号分享给小伙伴，一起游戏！',
                    picurl: 'http://hoop8.com/1612D/0RjlSUeV.jpg',
                    url: SERVER_NAME + '/game?room_id=' + room_id + '&amp;user_id=' + user_id
                  }
                ]);
                break;
              case RESULT_CODE.RoomFull:
                res.reply('房间' + room_id + '已满，请尝试加入其它房间或创建房间！');
                break;
              case RESULT_CODE.RoomNotExist:
                res.reply('房间' + room_id + '不存在，请尝试加入其它房间或创建房间！');
                break;
              default:
                res.reply('Error.');
                break;
            }
          });
        } else {
          res.reply('指令无效！' + TIPS);
        }
      }
    });
  }
  else if (message.MsgType == 'event' && message.Event == 'subscribe') {
    res.reply('欢迎关注 "The Missing Four" 小组！\r\n开始麻将生涯：' + TIPS + RULES);
  }
});


// app.use('/wechat',);
module.exports = wechat;
