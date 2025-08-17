let video;

function setup() {
  createCanvas(640, 480);
  console.log(p5.prototype.constructor.VERSION);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function draw() {
  background(0);

  // varianta A – funguje v p5.js 1.6.0
  // image(video, 0, 0, width, height);

  // varianta B – funguje i v p5.js 1.9.x
  drawingContext.drawImage(video.elt, 0, 0, width, height);
}
