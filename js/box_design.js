// box_design.js
// ver. 0.5 - 2025/09

// color style/mode
// c[0]=bg1, bg2, base1, base2, spec1, spec2

const colorsDarkGreenMode = ["#000000", "#222222", "#00ff00", "#00aa00", "#55ff00", "#00ff55"];

const colorsLightBlaWhiMode = ["#cccccc", "#eeeeee", "#000000", "#333333", "#ff0000", "#0000ff"];


// global var
let currentColors = colorsDarkGreenMode;

// selector
function setColorStyle(cs) {
  if (cs === "dark") currentColors = colorsDarkGreenMode;
  if (cs === "light") currentColors = colorsLightBlaWhiMode;
}


function drawColorPalette(x, y, a, border = false) {
  let offset = 5;
  let totalWidth = 6 * a + 5 * offset; 
  push();

  // border
  if (border) {
    stroke(currentColors[2]);
    strokeWeight(1);
    noFill();
    rect(x, y, totalWidth + 2*offset, a + 2*offset);
  }

  // color SQs
  noStroke();
  for (let i = 0; i < 6; i++) {
    fill(currentColors[i]);
    rect(x + offset + i * (a + offset), y + offset, a, a);
  }

  pop();
}


//--------------------------------------------
class EffectShape {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shadowOffsetX = 12;
    this.shadowOffsetY = 12;
    this.shadowBlur = 12;
    this._shadowColor = this.p.color(0, 0, 0, 100); // Internal p5.Color object

    this._blurEnabled = false; // New property to enable/disable blur
    this.blurAmount = 8;       // Amount of blur in pixels
  }

  // Sets shadow color. Expects a p5.Color object.
  setShadowColor(p5ColorObject) {
    this._shadowColor = p5ColorObject;
  }

  // Enables or disables the blur effect.
  // 'enabled' is a boolean (true/false).
  // 'amount' (optional) sets the blur intensity in pixels.
  blur(enabled, amount = this.blurAmount) {
    this._blurEnabled = enabled;
    this.blurAmount = amount;
  }

  // Applies a linear gradient to the drawingContext
  // colorS and colorE must be p5.Color objects
  linearGradient(sX, sY, eX, eY, colorS, colorE) {
    let gradient = this.p.drawingContext.createLinearGradient(sX, sY, eX, eY);
    gradient.addColorStop(0, colorS.toString());
    gradient.addColorStop(1, colorE.toString());
    this.p.drawingContext.fillStyle = gradient;
  }

  // Applies shadow and blur to the drawingContext
  // Renamed from applyShadow to applyEffects for general use
  applyEffects() {
    // Apply shadow
    this.p.drawingContext.shadowOffsetX = this.shadowOffsetX;
    this.p.drawingContext.shadowOffsetY = this.shadowOffsetY;
    this.p.drawingContext.shadowBlur = this.shadowBlur;
    this.p.drawingContext.shadowColor = this._shadowColor.toString();

    // Apply blur if enabled
    if (this._blurEnabled) {
      this.p.drawingContext.filter = `blur(${this.blurAmount}px)`;
    }
  }

  // Resets all applied effects (shadow and blur)
  resetEffects() {
    // Reset shadow
    this.p.drawingContext.shadowOffsetX = 0;
    this.p.drawingContext.shadowOffsetY = 0;
    this.p.drawingContext.shadowBlur = 0;
    this.p.drawingContext.shadowColor = 'rgba(0,0,0,0)';

    // Reset filter (blur)
    this.p.drawingContext.filter = 'none'; // Important: 'none' resets all filters
  }
}


// ========== DesignArc ==========
class DesignArc {
  constructor(r1, r2, alfa0, beta = 30, gama = 60, delta = 20, sw = 2) {
    this.r1 = r1;
    this.r2 = r2;
    this.alfa0 = alfa0; // start angle
    this.beta = beta;   // length of first arc
    this.gama = gama;   // length of second arc
    this.delta = delta; // length of closing arc
    this.sw = sw;       // stroke weight
    this.stroCol = color(0,128,0);
  }

  drawArc(cx, cy) {
    strokeWeight(this.sw);
    stroke(this.stroCol);
    noFill();

    // first r1: alfa0 -> alfa0+beta
    arc(cx, cy, this.r1 * 2, this.r1 * 2,
        radians(this.alfa0), radians(this.alfa0 + this.beta));

    // second r2: alfa0+beta -> alfa0+beta+gama
    arc(cx, cy, this.r2 * 2, this.r2 * 2,
        radians(this.alfa0 + this.beta), radians(this.alfa0 + this.beta + this.gama));

    // closing arc r1: alfa0+beta+gama -> alfa0+beta+gama+delta
    arc(cx, cy, this.r1 * 2, this.r1 * 2,
        radians(this.alfa0 + this.beta + this.gama),
        radians(this.alfa0 + this.beta + this.gama + this.delta));

    // connectors
    this.drawConnector(cx, cy, this.r1, this.r2, this.alfa0 + this.beta);
    this.drawConnector(cx, cy, this.r1, this.r2, this.alfa0 + this.beta + this.gama);
  }

