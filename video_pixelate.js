let video;
let buffer;
let shapeRadio;
let sizeSlider, sizeValue;
let contrastSlider, contrastValue;
let brightnessSlider, brightnessValue;
let mirrorCheckbox;

let asciiCharX = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
let asciiChar = "*#&@%$=+:'. ";

let uiY = 50;
let centerX = 660;

function setup() {
  createCanvas(800, 600); //.position(0, 100);
  console.log(p5.prototype.constructor.VERSION);
  buffer = createGraphics(width, height);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // SIZE
  createDiv('size').position(centerX, uiY - 18).style('color', '#fff');
  sizeSlider = createSlider(4, 30, 10, 1); // menší minimum kvůli fontu
  sizeSlider.position(centerX, uiY);
  sizeSlider.style('width', '200px');
  sizeValue = createSpan('');
  sizeValue.position(centerX + 210, uiY - 2);
  uiY += 40;

  // CONTRAST
  createDiv('contrast').position(centerX, uiY - 18).style('color', '#fff');
  contrastSlider = createSlider(0, 200, 100, 1);
  contrastSlider.position(centerX, uiY);
  contrastSlider.style('width', '200px');
  contrastValue = createSpan('');
  contrastValue.position(centerX + 210, uiY - 2);
  uiY += 40;

  // BRIGHTNESS
  createDiv('brightness').position(centerX, uiY - 18).style('color', '#fff');
  brightnessSlider = createSlider(-100, 100, 0, 1);
  brightnessSlider.position(centerX, uiY);
  brightnessSlider.style('width', '200px');
  brightnessValue = createSpan('');
  brightnessValue.position(centerX + 210, uiY - 2);
  uiY += 40;

  // SHAPE (včetně ASCII)
  createDiv('shape').position(centerX, uiY - 18).style('color', '#fff');
  shapeRadio = createRadio();
  shapeRadio.option('square');
  shapeRadio.option('circle');
  shapeRadio.option('dot');
  shapeRadio.option('ascii'); // nový režim
  shapeRadio.selected('square');
  shapeRadio.position(centerX, uiY);
  uiY += 40;

  // MIRROR
  mirrorCheckbox = createCheckbox('Mirror', false);
  mirrorCheckbox.position(centerX, uiY);

  textFont('Courier'); // použijeme monospaced font
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);

  push();
  if (!mirrorCheckbox.checked()) {
    translate(width, 0);
    scale(-1, 1);
  }

  // video → buffer (zrcadlené)
  buffer.push();
  buffer.translate(buffer.width, 0);
  buffer.scale(-1, 1);
  buffer.image(video, 0, 0, buffer.width, buffer.height);
  buffer.pop();

  buffer.loadPixels();

  let stepSize = sizeSlider.value();
  let contrastFactor = contrastSlider.value() / 100;
  let brightnessOffset = brightnessSlider.value();
  let shape = shapeRadio.value();

  textSize(stepSize); // font size pro ASCII

  for (let y = 0; y < height; y += stepSize) {
    for (let x = 0; x < width; x += stepSize) {
      let index = (x + y * width) * 4;
      let r = buffer.pixels[index];
      let g = buffer.pixels[index + 1];
      let b = buffer.pixels[index + 2];

      let bright = (r + g + b) / 3;
      bright = constrain((bright - 128) * contrastFactor + 128 + brightnessOffset, 0, 255);

      noStroke();

      if (shape === 'square') {
        fill(bright);
        rect(x, y, stepSize, stepSize);

      } else if (shape === 'circle') {
        fill(bright);
        ellipse(x + stepSize / 2, y + stepSize / 2, stepSize);

      } else if (shape === 'dot') {
        fill(255);
        let dotSize = map(bright, 0, 255, 1, stepSize);
        ellipse(x + stepSize / 2, y + stepSize / 2, dotSize);

      } else if (shape === 'ascii') {
        let charIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
        let c = asciiChar.charAt(charIndex);
        fill(255);
        text(c, x + stepSize / 2, y + stepSize / 2);
      }
    }
  }

  pop();

  // UI hodnoty
  sizeValue.html(sizeSlider.value());
  contrastValue.html(contrastSlider.value());
  brightnessValue.html(brightnessSlider.value());
}
