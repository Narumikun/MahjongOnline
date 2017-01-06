var util = require('util');
var orm = require('orm');
orm.settings.set("instance.autoSave", true);
// orm.settings.set('instance.returnAllErrors', true);
// orm.settings.set("connection.pool", true);
var db = null;
require('./constants');
var timer_manager = require('./timer');

var RoomModel = {};

RoomModel.connect = function (callback) {
  // callback(err,db)
  // mylog('RoomModel.connect');
  if (process.env.NODE_ENV == 'development') {
    db = orm.connect('mysql://root:123456@localhost:3306/game');
  }
  else {
    db = orm.connect(util.format('mysql://%s:%s@%s:%d/%s', ACCESS_KEY, SECRET_KEY, DB_HOST, DB_PORT, DB_NAME));
  }
  mylog('a new db connection.');
  db.on('connect', function (err) {
    if (err) {
      callback(err);
      return
    }
    // model define
    var Room = db.define('room', {
      room_id: {type: 'integer', unique: true, key: true},
      user_ids: Object, //[OpenID]
      user_names: Object,

      current_player: {type: 'integer', defaultValue: 0},
      discarded: {type: 'integer', defaultValue: -1},
      drawn: {type: 'integer', defaultValue: -1},


      left_tiles: Object,//[]
      next_players: Object,//[{actions:[],option_tiles:[]},,,]
      last_info: Object,
      hand_tiles: Object,//[u1,u2,u3,u4]
      shown_tiles: Object,//[[[1,2,3],[3,3,3,3],,],,,]
      discarded_tiles: Object,//[]

      winner: Object, //[nothing,dian,hu,liuju]
      extras: Object
    }, {
      validations: {
        room_id: [orm.enforce.ranges.number(1, undefined, 'room id must be a positive integer')]
      },

      methods: {
        // 对外接口
        initRoom: function (user_id, ai_num) {
          //init
          // mylog('before initial, user_ids=' + this.user_ids + ', type=' + typeof(this.user_ids));
          // mylog('this.user_ids==null: ' + (this.user_ids == null));
          // mylog('this.user_ids==null: '+(this.user_ids==null));

          if (typeof user_id != 'undefined') {
            // 传入参数，第一次创建初始化
            this.user_ids = [user_id, '', '', ''];
            this.user_names = ['晓氡', '晓镧', '晓锡', '晓钡'];

            while (ai_num > 0) {
              this.user_ids[4 - ai_num] = 'AI' + ai_num;
              this.user_names[4 - ai_num] = this.user_names[4 - ai_num] + '(AI)';
              ai_num--;
            }
          } else if (this.user_ids == null) {
            return false;
          }
          this.current_player = 0;
          this.left_tiles = [];
          this.next_players = [{actions: [], option_tiles: []}, {actions: [], option_tiles: []}, {
            actions: [],
            option_tiles: []
          }, {actions: [], option_tiles: []}];
          this.hand_tiles = [[], [], [], []];
          this.shown_tiles = [[], [], [], []];
          this.discarded_tiles = [[], [], [], []];
          this.last_info = {last_player: -1, last_tile: -1, last_action: -1};
          this.winner = [GAME_RESULT_S.Playing, GAME_RESULT_S.Playing, GAME_RESULT_S.Playing, GAME_RESULT_S.Playing];
          this.extras = {time_stamp: new Date().getTime()};
          if (this.user_ids.indexOf('') < 0) {
            this.startGame();
          }
          this.update();
        },

        joinRoom: function (user_id) {
          if (this.user_ids.indexOf(user_id) >= 0) {
            return RESULT_CODE.UserInRoom;
          }
          var index = this.user_ids.indexOf('');
          if (index < 0) {
            return RESULT_CODE.RoomFull;
          }
          this.user_ids[index] = user_id;
          mylog(user_id + "joined room" + this.room_id);
          if (this.user_ids.indexOf('') < 0) {
            this.startGame();
          }
          this.update();
          return RESULT_CODE.Ok;
        },

        startGame: function () {
          if (this.user_ids.indexOf('') >= 0) {
            return false;
          }

          var tile = [], i, j;
          for (i = 0; i < 4; i++) {
            for (j = 0; j < 34; j++) {
              tile.push(j);
            }
          }
          // random left_tiles
          tile.sort(function (a, b) {
            return Math.random() > 0.5 ? -1 : 1;
          });
          for (i = 0; i < 4; i++) {
            //首次发牌
            for (j = 0; j < 13; j++) {
              this.hand_tiles[i].push(tile.pop());
            }
            this.hand_tiles[i].sortByNumber();
          }
          this.left_tiles = tile;
          this.current_player = 0;
          this.drawTile();
          this.extras.time_stamp = new Date().getTime();
          this.update();
          return true;
        },

        getState: function (user_id) {
          var seat = this.user_ids.indexOf(user_id);
          if (seat == -1) {
            return null;
          }
          var i = 0, j = 0;

          // user name = open id, winner=game state
          var user_names = this.user_names.concat();
          user_names = user_names.concat(user_names.splice(0, seat));
          for (i = 0; i < 4; i++) {
            if (this.user_ids[(i + seat) % 4] == '') {
              user_names[i] = 'Offline';
            }
            else {
              user_names[i] = this.user_names[(i + seat) % 4];
            }
          }

          var winner = this.winner.concat();
          winner = winner.concat(winner.splice(0, seat));

          //discarded_tiles & shown_tiles
          var discarded_tiles = [];
          var shown_tiles = [];
          for (i = seat; i < seat + 4; i++) {
            var index = i % 4;
            discarded_tiles.push(this.discarded_tiles[index]);
            var shown_tile = [];
            // mylog('st['+i+']='+this.shown_tiles[index]);
            for (j = 0; j < this.shown_tiles[index].length; j++) {
              shown_tile = shown_tile.concat(this.shown_tiles[index][j]);
            }
            shown_tiles.push(shown_tile);
            // shown_tiles.push(this.shown_tiles[i % 4]);
          }


          var last_info = {
            last_player: (this.last_info.last_player - seat + 4) % 4,
            last_tile: this.last_info.last_tile,
            last_action: this.last_info.last_action
          };

          // hand_tiles
          var hand_tiles = [];
          hand_tiles.push(this.hand_tiles[seat % 4]);
          for (i = seat + 1; i < seat + 4; i++) {
            hand_tiles.push([].repeat(this.hand_tiles[i % 4].length, -1));
          }
          var actions = this.next_players[seat].actions;

          // if 游戏结束
          var isGameOver = false;
          if (winner.indexOf(GAME_RESULT_S.Playing) < 0) {
            hand_tiles = [];
            isGameOver = true;
            for (i = seat; i < seat + 4; i++) {
              hand_tiles.push(this.hand_tiles[i % 4]);
              for (j = 0; j < shown_tiles[i % 4].length; j++) {
                shown_tiles[i % 4][j] = Math.abs(shown_tiles[i % 4][j]);
              }
            }
          }

          // end if 游戏结束
          return {
            room_id: this.room_id,
            user_id: user_id,
            user_names: user_names,

            left_tiles: this.left_tiles.length,
            shown_tiles: shown_tiles,
            hand_tiles: hand_tiles,
            discarded_tiles: discarded_tiles,

            current_player: (this.current_player - seat + 4) % 4,
            discarded: this.discarded,
            last_info: last_info,
            drawn: (this.current_player == seat && !isGameOver) ? this.drawn : -1,
            actions: isGameOver ? [] : this.next_players[seat].actions,
            option_tiles: isGameOver ? [] : this.next_players[seat].option_tiles,
            winner: winner,
            time_stamp: this.extras.time_stamp
          };

        },

        receiveAction: function (user_id, action, tile) {
          // console.log("receiver id " + user_id + " action " + action + " tile " + tile);
          var seat = this.user_ids.indexOf(user_id);
          if (seat < 0) {
            return false;
          }
          if (this.next_players[seat].actions.indexOf(action) >= 0) {
            switch (action) {
              case ACTION_S.Chow:
                //tile = option
                this.chow(seat, tile);
                break;
              case ACTION_S.Pong:
                var flag=this.pong(seat);
                break;
              case ACTION_S.AnKong:
              case ACTION_S.MingKong:
              case ACTION_S.BuKong:
                this.kong(seat, action);
                break;
              case ACTION_S.Win:
                //自摸无需，点炮胡用到discarded
                this.endGame(seat, GAME_RESULT_S.Win);
                break;
              case ACTION_S.Ready:
                //放到客户端
                break;
              case ACTION_S.Pass:
                this.pass(seat);
                break;
              case ACTION_S.Discard:
                this.discardTile(seat, tile);
                break;
              default:
                console.log('User action: ' + action);
                break;
            }
            if(flag==false){
              return false
            }
            //


          }else{
            return false
          }
          //Liuju
          if (this.left_tiles.length == 0) {
            this.endGame(seat, GAME_RESULT_S.Liuju);
          }
          this.extras.time_stamp = new Date().getTime();
          //
          this.update();
          return true;
        },

        //对内接口
        drawTile: function () {
          var seat = this.current_player;
          this.discarded = -1;
          this.drawn = this.left_tiles.pop();

          // update Actions, 只有自己能an/bu杠、自摸、出
          for (var i = 0; i < 4; i++) {
            if (i != seat) {
              this.next_players[i] = {actions: [], option_tiles: []};
            } else {
              var actions = [ACTION_S.Discard];
              if (this.canWin(i, this.drawn)) {
                actions.push(ACTION_S.Win);
              }
              var kong = this.canKong(i, this.drawn, true);//0-false,1-明暗杠,2-补杠
              if (kong) {
                if (kong == 1) {
                  actions.push(ACTION_S.AnKong);
                } else if (kong == 2) {
                  actions.push(ACTION_S.BuKong);
                }
              }//end kong
              this.next_players[i] = {actions: actions.sortByNumber(), option_tiles: []};
            }
          }
          //判断完再加入手牌
          this.hand_tiles[seat].push(this.drawn);
          // this.update();
        },

        discardTile: function (seat, tile) {
          // return boolean
          var index = this.hand_tiles[seat].indexOf(tile);
          if (index < 0) {
            return false;
          }
          this.hand_tiles[seat].splice(index, 1);
          this.hand_tiles[seat].sortByNumber();
          this.discarded = tile;
          this.last_info = {last_player: seat, last_tile: tile, last_action: ACTION_S.Discard};
          this.drawn = -1;
          //actions
          var flag = false;
          for (var i = 0; i < 4; i++) {
            if (i == seat) {
              this.next_players[i] = {actions: [], option_tile: []};
            }
            else {
              var actions = [], option_tiles = [];//flag=false，无人可do，直接下一个丢牌
              option_tiles = this.canChow(i);// [] or [chow list]
              // mylog('option_tiles=' + option_tiles);
              if (option_tiles.length != 0) {
                actions.push(ACTION_S.Chow);
              }
              if (this.canPong(i)) {
                actions.push(ACTION_S.Pong);
              }
              if (this.canKong(i, this.discarded, false)) {
                actions.push(ACTION_S.MingKong);
              }
              if (this.canWin(i, this.discarded)) {
                actions.push(ACTION_S.Win);
              }

              if (actions.length != 0) {
                flag = true;
                actions.push(ACTION_S.Pass);
              }
              actions.sortByNumber();
              this.next_players[i] = {actions: actions, option_tiles: option_tiles};
            }
          }
          if (!flag) {
            this.discarded_tiles[seat].push(this.discarded);
            this.current_player = (this.current_player + 1) % 4;
            this.drawTile();
          }

          // this.update();
          return true;
        },

        chow: function (seat, option) {
          if (this.next_players[seat].actions.indexOf(ACTION_S.Chow) < 0) {
            return false;
          }

          var i;
          option = option >= 0 ? option : 0;
          var chow_tiles = this.next_players[seat].option_tiles[option];
          var hand_tile = this.hand_tiles[seat];
          hand_tile.push(this.discarded);
          for (i = 0; i < chow_tiles.length; i++) {
            hand_tile.splice(hand_tile.indexOf(chow_tiles[i]), 1);
          }
          this.hand_tiles[seat] = hand_tile;
          this.shown_tiles[seat].push(chow_tiles);
          // update states
          this.last_info = {last_player: seat, last_tile: this.discarded, last_action: ACTION_S.Chow};
          this.discarded = -1;
          this.drawn = -1;
          this.current_player = seat;
          for (i = 0; i < 4; i++) {
            this.next_players[i] = {
              actions: i == seat ? [ACTION_S.Discard] : [],
              option_tiles: []
            }
          }
          return true;
        },

        pong: function (seat) {
          if (this.next_players[seat].actions.indexOf(ACTION_S.Pong) < 0) {
            return false;
          }

          var hand_tile = this.hand_tiles[seat];
          hand_tile.push(this.discarded);
          hand_tile.sortByNumber();
          this.shown_tiles[seat].push(
            hand_tile.splice(
              hand_tile.indexOf(this.discarded), 3));

          // this.shown_tiles.push(hand_tile.sortByNumber().splice(indexOf())
          // hand_tile.splice(hand_tile.indexOf(this.discarded),2);

          // update states
          this.last_info = {last_player: seat, last_tile: this.discarded, last_action: ACTION_S.Pong};
          this.discarded = -1;
          this.drawn = -1;
          this.current_player = seat;
          for (var i = 0; i < 4; i++) {
            this.next_players[i] = {
              actions: i == seat ? [ACTION_S.Discard] : [],
              option_tiles: []
            }
          }
          return true;
        },

        kong: function (seat, kong_type) {
          if (this.next_players[seat].actions.indexOf(kong_type) < 0) {
            return false;
          }
          var hand_tile = null;
          switch (kong_type) {
            case ACTION_S.AnKong:
              hand_tile = this.hand_tiles[seat].sortByNumber();
              hand_tile.splice(hand_tile.indexOf(this.drawn), 4);
              this.shown_tiles[seat].push([-this.drawn - 1, -this.drawn - 1, -this.drawn - 1, -this.drawn - 1]);
              this.last_info = {last_player: seat, last_tile: -1, last_action: ACTION_S.AnKong};
              break;
            case ACTION_S.MingKong:
              hand_tile = this.hand_tiles[seat];
              hand_tile.push(this.discarded);
              hand_tile.sortByNumber();
              this.shown_tiles[seat].push(hand_tile.splice(hand_tile.indexOf(this.discarded), 4));
              this.last_info = {last_player: seat, last_tile: this.discarded, last_action: ACTION_S.MingKong};
              break;
            case ACTION_S.BuKong:
              var shown_tile = this.shown_tiles[seat];
              var index = this.hand_tiles[seat].indexOf(this.drawn);
              if (index >= 0) {
                this.hand_tiles[seat].splice(index, 1);
              }
              for (var i = 0, len = shown_tile.length; i < len; i++) {
                if (shown_tile[i].toString() == [this.drawn, this.drawn, this.drawn].toString()) {
                  shown_tile[i].push(this.drawn);
                }
              }
              this.shown_tiles[seat] = shown_tile;
              this.last_info = {last_player: seat, last_tile: this.drawn, last_action: ACTION_S.BuKong};
              break;
            default:
              console.log("Kong required, but" + kong_type);
              break;
          }
          this.discarded = -1;
          this.drawn = -1;
          this.current_player = seat;
          this.drawTile();

        },

        pass: function (seat) {
          if (this.next_players[seat].actions.indexOf(ACTION_S.Pass) < 0) {
            return false;
          }
          this.next_players[seat] = {actions: [], option_tiles: []};
          var flag = false;
          for (var i = 0; i < 4; i++) {
            if (this.next_players[i].actions.toString() != [].toString()) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            //全都Pass了
            this.discarded_tiles[this.current_player].push(this.discarded);
            this.current_player = (this.current_player + 1) % 4;
            this.drawTile();
          }
          return true;
        },

        endGame: function (seat, game_result) {
          if (game_result == GAME_RESULT_S.Win) {
            this.winner = [].repeat(4, GAME_RESULT_S.Lose);
            if (this.current_player == seat) {
              //zimo
              this.winner[seat] = GAME_RESULT_S.Win;
              this.last_info = {last_player: seat, last_tile: this.drawn, last_action: ACTION_S.Win};
            }
            else {
              //dianpao
              this.hand_tiles[seat].push(this.discarded);
              this.winner[this.current_player] = GAME_RESULT_S.Dianpao;
              this.winner[seat] = GAME_RESULT_S.Win;
              this.last_info = {last_player: seat, last_tile: this.discarded, last_action: ACTION_S.Win};
            }
            for (var i = 0; i < 4; i++) {
              this.next_players[i] = {actions: [], option_tiles: []};
            }
          }
          else if (game_result == GAME_RESULT_S.Liuju) {
            this.winner = [].repeat(4, GAME_RESULT_S.Liuju);
            this.last_info = {last_player: seat, last_tile: this.discarded, last_action: ACTION_S.Discard};
            for (var i = 0; i < 4; i++) {
              this.next_players[i] = {actions: [], option_tiles: []};
            }
          } else {
            mylog('endGame?game_result=' + game_result);
            return false;
          }
          if (this.next_players[seat].actions.indexOf(ACTION_S.Win) < 0) {
            return false;
          }
        },

        update: function (room) {
          if (room == undefined) {
            room = this;
          }

          this.user_ids = room.user_ids.concat();
          this.user_names = room.user_names.concat();

          this.left_tiles = room.left_tiles.concat();
          this.next_players = JSON.parse(JSON.stringify(room.next_players));
          this.last_info = JSON.parse(JSON.stringify(room.last_info));
          this.hand_tiles = room.hand_tiles.concat();
          this.shown_tiles = room.shown_tiles.concat();
          this.discarded_tiles = room.discarded_tiles.concat();

          this.winner = room.winner.concat();
          this.extras = JSON.parse(JSON.stringify(room.extras));

        },

        canChow: function (seat) {
          // return [], chow list=[[3,4,5],[5,6,7]]
          var tile = this.discarded;
          if (seat != (this.current_player + 1) % 4 || tile >= 27 || tile < 0) {
            return [];
          }
          var hand_tile = this.hand_tiles[seat];
          var locs = [-2, -1, 1, 2], nearby = [false, false, false, false];
          var option_tiles = [], i;
          for (i = 0; i < locs.length; i++) {
            nearby[i] = (hand_tile.indexOf(tile + locs[i]) >= 0) && (Math.floor((tile + locs[i]) / 9) == Math.floor(tile / 9));
            // nearby[i] = Math.floor(hand_tile.indexOf(tile + locs[i]) / 9) == Math.floor(tile / 9);
          }
          for (i = 0; i < 3; i++) {
            if (nearby[i] && nearby[i + 1]) {
              option_tiles.push([tile - 2 + i, tile - 1 + i, tile + i]);
            }
          }
          return option_tiles;
        },

        canPong: function (seat) {
          if (seat == this.current_player) {
            return false;
          }
          var hand_tile = this.hand_tiles[seat].sortByNumber();
          var result = hand_tile.counts(this.discarded) >= 2;
          return hand_tile.counts(this.discarded) >= 2;

          // var index = hand_tile.indexOf(this.discarded);
          // return index >= 0 && hand_tile[index + 1] == this.discarded;
        },

        canKong: function (seat, tile, bukong) {
          //tile=discarded or drawn
          //return 0-false,1-明暗杠,2-补杠
          if (bukong) {
            //补杠

            for (var i = 0, len = this.shown_tiles[seat].length; i < len; i++) {
              if (this.shown_tiles[seat][i].toString() == [tile, tile, tile].toString()) {
                return 2;
              }
            }
          }

          var hand_tile = this.hand_tiles[seat].slice().sortByNumber();

          return hand_tile.counts(tile) >= 3 ? 1 : 0;

          // var index = hand_tile.indexOf(tile);
          // if (index >= 0 && hand_tile[index + 1] == tile && hand_tile[index + 2] == tile) {
          //   return 1;
          // }
          // return 0;
        },

        canWin: function (seat, tile) {
          // tile可能是this.discarded or this.drawn
          // 只能是3n+2||7*2
          var hand_tile = this.hand_tiles[seat].slice().concat(tile).sortByNumber();
          var result_general = hand_tile.length % 3 == 2 && this.iterChecker(hand_tile, 1, Math.floor(hand_tile.length / 3));
          var result_7pairs = hand_tile.length == 14 && this.iterChecker(hand_tile, 7, 0);

          return result_7pairs || result_general;


          // if (hand_tile.length % 3 == 2)
          //   return this.iterChecker(hand_tile, 1, Math.floor(hand_tile.length / 3))
        },

        canReady: function (seat) {
          // TODO
          // if(seat==this.current_player)
          // for(var i=0;i<34;i++){
          //   var hand_tile=this.hand_tiles[seat].concat(i);
          //   return hand_tile.length % 3 == 2 && this.iterChecker(hand_tile, 1, Math.floor(hand_tile.length / 3));
          // }
        },

        match: function (tiles) {
          // 判断是否成一组/一对
          tiles.sortByNumber();
          var tile1 = tiles[0], tile2 = tiles[1], tile3 = tiles[2];
          if (tiles.length == 2) {
            return tile1 == tile2;
          } else if (tiles.length == 3) {
            if ((tile1 == tile2) && (tile3 == tile2)) {
              return true;
            }
            if ((Math.abs(tile3 - tile2) == 1 ) && (Math.abs(tile2 - tile1) == 1)) {
              var suit = [Math.floor(tile1 / 9), Math.floor(tile2 / 9), Math.floor(tile3 / 9)];
              if (suit[0] == suit[1] && suit[1] == suit[2]) {
                return true;
              }
            }
          }
          return false;
        },

        iterChecker: function (hand_tile, pairs, melds) {
          if (melds == 0 && pairs == 0) {
            // iter end
            return true;
          }
          var i = 0;
          var iter_tiles = [];
          for (var j = 1; j < hand_tile.length; j++) {
            if (pairs && hand_tile[i] == hand_tile[j]) {
              // 判断一对将牌
              iter_tiles = hand_tile.concat();
              iter_tiles.splice(j, 1);
              iter_tiles.splice(i, 1);
              if (this.iterChecker(iter_tiles, pairs - 1, melds)) {
                return true
              }
            }
            for (var k = j + 1; k < hand_tile.length; k++) {
              if (this.match([hand_tile[i], hand_tile[j], hand_tile[k]])) {
                iter_tiles = hand_tile.concat();
                iter_tiles.splice(k, 1);
                iter_tiles.splice(j, 1);
                iter_tiles.splice(i, 1);
                if (this.iterChecker(iter_tiles, pairs, melds - 1)) {
                  return true;
                }
              }// end if
            }//end for
          }//end for
          return false
        }

      }

      /*******************************************************
       * end methods
       *******************************************************/
    });// end Room define
    // define class functions
    Room.createRoom = function (user_id, ai_num, cb) {
      ai_num = parseInt(ai_num);
      ai_num = ai_num > 3 ? 3 : (ai_num < 0 ? 0 : ai_num);

      //
      var room_id = Math.floor(Math.random() * 9000 + 1000);
      Room.exists({room_id: room_id},
        function (err, roomExists) {
          if (err) {
            cb(err, -1);
            return;
          }
          if (roomExists) {
            Room.createRoom(user_id, ai_num, cb);
          } else {
            var new_room = {
              room_id: room_id
            };
            Room.create(new_room, function (err, room) {
              if (err) {
                cb(err, -1);
                return
              }
              mylog('room created:' + room_id);
              room.initRoom(user_id, ai_num);
              cb(null, room_id);
            });
          }
        });
    };

    Room.isUserInRoom = function (user_id, room_id, cb) {
      Room.one({room_id: room_id}, function (err, room) {
        if (err) {
          mylog(err);
          mylog('when err, room.user_ids=' + room.user_ids);
          return;
        }
        // mylog('room='+room);
        if (room) {
          var index = room.user_ids.indexOf(user_id);
          if (index >= 0) {
            cb(RESULT_CODE.UserInRoom);
          } else {
            cb(RESULT_CODE.UserNotInRoom);
          }
        } else {
          cb(RESULT_CODE.RoomNotExist);
        }
      });
    };

    callback(null, db);

  });
  db.on('error', function (err) {
    if (err.errno == 'ECONNRESET') {
      // mylog('detect ECONNRESET');
    }
    else if (err.code == 'PROTOCOL_CONNECTION_LOST') {
      mylog('detect PROTOCOL_CONNECTION_LOST');
      // db = null;
    }
    else {
      //do nothing
      mylog('detect unknown db err: ' + err.errno);
    }
  });
};

