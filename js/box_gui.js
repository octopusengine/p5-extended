// box_gui.js | simple GUI library for p5.js
// v0.1 | 2025/09

class BoxSlider {
  static active = null;

  constructor(x, y, w, h, a, b, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.minVal = a;
    this.maxVal = c;
    this.value = constrain(b, a, c);

    this.dragging = false;
    this.lineCol1 = color(0, 255, 0);
    this.lineCol2 = color(0, 100, 0);
  }

  valueToX(v) {
    let ratio = (v - this.minVal) / (this.maxVal - this.minVal);
    return this.x + ratio * this.w;
  }

  xToValue(px) {
    let ratio = (px - this.x) / this.w;
    return constrain(this.minVal + ratio * (this.maxVal - this.minVal), this.minVal, this.maxVal);
  }

  update() {
    if (this.dragging && BoxSlider.active === this) {
      this.value = this.xToValue(mouseX);
    }
  }

  pressed() {
    let knobX = this.valueToX(this.value);
    if (
      mouseX > knobX - this.h / 2 &&
      mouseX < knobX + this.h / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    ) {
      this.dragging = true;
      BoxSlider.active = this;  // This slider owns the mouse
    }
  }

  released() {
    if (this.dragging) {
      this.dragging = false;
      if (BoxSlider.active === this) BoxSlider.active = null;
    }
  }

  draw() {
    push();               // Start local drawing
    colorMode(RGB);       // Switch to RGB so stroke/fill works
    stroke(this.lineCol1);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.w, this.y);

    // Ticks
    stroke(this.lineCol2);
    let step = (this.maxVal <= 20) ? 1 : 10;
    for (let v = this.minVal; v <= this.maxVal; v += step) {
      let tx = this.valueToX(v);
      line(tx, this.y - 5, tx, this.y + 5);
    }

    // Knob
    let knobX = this.valueToX(this.value);
    fill(this.lineCol1);
    noStroke();
    rectMode(CENTER);
    rect(knobX, this.y, this.h, this.h, 3);
    pop();                // Restore state
  }
}

//-----------------------
class EffectShape {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shadowOffsetX = 14;
    this.shadowOffsetY = 14;
    this.shadowBlur = 14;
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
