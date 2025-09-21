// digital_font.js — jednoduchá verze s pevnými daty + jednorázové animace
// ver. 0.3 - 2025/09

class DigiFont {
  constructor(glyphMap) {
    this.cols = 5;
    this.rows = 7;
    this.dotScale = 0.9;
    this.glyphs = new Map();

    // Výchozí nastavení
    this.defaultColor = [0, 255, 0, 255]; // zelená
    this.defaultSize = 10;
    this.pixelShape = "circle"; // výchozí tvar pixelu

    // registry animací
    this._anims = new Map();

    if (glyphMap) this.loadGlyphs(glyphMap);
  }

  // ----- Nastavení -----
  setColor(r, g, b, a = 255) { this.defaultColor = [r, g, b, a]; return this; }
  setFontSize(size) { this.defaultSize = size; return this; }
  setPixel(shape) { if (["circle", "square"].includes(shape)) this.pixelShape = shape; return this; }

  changeColorStyle() {
    this.setColor(currentColors[2].levels);
  }

  // ----- Animace -----
  _getAnim(id) {
    if (!this._anims.has(id)) this._anims.set(id, { t0: null, done: false });
    return this._anims.get(id);
  }
  resetAnim(id) { this._anims.delete(id); return this; }
  isAnimDone(id) { const rec = this._anims.get(id); return !!(rec && rec.done); }

  // ---
playFromAlpha(id, text, x, y, opts = {}) {
  const {
    duration = 1000,
    delay = 0,
    color = this.defaultColor,
    letterSpacing = 1,
    monoSpacing = null,
    dotScale = this.dotScale,
    flipY = false,
    fallback = '?',
    size: sizeOpt    // ← podporuj i opts.size
  } = opts;

  //const fontSize = (sizeOpt ?? size ?? this.defaultSize);  // ← jediné místo pravdy
  const fontSize = this.defaultSize;
  // ... dál už všude používej fontSize ...
  // před startem:
  const rec = this._getAnim(id);
  const now = (typeof millis === 'function') ? millis() : Date.now();
  if (rec.t0 == null) rec.t0 = now;

  let elapsed = now - rec.t0;
  if (elapsed < delay) {
    const col0 = [color[0], color[1], color[2], 0];
    this.drawText(text, x, y, fontSize, { letterSpacing, monoSpacing, color: col0, dotScale, flipY, fallback });
    return false;
  }

  let p = (elapsed - delay) / duration;
  if (p >= 1) { p = 1; rec.done = true; }

  const baseA = (color.length >= 4 ? color[3] : 255);
  const col = [color[0], color[1], color[2], Math.round(baseA * p)];
  this.drawText(text, x, y, fontSize, { letterSpacing, monoSpacing, color: col, dotScale, flipY, fallback });
  return rec.done;
}

typeWriter(id, text, x, y, opts = {}, doneCallback = null) {
  const {
    duration = 80,          // ms na JEDEN znak
    delay = 0,
    color = this.defaultColor,
    letterSpacing = 1,
    monoSpacing = null,
    dotScale = this.dotScale,
    flipY = false,
    fallback = '?',
    easing = t => 1 - Math.pow(1 - t, 3)
  } = opts;

  const fontSize = this.defaultSize;
  const rec = this._getAnim(id);
  const now = (typeof millis === 'function') ? millis() : Date.now();
  if (rec.t0 == null) rec.t0 = now;

  let elapsed = now - rec.t0;

  if (elapsed < delay) {
    return false;
  }
  elapsed -= delay;

  const totalChars = [...String(text)].length;
  const perChar = duration;
  const fullChars = Math.floor(elapsed / perChar);
  const frac = Math.min(1, (elapsed % perChar) / perChar);
  const idx = Math.min(fullChars, totalChars - 1);

  const advCells = monoSpacing != null ? monoSpacing : this.cols;
  const cellAdvance = (advCells + letterSpacing) * fontSize;

  if (fullChars > 0) {
    const doneText = [...text].slice(0, Math.min(fullChars, totalChars)).join("");
    this.drawText(doneText, x, y, fontSize, { letterSpacing, monoSpacing, color, dotScale, flipY, fallback });
  }

  if (fullChars < totalChars) {
    const ch = [...text][idx];
    const xBase = x + fullChars * cellAdvance;

    const e = easing(frac);
    const xNow = xBase - (1 - e) * (advCells * fontSize);
    const baseA = (color.length >= 4 ? color[3] : 255);
    const col = [color[0], color[1], color[2], Math.round(baseA * e)];

    this.drawText(ch, xNow, y, fontSize, { letterSpacing, monoSpacing, color: col, dotScale, flipY, fallback });
  }

  if (elapsed >= totalChars * perChar) {
    this.drawText(text, x, y, fontSize, { letterSpacing, monoSpacing, color, dotScale, flipY, fallback });
    if (!rec.done) {
      rec.done = true;
      console.log(`typeWriter[${id}] hotovo – spouštím callback`);
      if (doneCallback) doneCallback();
    }
    return true;
  }
  return false;
}



playFromLeft(id, text, x, y, opts = {}) {
  const {
    duration = 1000,
    delay = 0,
    easing = t => 1 - Math.pow(1 - t, 3),
    color = this.defaultColor,
    letterSpacing = 1,
    monoSpacing = null,
    dotScale = this.dotScale,
    flipY = false,
    fallback = '?',
    size: sizeOpt
  } = opts;

  //const fontSize = (sizeOpt ?? size ?? this.defaultSize);
  const fontSize = this.defaultSize;

  const rec = this._getAnim(id);
  const now = (typeof millis === 'function') ? millis() : Date.now();
  if (rec.t0 == null) rec.t0 = now;

  let elapsed = now - rec.t0;
  const cells = this.measureCells(text, letterSpacing, monoSpacing);
  const wpx = cells * fontSize;

  if (elapsed < delay) {
    const xNow = x - wpx;
    const col0 = [color[0], color[1], color[2], 0];
    this.drawText(text, xNow, y, fontSize, { letterSpacing, monoSpacing, color: col0, dotScale, flipY, fallback });
    return false;
  }

  let p = (elapsed - delay) / duration;
  if (p >= 1) { p = 1; rec.done = true; }
  const e = easing(Math.max(0, Math.min(1, p)));

  const xNow = x - (1 - e) * wpx;
  this.drawText(text, xNow, y, fontSize, { letterSpacing, monoSpacing, color, dotScale, flipY, fallback });
  return rec.done;
}



// ---/---


