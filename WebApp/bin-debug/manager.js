var Manager = (function (_super) {
    __extends(Manager, _super);
    function Manager() {
        _super.call(this);
        this.userInfo = new Array(4);
        this.shownTiles = new Array(4);
        this.handTiles = new Array(4);
        this.discardedTiles = new Array(4);
        this.adaptUI();
    }
    var d = __define,c=Manager,p=c.prototype;
    p.adaptUI = function () {
        // var mat = [	//1136*640
        //     [100,    150,    1000,   950],	//x
        //     [550,   100,    100,    550],	//y
        //     [0,     90,     180,    -90],	//rotation
        //     [0.8,   0.8,    0.8,    0.8]]	//scale
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
        var st = this.shownTiles, ht = this.handTiles, dt = this.discardedTiles, ui = this.userInfo;
        for (var i = 0; i < 4; i++) {
            //userInfo
            ui[i] = new UserInfo(i % 2 == 0, "鸣海步", "http://img1.comic.zongheng.com/comic/image/2009/1/nuexue/240_240/20090219125722535327.jpg");
            this.addChild(ui[i]);
            ui[i].x = props.ux[i];
            ui[i].y = props.uy[i];
            //shownTiles & handTiles
            var sprite = new egret.Sprite();
            st[i] = new TileSet(i, [1, 4, 7, 12, 32, 27, 9], 7);
            ht[i] = new TileSet(i + 4, [1, 4, 7, 12, 32, 27, 9], 7);
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
            console.log("width:" + st[i].width + "   measureWidth:" + st[i].measuredWidth);
            ht[i].y = (sprite.height - ht[i].height) / 2;
            ht[i].scaleX = props.scale[i + 4];
            ht[i].scaleY = props.scale[i + 4];
            sprite.x = props.x[i];
            sprite.y = props.y[i];
            sprite.rotation = props.rotation[i];
            //discardedTiles
            dt[i] = new TileSet(i + 8, [1, 4, 7, 12, 32, 27, 9], 7, 8 - i % 2 * 2);
            this.addChild(dt[i]);
            dt[i].x = props.x[i + 4];
            dt[i].y = props.y[i + 4];
            dt[i].rotation = props.rotation[i];
            dt[i].scaleX = props.scale[i + 8];
            dt[i].scaleY = props.scale[i + 8];
        }
        return;
        // var umat = [
        //     [],
        //     [],
        //     [],
        //     []
        // ];
        // for (var i = 0; i < 4; i++) {
        //     this.userInfo[i] = new UserInfo("user" + i, null, i % 2 == 0);
        //     this.userInfo[i].x = umat[0][i];
        //     this.userInfo[i].y = umat[1][i];
        //     this.userInfo[i].scaleX = umat[2][i];
        //     this.userInfo[i].scaleY = umat[3][i];
        // }
    };
    p.updateState = function () {
    };
    return Manager;
}(egret.Sprite));
egret.registerClass(Manager,'Manager');
//# sourceMappingURL=manager.js.map