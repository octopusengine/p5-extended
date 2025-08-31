// simple_kbd.js for P5.js | 
// ver. 0.1 | 2025/08

class Keyboard {
  constructor(layout = 1, kw = 90, kh = 70) {
    this.kw = kw;
    this.kh = kh;
    this.xKbd = 0;
    this.yKbd = 50;

    this.buffer = [];
    this.keyStates = [];
    this.flashTime = 150;
    this.enterMapsTo = "=";
    this.keyRects = [];

    // Style properties
    this.fontSize = 25;
    this.keyColor = 240;
    this.keyNumColor = 65;
    this.keyKeyColor = 90;
    this.keyEqualColor = 125
    this.keyPressedColor = 180;
    this.strokeColor = 0;
    this.strokeWeight = 1;

    // >>> NOVÁ VLASTNOST <<<
    this.keyNumColor = color(200, 230, 255); // barva pro číslice

    // Layout selection
    if (layout === 1) {
      this.keys = [
        "7","8","9",
        "4","5","6",
        "1","2","3",
        "*","0","="
      ];
      this.cols = 3;
    } else if (layout === 2) {
      this.keys = [
        "+","-","*","/","R",
        "?","@","&","%","Q",
        "C","D","E","F","I",
        "8","9","A","B","L",
        "4","5","6","7","S",
        "0","1","2","3","="
      ];
      this.cols = 5;
    } else {
      throw new Error("Unknown layout");
    }

    this.keyStates = new Array(this.keys.length).fill(0);
    this.keyRects = new Array(this.keys.length).fill(null);
  }

  rows() {
    return Math.ceil(this.keys.length / this.cols);
  }

  draw(x = null, y = null) {
    // pokud uživatel zadá parametry, přepíšou vlastnosti
    if (x !== null) this.xKbd = x;
    if (y !== null) this.yKbd = y;

    const baseX = this.xKbd;
    const baseY = this.yKbd;

    textAlign(CENTER, CENTER);
    textSize(this.fontSize);

    for (let i = 0; i < this.keys.length; i++) {
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);
      const bx = baseX + col * this.kw;
      const by = baseY + row * this.kh;

      this.keyRects[i] = { x0: bx, y0: by, x1: bx + this.kw, y1: by + this.kh };

      const pressed = millis() - this.keyStates[i] < this.flashTime;
      const ch = this.keys[i];

      stroke(this.strokeColor);
      strokeWeight(this.strokeWeight);

      if (pressed) {
        fill(this.keyPressedColor);
      } else if (/^[0-9A-F]$/.test(ch)) {
        fill(this.keyNumColor);
      } else if (ch === "=") {
        fill(this.keyEqualColor);
      } else {
        fill(this.keyColor);
      }

      rect(bx, by, this.kw, this.kh);

      fill(0);
      noStroke();
      text(ch, bx + this.kw / 2, by + this.kh / 2);
    }
  }

  

  _pressIndex(i) {
  if (i < 0 || i >= this.keys.length) return null;
  const ch = this.keys[i];
  this.buffer.push(ch);
  this.keyStates[i] = millis();
  return ch; // vracíme znak, buffer není flushován
}

mousePressed(mx, my) {
  for (let i = 0; i < this.keyRects.length; i++) {
    const r = this.keyRects[i];
    if (r && mx >= r.x0 && mx < r.x1 && my >= r.y0 && my < r.y1) {
      return this._pressIndex(i);
    }
  }
  return null;
}


  // Keyboard detection
  keyPressed(evt = null) {
    const kc = evt && typeof evt.keyCode !== "undefined" ? evt.keyCode : keyCode;
    const k  = evt && typeof evt.key !== "undefined"     ? evt.key     : key;

    // ENTER / RETURN → "="
    if (kc === 13 || kc === ENTER || kc === RETURN || k === "Enter") {
      this._pressByChar(this.enterMapsTo);
      return;
    }

    // case-insensitive
    if (typeof k === "string" && k.length > 0) {
      this._pressByChar(k);
    }
  }

  // ===== internal helpers =====

  _pressByChar(ch) {
    const up = String(ch).toUpperCase();
    const i = this.keys.findIndex(c => c.toUpperCase() === up);
    if (i !== -1) this._pressIndex(i);
  }



 _pressIndex(i) {
  if (i < 0 || i >= this.keys.length) return null;
  const ch = this.keys[i];
  this.buffer.push(ch);
  this.keyStates[i] = millis();
  return ch; // buffer není flushován zde
}

_flushBuffer() {
  if (this.buffer.length === 0) return;

  const p = createP('');
  const span = createSpan(this.buffer.join(''));
  span.addClass('data_kbd');
  span.parent(p);
  p.parent(document.body);

  this.buffer = [];
}




}
