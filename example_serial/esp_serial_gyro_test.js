let lastValue = "Waiting for data...";
let valueHistory = [];
let maxHistory = 10;
let ledState = false; // false = off, true = on

function setup() {
  createCanvas(800, 600);
  console.log("p5.js version:", p5.prototype.constructor.VERSION);

  document.getElementById('connectBtn').onclick = connectToSerial;
  document.getElementById('disconnectBtn').onclick = disconnectFromSerial;
}

function draw() {
  background(240);
  drawTiltedRect();
  drawMainValueBox();
  //drawValueHistory();
}




function mousePressed() {
  if (!isConnected) {
    console.log("Not connected.");
    return;
  }

  ledState = !ledState; // toggle

  let cmd = ledState ? "led1\n" : "led0\n";
  sendToSerial(cmd);
  console.log("Sent:", cmd.trim());
}

function drawTiltedRect() {
  let angleDeg = parseFloat(lastValue);
  if (isNaN(angleDeg)) return;

  angleDeg = map(angleDeg, -100, 100, -90, 90);
  let angleRad = radians(angleDeg);

  push();
  translate(width / 2, height / 2);
  rotate(angleRad + 90);
  fill(100, 150, 255);
  stroke(0);
  rectMode(CENTER);
  rect(0, 0, 300, 20);
  pop();
}

function drawMainValueBox() {
  fill(255);
  stroke(isConnected ? color(76, 175, 80) : color(200));
  strokeWeight(4);
  rect(width/2 - 200, 50, 400, 150, 10);

  fill(50);
  noStroke();
  textSize(21);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  text("Last value:", width/2, 100);

  fill(isConnected ? color(76, 175, 80) : color(150));
  textSize(48);
  textStyle(BOLD);
  text(lastValue, width/2, 150);
}

function drawValueHistory() {
  if (valueHistory.length === 0) return;

  fill(50);
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  text("Value history:", 50, 250);

  for (let i = 0; i < valueHistory.length; i++) {
    let alpha = map(i, 0, valueHistory.length - 1, 100, 255);
    fill(50, alpha);
    textSize(10);
    textFont('monospace');
    let y = 280 + i * 25;
    text(`${valueHistory[i].time}: ${valueHistory[i].value}`, 50, y);
  }
}

function processNewValue(value) {
  lastValue = value;

  let now = new Date();
  let timeString = now.toLocaleTimeString();

  valueHistory.push({
    time: timeString,
    value: value
  });

  if (valueHistory.length > maxHistory) {
    valueHistory.shift();
  }
}