  drawConnector(cx, cy, r1, r2, alfa) {
    let x1 = cx + r1 * cos(radians(alfa));
    let y1 = cy + r1 * sin(radians(alfa));

    let x2 = cx + r2 * cos(radians(alfa));
    let y2 = cy + r2 * sin(radians(alfa));

    line(x1, y1, x2, y2);
  }
}


// ========== DesignMatrix ==========

class DesignMatrix {
  constructor(x0, y0, mw, mh, cols, rows) {
    this.x0 = x0;
    this.y0 = y0;
    this.mw = mw;
    this.mh = mh;
    this.cols = cols;
    this.rows = rows;

    this.treshold = 100;
    this.colors = [];
    this.initColors();
  }

  get cellW() {
    return this.mw / this.cols;
  }

  get cellH() {
    return this.mh / this.rows;
  }

  initColors() {
    this.colors = [];
    for (let i = 0; i < this.cols; i++) {
      this.colors[i] = [];
      for (let j = 0; j < this.rows; j++) {
        let rndCol = random(0, 255);
        if (rndCol < this.treshold) { rndCol = 0; }        
        this.colors[i][j] = color(0, rndCol, 0);

      }
    }
  }

  updateColors() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let rndCol = random(0, 255);
        if (rndCol < this.treshold) { rndCol = 0; }        
        this.colors[i][j] = color(0, rndCol, 0);
      }
    }
  }

  draw() {
    noStroke();
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let gx = this.x0 + i * this.cellW;
        let gy = this.y0 + j * this.cellH;
        fill(this.colors[i][j]);
        rect(gx, gy, this.cellW, this.cellH);
      }
    }
  }
}


// ========== DesignGo10 ==========
// class for grid of random diagonal green lines
class DesignGo10 {
  constructor(mw, mh, cols, rows) {
    this.mw = mw;
    this.mh = mh;
    this.cols = cols;
    this.rows = rows;

    this.x0 = 0;
    this.y0 = 0;

    this.running = true;   // animation toggle
    this.grid = [];        // store line orientation (0/1)
    this.thickness = 1;    // line thickness (modifiable later)

    this.initGrid();
  }

  initGrid() {
    this.grid = [];
    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = random() > 0.5 ? 1 : 0;
      }
    }
  }

  updateGrid() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = random() > 0.5 ? 1 : 0;
      }
    }
  }

  draw() {
    let stepX = this.mw / this.cols;
    let stepY = this.mh / this.rows;

    stroke(0, 200, 0);
    strokeWeight(this.thickness);

    // pokud běží a jsme na každém 10. framu → změň vzor
    if (this.running && frameCount % 10 === 0) {
      this.updateGrid();
    }

    // vždy vykresli podle uložené grid
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = this.x0 + i * stepX;
        let y = this.y0 + j * stepY;
        if (this.grid[i][j] === 1) {
          line(x, y, x + stepX, y + stepY);
        } else {
          line(x + stepX, y, x, y + stepY);
        }
      }
    }
  }
}


// ========== Polyline ==========
// General class for drawing a polyline
class Polyline {
  constructor(points, thickness = 2, col = [0, 220, 0]) {
    this.points = points;
    this.thickness = thickness;
    this.col = color(col);   // p5.js color()
    this.x0 = 0;             // global X offset
    this.y0 = 0;             // global Y offset
  }

  draw(doFill = false) {
    stroke(this.col);
    strokeWeight(this.thickness);
    if (doFill) fill(100, 150, 200, 150);
    else noFill();

    beginShape();
    for (let pt of this.points) {
      vertex(this.x0 + pt[0], this.y0 + pt[1]);
    }
    endShape();
  }
}


// ========== DesignLine ==========
// Class for generating a "tooth-shaped" design polyline
class DesignLine {
  constructor(lineA = 15, lineL1 = 100, lineL2 = 50, lineL3 = 150, 
              thickness = 1, col = [0, 255, 0]) {
    this.lineA = lineA;   // amplitude of the "tooth"
    this.lineL1 = lineL1; // first segment length
    this.lineL2 = lineL2; // second segment length
    this.lineL3 = lineL3; // third segment length
    this.lineX0 = 0;      // horizontal start offset
    this.lineY0 = 100;    // vertical start offset

    this.polyline = new Polyline(this.createPoints(), thickness, col);
  }

  // Set a new vertical offset and recalculate points
  setY0(newY0) {
    this.lineY0 = newY0;
    this.polyline.points = this.createPoints();
  }

  // Generate points for the Polyline
  createPoints() {
    return [
      [this.lineX0, this.lineY0],
      [this.lineX0 + this.lineL1, this.lineY0],
      [this.lineX0 + this.lineL1 + Math.abs(this.lineA), this.lineY0 - this.lineA],
      [this.lineX0 + this.lineL1 + this.lineL2 + Math.abs(this.lineA) * 2, this.lineY0 - this.lineA],
      [this.lineX0 + this.lineL1 + this.lineL2 + Math.abs(this.lineA) * 3, this.lineY0],
      [this.lineX0 + this.lineL1 + this.lineL2 + this.lineL3 + Math.abs(this.lineA) * 3, this.lineY0]
    ];
  }

