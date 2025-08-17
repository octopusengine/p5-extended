// cister_font.js — Cistercian numbers for p5.js
// agamaPoint 2025 - GPT5.0
// v: 0.1

// API:
//   const cf = new CisterFont(); // alias also cisterFont
//   cf.setColor(0,255,0).setSize(10);
//   cf.drawNum(1234, 20, 30);
// ---
// 2|1
// 4|3

class CisterFont {
  constructor() {
    // "segment" / grid unit (corresponds to cell_size in Python)
    this.size = 10;
    // pen color (RGBA)
    this.color = [0, 255, 0, 255];
    // line thickness (derived from size)
    this.pen = Math.max(1, Math.round(this.size / 2));
    // inner vertical padding (corresponds to padding in Python ~3.5× cell_size)
    this.padding = Math.round(this.size * 3.5);

    // grid points (see Python: ca, cb, cc, cd)
    this.ca = [0, 3];
    this.cb = [2, 3];
    this.cc = [0, 1];
    this.cd = [2, 1];

    // line definitions for digits 0–9 (same as in your Python code)
    this.numbers = {
      '0': [this.ca, this.cc],
      '1': [this.ca, this.cb],
      '2': [this.cc, this.cd],
      '3': [this.ca, this.cd],
      '4': [this.cc, this.cb],
      '5': [this.ca, this.cb, this.cc],
      '6': [this.cd, this.cb],
      '7': [this.ca, this.cb, this.cd],
      '8': [this.cc, this.cd, this.cb],
      '9': [this.cc, this.cd, this.cb, this.ca]
    };

    // quadrant transformations (1, 10, 100, 1000)
    this.t1 = [ 1,  1];   // units (top right)
    this.t2 = [-1,  1];   // tens  (top left)
    this.t3 = [ 1, -1];   // hundreds (bottom right)
    this.t4 = [-1, -1];   // thousands (bottom left)
  }

  // chaining: set color (RGBA)
  setColor(r, g, b, a = 255) {
    this.color = [r, g, b, a];
    return this;
  }

  // chaining: set base "segment" size
  setSize(size) {
    this.size = size;
    this.pen = Math.max(1, Math.round(size / 2));
    this.padding = Math.round(size * 3.5);
    return this;
  }

  // internal helper to draw one digit into a quadrant
  _drawDigit(digitChar, tx, xAxis, yTop) {
    const p = (typeof window !== 'undefined') ? window : null;
    if (!p) return;

    const s = this.size;
    const y = yTop + this.padding;

    // vertical "staff" (drawn for each quadrant — overlap doesn't matter)
    p.stroke(...this.color);
    p.strokeWeight(this.pen);
    p.noFill();
    p.line(xAxis, y + 1 * s, xAxis, y + 7 * s);

    const dl = this.numbers[digitChar];
    if (!dl || dl.length < 2) return;

    for (let i = 0; i < dl.length - 1; i++) {
      const a = dl[i];
      const b = dl[i + 1];
      const x1 = xAxis + tx[0] * a[0] * s;
      const y1 = y + (4 - tx[1] * a[1]) * s;
      const x2 = xAxis + tx[0] * b[0] * s;
      const y2 = y + (4 - tx[1] * b[1]) * s;
      p.line(x1, y1, x2, y2);
    }
  }

  // main method: draws a number 0–9999 at axis (x,y)
  drawNum(n, x, y) {
    const num = Math.max(0, Math.min(9999, Math.floor(n)));
    const digits = String(num).padStart(4, '0').split('');

    // order of quadrants as in Python: 1→t1 (units), 10→t2, 100→t3, 1000→t4
    // digits = [ thousands, hundreds, tens, units ]
    this._drawDigit(digits[3], this.t1, x, y); // units
    this._drawDigit(digits[2], this.t2, x, y); // tens
    this._drawDigit(digits[1], this.t3, x, y); // hundreds
    this._drawDigit(digits[0], this.t4, x, y); // thousands
  }
}

// Global exports
if (typeof window !== 'undefined') {
  window.CisterFont = CisterFont;
  // alias, so new cisterFont() also works
  window.cisterFont = CisterFont;
}
