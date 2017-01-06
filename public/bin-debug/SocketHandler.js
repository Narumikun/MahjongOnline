var SocketHandler = (function () {
    // private socket: Socket;
    function SocketHandler() {
        console.log('host:' + location.host);
        if (location.host.indexOf('mahjongonline.duapp.com') >= 0) {
            socket = io.connect('http://111.206.45.12:30034');
        }
        else if (location.host.indexOf('happymahjong.duapp.com') >= 0) {
            socket = io.connect('http://111.206.45.12:30260');
        }
        else {
            socket = io.connect('http://localhost:18081');
        }
        // let self = this;
        socket.on("connect", this.onConnect);
        socket.on("state", this.onUpdateSate);
        socket.on("restart", this.onRestart);
    }
    SocketHandler.prototype.onConnect = function () {
        console.log('Socket connect~~~~~~');
        socket.emit('join', {
            room_id: GlobalData.room_id,
            user_id: GlobalData.user_id
        });
    };
    SocketHandler.prototype.onRestart = function (state) {
        manager.initialScene();
        this.onUpdateSate(state);
        // console.log('mute_before'+mute_before_restart);
        // if (!mute_before_restart) {
        //     console.log('restart & switch mute');
        //     manager.sound_player.switchMute();
        // }
    };
    SocketHandler.prototype.onUpdateSate = function (state) {
        console.log('Receive message.');
        GlobalData.reset();
        GlobalData.state = state;
        //timer
        manager.director.setTimer(state.time_stamp);
        //sound
        var last = state.last_info;
        if (last.last_action == ACTION_C.Discard) {
            if (last.last_tile >= 0) {
                manager.sound_player.playEffect('tile', last.last_tile);
            }
        }
        else {
            // [ACTION_C.Chow,ACTION_C.Pong,ACTION_C.MingKong,ACTION_C.AnKong,ACTION_C.BuKong,ACTION_C.Win]
            if (last.last_action >= 0 && last.last_action <= 5) {
                manager.sound_player.playEffect('action', last.last_action);
            }
        }
        //
        if (manager.button.parent && state.winner.indexOf(GAME_RESULT_C.Playing) >= 0) {
            // restart
            manager.removeChildren();
            manager.initialScene();
        }
        if (state.user_id != GlobalData.user_id || state.room_id != GlobalData.room_id) {
            console.log('user_id and room_id are wrong!!!');
        }
        //tiles
        console.log('state=');
        console.log(state);
        manager.left_tiles.setNum(state.left_tiles);
        for (var i = 0; i < 4; i++) {
            manager.users_info[i].setName(state.user_names[i]);
            manager.shown_tiles[i].setTiles(state.shown_tiles[i]);
            manager.hand_tiles[i].setTiles(state.hand_tiles[i], state.winner);
            manager.discarded_tiles[i].setTiles(state.discarded_tiles[i]);
            manager.hand_tiles[i].x = manager.shown_tiles[i].measuredWidth * 0.7 + 10;
            if (state.winner[i] > GAME_RESULT_C.Playing) {
            }
        }
        //current_player
        manager.director.setActionsOfAllUser(state.current_player, state.last_info, state.winner);
        //if my turn
        manager.actions.setActions(state.actions, state.option_tiles);
        if (state.winner.indexOf(GAME_RESULT_C.Win) >= 0) {
            for (var i = 0; i < 4; i++) {
                manager.hand_tiles[i].setTiles(state.hand_tiles[i], state.winner, i);
            }
        }
    };
    SocketHandler.prototype.sendAction = function () {
        socket.emit('action', {
            user_id: GlobalData.user_id,
            room_id: GlobalData.room_id,
            action: GlobalData.action,
            tile: GlobalData.tile
        });
    };
    SocketHandler.prototype.sendEvent = function (event, data) {
        if (data === void 0) { data = null; }
        socket.emit(event, {
            user_id: GlobalData.user_id,
            room_id: GlobalData.room_id,
            data: data
        });
    };
    return SocketHandler;
}());
