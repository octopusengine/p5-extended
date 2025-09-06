// box_giu.js | simple GUI library for p5.js
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
    this.lineCol1 = color(0,255,0);
    this.lineCol2 = color(0,100,0);
 
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
      BoxSlider.active = this;  // this slider owns the mouse
    }
  }

  released() {
    if (this.dragging) {
      this.dragging = false;
      if (BoxSlider.active === this) BoxSlider.active = null;
    }
  }

  draw() {
  push();               // začínáme lokální kreslení
  colorMode(RGB);       // přepni na RGB, aby stroke/fill fungovalo
  stroke(this.lineCol1);
  strokeWeight(2);
  line(this.x, this.y, this.x + this.w, this.y);

  // ticks
  stroke(this.lineCol2);
  let step = (this.maxVal <= 20) ? 1 : 10;
  for (let v = this.minVal; v <= this.maxVal; v += step) {
    let tx = this.valueToX(v);
    line(tx, this.y - 5, tx, this.y + 5);
  }

  // knob
  let knobX = this.valueToX(this.value);
  fill(this.lineCol1);
  noStroke();
  rectMode(CENTER);
  rect(knobX, this.y, this.h, this.h, 3);
  pop();                // obnov stav
}
}

//-----------------------
class EffectShape {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shadowOffsetX = 14;
    this.shadowOffsetY = 14;
    this.shadowBlur = 14;
    this._shadowColor = this.p.color(0, 0, 0, 100); // Interní p5.Color objekt

    this._blurEnabled = false; // Nová property pro povolení/zakázání bluru
    this.blurAmount = 8;       // Množství bluru v pixelech
  }

  // Nastaví barvu stínu. Očekává p5.Color objekt.
  setShadowColor(p5ColorObject) {
    this._shadowColor = p5ColorObject;
  }

  // Povolí nebo zakáže blur efekt.
  // Parametr 'enabled' je boolean (true/false).
  // Parametr 'amount' (volitelný) nastaví intenzitu bluru v pixelech.
  blur(enabled, amount = this.blurAmount) {
    this._blurEnabled = enabled;
    this.blurAmount = amount;
  }

  // Aplikuje lineární gradient na drawingContext
  // colorS a colorE musí být p5.Color objekty
  linearGradient(sX, sY, eX, eY, colorS, colorE) {
    let gradient = this.p.drawingContext.createLinearGradient(sX, sY, eX, eY);
    gradient.addColorStop(0, colorS.toString());
    gradient.addColorStop(1, colorE.toString());
    this.p.drawingContext.fillStyle = gradient;
  }

  // Aplikuje stín a blur na drawingContext
  // Přejmenováno z applyShadow na applyEffects pro obecnější použití
  applyEffects() {
    // Aplikuje stín
    this.p.drawingContext.shadowOffsetX = this.shadowOffsetX;
    this.p.drawingContext.shadowOffsetY = this.shadowOffsetY;
    this.p.drawingContext.shadowBlur = this.shadowBlur;
    this.p.drawingContext.shadowColor = this._shadowColor.toString();

    // Aplikuje blur, pokud je povolen
    if (this._blurEnabled) {
      this.p.drawingContext.filter = `blur(${this.blurAmount}px)`;
    }
  }

  // Resetuje všechny aplikované efekty (stín a blur)
  resetEffects() {
    // Resetuje stín
    this.p.drawingContext.shadowOffsetX = 0;
    this.p.drawingContext.shadowOffsetY = 0;
    this.p.drawingContext.shadowBlur = 0;
    this.p.drawingContext.shadowColor = 'rgba(0,0,0,0)';

    // Resetuje filter (blur)
    this.p.drawingContext.filter = 'none'; // Důležité: 'none' resetuje všechny filtry
  }
}