  // ----- Glyphy a kreslení -----
  loadGlyphs(obj) {
    for (const key of Object.keys(obj)) {
      const bytes = obj[key];
      const cp = [...key][0].codePointAt(0);
      this.glyphs.set(cp, Uint8Array.from(bytes));
    }
    return this;
  }
  addGlyph(ch, bytes) {
    const cp = [...ch][0].codePointAt(0);
    this.glyphs.set(cp, Uint8Array.from(bytes));
    return this;
  }
  measureCells(text, letterSpacing = 1, monoSpacing = null) {
    if (!text || !text.length) return 0;
    const perChar = (monoSpacing != null ? monoSpacing : this.cols);
    return text.length * perChar + (text.length - 1) * letterSpacing;
  }
  drawChar(ch, x, y, cell, p5ctx, opts = {}) {
    const { color = this.defaultColor, dotScale = this.dotScale, flipY = false, fallback = '?' } = opts;
    const cp = [...ch][0].codePointAt(0);
    let data = this.glyphs.get(cp);
    if (!data && fallback) data = this.glyphs.get(fallback.codePointAt(0));
    if (!data) return this.cols;
    const r = cell, rad = (r * dotScale) * 0.5;
    p5ctx.push();
    p5ctx.noStroke();
    p5ctx.fill(...color);
    for (let cx = 0; cx < this.cols; cx++) {
      const col = data[cx] || 0;
      for (let ry = 0; ry < this.rows; ry++) {
        const bit = (col >> ry) & 1;
        if (bit) {
          const row = flipY ? (this.rows - 1 - ry) : ry;
          const cxPos = x + cx * r + r * 0.5;
          const cyPos = y + row * r + r * 0.5;
          if (this.pixelShape === "square") {
            p5ctx.square(cxPos - rad, cyPos - rad, rad * 2);
          } else {
            p5ctx.circle(cxPos, cyPos, rad * 2);
          }
        }
      }
    }
    p5ctx.pop();
    return this.cols;
  }
  drawText(text, x, y, size = this.defaultSize, opts = {}) {
    const { letterSpacing = 1, monoSpacing = null } = opts;
    const color = opts.color || this.defaultColor;
    const p = (typeof window !== 'undefined') ? window : null;
    if (!p) throw new Error('p5 context not found');
    let penX = x;
    for (const ch of [...text]) {
      const adv = this.drawChar(ch, penX, y, size, p, { ...opts, color });
      const total = (monoSpacing != null ? monoSpacing : adv);
      penX += (total + letterSpacing) * size;
    }
  }
}

