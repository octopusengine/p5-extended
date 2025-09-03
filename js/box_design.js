// box_design.js
// ver. 0.1 - 2025/08


// ========== DesignMatrix ==========
// draws a grid (matrix) of rectangles inside mw x mh area

class DesignMatrix {
  constructor(x0, y0, mw, mh, cols, rows) {
    this.x0 = x0;     // top-left X
    this.y0 = y0;     // top-left Y
    this.mw = mw;     // total width
    this.mh = mh;     // total height
    this.cols = cols; // number of columns
    this.rows = rows; // number of rows
  }

  // size of one cell
  get cellW() {
    return this.mw / this.cols;
  }

  get cellH() {
    return this.mh / this.rows;
  }

  // draw with random green color per cell
  drawRandomColor() {
    noStroke();
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let gx = this.x0 + i * this.cellW;
        let gy = this.y0 + j * this.cellH;

        // random green (0, 50..255, 0)
        let g = random(50, 255);
        fill(0, g, 0);

        rect(gx, gy, this.cellW, this.cellH);
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
