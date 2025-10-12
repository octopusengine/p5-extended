// c64edit sprites 
// v0.3 / 2025-10

let spriteWidth = 24;
let spriteHeight = 21;
let cellSize = 19; //20
let grid = [];
let currentSprite = "s1";
let outputArea, select;

let preview3x, preview3xInv, preview5x;

function setup() {
  // enlarge canvas to fit previews
  createCanvas(spriteWidth * cellSize + 480, spriteHeight * cellSize);

  // prepare preview buffers
  preview3x = createGraphics(spriteWidth * 3, spriteHeight * 3);
  preview3xInv = createGraphics(spriteWidth * 3, spriteHeight * 3);
  preview5x = createGraphics(spriteWidth * 5, spriteHeight * 5);

  // --- Create "inbox" styled multiline output box ---
  outputArea = document.createElement("textarea");
  outputArea.id = "output";
  outputArea.rows = 5;
  outputArea.cols = 90;
  outputArea.readOnly = true;
  outputArea.style.fontFamily = "monospace";
  outputArea.style.background = "#111";
  outputArea.style.color = "#0f0";
  outputArea.style.padding = "8px 10px";
  outputArea.style.border = "1px solid #333";
  outputArea.style.borderRadius = "6px";
  outputArea.style.marginTop = "15px";
  outputArea.style.whiteSpace = "pre";
  outputArea.style.resize = "none";
  document.body.appendChild(outputArea);

  // --- Sprite selection dropdown ---
  select = createSelect();
  for (let key in sprites) select.option(key);
  select.changed(() => {
    currentSprite = select.value();
    loadSprite(sprites[currentSprite]);
  });

  // --- Control buttons ---
  let btnLeft = createButton("←");
  btnLeft.mousePressed(() => shiftGrid("left"));

  let btnUp = createButton("↑");
  btnUp.mousePressed(() => shiftGrid("up"));

  let btnDown = createButton("↓");
  btnDown.mousePressed(() => shiftGrid("down"));

  let btnRight = createButton("→");
  btnRight.mousePressed(() => shiftGrid("right"));

  let btnClear = createButton("Clear");
  btnClear.mousePressed(() => {
    initGrid();
    updateOutput();
  });

  // layout of buttons
  btnLeft.position(10, height + 40);
  btnUp.position(50, height + 10);
  btnDown.position(50, height + 70);
  btnRight.position(90, height + 40);
  btnClear.position(160, height + 40);

  // load first sprite
  loadSprite(sprites[currentSprite]);
}

function draw() {
  background(30);

  // --- sprite edit grid ---
  for (let y = 0; y < spriteHeight; y++) {
    for (let x = 0; x < spriteWidth; x++) {
      stroke(80);
      fill(grid[y][x] ? 0 : 255);
      rect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
    }
  }

  // --- update previews ---
  drawPreview(preview3x, 3, false);
  drawPreview(preview3xInv, 3, true);
  drawPreview(preview5x, 5, false);

  // --- display previews ---
  let px = spriteWidth * cellSize + 20;
  let py = 30;

  fill(255);
  noStroke();
  textSize(14);
  text("Preview 3x:", px, py - 10);
  image(preview3x, px, py);

  // inverted 3x preview
  image(preview3xInv, px + preview3x.width + 20, py);
  text("Inverted", px + preview3x.width + 20, py - 10);

  // 5x preview below
  py += preview3x.height + 40;
  text("Preview 5x:", px, py - 10);
  image(preview5x, px, py);
}

// draw one preview buffer with optional inversion
function drawPreview(pg, scale, invert = false) {
  pg.background(invert ? 0 : 200);
  pg.noStroke();
  for (let y = 0; y < spriteHeight; y++) {
    for (let x = 0; x < spriteWidth; x++) {
      let val = grid[y][x];
      pg.fill(invert ? (val ? 255 : 0) : (val ? 0 : 255));
      pg.rect(x * scale, y * scale, scale, scale);
    }
  }
}

// toggle pixel when mouse is pressed
function mousePressed() {
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  if (x >= 0 && x < spriteWidth && y >= 0 && y < spriteHeight) {
    grid[y][x] = !grid[y][x];
    updateOutput();
  }
}

// shift pixels in a direction
function shiftGrid(dir) {
  if (dir === "left") {
    for (let y = 0; y < spriteHeight; y++) {
      let first = grid[y].shift();
      grid[y].push(first);
    }
  } else if (dir === "right") {
    for (let y = 0; y < spriteHeight; y++) {
      let last = grid[y].pop();
      grid[y].unshift(last);
    }
  } else if (dir === "up") {
    let firstRow = grid.shift();
    grid.push(firstRow);
  } else if (dir === "down") {
    let lastRow = grid.pop();
    grid.unshift(lastRow);
  }
  updateOutput();
}

// create empty sprite grid
function initGrid() {
  grid = [];
  for (let y = 0; y < spriteHeight; y++) grid.push(Array(spriteWidth).fill(0));
}

// load sprite byte data into grid
function loadSprite(data) {
  initGrid();
  let bitIndex = 0;
  for (let byte of data) {
    for (let b = 7; b >= 0; b--) {
      let x = bitIndex % spriteWidth;
      let y = Math.floor(bitIndex / spriteWidth);
      if (y < spriteHeight) grid[y][x] = (byte >> b) & 1;
      bitIndex++;
    }
  }
  updateOutput();
}

// convert grid to bytes and show in styled textarea
function updateOutput() {
  let bytes = [];
  let bitBuffer = 0, bitCount = 0;

  for (let y = 0; y < spriteHeight; y++) {
    for (let x = 0; x < spriteWidth; x++) {
      bitBuffer = (bitBuffer << 1) | (grid[y][x] ? 1 : 0);
      bitCount++;
      if (bitCount === 8) {
        bytes.push(bitBuffer);
        bitBuffer = 0;
        bitCount = 0;
      }
    }
  }

  // Wrap lines to about 80 chars (3 lines)
  const formatted = [];
  let line = "";
  for (let i = 0; i < bytes.length; i++) {
    let part = bytes[i].toString();
    if ((line + part + ",").length > 80) {
      formatted.push(line);
      line = "";
    }
    line += part + (i < bytes.length - 1 ? ", " : "");
  }
  if (line.length) formatted.push(line);

  outputArea.value = formatted.join("\n");
}
