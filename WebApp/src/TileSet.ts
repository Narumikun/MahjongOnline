class TileSet extends egret.Sprite{
    public tiles: Array<number>;
    public sprites: Array<Tile>;
    public boxStyle: number; //0~7;0亮牌-1手牌,box style
    public multiLine: boolean; // 10 tiles per line

    public static tileWidth: number[] = [54, 54, 54, 54, 54, 38, 54, 38];
    public static tileHeight: number[] = [70, 70, 70, 70, 70, 32, 70, 32];

    public constructor(boxStyle: number = 6, tiles: Array<number> = new Array<number>(),
                       length: number = 0, multiLine: boolean = false) {
        super();
        this.multiLine = multiLine;
        if (boxStyle < 0 || boxStyle > 7) {
            boxStyle = 6;
        }
        this.boxStyle = boxStyle;
        if (boxStyle <= 4) {
            this.tiles = tiles;
        } else {
            this.tiles = new Array<number>(length);
        }
        this.sprites = new Array<Tile>(this.tiles.length);
        this.render();
    }

    public setTiles(tiles: Array<number>) {
        if (tiles != this.tiles) {
            this.tiles = tiles;
            this.render();	
        }
    }

    public setLength(length: number) {
        if (length != this.tiles.length && length >= 0) {
            this.tiles.length = length;
            this.render();
        }
    }

    private render() {
        console.log(this.tiles);
        this.removeChildren();
        if (this.multiLine) {
            var maxLength: number = 6;
        } else {
            var maxLength: number = 20;
        }
        for (var i = 0, len = this.tiles.length; i < len; i++){
            this.sprites[i] = new Tile(this.boxStyle, this.tiles[i]);
            this.sprites[i].x = (i % maxLength) * TileSet.tileWidth[this.boxStyle];
            this.sprites[i].y = Math.floor(i / maxLength) * TileSet.tileHeight[this.boxStyle];
            if (this.boxStyle == 4) {
                this.sprites[i].touchEnabled = true;
                this.sprites[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTile, this);
            }
            // this.sprites[i] = tile;
            this.addChild(this.sprites[i]);
        }
    }

    private onTouchTile(event: egret.TouchEvent) {
        for (let sprite of this.sprites) {
            sprite.y = 0;
        }
        event.currentTarget.y = -event.currentTarget.y - event.currentTarget.height / 3;
    }
}
/* 
class TileSets extends egret.Sprite {

    public tiles: Array<number>;
    public length: number;
    public boxStyle: number; //0~7;0亮牌-1手牌,box style
    public multiLine: boolean; // 10 tiles per line

    public static tileWidth: number[] = [54, 54, 54, 38, 54, 54, 54, 38];
    public static tileHeight: number[] = [70, 70, 70, 32, 70, 70, 70, 32];

    public constructor(tiles: Array<number> = null,
        boxStyle: number = 0, multiLine: boolean = false) {
        super();
        /TO DO: tileHeight tileWidth by boxStyle
        if (boxStyle < 0 || boxStyle > 7) {
            console.log("boxStyle=" + boxStyle + " 不合法");
            boxStyle = 7;//??
            this.tiles = new Array<number>();
            this.multiLine = false;
        } else if (boxStyle > 4) {
            // 其他三方不可见手牌
            this.tiles = new Array<number>();
            this.boxStyle = boxStyle;
            this.multiLine = false;

        }

        if (boxStyle == 3 || boxStyle == 5 || boxStyle == 7) {
            if (length < 0 || length > 14) {
                console.log("length=" + length + "  超出允许范围");
                length = 0;
            } else {
                this.length = length;
                this.tiles = null;
                this.boxStyle = boxStyle;
                this.multiLine = false;
            }
        } else {
            this.tiles = tiles;
            this.length = tiles.length;
            this.boxStyle = boxStyle;
            this.multiLine = multiLine;
        }
        this.render();
    }

    public setTiles(tiles: Array<number>) {
        if (tiles != this.tiles) {
            this.tiles = tiles;
            this.render();	
        }
    }

    public setLength(length: number) {
        //to do: exception
        if (length != this.tiles.length && length >= 0) {
            this.tiles = new Array<number>(length);
            this.render();
        }
    }

    private render() {
        this.removeChildren();
        if (this.length == 0) {
            return;
        }
        for (var i = 0; i < this.length; i++) {
            // rend tile
            try {
                var tile = this.rendTile(this.tiles[i]);
            } catch (e) {
                var tile = this.rendTile();
            }
            if (this.multiLine) {
                tile.x = (i % 6) * TileSet.tileWidth[this.boxStyle];
                tile.y = Math.floor(i / 6) * TileSet.tileHeight[this.boxStyle];
            } else {
                tile.x = i * TileSet.tileWidth[this.boxStyle];
            }
            console.log("style=" + this.boxStyle);
            if (this.boxStyle == 1) {
                // my hans tilea
                tile.touchEnabled = true;
                tile.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTile, this);
            }
            this.addChild(tile);
        }
    }

    private rendTile(tileNum: number = -1): egret.Sprite {
        var sprite = new egret.Sprite();
        var imgBox = new egret.Bitmap(RES.getRes('tiles.box' + this.boxStyle));
        sprite.addChild(imgBox);
        if (tileNum == -1) { //其他三方手牌不可见牌面
            return sprite;
        }
        var imgTile = new egret.Bitmap(RES.getRes("tiles." + tileNum));
        switch (this.boxStyle) {
            case 0:
                imgTile.x = (imgBox.width - imgTile.width) / 2;
                break;
            case 1:
                imgTile.x = (imgBox.width - imgTile.width) / 2;
                imgTile.y = imgBox.height - imgTile.height;
                break;
            case 2:
                imgTile.y = (imgBox.height - imgTile.height) / 2;
                break;
            case 3:
                console.log('bug: tileNum!=-1 & boxStyle=3 不合法');
                break;
            case 4:
                imgTile.x = (imgBox.width - imgTile.width) / 2;
                imgTile.y = imgBox.height - imgTile.height;
                break;
            case 5:
                console.log('bug: tileNum!=-1 & boxStyle=5 不合法');
                break;
            case 6:
                imgTile.x = imgBox.width - imgTile.width;
                imgTile.y = (imgBox.height - imgTile.height) / 2;
                break;
            case 7:
                console.log('bug: tileNum!=-1 & boxStyle=7 不合法');
                break;
            default:
                console.log('boxStyle 不合法');
                break;
        }
        sprite.addChild(imgTile);

        return sprite;
    }

    private onTouchTile(evt: egret.TouchEvent) {
        evt.currentTarget.y = -evt.currentTarget.y - evt.currentTarget.height / 3;
        //flag: selected
    }
}
*/


class Tile extends egret.Sprite {
    public box: number;
    public card: number;

    public constructor(box: number=null, card: number = -1) {
        super();
        if (box < 0 || box > 7) {
            this.box = 4;
            this.card = -1;
        } else if (box > 4) { // 其他三方手牌 不可见
            this.box = box;
            this.card = -1;
        } else {
            this.box = box;
            if (card < 0 || card > 41) {
                card = -1;
            }
            this.card = card;
        }
        this.rend();
    }


    private rend() {
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