// ASCII 32–126 + malá písmena
const DIGI_GLYPHS = {
  " ": [0x00,0x00,0x00,0x00,0x00],
  "!": [0x00,0x00,0x5F,0x00,0x00],
  "\"": [0x00,0x07,0x00,0x07,0x00],
  "#": [0x14,0x7F,0x14,0x7F,0x14],
  "$": [0x24,0x2A,0x7F,0x2A,0x12],
  "%": [0x23,0x13,0x08,0x64,0x62],
  "&": [0x36,0x49,0x55,0x22,0x50],
  "'": [0x00,0x05,0x03,0x00,0x00],
  "(": [0x00,0x1C,0x22,0x41,0x00],
  ")": [0x00,0x41,0x22,0x1C,0x00],
  "*": [0x08,0x2A,0x1C,0x2A,0x08],
  "+": [0x08,0x08,0x3E,0x08,0x08],
  ",": [0x00,0x50,0x30,0x00,0x00],
  "-": [0x08,0x08,0x08,0x08,0x08],
  ".": [0x00,0x60,0x60,0x00,0x00],
  "/": [0x20,0x10,0x08,0x04,0x02],
  "0": [0x3E,0x51,0x49,0x45,0x3E],
  "1": [0x00,0x42,0x7F,0x40,0x00],
  "2": [0x42,0x61,0x51,0x49,0x46],
  "3": [0x21,0x41,0x45,0x4B,0x31],
  "4": [0x18,0x14,0x12,0x7F,0x10],
  "5": [0x27,0x45,0x45,0x45,0x39],
  "6": [0x3C,0x4A,0x49,0x49,0x30],
  "7": [0x01,0x71,0x09,0x05,0x03],
  "8": [0x36,0x49,0x49,0x49,0x36],
  "9": [0x06,0x49,0x49,0x29,0x1E],
  ":": [0x00,0x36,0x36,0x00,0x00],
  ";": [0x00,0x56,0x36,0x00,0x00],
  "<": [0x00,0x08,0x14,0x22,0x41],
  "=": [0x14,0x14,0x14,0x14,0x14],
  ">": [0x41,0x22,0x14,0x08,0x00],
  "?": [0x02,0x01,0x51,0x09,0x06],
  "@": [0x32,0x49,0x79,0x41,0x3E],
  "A": [0x7E,0x11,0x11,0x11,0x7E],
  "B": [0x7F,0x49,0x49,0x49,0x36],
  "C": [0x3E,0x41,0x41,0x41,0x22],
  "D": [0x7F,0x41,0x41,0x22,0x1C],
  "E": [0x7F,0x49,0x49,0x49,0x41],
  "F": [0x7F,0x09,0x09,0x01,0x01],
  "G": [0x3E,0x41,0x41,0x51,0x32],
  "H": [0x7F,0x08,0x08,0x08,0x7F],
  "I": [0x00,0x41,0x7F,0x41,0x00],
  "J": [0x20,0x40,0x41,0x3F,0x01],
  "K": [0x7F,0x08,0x14,0x22,0x41],
  "L": [0x7F,0x40,0x40,0x40,0x40],
  "M": [0x7F,0x02,0x04,0x02,0x7F],
  "N": [0x7F,0x04,0x08,0x10,0x7F],
  "O": [0x3E,0x41,0x41,0x41,0x3E],
  "P": [0x7F,0x09,0x09,0x09,0x06],
  "Q": [0x3E,0x41,0x51,0x21,0x5E],
  "R": [0x7F,0x09,0x19,0x29,0x46],
  "S": [0x46,0x49,0x49,0x49,0x31],
  "T": [0x01,0x01,0x7F,0x01,0x01],
  "U": [0x3F,0x40,0x40,0x40,0x3F],
  "V": [0x1F,0x20,0x40,0x20,0x1F],
  "W": [0x7F,0x20,0x18,0x20,0x7F],
  "X": [0x63,0x14,0x08,0x14,0x63],
  "Y": [0x03,0x04,0x78,0x04,0x03],
  "Z": [0x61,0x51,0x49,0x45,0x43],
  "a": [0x20,0x54,0x54,0x54,0x78],
  "b": [0x7F,0x48,0x44,0x44,0x38],
  "c": [0x38,0x44,0x44,0x44,0x20],
  "d": [0x38,0x44,0x44,0x48,0x7F],
  "e": [0x38,0x54,0x54,0x54,0x18],
  "f": [0x08,0x7E,0x09,0x01,0x02],
  "g": [0x08,0x14,0x54,0x54,0x3C],
  "h": [0x7F,0x08,0x04,0x04,0x78],
  "i": [0x00,0x44,0x7D,0x40,0x00],
  "j": [0x20,0x40,0x44,0x3D,0x00],
  "k": [0x00,0x7F,0x10,0x28,0x44],
  "l": [0x00,0x41,0x7F,0x40,0x00],
  "m": [0x7C,0x04,0x18,0x04,0x78],
  "n": [0x7C,0x08,0x04,0x04,0x78],
  "o": [0x38,0x44,0x44,0x44,0x38],
  "p": [0x7C,0x14,0x14,0x14,0x08],
  "q": [0x08,0x14,0x14,0x18,0x7C],
  "r": [0x7C,0x08,0x04,0x04,0x08],
  "s": [0x48,0x54,0x54,0x54,0x20],
  "t": [0x04,0x3F,0x44,0x40,0x20],
  "u": [0x3C,0x40,0x40,0x20,0x7C],
  "v": [0x1C,0x20,0x40,0x20,0x1C],
  "w": [0x3C,0x40,0x30,0x40,0x3C],
  "x": [0x44,0x28,0x10,0x28,0x44],
  "y": [0x0C,0x50,0x50,0x50,0x3C],
  "z": [0x44,0x64,0x54,0x4C,0x44],
  "_": [0x40,0x40,0x40,0x40,0x40]
};

