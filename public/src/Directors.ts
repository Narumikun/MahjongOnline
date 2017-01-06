class GameDirector extends egret.Sprite {
    private indicator: egret.Bitmap;
    // private discarded: Tile;
    private timer_text: egret.TextField;
    private timer;
    private left_time: number;
    private start_time: number;

    public constructor() {
        super();
        //所有锚点在正中!
        //indicator 图片方向朝me，0
        let indicator = new egret.Bitmap(RES.getRes("button_json.director"));
        indicator.anchorOffsetX = indicator.width / 2;
        indicator.anchorOffsetY = indicator.height / 2;
        // indicator.scaleX=0.5;
        // indicator.scaleY=0.5;
        this.indicator = indicator;
        this.addChild(this.indicator);

        // Remaining Time useless
        let timer_text = new egret.TextField();
        timer_text.textAlign = egret.HorizontalAlign.CENTER;
        timer_text.textAlign = egret.VerticalAlign.MIDDLE;
        timer_text.textColor = 0xFFFFFF;
        timer_text.size = 40;
        this.timer_text = timer_text;
        this.setTimer(0);
        this.addChild(this.timer_text);

        //Director
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        // this.setActionsOfAllUser();
    }

    public setActionsOfAllUser(player: number = 0, last_info, winner) {
        // default
        if (last_info === void 0) {
            last_info = {
                last_player: 0,
                last_action: -1,
                last_tile: -1
            };
        }
        if (winner === void 0) {
            winner = [0, 0, 0, 0];
        }
        // start
        if (player >= 0 && player < 4) {
            this.indicator.rotation = -player * 90;
            //start timer
        }
        // let discarded = last_info.last_tile;

        //reset last action
        for (let i = 0; i < 4; i++) {
            manager.winner[i].removeChildren();
        }
        // detect win or liuju
        // let winner_index = winner.indexOf(GAME_RESULT_C.Win);
        // console.log('winner_index=' + winner_index);

        if (winner.indexOf(GAME_RESULT_C.Playing) >= 0) {
            // 正常
            let last_action = last_info.last_action;
            let last_player = last_info.last_player;
            let last_tile = last_info.last_tile;
            if (last_player == 0) {
                // console.log('last player is me');
                return;
            }
            if (last_action >= 0) {
                let user_action = manager.winner[last_player];//借用winner
                let last_action_tile;
                if (last_action == ACTION_C.Discard) {
                    last_action_tile = new Tile(last_player, last_tile);
                    last_action_tile.scaleX = 0.925;
                    last_action_tile.rotation = -last_info.last_player * 90;
                    manager.winner[last_player].addChild(last_action_tile);
                }
                else {
                    last_action_tile = new egret.Bitmap(RES.getRes("button_json." + ACTION_C[last_action]));
                    manager.winner[last_player].addChild(last_action_tile);
                }
                last_action_tile.anchorOffsetX = last_action_tile.width / 2;
                last_action_tile.anchorOffsetY = last_action_tile.height / 2;
                manager.sound_player.playEffect("action", last_action);
            }
        }
        else {
            // Game over=win or liuju
            if (winner[0] == GAME_RESULT_C.Liuju) {
                manager.winner[0].addChild(new egret.Bitmap(RES.getRes("button_json.Liuju")));//暂存actions里
                // manager.winner[0].y = manager.winner[0].y - 20;
                manager.sound_player.playEffect('result', GAME_RESULT_C.Liuju);//Lose & Liuju 音效一样
            }
            else {
                let winner_index = winner.indexOf(GAME_RESULT_C.Win);
                if (winner_index >= 0) {
                    manager.winner[winner_index].addChild(new egret.Bitmap(RES.getRes("button_json.Win")));
                    manager.sound_player.playEffect("action", ACTION_C.Win);
                    if (winner_index == 0) {
                        manager.sound_player.playEffect('result', GAME_RESULT_C.Win);
                    }
                    else {
                        manager.sound_player.playEffect('result', GAME_RESULT_C.Lose);
                    }
                }
            }
            manager.addChild(manager.button);

            // if (winner_index >= 0) {
            //     manager.winner[winner_index].addChild(new egret.Bitmap(RES.getRes("button_json.Win")));
            //     manager.sound_player.playSound("action", ACTION_C.Win);
            // }
            // else if (winner[0] == GAME_RESULT_C.Liuju) {
            //     manager.winner[0].addChild(new egret.Bitmap(RES.getRes("button_json.Liuju")));
            // }
            // else {
            //     console.log('No playing/win/liuju?');
            //     return;
            // }
            // manager.addChild(manager.button);
        }
    }

    public setTimer(time: number) {
        clearInterval(this.timer);
        this.left_time = time / 1000;
        if (this.left_time < 0 || this.left_time > 15) {
            this.left_time = 0;
        }
        this.start_time = new Date().getTime();

        this.timer_text.text = Math.floor(this.left_time).toString();
        this.timer_text.anchorOffsetX = this.timer_text.width / 2;
        this.timer_text.anchorOffsetY = this.timer_text.height / 2;
        if (time > 0) {
            let self = this;
            this.timer = setInterval(function () {
                let left_time = self.left_time - (new Date().getTime() - self.start_time) / 1000;
                if (left_time < 0) {
                    clearInterval(self.timer);
                    left_time = 0;
                }
                self.timer_text.text = Math.floor(left_time).toString();
                self.timer_text.anchorOffsetX = self.timer_text.width / 2;
                self.timer_text.anchorOffsetY = self.timer_text.height / 2;
            }, 500)
        }
    }

}

