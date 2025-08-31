// Class BoxRandomChars
class BoxRandomChars {
  constructor(inputText, mx = 5, my = 5, x0 = 100, y0 = 100, cellSize = 35) {
    this.mx = mx;
    this.my = my;
    this.x0 = x0;
    this.y0 = y0;
    this.cellSize = cellSize;
    this.texts = inputText;
    this.currentTextIndex = 0;
    this.grid = [];
    this.prepareGrid(this.texts[this.currentTextIndex]);
  }

  // draw the frame and all chars
  draw() {
    // frame
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(this.x0 - this.cellSize+5, this.y0 - this.cellSize, this.mx * this.cellSize + this.cellSize, this.my * this.cellSize + this.cellSize);

    // characters
    for (let y = 0; y < this.my; y++) {
      for (let x = 0; x < this.mx; x++) {
        let idx = y * this.mx + x;
        let rc = this.grid[idx];
        rc.update();
        rc.display(this.x0 + x * this.cellSize, this.y0 + y * this.cellSize);
      }
    }
  }

  // switch to next text
  nextText() {
    this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    this.prepareGrid(this.texts[this.currentTextIndex]);
  }

  // prepare grid with one string
  prepareGrid(txt) {
    this.grid = [];
    let totalCells = this.mx * this.my;

    if (txt.length > totalCells) {
      txt = txt.substring(0, totalCells);
    } else if (txt.length < totalCells) {
      txt = txt.padEnd(totalCells, '*');
    }

    for (let i = 0; i < totalCells; i++) {
      this.grid.push(new RandomChar(txt[i]));
    }
  }
}

// Class RandomChar stays the same
class RandomChar {
  constructor(finalChar) {
    this.finalChar = finalChar;
    this.counter = 0;
    this.rndLen = int(random(12, 89));
    this.done = false;
    this.currentChar = this.randomSymbol();
  }

  update() {
    if (!this.done) {
      this.counter++;
      if (this.counter >= this.rndLen) {
        this.done = true;
      } else {
        this.currentChar = this.randomSymbol();
      }
    }
  }

  display(x, y) {
    textStyle(BOLD);
    if (this.done) {
      fill(0, 255, 0);
      noStroke();
      text(this.finalChar, x, y);
    } else {
      fill(0, 150, 0);
      noStroke();
      text(this.currentChar, x, y);
    }
  }

  randomSymbol() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    return chars.charAt(int(random(chars.length)));
  }
}