  // Draw using the internal Polyline
  draw(doFill = false) {
    this.polyline.draw(doFill);
  }
}

// ========== BoxPerlin ==========
class BoxPerlin {
  constructor(x, y, w, h, seed, z = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.seed = seed;
    this.z = z;

    this.rez = 0.05;
    this.pixelSize = 3;
    this.palette = [color(0, 0, 100)];
    this.showBorder = true;
    this.levels = 8; // nová property: kolik "stupňů" má mít noise
  }

  draw() {
    noiseSeed(this.seed);

    for (let ix = 0; ix < this.w; ix += this.pixelSize) {
      for (let iy = 0; iy < this.h; iy += this.pixelSize) {
        let n = noise((this.x + ix) * this.rez,
                      (this.y + iy) * this.rez,
                      this.z);

        // škálování podle počtu levels
        let idx = floor(n * this.levels);
        idx = constrain(idx, 0, this.levels - 1);

        // mapování na paletu
        let palIdx = floor(map(idx, 0, this.levels - 1, 0, this.palette.length - 1));
        fill(this.palette[palIdx]);

        rect(this.x + ix, this.y + iy, this.pixelSize, this.pixelSize);
      }
    }

    if (this.showBorder) {
      noFill();
      stroke(0, 0, 100);
      rect(this.x, this.y, this.w, this.h);
      noStroke();
    }
  }
}



//=======================
class OscSphere {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.running = true;

    this.num = 20;
    this.step = 20;
    this.strokeCol = color(255);

    this.waves = [];
    for (let i = 0; i < this.num; i++) {
      this.waves[i] = new WaveSph(i * this.step, this.r);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    stroke(this.strokeCol);
    noFill();
    for (let w of this.waves) {
      w.display();
      if (this.running) w.move();  // <-- running
    }
    pop();
  }
}


//--------------------------------------------------
// Wave Sphere class 
//--------------------------------------------------
class WaveSph {
  constructor(shift, r) {
    this.shift = shift;
    this.angle = 0;
    this.movement = 0;
    this.period = 1;
    this.r = r;
  }

  display() {
    for (let i = 0; i <= 360; i++) {
      let x = map(i, 0, 360, -this.r, this.r);

      // bezpečné sqrt
      let tmp = 1 - (x / this.r) * (x / this.r);
      tmp = max(0, tmp);
      let amplitude = this.r * sqrt(tmp);

      let y = amplitude * sin((i + this.angle + this.shift * this.movement) * this.period);
      point(x, y);
    }
  }

  move() {
    this.angle += 1;
    this.movement = cos(this.angle);
  }
}


//============================ t e m p l a t e s ====================================

// ========== Template ==========
class Template {
  constructor() {
    this.xL13 = width / 3;
    this.xL23 = width - this.xL13;
    this.xC = width / 2;
    this.yC = height / 2;
    this.radius1 = 300;
    this.radius2 = 350;
    this.bgCol = color(0);
    this.basCol = color(0,127,0); // basic color 
    this.basColdark = color(0,63,0);
    this.strokeW = 1;
    this.gridStep = 100;
    this.x0 = 0;
    this.y0 = 0;
    this.w = width;
    this.h = height;
    this.R = width / 3;

    // "global" for extern btn
    this.btnW = 120;
    this.btnH = 39; 
    this.btnD = 50;
    this.btnX0 = 25;
  }

   changeColorStyle() {
    // from "global currentColors"
    this.bgCol = color(currentColors[0]);
    this.basCol = color(currentColors[2]);
    this.basColdark = color(currentColors[3]);
    }

  draw() {
    stroke(this.basCol);
    strokeWeight(this.strokeW);

    line(this.xL13, 0, this.xL13, height);
    line(this.xC, 0, this.xC, height); 
    line(this.xL23, 0, this.xL23, height);

    noFill();
    ellipse(this.xC, this.yC, this.radius1, this.radius1);
    ellipse(this.xC, this.yC, this.radius2, this.radius2);
  }

  // simple center MASK
  drawCircle() {
    fill(this.bgCol);
    noStroke();
    circle(this.xC, this.yC, this.R);
  }

  drawRect() {
    fill(this.bgCol);
    noStroke();
    rect(this.xC-this.R/2, this.yC-this.R/2, this.R,this.R);
  }


  drawGrid() {
     stroke(this.basColdark);
     strokeWeight(this.strokeW); 
  
    for (let x = 0; x <= width; x += this.gridStep) {
      line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += this.gridStep) {
      line(0, y, width, y);
    }
  }

 drawGridPoints() {
  stroke(this.basCol);
  strokeWeight(this.strokeW);

  for (let x = 0; x <= this.w ; x += this.gridStep) {
    for (let y = 0; y <= this.h ; y += this.gridStep) {
      point(this.x0 + x, this.y0 + y);
    }
  }
}
}




