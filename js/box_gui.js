// box_gui.js | simple GUI library for p5.js
// v0.2 | 2025/09

class ButtonBox {
  constructor(x, y, w, h, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;

    this.cornerRadius = 6;
    this.strokeWeight = 2;
    this.strokeColor = color(0, 255, 0);
    this.fillColor = color(0, 50, 0);
    this.fillColorHover = color(0, 80, 0);

    this.textColor = color(0, 255, 0);
    this.textSize = 16;
  }

  // zjištění, zda je myš nad tlačítkem
  isHovered() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  // zpracování kliknutí
  pressed() {
    if (this.isHovered()) {
      // akce při kliknutí
      window.location.href = "index.html";
      return true;
    }
    return false;
  }

  // vykreslení tlačítka
  draw() {
    push();
    colorMode(RGB);

    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    if (this.isHovered()) {
      fill(this.fillColorHover);
    } else {
      fill(this.fillColor);
    }
    rect(this.x, this.y, this.w, this.h, this.cornerRadius);

    noStroke();
    fill(this.textColor);
    textSize(this.textSize);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    pop();
  }
}



class CheckBox {
    constructor(x, y, size, initialState = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.checked = initialState; // true nebo false

        this.outerCornerRadius = 5; // Zaoblení rohů vnějšího rámečku
        this.strokeWeight = 2;
        this.strokeColor = color(0, 255, 0); // Zelená linka

        this.padding = 5; // Mezera od okraje

        // Vypočítáme velikost a pozici vnitřního čtverce
        this.innerSize = this.size - (2 * this.padding);
        this.innerX = this.x + this.padding;
        this.innerY = this.y + this.padding;

        this.innerCornerRadius = Math.max(0, this.outerCornerRadius - Math.min(this.padding, this.outerCornerRadius));


        this.fillColorChecked = color(0, 200, 0); // Jasná zelená pro checked
        this.fillColorUnchecked = color(0, 80, 0);  // Tmavá zelená pro unchecked

        // --- Nové vlastnosti pro textový popisek ---
        this.label = "";
        this.labelColor = color(0,200,0); 
        this.labelSize = 16;          // Velikost textu
        this.labelOffsetX = this.size + 10; // Relativní X pozice od levého horního rohu checkboxu
        this.labelOffsetY = this.size / 2 + this.labelSize / 3; // Relativní Y pozice od levého horního rohu checkboxu (pro vertikální vycentrování s textem)
    }

    // Nastaví text popisku
    textLabel(text, offsetX = this.size + 10, offsetY = null, color = null, size = null) {
        this.label = text;
        this.labelOffsetX = offsetX;
        this.labelOffsetY = (offsetY !== null) ? offsetY : (this.size / 2 + this.labelSize / 3);
        this.labelColor = (color !== null) ? color : this.labelColor;
        this.labelSize = (size !== null) ? size : this.labelSize;
        return this; // Pro chainování metod
    }

    // Kontroluje, zda se myš nachází nad checkboxem (nebo nad popiskem pro jednodušší interakci)
    isHovered() {
        if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined') {
            return false;
        }

        // Oblast checkboxu
        const checkArea = mouseX > this.x && mouseX < this.x + this.size &&
                          mouseY > this.y && mouseY < this.y + this.size;

        // Oblast popisku
        // Zde je to zjednodušené, pokud potřebuješ přesnější ohraničení textu,
        // musel bys použít textWidth() a textAscent()/textDescent().
        // Prozatím předpokládejme obdélník kolem textu.
        const labelArea = mouseX > this.x + this.labelOffsetX &&
                          mouseX < this.x + this.labelOffsetX + textWidth(this.label) &&
                          mouseY > this.y + this.labelOffsetY - this.labelSize && // Odhad výšky textu
                          mouseY < this.y + this.labelOffsetY;

        return checkArea || labelArea;
    }

    // Zpracuje kliknutí myši
    pressed() {
        if (this.isHovered()) {
            this.checked = !this.checked; // Přepne stav
            return true; // Označuje, že byl checkbox kliknut
        }
        return false;
    }

    // Vykreslí checkbox
    draw() {
        push();
        colorMode(RGB);

        // Kreslíme vnější rámeček
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        noFill(); // Rámeček bez výplně
        rect(this.x, this.y, this.size, this.size, this.outerCornerRadius);

        // Kreslíme vnitřní výplň
        noStroke(); // Vnitřní výplň bez linky
        if (this.checked) {
            fill(this.fillColorChecked);
        } else {
            fill(this.fillColorUnchecked);
        }
        // Kontrola, aby se vnitřní čtverec vykreslil pouze, pokud má platnou velikost
        if (this.innerSize > 0) {
            rect(this.innerX, this.innerY, this.innerSize, this.innerSize, this.innerCornerRadius);
        }


        // --- Vykreslení textového popisku ---
        if (this.label !== "") {
            fill(this.labelColor);
            noStroke();
            textSize(this.labelSize);
            textAlign(LEFT, BASELINE); // Text zarovnáme k levému okraji a základní linii
            text(this.label, this.x + this.labelOffsetX, this.y + this.labelOffsetY);
        }


        pop();
    }
}




