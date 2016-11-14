var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo(name, avatar, isHorizontal) {
        if (name === void 0) { name = "not login"; }
        if (avatar === void 0) { avatar = ""; }
        if (isHorizontal === void 0) { isHorizontal = true; }
        _super.call(this);
        this.isHorizontal = isHorizontal;
        this.nameField = new egret.TextField();
        this.avatar = new egret.Bitmap(RES.getRes("defaultAvatar"));
        this.setName(name);
        this.setAvatar(avatar);
        this.addChild(this.nameField);
        this.addChild(this.avatar);
    }
    var d = __define,c=UserInfo,p=c.prototype;
    p.setName = function (name) {
        if (name.length > 6) {
            name = name.substring(0, 5) + "...";
        }
        this.nameField.text = name;
    };
    p.setAvatar = function (avatar) {
        if (avatar != "") {
            // RES.getResByUrl(avatar, this.onAvatarLoaded, this);
            RES.getResByUrl(avatar, function (event) {
                this.avatar.texture = event;
            }, this);
        }
    };
    return UserInfo;
}(egret.Sprite));
egret.registerClass(UserInfo,'UserInfo');
var TileSet = (function (_super) {
    __extends(TileSet, _super);
    function TileSet(boxStyle, tiles, length) {
        if (boxStyle === void 0) { boxStyle = 4; }
        if (tiles === void 0) { tiles = new Array(); }
        if (length === void 0) { length = 0; }
        _super.call(this);
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
        this.sprites = new Array(this.tiles.length);
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
        if (this.boxStyle > 7) {
            var maxLength = 6;
        }
        else {
            var maxLength = 20;
        }
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            this.sprites[i] = new Tile(this.boxStyle, this.tiles[i]);
            this.sprites[i].x = (i % maxLength) * TileSet.tileWidth[this.boxStyle % 8];
            this.sprites[i].y = Math.floor(i / maxLength) * TileSet.tileHeight[this.boxStyle];
            if (this.boxStyle == 4) {
                this.sprites[i].touchEnabled = true;
                this.sprites[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTile, this);
            }
            // this.sprites[i] = tile;
            this.addChild(this.sprites[i]);
        }
        if (this.boxStyle % 4 == 3) {
            //逆序排列
            for (var i = 0, len = this.tiles.length; i < len / 2; i++) {
                this.swapChildren(this.sprites[i], this.sprites[len - i - 1]);
            }
        }
    };
    p.onTouchTile = function (event) {
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.y = 0;
        }
        event.currentTarget.y = -event.currentTarget.y - event.currentTarget.height / 3;
    };
    TileSet.tileWidth = [54, 48, 54, 48, 54, 38, 54, 38];
    TileSet.tileHeight = [70, 70, 70, 70, 70, 32, 70, 32];
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