let dynamicLayer;
let animating = false;
let button, toggleButton, sizeSlider;
let frameCounter = 0;
let showDynamic = true;
let squareSize = 100;

function setup() {
  createCanvas(800, 400).parent("t1");
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  // statická levá část (jen jednou)
  background(0);
  push();
  fill(255);
  textSize(32);
  text("example", width / 4, 80); // levá polovina
  noFill();
  stroke(255);
  rect(width / 4, 200, 100, 100);
  pop();

  // tlačítko Start/Stop
button = createButton('Start animation');
button.parent("t2");

//button.style('position', 'absolute');
button.style('left', (width / 4 - 60) + 'px');
button.style('top', (40 + 200 - 15) + 'px');
button.mousePressed(toggleAnimation);

// tlačítko Show/Hide
toggleButton = createButton('Hide square');
toggleButton.parent("t2");
//toggleButton.style('position', 'absolute');
toggleButton.style('left', (width / 4 - 60) + 'px');
toggleButton.style('top', (40 + 200 + 25) + 'px');
toggleButton.mousePressed(toggleSquare);

// slider pro velikost čtverce
sizeSlider = createSlider(50, 200, 100, 1);
sizeSlider.parent("t2");  
//sizeSlider.style('position', 'absolute');
//sizeSlider.style('left', (width / 4 - 60) + 'px');
sizeSlider.style('top', (40 + 200 + 60) + 'px');

// pravá část bude samostatná grafika
dynamicLayer = createGraphics(width / 2, height);
dynamicLayer.textAlign(CENTER, CENTER);
dynamicLayer.rectMode(CENTER);
}


function draw() {
  // vymažeme pravou polovinu grafiky
  dynamicLayer.background(0);

  // čas – hodiny, minuty, sekundy
  let h = hour();
  let m = minute();
  let s = second();

  dynamicLayer.fill(255);
  dynamicLayer.textSize(32);
  dynamicLayer.text(nf(h, 2) + ":" + nf(m, 2) + ":" + nf(s, 2),
                    dynamicLayer.width / 2, 80);

  if (animating) {
    frameCounter++;
  }

  dynamicLayer.textSize(24);
  dynamicLayer.text("Frame: " + frameCounter,
                    dynamicLayer.width / 2, 150);

  // slider určuje velikost čtverce
  squareSize = sizeSlider.value();

  if (showDynamic) {
    // rotující čtverec
    dynamicLayer.push();
    dynamicLayer.translate(dynamicLayer.width / 2, 250);
    dynamicLayer.rotate(frameCounter * 0.05);
    dynamicLayer.noFill();
    dynamicLayer.stroke(255);
    dynamicLayer.rect(0, 0, squareSize, squareSize);
    dynamicLayer.pop();
  }

  // vykreslíme dynamickou grafiku do pravé půlky canvasu
  image(dynamicLayer, width / 2, 0);
}

function toggleAnimation() {
  animating = !animating;
  if (animating) {
    button.html("Stop animation");
  } else {
    button.html("Start animation");
  }
}

function toggleSquare() {
  showDynamic = !showDynamic;
  if (showDynamic) {
    toggleButton.html("Hide square");
  } else {
    toggleButton.html("Show square");
  }
}
