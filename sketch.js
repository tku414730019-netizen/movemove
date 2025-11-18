let redHatSheet, ratSheet;
let redHatStand, ratStand;
let redHatDie, ratDie;
let fireIcon;
let bgMusic;

let hat, rat;
let itPlayer = null;
let gameOver = false;
let winner = "";
let restartButton;

function preload() {
  redHatSheet = loadImage("redhat/all.png");
  ratSheet = loadImage("RATWALK/all.png");

  redHatStand = loadImage("redhat/stand.png");
  ratStand = loadImage("RATWALK/stand.png");

  redHatDie = loadImage("redhat/die.png");
  ratDie = loadImage("RATWALK/die.png");

  fireIcon = loadImage("fire.png");

  bgMusic = loadSound("music/music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgMusic.loop();

  hat = new Character(width / 2 - 100, height / 2, redHatSheet, 16, 16, redHatStand, redHatDie, "hat", 7, 4);
  rat = new Character(width / 2 + 100, height / 2, ratSheet, 15, 24, ratStand, ratDie, "rat", 7, 4);

  itPlayer = random([hat, rat]);

  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 40, height / 2 + 60);
  restartButton.mousePressed(resetGame);
  restartButton.hide();
}

function draw() {
  background("#849C95");

  if (!gameOver) {
    hat.update();
    rat.update();

    hat.draw();
    rat.draw();

    checkTag();
  } else {
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(255);
    text(winner + " wins!", width / 2, height / 2);
  }
}

// ------------------ 角色類別 ------------------
class Character {
  constructor(x, y, spriteSheet, frameW, frameH, standImg, dieImg, name, spacing, scaleFactor) {
    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    this.frameW = frameW;
    this.frameH = frameH;
    this.standImg = standImg;
    this.dieImg = dieImg;
    this.name = name;

    this.frame = 0;
    this.animationSpeed = 6;
    this.flip = false;
    this.alive = true;
    this.moving = false;
    this.spacing = spacing;
    this.scaleFactor = scaleFactor;
  }

  update() {
    if (!this.alive) return;

    let speed = 4;
    this.moving = false;

    if (this.name === "hat") {
      if (keyIsDown(87)) { this.y -= speed; this.moving = true; }
      if (keyIsDown(83)) { this.y += speed; this.moving = true; }
      if (keyIsDown(65)) { this.x -= speed; this.flip = true; this.moving = true; }
      if (keyIsDown(68)) { this.x += speed; this.flip = false; this.moving = true; }
    }

    if (this.name === "rat") {
      if (keyIsDown(UP_ARROW)) { this.y -= speed; this.moving = true; }
      if (keyIsDown(DOWN_ARROW)) { this.y += speed; this.moving = true; }
      if (keyIsDown(LEFT_ARROW)) { this.x -= speed; this.flip = true; this.moving = true; }
      if (keyIsDown(RIGHT_ARROW)) { this.x += speed; this.flip = false; this.moving = true; }
    }

    // 邊界穿越
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    if (this.moving) {
      if (frameCount % this.animationSpeed === 0) {
        this.frame = (this.frame + 1) % 8;
      }
    } else {
      this.frame = 0; // idle -> 第一格 stand
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    if (this.flip) scale(-1, 1);

    imageMode(CENTER);

    if (!this.alive) {
      image(this.dieImg, 0, 0, this.frameW * this.scaleFactor, this.frameH * this.scaleFactor);
    } else if (!this.moving) {
      image(this.standImg, 0, 0, this.frameW * this.scaleFactor, this.frameH * this.scaleFactor);
    } else {
      let sx = this.frame * (this.frameW + this.spacing);
      image(this.spriteSheet, 0, 0, this.frameW * this.scaleFactor, this.frameH * this.scaleFactor, sx, 0, this.frameW, this.frameH);
    }

    pop();

    if (this === itPlayer && this.alive) {
      image(fireIcon, this.x - 15, this.y - 80, 40, 40);
    }
  }
}

// ------------------ 鬼抓人判定 ------------------
function checkTag() {
  let d = dist(hat.x, hat.y, rat.x, rat.y);
  if (d < 25) {
    if (itPlayer === hat) rat.alive = false;
    else hat.alive = false;

    gameOver = true;
    winner = itPlayer === hat ? "hat" : "rat";
    restartButton.show();
  }
}

// ------------------ 重新開始 ------------------
function resetGame() {
  hat.x = width / 2 - 100;
  hat.y = height / 2;
  rat.x = width / 2 + 100;
  rat.y = height / 2;

  hat.alive = true;
  rat.alive = true;

  itPlayer = random([hat, rat]);
  gameOver = false;
  restartButton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
