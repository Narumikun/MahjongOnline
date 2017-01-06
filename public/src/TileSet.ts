class TileSet extends egret.Sprite {
    public flag: any;// 用于上层结构的各种标记用

    private tiles: Array<number>;
    private imgTiles: Array<Tile>;
    private boxStyle: number; // 0~7;0亮牌-1手牌,box style
    private maxLength: number;
    private tileTouchEnable: boolean;
    public static tileWidth: number[] = [54, 48, 54, 48, 54, 38, 54, 38];
    public static tileHeight: number[] = [66, 66, 66, 66, 66, 32, 66, 32];

    public constructor(tiles: number[] = [], boxStyle: number = 4,
                       length: number = 0, maxLength: number = 20, touch = false) {
        super();
        this.tileTouchEnable = touch;
        this.maxLength = maxLength;

        this.boxStyle = boxStyle;
        this.tiles = tiles;

        this.imgTiles = new Array<Tile>(this.tiles.length);
        this.render();
    }

    public setTiles(tiles: Array<number>, winner: Array<number> = [0, 0, 0, 0], box: number = 0) {
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
    }

    public setLength(length: number) {
        //useless
        if (length != this.tiles.length && length >= 0) {
            this.tiles.length = length;
            this.render();
        }
    }

    private render(isOver: boolean = false) {
        this.removeChildren();
        for (let i = 0, len = this.tiles.length; i < len; i++) {
            if (isOver) {
                this.imgTiles[i] = new Tile(this.boxStyle, this.tiles[i] < 0 ? -this.tiles[i] - 1 : this.tiles[i]);
            }
            else if (this.boxStyle >= 0 && this.boxStyle < 4) {
                //showntile
                if (this.tiles[i] < 0) {
                    this.imgTiles[i] = new Tile(this.boxStyle + 12, -this.tiles[i] - 1);
                } else {
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
            for (let i = 0, len = this.tiles.length; i < len / 2; i++) {
                this.swapChildren(this.imgTiles[i], this.imgTiles[len - i - 1]);
            }
        }
        if (this.imgTiles.length > 1) {
            if (this.boxStyle == 4 && GlobalData.state['drawn'] == this.tiles[this.tiles.length - 1]) {
                // TODO
                // console.log('imgTiles.length' + this.imgTiles.length);
                this.imgTiles[this.imgTiles.length - 1].x += 20;
            }
        }
    }

    private onTouchTile(event: egret.TouchEvent) {

        if (event.currentTarget.y != 0) {
            event.currentTarget.y = 0;
            GlobalData.tile = -1;
        } else {
            for (let sprite of this.imgTiles) {
                sprite.y = 0;
            }
            event.currentTarget.y = -event.currentTarget.height / 5;
            GlobalData.tile = event.currentTarget.getTile();
        }
        return;
    }
}

class Tile extends egret.Sprite {
    public flag: any;//用于上级标记
    private box: number;
    private card: number;
    private img_card: egret.Bitmap;
    private img_box: egret.Bitmap;

    public constructor(box: number = 4, card: number = -1) {
        super();
        if (box < 0 || box >= 16) {
            this.box = 4;
            this.card = -1
        } else if (box >= 12 && box < 16) {
            this.box = box;
            this.card = -1;
        } else if (box >= 5 && box < 8) { // 其他三方手牌 不可见
            this.box = box;
            this.card = -1;
        } else {
            box = box % 8;
            this.box = box;
            this.card = card;
        }
        this.render();
    }

    public getTile() {
        return this.card;
    }

    public setTile(card: number = -1) {
        this.img_card.texture = RES.getRes("tiles_json." + card);
        this.adjustPos();
    }

    private render() {
        this.img_box = new egret.Bitmap(RES.getRes('tiles_json.box' + this.box));
        this.addChild(this.img_box);
        if (this.card == -1) {
            return;
        }
        this.img_card = new egret.Bitmap(RES.getRes("tiles_json." + this.card));
        this.addChild(this.img_card);
        this.adjustPos();
    }

    private adjustPos() {
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
    }
}