// Třída BoxSlider - UPRAVENÁ VERZE
class BoxSlider {
  static active = null;

  constructor(x, y, w, h, a, b, c, vertical=false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vertical = vertical; // přepínač: false = horizontální, true = vertikální

    this.minVal = a;
    this.maxVal = c;
    this.value = constrain(b, a, c);

    this.dragging = false;
    this.lineCol1 = color(0, 255, 0);
    this.lineCol2 = color(0, 100, 0);

    // touchAreaSize by měl brát v úvahu, zda je slider vertikální nebo horizontální
    this.touchAreaSize = Math.max(30, (this.vertical ? this.w : this.h) * 1.5);
    this.isHovering = false;
  }

  // Získání souřadnic ukazatele (dotyk nebo myš)
  getPointer() {
    // Používáme touches[0] pro první dotyk, jinak mouseX/mouseY
    if (touches.length > 0) {
      return { x: touches[0].x, y: touches[0].y };
    } else {
      return { x: mouseX, y: mouseY };
    }
  }

  valueToPos(v) {
    let ratio = (v - this.minVal) / (this.maxVal - this.minVal);
    if (this.vertical) {
      return this.y + this.h - ratio * this.h; // invert Y pro vertikální slider
    } else {
      return this.x + ratio * this.w;
    }
  }

  posToValue(px, py) {
    if (this.vertical) {
      // Důležité: 'this.y + this.h - py' pro vertikální slider
      let ratio = (this.y + this.h - py) / this.h;
      return constrain(this.minVal + ratio * (this.maxVal - this.minVal), this.minVal, this.maxVal);
    } else {
      let ratio = (px - this.x) / this.w;
      return constrain(this.minVal + ratio * (this.maxVal - this.minVal), this.minVal, this.maxVal);
    }
  }

  isPointerOver() {
    let p = this.getPointer();
    // Pokud p.x nebo p.y nejsou validní čísla (např. když není aktivní dotyk/myš), vrať false
    if (isNaN(p.x) || isNaN(p.y)) return false;

    if (this.vertical) {
      let knobY = this.valueToPos(this.value);
      return (
        p.x > this.x - this.touchAreaSize/2 &&
        p.x < this.x + this.w + this.touchAreaSize/2 && // Šířka slideru je tentokrát this.w
        p.y > knobY - this.touchAreaSize/2 &&
        p.y < knobY + this.touchAreaSize/2
      );
    } else {
      let knobX = this.valueToPos(this.value);
      return (
        p.x > knobX - this.touchAreaSize/2 &&
        p.x < knobX + this.touchAreaSize/2 &&
        p.y > this.y - this.touchAreaSize/2 &&
        p.y < this.y + this.h + this.touchAreaSize/2 // Výška slideru je tentokrát this.h
      );
    }
  }

  update() {
    this.isHovering = this.isPointerOver();
    if (this.dragging && BoxSlider.active === this) {
      let p = this.getPointer();
      // Ujistíme se, že pointer má validní souřadnice před použitím
      if (!isNaN(p.x) && !isNaN(p.y)) {
         this.value = this.posToValue(p.x, p.y);
      }
    }
  }

  pressed() {
    if (this.isPointerOver()) {
      this.dragging = true;
      BoxSlider.active = this;
      let p = this.getPointer();
      // Ujistíme se, že pointer má validní souřadnice před použitím
      if (!isNaN(p.x) && !isNaN(p.y)) {
          this.value = this.posToValue(p.x, p.y);
      }
      return true;
    }
    return false;
  }

  released() {
    if (this.dragging) {
      this.dragging = false;
      if (BoxSlider.active === this) BoxSlider.active = null;
    }
  }

