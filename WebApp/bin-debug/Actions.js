var ACTION;
(function (ACTION) {
    ACTION[ACTION["Chow"] = 0] = "Chow";
    ACTION[ACTION["Pong"] = 1] = "Pong";
    ACTION[ACTION["Kong"] = 2] = "Kong";
    ACTION[ACTION["Win"] = 3] = "Win";
    ACTION[ACTION["Ready"] = 4] = "Ready";
    ACTION[ACTION["Pass"] = 5] = "Pass";
    ACTION[ACTION["Discard"] = 6] = "Discard";
})(ACTION || (ACTION = {})); //吃/碰/杠/胡/听/过/打 牌
var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions() {
        _super.call(this);
        this.actions = new Array();
    }
    var d = __define,c=Actions,p=c.prototype;
    p.setActions = function (actions, tiles) {
        if (tiles === void 0) { tiles = []; }
        this.actionTiles = tiles;
        actions.sort();
        for (var i = 0, len = actions.length; i < len; i++) {
            var action = new Action(actions[i]);
            this.addChild(action);
            action.x = this.width + 10;
            action.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAction, this);
        }
        //to be tiles
    };
    p.onTouchAction = function (event) {
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
        var pairLength = 0; // Chow=3,Ready=1
        switch (action) {
            case ACTION.Ready:
                pairLength = 1;
            case ACTION.Chow:
                //if 多种方案可以吃
                // now only for Chow, to be done for Ready(pairLength=1)
                if (pairLength == 0) {
                    pairLength = 3;
                    if (this.actionTiles.length % pairLength != 0) {
                        console.log("不合理啊不合理，吃的牌组必需得是3的倍数啊:" + this.actionTiles.length);
                    }
                }
                if (this.actionTiles != null) {
                    var pairs = new Array();
                    for (var i = 0, len = this.actionTiles.length; i < len / pairLength; i++) {
                        //新建2个吃的牌组，点击，返回
                        pairs[i] = new TileSet(this.actionTiles.slice(i * pairLength, (i + 1) * pairLength - 1));
                        pairs[i].x = -(pairs[i].width + 10) * i;
                        pairs[i].flag = i;
                        this.addChild(pairs[i]);
                        pairs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
                            //how to 通讯,return 一个flag还需要
                            var target = event.currentTarget;
                            GlobalData.tile = target.flag;
                            target.y = -target.y - 20; // to be removed
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
    };
    return Actions;
}(egret.Sprite));
egret.registerClass(Actions,'Actions');
var Action = (function (_super) {
    __extends(Action, _super);
    function Action(action) {
        _super.call(this);
        this.action = action;
        this.img = new egret.Bitmap(RES.getRes("actions." + ACTION[this.action]));
        this.addChild(this.img);
    }
    var d = __define,c=Action,p=c.prototype;
    p.getAction = function () {
        return this.action;
    };
    return Action;
}(egret.Sprite));
egret.registerClass(Action,'Action');
//# sourceMappingURL=Actions.js.map