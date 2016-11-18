var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo(isHorizontal, name, avatar) {
        if (isHorizontal === void 0) { isHorizontal = true; }
        if (name === void 0) { name = "not login"; }
        if (avatar === void 0) { avatar = ""; }
        _super.call(this);
        this.isHorizontal = isHorizontal;
        this.nameField = new egret.TextField();
        this.avatar = new egret.Bitmap(RES.getRes("default_avatar"));
        this.setName(name);
        this.setAvatar(avatar);
        this.addChild(this.nameField);
        this.addChild(this.avatar);
        this.nameField.y = 72;
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
            RES.getResByUrl(avatar, this.onAvatarLoaded, this);
        }
    };
    p.onAvatarLoaded = function (event) {
        // this.avatar.bitmapData = event.currentTarget.data;
        this.avatar.texture = event;
        this.avatar.width = 72;
        this.avatar.height = 72;
    };
    return UserInfo;
}(egret.Sprite));
egret.registerClass(UserInfo,'UserInfo');
//# sourceMappingURL=UserInfo.js.map