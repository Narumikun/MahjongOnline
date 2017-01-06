var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TileSet = (function (_super) {
    __extends(TileSet, _super);
    function TileSet(tiles, boxStyle, length, maxLength, touch) {
        if (tiles === void 0) { tiles = []; }
        if (boxStyle === void 0) { boxStyle = 4; }
        if (length === void 0) { length = 0; }
        if (maxLength === void 0) { maxLength = 20; }
        if (touch === void 0) { touch = false; }
        _super.call(this);
        this.tileTouchEnable = touch;
        this.maxLength = maxLength;
        this.boxStyle = boxStyle;
        this.tiles = tiles;
        this.imgTiles = new Array(this.tiles.length);
        this.render();
    }
    TileSet.prototype.setTiles = function (tiles, winner, box) {
        if (winner === void 0) { winner = [0, 0, 0, 0]; }
        if (box === void 0) { box = 0; }
        if (winner.indexOf(GAME_RESULT_C.Playing) < 0) {
            //game over
            // box = box > 4 ? box % 4 : box;
            this.boxStyle = this.boxStyle % 4;
            this.tiles = tiles;
            this.render(true);
        }
        else if (tiles.toString() != this.tiles.toString()) {
            this.tiles = tiles;
            this.render();
        }
    };
    TileSet.prototype.setLength = function (length) {
        //useless
        if (length != this.tiles.length && length >= 0) {
            this.tiles.length = length;
            this.render();
        }
    };
    TileSet.prototype.render = function (isOver) {
        if (isOver === void 0) { isOver = false; }
        this.removeChildren();
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            if (isOver) {
                this.imgTiles[i] = new Tile(this.boxStyle, this.tiles[i] < 0 ? -this.tiles[i] - 1 : this.tiles[i]);
            }
            else if (this.boxStyle >= 0 && this.boxStyle < 4) {
                //showntile
                if (this.tiles[i] < 0) {
                    this.imgTiles[i] = new Tile(this.boxStyle + 12, -this.tiles[i] - 1);
                }
                else {
                    this.imgTiles[i] = new Tile(this.boxStyle, this.tiles[i]);
                }
            }
            else {
                this.imgTiles[i] = new Tile(this.boxStyle, this.tiles[i]);
            }
            // this.imgTiles[i] = new Tile(this.boxStyle, this.tiles[i]);
            this.imgTiles[i].x = (i % this.maxLength) * TileSet.tileWidth[this.boxStyle % 8];
            this.imgTiles[i].y = Math.floor(i / this.maxLength) * TileSet.tileHeight[this.boxStyle % 8];
            // if (this.boxStyle == 4) {
            if (this.tileTouchEnable == true) {
                this.imgTiles[i].touchEnabled = true;
                this.imgTiles[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTile, this);
            }
            this.addChild(this.imgTiles[i]);
        }
        if (this.boxStyle % 4 == 1 || this.boxStyle % 4 == 2) {
            //逆序排列
            for (var i = 0, len = this.tiles.length; i < len / 2; i++) {
                this.swapChildren(this.imgTiles[i], this.imgTiles[len - i - 1]);
            }
        }
        if (this.imgTiles.length > 1) {
            if (this.boxStyle == 4 && GlobalData.state['drawn'] == this.tiles[this.tiles.length - 1]) {
                // TODO
                console.log('imgTiles.length' + this.imgTiles.length);
                this.imgTiles[this.imgTiles.length - 1].x += 20;
            }
        }
    };
    TileSet.prototype.onTouchTile = function (event) {
        if (event.currentTarget.y != 0) {
            event.currentTarget.y = 0;
            GlobalData.tile = -1;
        }
        else {
            for (var _i = 0, _a = this.imgTiles; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.y = 0;
            }
            event.currentTarget.y = -event.currentTarget.height / 5;
            GlobalData.tile = event.currentTarget.getTile();
        }
        return;
    };
    TileSet.tileWidth = [54, 48, 54, 48, 54, 38, 54, 38];
    TileSet.tileHeight = [66, 66, 66, 66, 66, 32, 66, 32];
    return TileSet;
}(egret.Sprite));
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(box, card) {
        if (box === void 0) { box = 4; }
        if (card === void 0) { card = -1; }
        _super.call(this);
        if (box < 0 || box >= 16) {
            this.box = 4;
            this.card = -1;
        }
        else if (box >= 12 && box < 16) {
            this.box = box;
            this.card = -1;
        }
        else if (box >= 5 && box < 8) {
            this.box = box;
            this.card = -1;
        }
        else {
            box = box % 8;
            this.box = box;
            this.card = card;
        }
        this.render();
    }
    Tile.prototype.getTile = function () {
        return this.card;
    };
    Tile.prototype.setTile = function (card) {
        if (card === void 0) { card = -1; }
        this.img_card.texture = RES.getRes("tiles_json." + card);
        this.adjustPos();
    };
    Tile.prototype.render = function () {
        this.img_box = new egret.Bitmap(RES.getRes('tiles_json.box' + this.box));
        this.addChild(this.img_box);
        if (this.card == -1) {
            return;
        }
        this.img_card = new egret.Bitmap(RES.getRes("tiles_json." + this.card));
        this.addChild(this.img_card);
        this.adjustPos();
    };
    Tile.prototype.adjustPos = function () {
        switch (this.box) {
            case 0:
                this.img_card.x = (this.img_box.width - this.img_card.width) / 2;
                break;
            case 1:
                this.img_card.x = this.img_box.width - this.img_card.width;
                this.img_card.y = (this.img_box.height - this.img_card.height) / 2;
                break;
            case 2:
                this.img_card.x = (this.img_box.width - this.img_card.width) / 2;
                this.img_card.y = this.img_box.height - this.img_card.height;
                break;
            case 3:
                this.img_card.y = (this.img_box.height - this.img_card.height) / 2;
                break;
            case 4:
                this.img_card.x = (this.img_box.width - this.img_card.width) / 2;
                this.img_card.y = this.img_box.height - this.img_card.height;
                break;
            default:
                console.log('不匹配：card=' + this.card + " & box=" + this.box);
                break;
        }
    };
    return Tile;
}(egret.Sprite));