class AudioPlayer extends egret.Sprite {
    private mute_button: egret.Bitmap;
    public mute_on: boolean = true;

    private bgm_player;
    private effect_player;
    private result_player;

    constructor() {
        super();
        this.bgm_player = <HTMLAudioElement> document.getElementById("bgm_player");
        this.effect_player = <HTMLAudioElement> document.getElementById("effect_player");
        this.result_player = <HTMLAudioElement> document.getElementById("result_player");
        //if restarted
        if (!this.bgm_player.paused) {
            this.mute_button = new egret.Bitmap(RES.getRes("button_json.mute_off"));
            this.mute_on = false;
        }
        else {
            this.mute_button = new egret.Bitmap(RES.getRes("button_json.mute_on"));
        }

        this.mute_button.touchEnabled = true;
        this.mute_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchMute, this);
        this.addChild(this.mute_button);
    }

    public switchMute(event: egret.Event = null) {
        this.mute_on = !this.mute_on;
        if (this.mute_on) {
            this.bgm_player.pause();
            this.effect_player.pause();
            this.mute_button.texture = RES.getRes("button_json.mute_on");
        }
        else {
            this.bgm_player.play();
            this.mute_button.texture = RES.getRes("button_json.mute_off");
        }
    }

    public playEffect(effect_type: string, effect_no: number) {
        // effects.mp3: 0.6s*34 + 0.5s*5(0/1/2/3/4/5/6) + 4s*2
        if (!this.mute_on) {
            let self = this;
            switch (effect_type) {
                case 'tile':
                    if (effect_no < 0 || effect_no > 33) {
                        break;
                    }
                    self.effect_player.currentTime = effect_no * 0.6;
                    self.effect_player.play();
                    setTimeout(function () {
                        self.effect_player.pause();
                    }, 600-100);
                    break;
                case 'action':
                    if (effect_no < 0 || effect_no > 6) {
                        break;
                    }
                    // effect_no=[0,1,2,2,2,3,4][effect_no];//映射一下
                    self.effect_player.currentTime = 0.6 * 34 + effect_no * 0.5;
                    self.effect_player.play();
                    setTimeout(function () {
                        self.effect_player.pause();
                    }, 500-100);
                    break;
                case 'result':
                    if (effect_no == GAME_RESULT_C.Win) {
                        effect_no = 0;
                    }
                    else if (effect_no == GAME_RESULT_C.Lose || effect_no == GAME_RESULT_C.Liuju) {
                        effect_no = 1;
                    }
                    else {
                        break;
                    }
                    self.result_player.currentTime = effect_no * 4;
                    self.result_player.play();
                    setTimeout(function () {
                        self.result_player.pause();
                    }, 4000-100);
                    break;
            }
        }
    }
}