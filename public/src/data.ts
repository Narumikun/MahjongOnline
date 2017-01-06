//constants
enum ACTION_C {Chow, Pong, MingKong, AnKong, BuKong, Win, Ready, Discard, Pass}
enum BTN_EVENT_C {Start, Restart}
enum GAME_RESULT_C {Stop, Playing, Win, Lose, Dianpao, Liuju}
// Global data
class GlobalData {
    //静态成员及函数作为全局数据储存
    public static user_id: string='';
    public static room_id: string='';
    public static action: number = -1;
    public static tile: number = -1;
    public static state = {};
    public static reset() {
        GlobalData.action = -1;
        GlobalData.tile = -1;
    }
}
let socket: Socket;
let manager: Manager;
let mute_before_restart: boolean = true;
// config
const uiparams = {
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
        // x: 850, y: 20
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