// var ACTION_C = { Chow:'Chow', Pong:'Pong', Kong:'Kong', Win:'Win', Ready:'Ready', Pass:'Pass', Discard:'Discard'};
class Actions extends egret.Sprite {
    private actions: ACTION_C[] = [];
    private option_tiles = [];

    public action_sprites: egret.Sprite;//Array<Action>;
    public option_sprites: egret.Sprite; //Array<TileSet>;

    public constructor() {
        super();
        this.action_sprites = new egret.Sprite();
        this.option_sprites = new egret.Sprite();
    }

    public setActions(actions: ACTION_C[], option_tiles: number[] = []) {

        if (this.option_sprites.parent) {
            this.removeChild(this.option_sprites);
        }
        // console.log("actions:" + actions + "; option=" + option_tiles);
        this.action_sprites.removeChildren();
        this.option_sprites.removeChildren();

        this.option_tiles = option_tiles;
        actions.sort();
        if (this.option_tiles.length > 1) {
            for (let i = 0, len = this.option_tiles.length; i < len; i++) {
                let option_tile_set = new TileSet(this.option_tiles[i], 4);
                this.option_sprites.addChild(option_tile_set);
                option_tile_set.x = this.option_sprites.width + 10;
                option_tile_set.flag = i;
                option_tile_set.touchEnabled = true;
                option_tile_set.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
                    //how to 通讯,return 一个flag还需要
                    let target = event.currentTarget;
                    GlobalData.tile = target.flag;
                    // target.y = -target.y - 10;
                    console.log('GlobalData.title=' + GlobalData.tile);
                    manager.socket_handler.sendAction();
                    // target.y = -target.y - 20;// to be removed
                }, this);
            }
        }

        for (let i = 0, len = actions.length; i < len; i++) {
            let actionSprite = new Action(actions[i]);
            actionSprite.touchEnabled = true;
            actionSprite.x = this.action_sprites.width + 10;
            this.action_sprites.addChild(actionSprite);
            // console.log('action=' + ACTION_C[actions[i]] + '; sprite.x=' + actionSprite.x);
            actionSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAction, this);

        }
        this.option_sprites.anchorOffsetX = this.option_sprites.width * 1.064 + 178;
        this.addChild(this.action_sprites);
    }

    private onTouchAction(event: egret.TouchEvent) {
        let action = event.currentTarget.action;
        console.log('Touch ' + ACTION_C[action]);

        if (action == ACTION_C.Discard) {
            if (GlobalData.tile < 0) {
                console.log("Wrong: Discard but no tile selected.");
                return;
            }
            GlobalData.action = action;
            manager.socket_handler.sendAction();
            console.log('GlobalData.action=' + ACTION_C[GlobalData.action])
        }
        else if (action == ACTION_C.Chow) {
            GlobalData.action = action;
            if (this.option_tiles.length <= 1) {
                manager.socket_handler.sendAction();
            }
            else {
                if (this.option_sprites.parent) {
                    this.removeChild(this.option_sprites);
                    // this.x = (this.parent.width - this.width) / 2;
                }
                else {
                    this.addChild(this.option_sprites);
                }
            }

        }
        else {
            //else not Discard
            GlobalData.action = action;
            GlobalData.tile = -1;
            if (this.option_sprites.parent) {
                this.removeChild(this.option_sprites);
            }
            manager.socket_handler.sendAction();
        }
    }
}

class Action extends egret.Sprite {
    public action: ACTION_C;
    private img: egret.Bitmap;

    constructor(action: ACTION_C) {
        super();
        this.action = action;
        if ([ACTION_C.MingKong, ACTION_C.AnKong, ACTION_C.BuKong].indexOf(this.action) >= 0) {
            this.img = new egret.Bitmap(RES.getRes("button_json.Kong"));
        }
        else {
            this.img = new egret.Bitmap(RES.getRes("button_json." + ACTION_C[this.action]));
        }
        this.addChild(this.img);
    }

    public getAction() {
        return this.action;
    }
}
