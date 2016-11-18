class GameDirector extends egret.Sprite {
    private indicator: egret.Bitmap;
    private remainingTime: egret.TextField;// to be 
    public constructor() {
        super();
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
    public setPlayer(player: number) {
        if (player >= 0 && player < 4) {
            this.indicator.rotation = player * 90;
            //start timer
        }
    }

    private timer(time: number = 60) {
        //60s default
    }

}