var GameDirector = (function (_super) {
    __extends(GameDirector, _super);
    function GameDirector() {
        _super.call(this);
        //所有锚点在正中
        //indicator 图片方向朝me，0
        var indicator = new egret.Bitmap(RES.getRes("Indicator"));
        indicator.anchorOffsetX = indicator.width / 2;
        indicator.anchorOffsetY = indicator.height / 2;
        this.indicator = indicator;
        this.addChild(this.indicator);
        // Remaining Time
        var timeText = new egret.TextField();
        timeText.text = "45";
        timeText.textAlign = egret.HorizontalAlign.CENTER;
        timeText.textAlign = egret.VerticalAlign.MIDDLE;
        timeText.anchorOffsetX = timeText.width / 2;
        timeText.anchorOffsetY = timeText.height / 2;
        //Direcotor
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        this.setPlayer(0);
    }
    var d = __define,c=GameDirector,p=c.prototype;
    p.setPlayer = function (player) {
        if (player >= 0 && player < 4) {
            this.indicator.rotation = player * 90;
        }
    };
    p.timer = function (time) {
        if (time === void 0) { time = 60; }
        //60s default
    };
    return GameDirector;
}(egret.Sprite));
egret.registerClass(GameDirector,'GameDirector');
//# sourceMappingURL=Directors.js.map