RoomModel.sync = function (callback) {
// callback(err,db)
  var conn_func = function (err, db) {
    if (err) {
      callback(err, null);
      return;
    }
    db.sync(function (err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, db);
    })
  };//

  if (db) {
    db.sync(function (err) {
      if (err) {
        RoomModel.connect(conn_func);
        return;
      }
      callback(null, db);
    });
  }
  else {
    RoomModel.connect(conn_func);
  }


  // if (!db) {
  //   RoomModel.connect(conn_func);
  // }
  // else {
  //   db.sync(function (err) {
  //     if (err) {
  //       RoomModel.connect(conn_func);
  //     }
  //     callback(null,db);
  //   });
  // }
  // //
  // RoomModel.connect(function (err, db) {
  //   if (err) {
  //     callback(err, null);
  //     return;
  //   }
  //   db.sync(function (err) {
  //     if (err) {
  //       RoomModel.connect(function (err, db) {
  //         // 重练一次失败则放弃
  //         if (err) {
  //           callback(err, null);
  //           return;
  //         }
  //         callback(null, db);
  //       });
  //       return;
  //     }
  //     callback(null, db);
  //   });
  // });
};

RoomModel.queryOneRoom = function (query, callback) {
  //callback(err, room)
  RoomModel.sync(function (err, db) {
    if (err) {
      callback(err, null);
      return;
    }
    var Room = db.models.room;
    if (Room) {
      Room.one(query, callback);
    }
    else {
      callback('ERRROOMNULL');
    }
  });
};

RoomModel.handleMessage = function (message, callback) {
  // callback(err, room)
  var room_id = message.room_id;
  var user_id = message.user_id;
  var action = message.action;
  var tile = message.tile;
  RoomModel.queryOneRoom({room_id: room_id}, function (err, room) {
    if (err) {
      callback(err, null);
      return;
    }
    if (!room.receiveAction(user_id, action, tile)) {
      mylog(user_id + " failed to action " + action);
    }
    callback(null, room);
    if (room.winner.indexOf(GAME_RESULT_S.Playing) < 0) {
      timer_manager.stop(room_id);
    } else {
      timer_manager.reset(room_id, callback);
    }

  });
};

module.exports = RoomModel;
