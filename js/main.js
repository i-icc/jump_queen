import mito from "./chara.js";
import stage from "./stage.js";

const music = new Audio('./sounds/bgm.mp3');
music.volume = 0.1;
music.loop = true;

let startIndex = 0;

const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");

let keyLeft = false;
let keyRight = false;
let keyJump = false;
document.addEventListener("keypress", event => { if (event.code === "Space") startIndex += 1; }, false);
document.addEventListener("keydown", keydownEvent, false);
document.addEventListener("keyup", keyupEvent, false);
function keydownEvent(event) {
  if (event.code === "KeyA") keyLeft = true;
  if (event.code === "KeyD") keyRight = true;
  if (event.code === "KeyJ") keyJump = true;
}
function keyupEvent(event) {
  if (event.code === "KeyA") keyLeft = false;
  if (event.code === "KeyD") keyRight = false;
  if (event.code === "KeyJ") keyJump = false;
}

function loop() {
  // mito status change
  mito.inputKey(keyLeft, keyRight, keyJump);
  // draw mito
  mito.move(stage.checkTouch(mito.x, mito.y, mito.realY, mito.w, mito.h));
  // draw background
  stage.draw(ctx, mito.realY);
  mito.draw(ctx);
  window.requestAnimationFrame(loop);
}

function start() {
  if (startIndex >= 3) {
    music.play();
    window.requestAnimationFrame(loop);
  }
  else {
    stage.drawStart(ctx, startIndex);
    window.requestAnimationFrame(start);
  }
}

window.requestAnimationFrame(start);
