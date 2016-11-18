
class TileSet extends egret.Sprite {
    public flag: any;// 用于上层结构的各种标记用

    private tiles: Array<number>;
    private imgTiles: Array<Tile>;
    private boxStyle: number; //0~7;0亮牌-1手牌,box style
    private maxLength: number;
    public static tileWidth: number[] = [54, 48, 54, 48, 54, 38, 54, 38];
    public static tileHeight: number[] = [66, 66, 66, 66, 66, 32, 66, 32];

    public constructor(tiles: number[] = [], boxStyle: number = 4,
        length: number = 0, maxLength: number = 20) {
        super();
        this.maxLength = maxLength;
        if (boxStyle < 0 || boxStyle > 11) {
            boxStyle = 4;
        }
        this.boxStyle = boxStyle;
        if ((boxStyle < 5 || boxStyle > 7) && tiles != null) {
            this.tiles = tiles;
        } else {
            this.tiles = new Array<number>(length);
        }
        this.imgTiles = new Array<Tile>(this.tiles.length);
        this.render();
    }

    public setTiles(tiles: Array<number>) {
        if (this.boxStyle < 5 || this.boxStyle > 7) {
            if (tiles != this.tiles) {
                this.tiles = tiles;
                this.render();
            }
        }
    }

    public setLength(length: number) {
        if (length != this.tiles.length && length >= 0) {
            this.tiles.length = length;
            this.render();
        }
    }

    private render() {
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
    }

    private onTouchTile(event: egret.TouchEvent) {
        if (event.currentTarget.y != 0) {
            event.currentTarget.y = 0;
        } else {
            for (let sprite of this.imgTiles) {
                sprite.y = 0;
            }
            event.currentTarget.y = - event.currentTarget.height / 5;
        }
        return;
        console.log("touch tile");
        var target = event.currentTarget;
        if (target.y != 0) {
            target.y = 0;
            GlobalData.tile = null;
        } else {
            for (let sprite of this.imgTiles) {
                sprite.y = 0;
            }
            target.y = - target.height / 5;
            GlobalData.tile = target.getTile();//get tile No.
        }
    }
}

class Tile extends egret.Sprite {
    public flag: any;//用于上级标记
    private box: number;
    private card: number;

    public constructor(box: number = null, card: number = -1) {
        super();
        if (box < 0 || box > 11) {
            this.box = 4;
            this.card = -1;
        } else if (box >= 5 && box <= 7) { // 其他三方手牌 不可见
            this.box = box;
            this.card = -1;
        } else {
            box = box % 8;
            this.box = box;
            if (card < 0 || card > 41) {
                card = -1;
            }
            this.card = card;
        }
        this.render();
    }

    public getTile() {
        return this.card;
    }

    private render() {
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
    }
}


