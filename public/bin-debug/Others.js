var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo(isHorizontal, name, user_no) {
        if (isHorizontal === void 0) { isHorizontal = true; }
        if (name === void 0) { name = "Offline"; }
        if (user_no === void 0) { user_no = -1; }
        _super.call(this);
        this.is_horizontal = isHorizontal;
        this.name_field = new egret.TextField();
        this.name_field.size = 25;
        this.avatar = new egret.Bitmap(RES.getRes("avatar_json.default"));
        this.setName(name);
        this.setAvatar(user_no);
        this.addChild(this.name_field);
        this.addChild(this.avatar);
        this.name_field.y = 72;
    }
    UserInfo.prototype.setName = function (name) {
        // if (name.length > 6) {
        //     name = name.substring(0, 5) + "...";
        // }
        if (this.name != name) {
            this.name = name;
            if (name.indexOf('AI') >= 0) {
                this.name_field.text = name.slice(0, 2) + '\r\n' + name.slice(2, name.length);
            }
            else {
                this.name_field.text = name;
            }
            var index = ['晓氡', '晓镧', '晓锡', '晓钡'].indexOf(name.slice(0, 2));
            if (index >= 0) {
                this.setAvatar(index);
            }
        }
    };
    UserInfo.prototype.setAvatar = function (user_no) {
        if (user_no === void 0) { user_no = -1; }
        if (user_no >= 0 && user_no < 4) {
            this.avatar.texture = RES.getRes("avatar_json.user" + user_no);
            this.avatar.width = 72;
            this.avatar.height = 72;
        }
    };
    return UserInfo;
}(egret.Sprite));
var LeftTiles = (function (_super) {
    __extends(LeftTiles, _super);
    function LeftTiles(Num) {
        if (Num === void 0) { Num = 0; }
        _super.call(this);
        this.hintText = new egret.TextField();
        this.addChild(this.hintText);
        this.setNum(Num);
    }
    LeftTiles.prototype.setNum = function (Num) {
        this.hintText.text = '剩余\r\n' + Num.toString() + ' 张';
    };
    return LeftTiles;
}(egret.Sprite));
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.call(this);
        this.btn_box = new egret.Bitmap(RES.getRes("button_json.rect"));
        this.btn_box.width = uiparams.btn_restart.width;
        this.btn_box.height = uiparams.btn_restart.height;
        this.addChild(this.btn_box);
        // let shp:egret.Shape = new egret.Shape();
        // shp.graphics.beginFill( 0xf93056, 1);
        // shp.graphics.drawRect( 0, 0, this.btn_box.width, this.btn_box.height );
        // shp.graphics.endFill();
        // this.addChild( shp );
        this.btn_txt = new egret.TextField();
        this.btn_txt.width = uiparams.btn_restart.width;
        this.btn_txt.height = uiparams.btn_restart.height;
        this.btn_txt.text = ['START', 'RESTART'][1];
        this.btn_txt.size = 50;
        this.btn_txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.btn_txt.textAlign = egret.HorizontalAlign.CENTER;
        this.btn_txt.textColor = 0xFFFFFF;
        this.addChild(this.btn_txt);
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }
    Button.prototype.setEvent = function (btn) {
        this.btn_txt.text = ['START', 'RESTART'][btn];
    };
    Button.prototype.onTouchButton = function (event) {
        manager.socket_handler.sendEvent(this.btn_txt.text.toLowerCase());
        // if(this.btn_txt.text=='START'){
        //     manager.socket_handler.sendEvent('start');
        // }
        // else if(this.btn_txt.text=='RESTART'){
        //     manager.socket_handler.sendEvent('restart');
        // }
    };
    return Button;
}(egret.Sprite));
