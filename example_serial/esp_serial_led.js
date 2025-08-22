let lastValue = "Waiting for data...";
let ledState = false; // false = off, true = on

function setup() {
  createCanvas(800, 600);
  console.log("p5.js version:", p5.prototype.constructor.VERSION);

  document.getElementById('connectBtn').onclick = connectToSerial;
  document.getElementById('disconnectBtn').onclick = disconnectFromSerial;
}

function draw() {
  background(240);
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
