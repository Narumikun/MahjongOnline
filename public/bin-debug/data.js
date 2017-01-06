//constants
var ACTION_C;
(function (ACTION_C) {
    ACTION_C[ACTION_C["Chow"] = 0] = "Chow";
    ACTION_C[ACTION_C["Pong"] = 1] = "Pong";
    ACTION_C[ACTION_C["MingKong"] = 2] = "MingKong";
    ACTION_C[ACTION_C["AnKong"] = 3] = "AnKong";
    ACTION_C[ACTION_C["BuKong"] = 4] = "BuKong";
    ACTION_C[ACTION_C["Win"] = 5] = "Win";
    ACTION_C[ACTION_C["Ready"] = 6] = "Ready";
    ACTION_C[ACTION_C["Discard"] = 7] = "Discard";
    ACTION_C[ACTION_C["Pass"] = 8] = "Pass";
})(ACTION_C || (ACTION_C = {}));
var BTN_EVENT_C;
(function (BTN_EVENT_C) {
    BTN_EVENT_C[BTN_EVENT_C["Start"] = 0] = "Start";
    BTN_EVENT_C[BTN_EVENT_C["Restart"] = 1] = "Restart";
})(BTN_EVENT_C || (BTN_EVENT_C = {}));
var GAME_RESULT_C;
(function (GAME_RESULT_C) {
    GAME_RESULT_C[GAME_RESULT_C["Stop"] = 0] = "Stop";
    GAME_RESULT_C[GAME_RESULT_C["Playing"] = 1] = "Playing";
    GAME_RESULT_C[GAME_RESULT_C["Win"] = 2] = "Win";
    GAME_RESULT_C[GAME_RESULT_C["Lose"] = 3] = "Lose";
    GAME_RESULT_C[GAME_RESULT_C["Dianpao"] = 4] = "Dianpao";
    GAME_RESULT_C[GAME_RESULT_C["Liuju"] = 5] = "Liuju";
})(GAME_RESULT_C || (GAME_RESULT_C = {}));
// Global data
var GlobalData = (function () {
    function GlobalData() {
    }
    GlobalData.reset = function () {
        GlobalData.action = -1;
        GlobalData.tile = -1;
    };
    //静态成员及函数作为全局数据储存
    GlobalData.user_id = '';
    GlobalData.room_id = '';
    GlobalData.action = -1;
    GlobalData.tile = -1;
    GlobalData.state = {};
    return GlobalData;
}());
var socket;
var manager;
var mute_before_restart = true;
// config
var uiparams = {
    // size: 1024*640
    actions: {
        x: [512, 812, 512, 212],
        y: [480, 300, 114, 300]
    },
    avatar: {
        x: [30, 937, 180, 15],
        y: [480, 210, 15, 210]
    },
    btn_mute: {
        x: 920, y: 570
    },
    btn_restart: {
        width: 320, height: 180,
        x: 512, y: 300,
        scale: 0.7
    },
    director: {
        x: 572, y: 360
    },
    left_num: {
        x: 932, y: 47
    },
    my_actions: {
        x: 560, y: 450
    },
    tiles: {
        x: [120, 869, 830, 155, 390, 642, 634, 381],
        y: [540, 535, 70, 40, 380, 375, 220, 225],
        rotation: [0, -90, 180, 90],
        scale: [0.7, 0.7, 0.7, 0.7, 1, 0.7, 0.7, 0.7, 0.55, 0.55, 0.55, 0.55],
    }
};
