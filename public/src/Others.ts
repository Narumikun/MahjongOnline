
class UserInfo extends egret.Sprite {
    private name_field: egret.TextField;
    private avatar: egret.Bitmap;
    public is_horizontal: boolean;
    private user_name: string;

    public constructor(isHorizontal: boolean = true, name: string = "Offline", user_no: number = -1) {
        super();
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

    public setName(name: string) {
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
            let index = ['晓氡', '晓镧', '晓锡', '晓钡'].indexOf(name.slice(0,2));
            if (index >= 0) {
                this.setAvatar(index);
            }
        }
    }

    public setAvatar(user_no: number=-1) {
        if (user_no >=0 && user_no <4) {
            this.avatar.texture=RES.getRes("avatar_json.user"+user_no);
            this.avatar.width = 72;
            this.avatar.height = 72;
        }
    }
}

class LeftTiles extends egret.Sprite {
    private hintText: egret.TextField;

    constructor(Num: number = 0){
        super();
        this.hintText = new egret.TextField();
        this.addChild(this.hintText);
        this.setNum(Num);
    }

    public setNum(Num: number) {
        this.hintText.text = '剩余\r\n' + Num.toString() + ' 张';
    }
}

class Button extends egret.Sprite {
    private btn_box:egret.Bitmap;
    private btn_txt:egret.TextField;

    public constructor(){
        super();
        this.btn_box=new egret.Bitmap(RES.getRes("button_json.rect"));
        this.btn_box.width = uiparams.btn_restart.width;
        this.btn_box.height = uiparams.btn_restart.height;
        this.addChild(this.btn_box);
        // let shp:egret.Shape = new egret.Shape();
        // shp.graphics.beginFill( 0xf93056, 1);
        // shp.graphics.drawRect( 0, 0, this.btn_box.width, this.btn_box.height );
        // shp.graphics.endFill();
        // this.addChild( shp );

        this.btn_txt=new egret.TextField();
        this.btn_txt.width = uiparams.btn_restart.width;
        this.btn_txt.height = uiparams.btn_restart.height;
        this.btn_txt.text = ['START', 'RESTART'][1];
        this.btn_txt.size=50;
        this.btn_txt.verticalAlign=egret.VerticalAlign.MIDDLE;
        this.btn_txt.textAlign=egret.HorizontalAlign.CENTER;
        this.btn_txt.textColor=0xFFFFFF;
        this.addChild(this.btn_txt);

        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;

        this.touchEnabled=true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchButton,this);

    }

    public setEvent(btn:BTN_EVENT_C){
        this.btn_txt.text=['START','RESTART'][btn];
    }

    private onTouchButton(event:egret.TouchEvent){
        manager.socket_handler.sendEvent(this.btn_txt.text.toLowerCase());
        // if(this.btn_txt.text=='START'){
        //     manager.socket_handler.sendEvent('start');
        // }
        // else if(this.btn_txt.text=='RESTART'){
        //     manager.socket_handler.sendEvent('restart');
        // }
    }
}