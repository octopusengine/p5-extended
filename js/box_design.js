// box_design.js
// ver. 0.2 - 2025/08


class Template {
  constructor() {
    this.xL13 = width / 3;
    this.xL23 = width - this.xL13;
    this.xC = width / 2;
    this.yC = height / 2;
    this.radius1 = 300;
    this.radius2 = 150;
    this.basCol = color(0,128,0); // basic color 
    this.basColdark = color(0,64,0);
    this.strokeW = 1;
    this.gridStep = 100;
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
