// configuration
DB_HOST = 'sqld.duapp.com';
DB_PORT = 4050;
DB_NAME = 'LgQiRFSDLnEGcmSTFaSo';
ACCESS_KEY = '43194ba6829442968edf15995cac424d';
SECRET_KEY = '91f757a689f14252a1469612b597c68f';
TOKEN = 'S2FpRGluZ1hpYW9kaUFpU2hpVGVSdVlv'; //for wechat

SERVER_NAME = 'http://happymahjong.duapp.com';
TIME_OUT = 15000;//ms
AI_TIME = 2500;
// constants or enums
ACTION_S = {Chow: 0, Pong: 1, MingKong: 2, AnKong: 3, BuKong: 4, Win: 5, Ready: 6, Discard: 7, Pass: 8};

GAME_RESULT_S = {Stop:0,Playing: 1, Win: 2, Lose: 3, Dianpao: 4, Liuju:5};

RESULT_CODE = {Ok: 0, RoomNotExist: 1, RoomFull: 2, UserNotInRoom: 3, UserInRoom:4};

BTN_EVENT_S = {Start: 1, Restart: 2};

USER_NAMES = ['晓氡', '晓镧', '晓锡', '晓钡'];
TIPS = '\r\n1. 回复a0~a3创建有0~3个AI的游戏房间；'
  + '\r\n2. 回复房间号可加入对应的游戏房间。';
RULES = '游戏规则：' +
  '\r\n1.出牌方式：点击牌,点“出”；' +
  '\r\n2.和牌方式：3n+2||7*2；' +
  '\r\n3.可以吃、碰、杠，先点击的先触发。' +
  '\r\n4.牌的总张数为136张，没有花牌；' +
  '\r\n5.庄家为建房的玩家。';


/**********************
 * constant functions *
 * ********************/

mylog = function (message) {

  var date = new Date();
  var str = date.toDateString()+' '+date.toLocaleTimeString();
  try{
    message=JSON.parse(message);
  }catch (e){
  }
  // message = message.toString();
  if (message.toString().indexOf('Error') >= 0) {
    console.error(str + ' | ' + message.errno + ' | ' + message + '');
    console.trace(message);
  }
  else {
    console.log(str + ' | ' + message);
  }
};

Array.prototype.counts = function (obj) {
  var i = this.length;
  var count = 0;
  while (i--) {
    if (this[i] === obj) {
      count++;
    }
  }
  return count;
};

Array.prototype.repeat = function (length, obj) {
  for (var i = 0; i < length; i++) {
    this[i] = obj;
  }
  return this;
};

Array.prototype.sortByNumber = function () {
  this.sort(function (a, b) {
    return a - b;
  });
  return this;
};
