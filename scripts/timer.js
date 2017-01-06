require('../scripts/constants');
var RoomModel = require('./room');
var AI = require('./ai');
var TimerManager = function () {
  this.timers = {};

  this.reset = function (room_id, callback) {
    // return;
    clearInterval(this.timers[room_id]);
    this.timers[room_id] = setInterval(function () {
      // mylog(room_id);
      AI.colocation(room_id, callback);
    }, TIME_OUT);
    // mylog('room:' + room_id + "'s timer reset");
  };

  this.stop = function (room_id) {
    clearInterval(this.timers[room_id]);
    // mylog('room:' + room_id + "'s timer stopped");
  };


};
var timer_manager = new TimerManager();


module.exports = timer_manager;

// timer_manager.start(1024);
//
// setTimeout(function () {
//   timer_manager.reset(1024);
//
// },7000);
//
// setTimeout(function () {
//   timer_manager.stop(1024);
//
// },20000);