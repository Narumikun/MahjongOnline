class UserInfo extends egret.Sprite {
    private nameField: egret.TextField;
    private avatar: egret.Bitmap;
    public isHorizontal: boolean;
    public constructor(name: string = "not login", avatar: string = "", isHorizontal: boolean = true) {
        super();
        this.isHorizontal = isHorizontal;
        this.nameField = new egret.TextField();
        this.avatar = new egret.Bitmap(RES.getRes("defaultAvatar"));
        this.setName(name);
        this.setAvatar(avatar);
        this.addChild(this.nameField);
        this.addChild(this.avatar);
    }

    public setName(name: string) {
        if (name.length > 6) {
            name = name.substring(0, 5) + "...";
        }
        this.nameField.text = name;
    }

    public setAvatar(avatar: string) {
        if (avatar != "") {
            // RES.getResByUrl(avatar, this.onAvatarLoaded, this);
            RES.getResByUrl(avatar, function (event) {
                this.avatar.texture = <egret.Texture>event;
            }, this);
        }
    }
    // private onAvatarLoaded(event:any) {
    //     this.avatar.texture = <egret.Texture>event;
    // }
}

class TileSet extends egret.Sprite{
    public tiles: Array<number>;
    public sprites: Array<Tile>;
    public boxStyle: number; //0~7;0亮牌-1手牌,box style

    public static tileWidth: number[] = [54, 48, 54, 48, 54, 38, 54, 38];
    public static tileHeight: number[] = [70, 70, 70, 70, 70, 32, 70, 32];

    public constructor(boxStyle: number = 4, tiles: Array<number> = new Array<number>(),
                       length: number = 0) {
        super();
        if (boxStyle < 0 || boxStyle > 11) {
            boxStyle = 4;
        }
        this.boxStyle = boxStyle;
        if ((boxStyle < 5 || boxStyle > 7) && tiles != null) {
            this.tiles = tiles;
        } else {
            this.tiles = new Array<number>(length);
        }
        this.sprites = new Array<Tile>(this.tiles.length);
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
        if (this.boxStyle > 7) {
            var maxLength: number = 6;
        } else {
            var maxLength: number = 20;
        }

        for (var i = 0, len = this.tiles.length; i < len; i++){
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
    }

    private onTouchTile(event: egret.TouchEvent) {
        for (let sprite of this.sprites) {
            sprite.y = 0;
        }
        event.currentTarget.y = -event.currentTarget.y - event.currentTarget.height / 3;
    }
}

class Tile extends egret.Sprite {
    public box: number;
    public card: number;

    public constructor(box: number=null, card: number = -1) {
        super();
        if (box < 0 || box > 11) {
            this.box = 4;
            this.card = -1;
        } else if (box >=5&&box<=7) { // 其他三方手牌 不可见
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