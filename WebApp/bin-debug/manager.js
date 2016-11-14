var Manager = (function (_super) {
    __extends(Manager, _super);
    function Manager() {
        _super.call(this);
        this.userInfo = new Array(4);
        this.shownTiles = new Array(4);
        this.handTiles = new Array(4);
        this.discardedTiles = new Array(4);
        this.adaptUI();
    }
    var d = __define,c=Manager,p=c.prototype;
    p.adaptUI = function () {
        var mat = [
            [100, 150, 1000, 950],
            [550, 100, 100, 550],
            [0, 90, 180, -90],
            [0.8, 0.8, 0.8, 0.8]]; //scale
        var ts = [this.shownTiles, this.handTiles, this.discardedTiles];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                ts[i][j] = new TileSet(i * 4 + j, [1, 4, 7, 12, 32, 27, 31], 7);
                this.addChild(ts[i][j]);
                ts[i][j].x = mat[0][i * 4 + j];
                ts[i][j].y = mat[1][i * 4 + j];
                ts[i][j].rotation = mat[2][i * 4 + j];
                ts[i][j].scaleX = mat[3][i * 4 + j];
                ts[i][j].scaleY = mat[3][i * 4 + j];
            }
            break;
        }
        return;
        var umat = [
            [],
            [],
            [],
            []
        ];
        for (var i = 0; i < 4; i++) {
            this.userInfo[i] = new UserInfo("user" + i, null, i % 2 == 0);
            this.userInfo[i].x = umat[0][i];
            this.userInfo[i].y = umat[1][i];
            this.userInfo[i].scaleX = umat[2][i];
            this.userInfo[i].scaleY = umat[3][i];
        }
    };
    p.updateState = function () {
    };
    return Manager;
}(egret.Sprite));
egret.registerClass(Manager,'Manager');
//# sourceMappingURL=manager.js.map