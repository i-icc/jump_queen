class Chara {
  constructor(x, realY, w, h, xd, imgPaths, fieldHeight) {
    this.x = x;
    this.realY = realY;
    this.y = fieldHeight - realY % fieldHeight;
    this.fieldHeight = fieldHeight;
    this.w = w;
    this.h = h;
    // 状態
    // 0: 待機
    // 1: ジャンプ待機
    // 2: ジャンプ＆落下
    // 3: 着地
    // 4: 移動
    this.status = 2;
    // 1フレームでの移動距離
    this.xd = xd;
    this.yd = 0;
    this.yd_min = -16;
    this.g = 0.5;
    // 方向 0:left 1:right -1:真上
    this.direction = 0;
    this.jumpDirection = -1;
    // images
    // 0:left 1:right
    this.standImg = [new Image(), new Image()];
    this.standbyImg = [new Image(), new Image()];
    this.walkImg = [
      [new Image(), new Image()],
      [new Image(), new Image()],
    ];
    this.jumpImg = [new Image(), new Image()];
    // image set
    this.standImg[0].src = imgPaths[0];
    this.standbyImg[0].src = imgPaths[1];
    this.walkImg[0][0].src = imgPaths[2];
    this.walkImg[1][0].src = imgPaths[3];
    this.jumpImg[0].src = imgPaths[4];
    this.standImg[1].src = imgPaths[5];
    this.standbyImg[1].src = imgPaths[6];
    this.walkImg[0][1].src = imgPaths[7];
    this.walkImg[1][1].src = imgPaths[8];
    this.jumpImg[1].src = imgPaths[9];
    // 歩くアニメーションのためのやつ
    this.walkCount = 0;
    this.walkStatus = 0;
    this.walkRate = 8;
    // 尻もちラグ
    this.buttocksCount = 10;
  }

  draw(ctx) {
    switch (this.status) {
      case 0:
        ctx.drawImage(
          this.standImg[this.direction],
          this.x,
          this.y,
          this.w,
          this.h
        );
        break;
      case 1:
        ctx.drawImage(
          this.standbyImg[this.direction],
          this.x,
          this.y,
          this.w,
          this.h
        );
        break;
      case 2:
        ctx.drawImage(
          this.jumpImg[this.direction],
          this.x,
          this.y,
          this.w,
          this.h
        );
        break;
      case 3:
        ctx.drawImage(
          this.standbyImg[this.direction],
          this.x,
          this.y,
          this.w,
          this.h
        );
        break;
      case 4:
        this.walkCount++;
        if (this.walkCount % this.walkRate == 0) {
          this.walkCount = 0;
          this.walkStatus ^= 1;
        }
        ctx.drawImage(
          this.walkImg[this.walkStatus][this.direction],
          this.x,
          this.y,
          this.w,
          this.h
        );
        break;
    }
  }

  walk() {
    this.x -= (-1) ** this.direction * this.xd;
  }

  jump() {
    this.realY -= this.yd;
    this.y = this.fieldHeight - this.realY % this.fieldHeight;
    if (this.jumpDirection >= 0) {
      this.x -= (-1) ** this.jumpDirection * this.xd * 1.5;
    }
    this.yd += this.g;
    if (this.yd > -this.yd_min + 1) this.yd = -this.yd_min + 1;
  }

  wait() {
    this.yd -= 0.5;
    if (this.yd < this.yd_min) this.yd = this.yd_min;
  }

  buttocks() {
    this.buttocksCount -= 1;
    if (this.buttocksCount <= 0) {
      // ここマジックナンバーだからよくない
      this.buttocksCount = 10;
      this.status = 0;
    }
  }

  move(touches) {
    // touchRight, touchLeft, touchTop, touchButtom

    switch (this.status) {
      case 0:
        if (touches[3]) {
          this.realY += 2;
          this.y = this.fieldHeight - this.realY % this.fieldHeight;
        }
        break;
      case 1:
        this.wait();
        break;
      case 2:
        if (touches[2] && this.yd < 0) {
          this.yd = - this.yd * 0.1;
        }
        else if (touches[3] && this.yd > 0) {
          this.status = this.yd > -this.yd_min ? 3 : 0;
          this.yd = 0
          break;
        }
        else if (touches[0] && this.jumpDirection == 1) {
          this.jumpDirection = 0;
        }
        else if (touches[1] && this.jumpDirection == 0) {
          this.jumpDirection = 1;
        }
        this.jump();
        break;
      case 3:
        this.buttocks();
        break;
      case 4:
        if (!touches[3]) {
          this.status = 2
          this.jumpDirection = this.direction;
          break;
        } else if (touches[0] && this.direction == 1 || touches[1] && this.direction == 0) {
          break;
        }
        this.walk();
        break;
    }
  }

  inputKey(left, right, jump) {
    switch (this.status) {
      case 0:
        if (jump) {
          this.yd = -2;
          this.status = 1;
        } else if (left) {
          this.status = 4;
          this.direction = 0;
        } else if (right) {
          this.status = 4;
          this.direction = 1;
        }
        break;
      case 1:
        if (!jump) {
          this.status = 2;
        }
        if (!left && !right) {
          this.jumpDirection = -1;
        } else if (left && this.jumpDirection != 0) {
          this.direction = 0;
          this.jumpDirection = 0;
        } else if (right && this.jumpDirection != 1) {
          this.direction = 1;
          this.jumpDirection = 1;
        }
        break;
      case 4:
        if (jump) {
          this.yd = -2;
          this.status = 1;
          this.jumpDirection = -1;
        } else if (!left && !right) {
          this.status = 0;
        } else if (left && this.direction == 1) {
          this.direction == 0;
        } else if (right && this.direction == 0) {
          this.direction == 1;
        }
        break;
    }
  }
}

let imagePaths = [
  "./imgs/chara/standL.png",
  "./imgs/chara/standbyL.png",
  "./imgs/chara/walk0L.png",
  "./imgs/chara/walk1L.png",
  "./imgs/chara/jumpL.png",
  "./imgs/chara/standR.png",
  "./imgs/chara/standbyR.png",
  "./imgs/chara/walk0R.png",
  "./imgs/chara/walk1R.png",
  "./imgs/chara/jumpR.png",
];

let mito = new Chara(400, 140, 40, 60, 4, imagePaths, 600);
// let mito = new Chara(280, 3000, 40, 60, 4, imagePaths, 600);

export default mito;