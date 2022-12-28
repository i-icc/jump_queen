class Stage {
    constructor(stageSize, w, h) {
        this.stageImages = [];
        this.starts = [];
        // map 読み込み
        // map の配列にしよう ステージ自体はmap 管理は配列
        fetch("./imgs/stage/stages.json")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.stages = data;
            });

        this.w = w;
        this.h = h;

        for (let i = 0; i < stageSize; i++) {
            this.stageImages.push(new Image());
            this.stageImages[i].src = "./imgs/stage/" + i + ".png";
        }
        for (let i = 0; i < 3; i++) {
            this.starts.push(new Image());
            this.starts[i].src = "./imgs/stage/start" + i + ".png";
        }
    }

    checkTouch(x, y, realY, charaWidth, charaHeight) {
        if (!this.stages) return false, false, false, true;
        const floor = realY / this.h | 0;
        let touchRight = false;
        let touchLeft = false;
        let touchTop = false;
        let touchButtom = false;
        // 右がついているか
        if (y < this.h) {
            touchRight = this.stages[floor].map(row => row[x + charaWidth]).slice(y + charaHeight / 10, Math.min(y + charaHeight / 5 * 4, this.h)).includes(0);
        }
        // 左がついているか
        if (y < this.h) {
            touchLeft = this.stages[floor].map(row => row[x]).slice(y + charaHeight / 10, Math.min(y + charaHeight / 5 * 4, this.h)).includes(0);
        }
        // 頭がついているか
        if (y < this.h) {
            touchTop = this.stages[floor][y | 0].slice(x + charaWidth / 3, x + charaWidth / 3 * 2).includes(0);
        }
        // 足が地面についているか
        if (y + charaHeight < this.h) {
            touchButtom = this.stages[floor][y + charaHeight | 0].slice(x + charaWidth/5*2, x + charaWidth/5*3).includes(0);
            // touchButtom = this.stages[floor][y + charaHeight | 0][x + charaWidth / 2 | 0] == 0;
        }

        return [touchRight, touchLeft, touchTop, touchButtom];
    }

    draw(ctx, y) {
        const floor = y / this.h | 0;
        ctx.drawImage(
            this.stageImages[floor], 0, 0, this.w, this.h
        );
    }

    drawStart(ctx, startIndex) {
        ctx.drawImage(
            this.starts[startIndex], 0, 0, this.w, this.h
        );
    }
}



let stage = new Stage(6, 800, 600);

export default stage;