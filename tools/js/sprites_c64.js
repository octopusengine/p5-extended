// v.0.1 | 2025/09

class Sprite {
  constructor(spriteData, x = 0, y = 0, pixelSize = 5, col = color(0, 200, 0)) {
    this.data = spriteData;     
    this.x = x;
    this.y = y;
    this.pixelSize = pixelSize;
    this.width = 24;            
    this.height = 21;
    this.setColor(col);          // use setter
  }

  // setter for color
  setColor(col) {
    // if RGB array, leave as is; if p5 color, convert to array
    if (col instanceof p5.Color) {
      this.color = [red(col), green(col), blue(col)];
    } else if (Array.isArray(col)) {
      this.color = col;
    } else {
      console.warn("Unsupported color format, using [0,200,0]");
      this.color = [0, 200, 0];
    }
  }

  draw() {
    let bitIndex = 0;
    fill(this.color[0], this.color[1], this.color[2]);
    noStroke();

    for (let byte of this.data) {
      for (let b = 7; b >= 0; b--) {
        let x = bitIndex % this.width;
        let y = Math.floor(bitIndex / this.width);

        if (y < this.height && ((byte >> b) & 1)) {
          rect(
            this.x + x * this.pixelSize,
            this.y + y * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
        bitIndex++;
      }
    }
  }
}


// ---data---
// sprites.js
// ----------

let s1 = [
0,0,0,6,0,96,6,0,96,1,129,128,1,129,128,7,255,224,7,255,224,30,126,
120,30,126,120,127,255,254,127,255,254,103,255,230,103,255,230,102,0,
102,102,0,102,1,231,128,1,231,128,0,0,0,0,0,0,0,0,0,0,0,0
];

let s2 = [
0,0,0,62,0,124,38,0,100,1,129,128,1,129,128,7,255,224,7,255,224,30,60,
120,28,126,56,127,255,254,127,231,254,103,255,230,103,255,230,102,165,102,
102,0,102,65,231,130,65,231,130,32,165,4,33,36,132,66,36,66,2,66,64
];

let s3 = [
  0,0,0,119,119,119,80,0,5,112,0,7,80,0,5,112,0,7,0,0,0,0,0,0,112,0,7,80,0,
5,112,0,7,80,0,5,112,0,7,0,0,0,0,0,0,119,119,119,85,85,85,119,119,119,85,
85,85,119,119,119,0,0,0
];

let sprites = {
  s1: s1,
  s2: s2,
  s3: s3
};
