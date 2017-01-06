var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Manager = (function (_super) {
    __extends(Manager, _super);
    function Manager(stageWidth, stageHeight) {
        _super.call(this);
        this.width = stageWidth;
        this.height = stageHeight;
        this.touchEnabled = true;
        this.initialScene();
    }
    Manager.prototype.initialScene = function () {
        this.users_info = new Array(4);
        this.left_tiles = new LeftTiles();
        this.shown_tiles = new Array(4);
        this.hand_tiles = new Array(4);
        this.discarded_tiles = new Array(4);
        this.director = new GameDirector();
        this.sound_player = new AudioPlayer();
        this.actions = new Actions();
        this.button = new Button();
        this.winner = new Array(4);
        this.adaptUI();
        this.socket_handler = new SocketHandler();
    };
    Manager.prototype.adaptUI = function () {
        // 只在第一次适配，之后update
        var pos_tiles = uiparams.tiles;
        var pos_avatar = uiparams.avatar;
        var st = this.shown_tiles, ht = this.hand_tiles, dt = this.discarded_tiles, ui = this.users_info;
        for (var i = 0; i < 4; i++) {
            //users_info
            ui[i] = new UserInfo(i % 2 == 0);
            this.addChild(ui[i]);
            ui[i].x = pos_avatar.x[i];
            ui[i].y = pos_avatar.y[i];
            //shown_tiles & hand_tiles
            var sprite = new egret.Sprite();
            st[i] = new TileSet([], i, 7);
            var initialTiles = []; //[-1, -1, -1, -1, -1, -1, -1, -1];
            ht[i] = new TileSet(initialTiles, i + 4, 8, 20, i == 0);
            // st[i].y = -40;
            sprite.addChild(st[i]);
            sprite.addChild(ht[i]);
            this.addChild(sprite);
            // st[i].y = (sprite.height - st[i].height) / 2;
            st[i].scaleX = pos_tiles.scale[i];
            st[i].scaleY = pos_tiles.scale[i];
            if (i == 0) {
                st[i].y = 20;
            }
            ht[i].x = st[i].measuredWidth * 0.7 + 10;
            // ht[i].y = (sprite.height - ht[i].height) / 2;
            ht[i].scaleX = pos_tiles.scale[i + 4];
            ht[i].scaleY = pos_tiles.scale[i + 4];
            sprite.x = pos_tiles.x[i];
            sprite.y = pos_tiles.y[i];
            sprite.rotation = pos_tiles.rotation[i];
            //discarded_tiles
            dt[i] = new TileSet([], i + 8, 7, 10 - i % 2 * 2);
            this.addChild(dt[i]);
            dt[i].x = pos_tiles.x[i + 4];
            dt[i].y = pos_tiles.y[i + 4];
            dt[i].rotation = pos_tiles.rotation[i];
            dt[i].scaleX = pos_tiles.scale[i + 8];
            dt[i].scaleY = pos_tiles.scale[i + 8];
            this.winner[i] = new egret.Sprite();
            this.winner[i].x = uiparams.actions.x[i];
            this.winner[i].y = uiparams.actions.y[i];
            this.addChild(this.winner[i]);
        }
        // left tiles No.
        this.left_tiles.x = uiparams.left_num.x;
        this.left_tiles.y = uiparams.left_num.y;
        this.addChild(this.left_tiles);
        //indicator & actions
        this.director.x = uiparams.director.x;
        this.director.y = uiparams.director.y;
        this.addChild(this.director);
        //soundPlayer
        this.sound_player.x = uiparams.btn_mute.x;
        this.sound_player.y = uiparams.btn_mute.y;
        this.addChild(this.sound_player);
        this.actions.x = uiparams.my_actions.x;
        // this.actions.x = 800;// to be modified
        this.actions.y = uiparams.my_actions.y;
        this.addChild(this.actions);
        this.button.x = uiparams.btn_restart.x;
        this.button.y = uiparams.btn_restart.y;
        this.button.scaleX = uiparams.btn_restart.scale;
        this.button.scaleY = uiparams.btn_restart.scale;
        // this.addChild(this.button);
        return;
    };
    return Manager;
}(egret.Sprite));
