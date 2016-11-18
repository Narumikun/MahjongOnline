enum ACTION {Chow, Pong, Kong, Win, Ready, Pass, Discard}//吃/碰/杠/胡/听/过/打 牌

class Actions extends egret.Sprite {
    private actions: Array<Action>;
    private actionTiles: number[];
    public constructor() {
        super();
        this.actions = new Array<Action>();
    }
    public setActions(actions: ACTION[], tiles: number[] = []) {
        this.actionTiles = tiles;
        actions.sort();
        for (var i = 0, len = actions.length; i < len; i++){
            var action = new Action(actions[i]);
            this.addChild(action);
            action.x = this.width + 10;
            action.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAction, this);
        }
        //to be tiles
    }
    private onTouchAction(event: egret.TouchEvent) {
        var action = event.currentTarget.action;
        if (action == ACTION.Discard) {
            if (GlobalData.tile == null) {
                console.log("Wrong: Discard but no tile selected.");
                return;
            }
            GlobalData.action = action;
            return;
        }
        //else not Discard
        GlobalData.reset();
        GlobalData.action = action;
        var pairLength = 0;// Chow=3,Ready=1
        switch (action) {
            case ACTION.Ready://similar with Chow 
                pairLength = 1;
            case ACTION.Chow:
                //if 多种方案可以吃
                // now only for Chow, to be done for Ready(pairLength=1)
                if (pairLength == 0) {
                    pairLength = 3;
                    if (this.actionTiles.length % pairLength != 0) {
                        console.log("不合理啊不合理，吃的牌组必需得是3的倍数啊:"+this.actionTiles.length);
                    }
                }
                
                if (this.actionTiles != null) {
                    var pairs = new Array<TileSet>();
                    for (var i = 0, len = this.actionTiles.length; i < len / pairLength; i++){
                        //新建2个吃的牌组，点击，返回
                        pairs[i] = new TileSet(this.actionTiles.slice(i * pairLength, (i + 1) * pairLength - 1));
                        pairs[i].x = -(pairs[i].width + 10) * i;
                        pairs[i].flag = i;
                        this.addChild(pairs[i]);
                        pairs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
                            //how to 通讯,return 一个flag还需要
                            var target = event.currentTarget;
                            GlobalData.tile = target.flag;
                            target.y = -target.y - 20;// to be removed
                         }, this);
                    }
                }
                
                break;
                /** may in default
            case ACTION.Pong:
                break;
            case ACTION.Kong:
                break;
            case ACTION.Win:
                break;
            case ACTION.Pass:
                break;
                 */
            default:
                break;
        }
        //send Data
        
    }
}

class Action extends egret.Sprite {
    private action: ACTION;
    private img: egret.Bitmap;

    constructor(action:ACTION) {
        super();
        this.action = action;
        this.img = new egret.Bitmap(RES.getRes("actions." + ACTION[this.action]));
        this.addChild(this.img);
    }
    
    public getAction() {
        return this.action;
    }
}