  draw() {
    push();
    colorMode(RGB);

    let lineCol = this.lineCol1;
    let knobFill = this.lineCol1;
    if (this.isHovering || this.dragging) {
      lineCol = color(50, 255, 50);
      knobFill = color(50, 255, 50);
    }

    stroke(lineCol);
    strokeWeight(2);

    if (this.vertical) {
      line(this.x, this.y, this.x, this.y + this.h);
      let step = (this.maxVal <= 20) ? 1 : 10;
      stroke(this.lineCol2);
      for (let v = this.minVal; v <= this.maxVal; v += step) {
        let ty = this.valueToPos(v);
        line(this.x - 5, ty, this.x + 5, ty);
      }
      let knobY = this.valueToPos(this.value);
      fill(knobFill);
      noStroke();
      rectMode(CENTER);
      // Velikost knobu pro vertikální slider: this.w je jeho šířka
      rect(this.x, knobY, this.touchAreaSize, this.touchAreaSize, 3);
    } else {
      line(this.x, this.y, this.x + this.w, this.y);
      let step = (this.maxVal <= 20) ? 1 : 10;
      stroke(this.lineCol2);
      for (let v = this.minVal; v <= this.maxVal; v += step) {
        let tx = this.valueToPos(v);
        line(tx, this.y - 5, tx, this.y + 5);
      }
      let knobX = this.valueToPos(this.value);
      fill(knobFill);
      noStroke();
      rectMode(CENTER);
      // Velikost knobu pro horizontální slider: this.h je jeho výška
      rect(knobX, this.y, this.touchAreaSize, this.touchAreaSize, 3);
    }

    pop();
  }
}


// Třída CheckBox2 - Upravená pro použití getPointer() a isPointerOver()
class CheckBox2 {
    constructor(x, y, size, initialState = false) {
        this.x = x;
        this.y = y;
        this.size = size; 
        this.checked = initialState; 

        this.outerCornerRadius = 5; 
        this.strokeWeight = 2;
        this.strokeColor = color(0, 255, 0); 

        this.padding = 5; 

        this.innerSize = this.size - (2 * this.padding);
        this.innerX = this.x + this.padding;
        this.innerY = this.y + this.padding;

        this.innerCornerRadius = Math.max(0, this.outerCornerRadius - Math.min(this.padding, this.outerCornerRadius));

        this.fillColorChecked = color(0, 200, 0);
        this.fillColorUnchecked = color(0, 80, 0);  

        this.label = "";
        this.labelColor = color(255); 
        this.labelSize = 14;          
        this.labelOffsetX = this.size + 10; 
        this.labelOffsetY = this.size / 2 + this.labelSize / 3; 

        // Nová vlastnost pro rozšíření dotykové oblasti checkboxu
        this.interactivePadding = 10; 
    }

    // Získání souřadnic ukazatele (dotyk nebo myš) - Duplikujeme pro CheckBox, nebo vytvoříme utilitu
    getPointer() {
        if (touches.length > 0) {
            return { x: touches[0].x, y: touches[0].y };
        } else {
            return { x: mouseX, y: mouseY };
        }
    }


    // Používáme getPointer()
    isPointerOver() {
        let p = this.getPointer();
        if (isNaN(p.x) || isNaN(p.y)) return false; // Kontrola validních souřadnic

        // Oblast checkboxu + malý přesah pro lepší dotyk
        const checkArea = p.x > this.x - this.interactivePadding &&
                          p.x < this.x + this.size + this.interactivePadding &&
                          p.y > this.y - this.interactivePadding &&
                          p.y < this.y + this.size + this.interactivePadding;

        push(); // Dočasně změníme nastavení textu
        textSize(this.labelSize);
        let textW = textWidth(this.label);
        pop(); // Obnovíme původní nastavení textu
        
        // Oblast popisku
        const labelArea = p.x > this.x + this.labelOffsetX - this.interactivePadding &&
                          p.x < this.x + this.labelOffsetX + textW + this.interactivePadding &&
                          p.y > this.y + this.labelOffsetY - this.labelSize - this.interactivePadding && 
                          p.y < this.y + this.labelOffsetY + this.interactivePadding;

        return checkArea || labelArea;
    }

    // Aktualizovaná textLabel metoda
    textLabel(text, offsetX = null, offsetY = null, color = null, size = null) {
        this.label = text;
        this.labelOffsetX = (offsetX !== null) ? offsetX : (this.size + 10);
        this.labelOffsetY = (offsetY !== null) ? offsetY : (this.size / 2 + this.labelSize / 3);
        this.labelColor = (color !== null) ? color : this.labelColor;
        this.labelSize = (size !== null) ? size : this.labelSize;
        return this;
    }

    // Používáme isPointerOver()
    pressed() {
        if (this.isPointerOver()) {
            this.checked = !this.checked;
            return true;
        }
        return false;
    }

    draw() {
        push();
        colorMode(RGB);

        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        noFill();
        rect(this.x, this.y, this.size, this.size, this.outerCornerRadius);

        noStroke();
        if (this.checked) {
            fill(this.fillColorChecked);
        } else {
            fill(this.fillColorUnchecked);
        }
        if (this.innerSize > 0) {
            rect(this.innerX, this.innerY, this.innerSize, this.innerSize, this.innerCornerRadius);
        }

        if (this.label !== "") {
            fill(this.labelColor);
            noStroke();
            textSize(this.labelSize);
            textAlign(LEFT, BASELINE);
            text(this.label, this.x + this.labelOffsetX, this.y + this.labelOffsetY);
        }
        pop();
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
