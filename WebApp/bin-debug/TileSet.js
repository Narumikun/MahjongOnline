var TileSet = (function (_super) {
    __extends(TileSet, _super);
    function TileSet(tiles, boxStyle, length, maxLength) {
        if (tiles === void 0) { tiles = []; }
        if (boxStyle === void 0) { boxStyle = 4; }
        if (length === void 0) { length = 0; }
        if (maxLength === void 0) { maxLength = 20; }
        _super.call(this);
        this.maxLength = maxLength;
        if (boxStyle < 0 || boxStyle > 11) {
            boxStyle = 4;
        }
        this.boxStyle = boxStyle;
        if ((boxStyle < 5 || boxStyle > 7) && tiles != null) {
            this.tiles = tiles;
        }
        else {
            this.tiles = new Array(length);
        }
        this.imgTiles = new Array(this.tiles.length);
        this.render();
    }
    var d = __define,c=TileSet,p=c.prototype;
    p.setTiles = function (tiles) {
        if (this.boxStyle < 5 || this.boxStyle > 7) {
            if (tiles != this.tiles) {
                this.tiles = tiles;
                this.render();
            }
        }
    };
    p.setLength = function (length) {
        if (length != this.tiles.length && length >= 0) {
            this.tiles.length = length;
            this.render();
        }
    };
    p.render = function () {
        this.removeChildren();
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            this.imgTiles[i] = new Tile(this.boxStyle, this.tiles[i]);
            this.imgTiles[i].x = (i % this.maxLength) * TileSet.tileWidth[this.boxStyle % 8];
            this.imgTiles[i].y = Math.floor(i / this.maxLength) * TileSet.tileHeight[this.boxStyle % 8];
            if (this.boxStyle == 4) {
                console.log("style: " + this.boxStyle);
                // this.touchEnabled = true;
                this.imgTiles[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTile, this);
            }
            // this.sprites[i] = tile;
            this.addChild(this.imgTiles[i]);
        }
        if (this.boxStyle % 4 == 3 || this.boxStyle == 10) {
            //逆序排列
            for (var i = 0, len = this.tiles.length; i < len / 2; i++) {
                this.swapChildren(this.imgTiles[i], this.imgTiles[len - i - 1]);
            }
        }
    };
    p.onTouchTile = function (event) {
        if (event.currentTarget.y != 0) {
            event.currentTarget.y = 0;
        }
        else {
            for (var _i = 0, _a = this.imgTiles; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.y = 0;
            }
            event.currentTarget.y = -event.currentTarget.height / 5;
        }
        return;
        console.log("touch tile");
        var target = event.currentTarget;
        if (target.y != 0) {
            target.y = 0;
            GlobalData.tile = null;
        }
        else {
            for (var _b = 0, _c = this.imgTiles; _b < _c.length; _b++) {
                var sprite = _c[_b];
                sprite.y = 0;
            }
            target.y = -target.height / 5;
            GlobalData.tile = target.getTile(); //get tile No.
        }
    };
    TileSet.tileWidth = [54, 48, 54, 48, 54, 38, 54, 38];
    TileSet.tileHeight = [66, 66, 66, 66, 66, 32, 66, 32];
    return TileSet;
}(egret.Sprite));
egret.registerClass(TileSet,'TileSet');
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(box, card) {
        if (box === void 0) { box = null; }
        if (card === void 0) { card = -1; }
        _super.call(this);
        if (box < 0 || box > 11) {
            this.box = 4;
            this.card = -1;
        }
        else if (box >= 5 && box <= 7) {
            this.box = box;
            this.card = -1;
        }
        else {
            box = box % 8;
            this.box = box;
            if (card < 0 || card > 41) {
                card = -1;
            }
            this.card = card;
        }
        this.render();
    }
    var d = __define,c=Tile,p=c.prototype;
    p.getTile = function () {
        return this.card;
    };
    p.render = function () {
        var imgBox = new egret.Bitmap(RES.getRes('tiles.box' + this.box));
        this.addChild(imgBox);
        if (this.card == -1) {
            return;
        }
        var imgCard = new egret.Bitmap(RES.getRes("tiles." + this.card));
        this.addChild(imgCard);
        switch (this.box) {
            case 0:
                imgCard.x = (imgBox.width - imgCard.width) / 2;
                break;
            case 1:
                imgCard.y = (imgBox.height - imgCard.height) / 2;
                break;
            case 2:
                imgCard.x = (imgBox.width - imgCard.width) / 2;
                imgCard.y = imgBox.height - imgCard.height;
                break;
            case 3:
                imgCard.x = imgBox.width - imgCard.width;
                imgCard.y = (imgBox.height - imgCard.height) / 2;
                break;
            case 4:
                imgCard.x = (imgBox.width - imgCard.width) / 2;
                imgCard.y = imgBox.height - imgCard.height;
                break;
            default:
                console.log('不匹配：card=' + this.card + " & box=" + this.box);
                break;
        }
    };
    return Tile;
}(egret.Sprite));
egret.registerClass(Tile,'Tile');
//# sourceMappingURL=TileSet.js.map