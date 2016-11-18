class UserInfo extends egret.Sprite {
    private nameField: egret.TextField;
    private avatar: egret.Bitmap;
    public isHorizontal: boolean;
    public constructor(isHorizontal: boolean = true, name: string = "not login", avatar: string = "") {
        super();
        this.isHorizontal = isHorizontal;
        this.nameField = new egret.TextField();
        this.avatar = new egret.Bitmap(RES.getRes("default_avatar"));
        this.setName(name);
        this.setAvatar(avatar);
        this.addChild(this.nameField);
        this.addChild(this.avatar);
        this.nameField.y = 72;
    }

    public setName(name: string) {
        if (name.length > 6) {
            name = name.substring(0, 5) + "...";
        }
        this.nameField.text = name;
    }

    public setAvatar(avatar: string) {
        if (avatar != "") {
            RES.getResByUrl(avatar, this.onAvatarLoaded, this);
        }
    }

    private onAvatarLoaded(event: any) {
        // this.avatar.bitmapData = event.currentTarget.data;
        this.avatar.texture = <egret.Texture>event;
        this.avatar.width = 72;
        this.avatar.height = 72;
    }
}