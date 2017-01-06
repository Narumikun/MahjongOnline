var expect = require('chai').expect;
var assert = require('assert');
require('./scripts/constants');

describe("room", function () {
  var RoomModel = require('./scripts/room');
  var my_room_ids = [];
  var room_copy = null;

  function fillInRoom(test_room, hand_tiles) {
    var left_tile = test_room.left_tiles;//.concat();
    for (var i = 0; i < 4; i++) {
      left_tile = left_tile.concat(test_room.hand_tiles[i]);
      var len = hand_tiles[i].length;
      for (var j = 0; j < len; j++) {
        //noinspection JSDuplicatedDeclaration
        var index = left_tile.indexOf(hand_tiles[i][j]);
        if (index >= 0) {
          left_tile.splice(index, 1);
        }
        if (len <= (i == 0 ? 14 : 13))
          test_room.hand_tiles[i] = hand_tiles[i].concat(left_tile.splice(0, (i == 0 ? 14 : 13) - len));
      }
    }
    test_room.update();
  }

  beforeEach(function (done) {
    RoomModel.sync(function (err, db) {
      if (err) {
        callback(err, null);
        mylog("connect err" + err);
        return;
      }
      var Room = db.models.room;
      Room.createRoom("test_user", 3, function (err, room_id) {
        if (err) {
          mylog('id=' + room_id + ', err=' + err);
          return;
        }
        my_room_ids.push(room_id);
        done();
      })
    })
  });


  describe("#canChow()", function () {
    var test_cases = [
      {
        hand_tiles: [[3], [1, 2, 4, 6, 6, 7, 8, 22, 22, 24, 29, 31, 32], [], []],
        tile: 3,
        expected: [[1, 2, 3], [2, 3, 4]]
      }];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "可以吃" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[0]}, function (err, room) {
          if (room) {
            fillInRoom(room, test.hand_tiles);
            room.discardTile(0, test.tile);
            expect(room.canChow(1)).to.eql(test.expected);
            room.update();
            done()
          }
        });
      });
    });
  });

  describe("#canPong()", function () {
    var test_cases = [{
      hand_tiles: [[5], [2, 2, 5, 5, 6, 7, 8, 22, 22, 24, 29, 31, 32], [], []],
      tile: 5,
      expected: true
    }];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "可以碰" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[1]}, function (err, room) {
          if (room) {
            fillInRoom(room, test.hand_tiles);
            room.discardTile(0, test.tile);
            expect(room.canPong(1)).to.equal(test.expected);
            room.update();
            done()
          }
        });
      });
    })

  });

  describe("#canKong()", function () {
    var test_cases = [
      {hand_tiles: [[2], [2, 2, 2, 5, 6, 7, 8, 22, 22, 24, 29, 31, 32], [], []], tile: 2, expected: 1}
    ];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "可以杠" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[2]}, function (err, room) {
          if (room) {
            fillInRoom(room, test.hand_tiles);
            room.discardTile(0, 2);
            expect(room.canKong(1, 2)).to.equal(test.expected);
            room.update();
            done()
          }
        });
      });
    })

  });

  describe("#canWin()", function () {
    var test_cases = [{
      hand_tiles: [[10], [2, 2, 2, 4, 5, 6, 6, 7, 8, 10, 14, 15, 16], [], []],
      tile: 10,
      expected: true
    },
      {
        hand_tiles: [[10], [2, 2, 3, 3, 5, 5, 6, 6, 7, 7, 10, 15, 15], [], []],
        tile: 10,
        expected: true
      }
    ];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "可以胡" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[3]}, function (err, room) {
          if (room) {
            fillInRoom(room, test.hand_tiles);
            // mylog(room.hand_tiles);
            // room.discardTile(0,10);
            expect(room.canWin(1, test.tile)).to.equal(test.expected);
            room.update();
            done()
          }
        });
      });
    })

  });

  describe("#chow()", function () {
    var test_cases = [
      {
        hand_tiles: [[3], [1, 2, 5, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17], [], []],
        tile: 3,
        expected_hand: [5, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17],
        expected_shown: [[1, 2, 3]]
      }];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "吃" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[4]}, function (err, test_room) {
          fillInRoom(test_room, test.hand_tiles);
          test_room.discardTile(0, test.tile);
          test_room.chow(1, 0);
          expect(test_room.hand_tiles[1]).to.eql(test.expected_hand);
          expect(test_room.shown_tiles[1]).to.eql(test.expected_shown);
          console.log(room_copy);
          done();
        })
      });
    });
  });

  describe("#pong()", function () {
    var test_cases = [
      {
        hand_tiles: [[5], [3, 3, 5, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17], [], []],
        tile: 5,
        expected_hand: [3, 3, 6, 7, 8, 9, 10, 14, 15, 16, 17],
        expected_shown: [[5, 5, 5]]
      }];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "碰" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[5]}, function (err, room) {
          fillInRoom(room, test.hand_tiles);
          room.discardTile(0, test.tile);
          room.pong(1);

          expect(room.hand_tiles[1]).to.eql(test.expected_hand);
          expect(room.shown_tiles[1]).to.eql(test.expected_shown);

          done();
        })
      });
    });
  });

  describe("#kong()", function () {
    var test_cases = [
      {
        hand_tiles: [[5], [3, 3, 5, 5, 5, 7, 8, 9, 10, 14, 15, 16, 17], [], []],
        tile: 5,
        expected_shown: [[5, 5, 5, 5]]
      }];
    test_cases.forEach(function (test) {
      it("手牌："+test.hand_tiles[1] + "杠" + test.tile, function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[6]}, function (err, room) {
          fillInRoom(room, test.hand_tiles);
          room.discardTile(0, test.tile);
          room.kong(1, 2);
          expect(room.shown_tiles[1]).to.eql(test.expected_shown);

          done()
        })
      });
    });

  });

  describe('#receiveAction()', function () {//pong
    var test_cases = [
      {
        hand_tiles: [[3], [3, 4, 5, 5, 7, 8, 9, 10, 14, 15, 16, 17], [], []],
        tile: 3,
        action: ACTION_S.Pong
      }];
    test_cases.forEach(function (test) {
      it('接收到碰，但实际不能够碰', function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[7]}, function (err, room) {
          fillInRoom(room, test.hand_tiles);
          room.discardTile(0, test.tile);
          room_copy = JSON.parse(JSON.stringify(room));
          expect(room.receiveAction('AI3', test.action)).to.be.false;
          expect(JSON.parse(JSON.stringify(room))).to.eql(room_copy);

          done()
        })

      });
    })

  });

  describe('#receiveAction()', function () {//pong
    var test_cases = [
      {
        hand_tiles: [[5], [3, 3, 5, 5,6, 7, 8, 9, 10, 14, 15, 16, 17], [], []],
        tile: 5,
        action: ACTION_S.Pong,
        expected_hand: [3, 3, 6, 7, 8, 9, 10, 14, 15, 16, 17],
        expected_shown: [[5, 5, 5]]
      }];
    test_cases.forEach(function (test) {
      it('接收到碰，实际可以碰', function (done) {
        RoomModel.queryOneRoom({room_id: my_room_ids[8]}, function (err, room) {
          fillInRoom(room, test.hand_tiles);
          room.discardTile(0, test.tile);
          room_copy = JSON.parse(JSON.stringify(room));
          room.receiveAction('AI3', test.action);
          expect(room.shown_tiles[1]).to.eql(test.expected_shown);
          expect(room.hand_tiles[1]).to.eql(test.expected_hand);
          done()
        })

      });
    });

  });

  after(function (done) {
    my_room_ids.forEach(function (my_room_id) {
      RoomModel.queryOneRoom({room_id: my_room_id}, function (err, room) {
        if (room) {
          room.remove(function (err) {
            if (err) {
              mylog("remove err")
            } else {

              if (my_room_id == my_room_ids[my_room_ids.length - 1]) {
                console.log("rooms all removed");
                done()
              }
            }
          })
        }
      });
    });

  });
});