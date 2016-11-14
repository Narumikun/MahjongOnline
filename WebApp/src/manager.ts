class Manager extends egret.Sprite{
    private userInfo: Array<UserInfo>;
    private shownTiles: Array<TileSet>;
    private handTiles: Array<TileSet>;
    private discardedTiles: Array<TileSet>;

    private curPlayer: number;

    public constructor() {
        super();
        this.userInfo = new Array<UserInfo>(4);
        this.shownTiles = new Array<TileSet>(4);
        this.handTiles = new Array<TileSet>(4);
        this.discardedTiles = new Array<TileSet>(4);
        this.adaptUI();
    }
    private adaptUI() {
        var mat = [	//1136*640
            [100,    150,    1000,   950],	//x
            [550,   100,    100,    550],	//y
            [0,     90,     180,    -90],	//rotation
            [0.8,   0.8,    0.8,    0.8]]	//scale
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
    }
    public updateState() {
        
    }


}