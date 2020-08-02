let video;
let poseNet, pose;
let skeleton;
let x, y, r, fallingball;
let start;
let score;
let resultX, resultY, d;
let timer;
let button, buttontag, button2;
let opencamera;

function setup() {
  createCanvas(640, 480).parent("sketchHolder");
  video = createCapture(VIDEO);
  video.parent("sketchHolder");
  video.hide();

  // Call poseNet from ml5 cloud server
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  buttontag = 'Press "s" Start';
  resetgame();
}

// Reset the game when time's end
function resetgame(){
    //button = createDiv(buttontag);
    background('lightgrey');
    button = createButton(buttontag);
    let buttonX = 190;
    let buttonY = 30;
    button.size(buttonX, buttonY);
    button.parent("sketchHolder");
    button.position(width/2-buttonX/2, height/2-buttonY/2);
    button.parent("sketchHolder");
    start = false;
    score = 0;
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  // Press 's' to start or stop
  if (start){
    push();
    translate(width,0);
    scale(-1, 1);
    image(video, 0, 0);
    pop();
    detectNose();

    display();
    timecall();
    ballMove();
    ballIntersect();
    // Reset
    if (y > height) {
      ballRestart();
    }
  }
}

// Detect the nose by Pretrained PoseNet
function detectNose(){
  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;

    // Calculate radius of noseball by two eyes coordinates
    d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y)*0.8;
    fill('blue');
    let Xdistance = pose.nose.x-width/2;
    resultX = pose.nose.x-2*Xdistance;
    resultY = pose.nose.y;

    // Draw a ball in the nose
    ellipse(resultX, resultY, d);
  }
}

// Moving up at a constant speed vertically
function ballMove(){
  x = x;
  y = y + r;
}

// Check whether falling & nose ball are intersected
function ballIntersect(){
  let interd = dist(x, y, resultX, resultY);
  // Falling should be within the d/2 and above nose
  if ((interd < d/2) && y<resultY) {
    score = score+1;
    ballRestart();
    //return true;
  } else {
    return false;
  }
}

// Redraw the falling ball when
// i) User press 's' to start
// ii) it falls outside the createCanvas;
// iii) Two balls are intersected
function ballRestart(){
  x = random(15,width-15);
  y = 0;
  r = random(4,7);
}

// Display main DOM elements
function display(){
  // Score tag at top-left corner
  let scoretag = 'Score: ' + score.toString();
  textSize(32);
  fill(0, 102, 153);
  text(scoretag, 20, 40);

  // Timer tag at top-right corner
  let timetag = 'Time: ' + timer.toString();
  textSize(32);
  fill(0, 102, 153);
  text(timetag, 500, 40);

  // Draw a falling ball
  stroke(50);
  fill(100);
  ellipse(x, y, 24, 24);
}

// Keyboard input to start and stop
function keyPressed() {
  if (key == 's'){
    if (start == false){
      button.hide();
      start = true;
      ballRestart();
      timer=15;
    }
  }
}

// Setting Timer
function timecall(){
  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  }
  if (timer == 0) {
    //text("GAME OVER", width/2, height*0.7);
    buttontag = 'Score: ' +  score +  '\n  Press "s" to restart';
    ballcolor='white';
    start = false
    clear();
    resetgame();
  }
}
