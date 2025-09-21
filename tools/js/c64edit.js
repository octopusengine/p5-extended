// c64edit sprites 
// v0.2 / 2025-09

let spriteWidth = 24;
let spriteHeight = 21;
let cellSize = 20;
let grid = [];
let currentSprite = "s1";
let outputDiv, select;

function setup() {
  createCanvas(spriteWidth * cellSize, spriteHeight * cellSize);

  // output pro bajty
  outputDiv = document.createElement("div");
  outputDiv.id = "output";
  document.body.appendChild(outputDiv);

  // select pro výběr sprite
  select = document.createElement("select");
  select.id = "spriteSelect";
  for (let key in sprites) {
    let opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    select.appendChild(opt);
  }
  document.body.appendChild(select);

  select.addEventListener("change", function () {
    currentSprite = this.value;
    loadSprite(sprites[currentSprite]);
  });

  // --- ovládací tlačítka ---
let btnLeft = createButton("←");
btnLeft.mousePressed(() => shiftGrid("left"));

let btnUp = createButton("↑");
btnUp.mousePressed(() => shiftGrid("up"));

let btnDown = createButton("↓");
btnDown.mousePressed(() => shiftGrid("down"));

let btnRight = createButton("→");
btnRight.mousePressed(() => shiftGrid("right"));

// --- nový clear ---
let btnClear = createButton("Clear");
btnClear.mousePressed(() => {
  initGrid();
  updateOutput();
});

// rozložení tlačítek
btnLeft.position(10, height + 40);
btnUp.position(50, height + 10);
btnDown.position(50, height + 70);
btnRight.position(90, height + 40);
btnClear.position(160, height + 40); // posuň kam ti vyhovuje

  // inicializace
  loadSprite(sprites[currentSprite]);
}

function draw() {
  background(30);
  for (let y = 0; y < spriteHeight; y++) {
    for (let x = 0; x < spriteWidth; x++) {
      stroke(80);
      fill(grid[y][x] ? 0 : 255);
      rect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  if (x >= 0 && x < spriteWidth && y >= 0 && y < spriteHeight) {
    grid[y][x] = !grid[y][x];
    updateOutput();
  }
}

// --- funkce pro posun ---
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

// --- inicializace a načtení ---
function initGrid() {
  grid = [];
  for (let y = 0; y < spriteHeight; y++) {
    grid.push(Array(spriteWidth).fill(0));
  }
}

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

function updateOutput() {
  let bytes = [];
  let bitBuffer = 0,
    bitCount = 0;
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
  outputDiv.textContent = bytes.join(",");
}