if (typeof window !== 'undefined') window.DigiFont = DigiFont;
if (typeof window !== 'undefined') window.DIGI_GLYPHS = DIGI_GLYPHS;


//---------------------------------
class Terminal {
  constructor(x, y, w, h, df, max_line_chars = 25, fontSize = 2) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.df = df;
    this.margin = 10;
    this.fontSize = fontSize;
    this.max_line_chars = max_line_chars;

    this.buffer = ["your input", ""];
    this.activeLine = 1;
    this.showCursor = true;
    this.cursorTimer = 0;

    this.commands = {}; // <- zde budeme ukládat externí příkazy
  }

  // metoda pro registraci externího příkazu
  registerCommand(name, callback) {
    this.commands[name.toLowerCase()] = callback;
  }

  handleKey(key) {
    if (key === "Enter") {
      const currentLine = this.buffer[this.activeLine].trim().toLowerCase();

      // nejdříve externí příkazy
      if (this.commands[currentLine]) {
        this.buffer.push(this.commands[currentLine]());
      }
      // pak vestavěné příkazy
      else if (currentLine === "time") {
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2,"0") + ":" +
                        now.getMinutes().toString().padStart(2,"0");
        this.buffer.push("TIME: " + timeStr);
      } else if (currentLine === "date") {
        const now = new Date();
        const dateStr = now.getFullYear() + "/" +
                        (now.getMonth()+1).toString().padStart(2,"0") + "/" +
                        now.getDate().toString().padStart(2,"0");
        this.buffer.push("DATE: " + dateStr);
      } else if (currentLine === "ver") {
        this.buffer.push("p5.js version: " + p5.VERSION);
      } else {
        this.buffer.push("THANKS");
      }

      this.buffer.push("");
      this.activeLine = this.buffer.length - 1;
      this.showCursor = true;
      this.cursorTimer = millis();
    }
    else if (key === "Backspace") {
      this.buffer[this.activeLine] = this.buffer[this.activeLine].slice(0, -1);
    }
    else if (key.length === 1) {
      let line = this.buffer[this.activeLine] + key;
      if (line.length > this.max_line_chars) {
        const overflow = line.slice(this.max_line_chars);
        line = line.slice(0, this.max_line_chars);
        this.buffer[this.activeLine] = line;
        this.buffer.push(overflow);
        this.activeLine = this.buffer.length - 1;
      } else {
        this.buffer[this.activeLine] = line;
      }
    }
  }

  updateCursor() {
    if (millis() - this.cursorTimer > 500) {
      this.showCursor = !this.showCursor;
      this.cursorTimer = millis();
    }
  }

  draw() {
    // rámeček
    push();
    noFill();
    stroke(0, 255, 0);
    rect(this.x, this.y, this.w, this.h);
    pop();

    // výpočet počtu řádků, které se vejdou
    const maxLines = Math.floor(this.h / 40);

    this.df.setColor(0, 255, 0).setFontSize(this.fontSize);

    const startLine = Math.max(0, this.buffer.length - maxLines);
    for (let i = startLine; i < this.buffer.length; i++) {
      let textToDraw = this.buffer[i];
      if (i === this.activeLine) {
        textToDraw += this.showCursor ? "_" : " ";
      }
      this.df.drawText(textToDraw, this.x + this.margin, this.y + (i - startLine) * 40 + this.margin);
    }

    this.updateCursor();
  }
}
