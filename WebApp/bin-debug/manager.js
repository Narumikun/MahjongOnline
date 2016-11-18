var GlobalData = (function () {
    function GlobalData() {
    }
    var d = __define,c=GlobalData,p=c.prototype;
    GlobalData.reset = function () {
        GlobalData.action = null;
        GlobalData.tile = null;
    };
    GlobalData.action = null;
    GlobalData.tile = null;
    return GlobalData;
}());
egret.registerClass(GlobalData,'GlobalData');
var Manager = (function (_super) {
    __extends(Manager, _super);
    function Manager(stageWidth, stageHeight) {
        _super.call(this);
        this.width = stageWidth;
        this.height = stageHeight;
        this.touchEnabled = true;
        this.userInfo = new Array(4);
        this.shownTiles = new Array(4);
        this.handTiles = new Array(4);
        this.discardedTiles = new Array(4);
        this.director = new GameDirector();
        this.actions = new Actions();
        this.adaptUI();
        //socket
        // this.socket = io.connect('http://' + document.domain + ':' + location.port);
        // console.log("location.port = " + location.port);
        // this.onSocketOpen();
        // this.socket.on("STATE", this.onReceiveMessage);
    }
    var d = __define,c=Manager,p=c.prototype;
    p.adaptUI = function () {
        // 只在第一次适配，之后使用updateState更新
        var props = {
            //for tileSets
            x: [100, 195, 920, 920, 460, 433, 680, 703],
            y: [540, 20, 70, 550, 383, 224, 223, 380],
            rotation: [0, 90, 180, -90],
            scale: [0.7, 0.7, 0.7, 0.7, 1, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
            //for userInfo
            ux: [80, 35, 230, 1015],
            uy: [450, 200, 15, 210]
        };
        //tiles
        var st = this.shownTiles, ht = this.handTiles, dt = this.discardedTiles, ui = this.userInfo;
        for (var i = 0; i < 4; i++) {
            //userInfo
            ui[i] = new UserInfo(i % 2 == 0, "user");
            this.addChild(ui[i]);
            ui[i].x = props.ux[i];
            ui[i].y = props.uy[i];
            //shownTiles & handTiles
            var sprite = new egret.Sprite();
            st[i] = new TileSet([1, 4, 7, 12, 32, 27, 9], i, 7);
            ht[i] = new TileSet([1, 4, 7, 12, 32, 27, 9], i + 4, 7);
            sprite.addChild(st[i]);
            sprite.addChild(ht[i]);
            this.addChild(sprite);
            st[i].y = (sprite.height - st[i].height) / 2;
            st[i].scaleX = props.scale[i];
            st[i].scaleY = props.scale[i];
            if (i == 0) {
                st[i].y = 20;
            }
            ht[i].x = st[i].measuredWidth * 0.7 + 10;
            ht[i].y = (sprite.height - ht[i].height) / 2;
            ht[i].scaleX = props.scale[i + 4];
            ht[i].scaleY = props.scale[i + 4];
            sprite.x = props.x[i];
            sprite.y = props.y[i];
            sprite.rotation = props.rotation[i];
            //discardedTiles
            dt[i] = new TileSet([1, 4, 7, 12, 32, 27, 9], i + 8, 7, 8 - i % 2 * 2);
            this.addChild(dt[i]);
            dt[i].x = props.x[i + 4];
            dt[i].y = props.y[i + 4];
            dt[i].rotation = props.rotation[i];
            dt[i].scaleX = props.scale[i + 8];
            dt[i].scaleY = props.scale[i + 8];
        }
        //indicator & actions
        this.director.x = this.width / 2 + 60; //(this.width - this.director.width) / 2;// this.width / 2;
        this.director.y = this.height / 2 + 40; //(this.height - this.director.height) / 2;;//this.height / 2;
        this.director.scaleX = 2;
        this.director.scaleY = 2;
        this.addChild(this.director);
        this.actions.setActions([ACTION.Chow, ACTION.Pong, ACTION.Pass]);
        this.actions.anchorOffsetX = this.actions.width;
        this.actions.anchorOffsetY = this.actions.height;
        this.actions.x = 800; // to be modified
        this.actions.y = 530;
        this.addChild(this.actions);
        return;
    };
    p.onReceiveMessage = function (state) {
        //reset GlobalData
        GlobalData.reset();
        //tiles
        for (var i = 0; i < 4; i++) {
            this.shownTiles[i].setTiles(state.tiles[i][0]);
            this.handTiles[i].setTiles(state.tiles[i][1]);
            this.discardedTiles[i].setTiles(state.tiles[i][2]);
            this.handTiles[i].x = this.shownTiles[i].measuredWidth * 0.7 + 10;
        }
        //curPlayer
        this.director.setPlayer(state.player);
        //if my turn
        if (state.player == 0) {
            //actions's ui
            this.actions.setActions(state.action, state.chowTiles);
            this.actions.anchorOffsetX = this.actions.width;
        }
    };
    p.onSocketOpen = function () {
        // socket connect, only once
        // 发送roomid userid
        // 刚进入房间，通知服务器我已经就位了，顺便发一份当前state给我
        this.socket.emit("SATRT", {
            user: 1,
            room: 1
        });
    };
    return Manager;
}(egret.Sprite));
egret.registerClass(Manager,'Manager');
//# sourceMappingURL=Manager.js.map