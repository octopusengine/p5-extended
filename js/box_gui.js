// box_gui.js | simple GUI library for p5.js
// v0.3 | 2025/09


//================================
class ProgressBar {
  constructor(x, y, w, h, minVal = 0, maxVal = 100) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.value = minVal;

    // barvy – budou nastaveny přes changeColorStyle
    this.bgColor = color(33);
    this.borderColor = color("green");
    this.barColor = color("green");

    this.isBorder = true;
    this.borderOffset = 5;
    this.cornerRadius = 6;
  }

  setValue(v) {
    this.value = constrain(v, this.minVal, this.maxVal);
  }

  changeColorStyle() {
    // použij barvy ze současného tématu
    this.bgColor = color(currentColors[1]);   
    this.borderColor = color(currentColors[2]); 
    this.barColor = color(currentColors[3]);
  }

  draw() {
    push();

    // border
    if (this.isBorder) {
      stroke(this.borderColor);
      strokeWeight(1);
      noFill();
      rect(
        this.x - this.borderOffset,
        this.y - this.borderOffset,
        this.w + this.borderOffset * 2,
        this.h + this.borderOffset * 2,
        this.cornerRadius
      );
    }

    noStroke();
    fill(this.bgColor);
    rect(this.x, this.y, this.w, this.h);

    fill(this.barColor);
    let ratio = (this.value - this.minVal) / (this.maxVal - this.minVal);

    if (this.w >= this.h) {
      // horizontální
      rect(this.x, this.y, this.w * ratio, this.h);
    } else {
      // vertikální
      let filled = this.h * ratio;
      rect(this.x, this.y + this.h - filled, this.w, filled);
    }

    pop();
  }
}


//================================
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

  changeColorStyle() {
    // from "global currentColors"
    this.strokeColor = color(currentColors[2]);
    this.fillColor = color(currentColors[1]);
    this.fillColorHover = color(currentColors[0]);
    this.textColor = color(currentColors[3]);
  }

  pressed() {
    return this.isHovered();
  }

  // Check if the mouse is over the button
  isHovered() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }
  
  // Draw button
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
    //textAlign(LEFT, TOP);
    textStyle(BOLD); 
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    pop();
  }
}


//================================
class CheckBox {
    constructor(x, y, size, initialState = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.checked = initialState; // true or false

        this.outerCornerRadius = 5; // Rounded corners of the outer frame
        this.strokeWeight = 2;
        this.strokeColor = color(0, 255, 0); // Green outline

        this.padding = 5; // Margin from the edge

        // Calculate size and position of the inner square
        this.innerSize = this.size - (2 * this.padding);
        this.innerX = this.x + this.padding;
        this.innerY = this.y + this.padding;

        this.innerCornerRadius = Math.max(0, this.outerCornerRadius - Math.min(this.padding, this.outerCornerRadius));

        this.fillColorChecked = color(0, 200, 0); // Bright green when checked
        this.fillColorUnchecked = color(0, 80, 0);  // Dark green when unchecked

        // --- New properties for label text ---
        this.label = "";
        this.labelColor = color(0,200,0); 
        this.labelSize = 16;          // Text size
        this.labelOffsetX = this.size + 10; // Relative X position from the checkbox’s top-left corner
        this.labelOffsetY = this.size / 2 + this.labelSize / 3; // Relative Y position (vertically centered with text)
    }

    changeColorStyle() {
        // základní mapping na currentColors
        this.strokeColor = color(currentColors[2]);        // outline
        this.fillColorChecked = color(currentColors[3]);   // active (spec1)
        this.fillColorUnchecked = color(currentColors[1]); // inactive (base2)
        this.labelColor = color(currentColors[3]);         // text
    }    

    // Set label text
    textLabel(text, offsetX = this.size + 10, offsetY = null, color = null, size = null) {
        this.label = text;
        this.labelOffsetX = offsetX;
        this.labelOffsetY = (offsetY !== null) ? offsetY : (this.size / 2 + this.labelSize / 3);
        this.labelColor = (color !== null) ? color : this.labelColor;
        this.labelSize = (size !== null) ? size : this.labelSize;
        return this; // For method chaining
    }

    // Check if the mouse is over the checkbox (or label for easier interaction)
    isHovered() {
        if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined') {
            return false;
        }

        // Checkbox area
        const checkArea = mouseX > this.x && mouseX < this.x + this.size &&
                          mouseY > this.y && mouseY < this.y + this.size;

        // Label area (simplified)
        const labelArea = mouseX > this.x + this.labelOffsetX &&
                          mouseX < this.x + this.labelOffsetX + textWidth(this.label) &&
                          mouseY > this.y + this.labelOffsetY - this.labelSize &&
                          mouseY < this.y + this.labelOffsetY;

        return checkArea || labelArea;
    }

    // Handle mouse click
    pressed() {
        if (this.isHovered()) {
            this.checked = !this.checked; // Toggle state
            return true; // Checkbox was clicked
        }
        return false;
    }

    // Draw checkbox
    draw() {
        push();
        colorMode(RGB);

        // Outer frame
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        noFill();
        rect(this.x, this.y, this.size, this.size, this.outerCornerRadius);

        // Inner fill
        noStroke();
        if (this.checked) {
            fill(this.fillColorChecked);
        } else {
            fill(this.fillColorUnchecked);
        }
        if (this.innerSize > 0) {
            rect(this.innerX, this.innerY, this.innerSize, this.innerSize, this.innerCornerRadius);
        }

        // Label text
        if (this.label !== "") {
            fill(this.labelColor);
            noStroke();
            textSize(this.labelSize);
            textAlign(LEFT, BASELINE);
            textStyle(BOLD);
            text(this.label, this.x + this.labelOffsetX, this.y + this.labelOffsetY);
        }

        pop();
    }
}


//================================
class RadioButton {
    constructor(x, y, size, label, selected=false, value=null) {
        this.x = x; this.y = y; this.size = size;
        this.label = label ?? "";
        this.value = value ?? label; // value or label
        this.selected = selected;

        // vizuální parametry
        this.strokeColor = color(0, 200, 0);
        this.fillColor = color(0, 80, 0);
        this.activeColor = color(0, 200, 0);

        this.labelColor = color(0, 200, 0);
        this.labelSize = 16;
        this.labelOffsetX = this.size + 5;
        this.labelOffsetY = this.labelSize / 3 - 3;
    }

    changeColorStyle() {
        this.strokeColor = color(currentColors[2]); 
        this.fillColor = color(currentColors[1]);
        this.activeColor = color(currentColors[3]);
        this.labelColor = color(currentColors[3]);
    }

    draw() {
        push();
        stroke(this.strokeColor);
        strokeWeight(2);
        noFill();
        ellipse(this.x, this.y, this.size);

        if (this.selected) {
            noStroke();
            fill(this.activeColor);
            ellipse(this.x, this.y, this.size / 2); // inner
        }

        // Label
        if (this.label !== "") {
            noStroke();
            fill(this.labelColor);
            textSize(this.labelSize);
            textAlign(LEFT, CENTER);
            textStyle(BOLD);
            text(this.label, this.x + this.labelOffsetX, this.y + this.labelOffsetY);
        }
        pop();
    }

    isHovered() {
        let d = dist(mouseX, mouseY, this.x, this.y);
        let insideCircle = d < this.size / 2;
        let insideLabel =
            mouseX > this.x + this.labelOffsetX &&
            mouseX < this.x + this.labelOffsetX + textWidth(this.label) &&
            mouseY > this.y - this.labelSize / 2 &&
            mouseY < this.y + this.labelSize / 2;
        return insideCircle || insideLabel;
    }
}

class RadioGroup {
    constructor() {
        this.buttons = [];
        this.selectedIndex = -1;
    }

    // přidáme parametr value
    addButton(x, y, size, label, selected = false, value = null) {
        let btn = new RadioButton(x, y, size, label, selected, value);
        this.buttons.push(btn);
        if (selected) this.selectedIndex = this.buttons.length - 1;
        return this;
    }

    draw() {
        this.buttons.forEach(b => b.draw());
    }

    pressed() {
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].isHovered()) {
                this.select(i);
                return true;
            }
        }
        return false;
    }

    select(index) {
        if (index >= 0 && index < this.buttons.length) {
            this.buttons.forEach((b,j) => b.selected = (j === index));
            this.selectedIndex = index;
        }
    }

    getValue() {
        if (this.selectedIndex >= 0) return this.buttons[this.selectedIndex].value;
        return null;
    }

    changeColorStyle() {
        this.buttons.forEach(b => b.changeColorStyle());
    }
}


//==================================
class BoxSlider {
  static active = null;

  constructor(x, y, w, h, a, b, c, vertical=false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vertical = vertical; // switch: false = horizontal, true = vertical

    this.minVal = a;
    this.maxVal = c;
    this.value = constrain(b, a, c);

    this.dragging = false;
    this.lineCol1 = color(0, 255, 0);
    this.lineCol2 = color(0, 100, 0);

    // touchAreaSize should take into account whether the slider is vertical or horizontal
    this.touchAreaSize = Math.max(30, (this.vertical ? this.w : this.h) * 1.5);
    this.isHovering = false;
  }

  // Get pointer coordinates (touch or mouse)
  getPointer() {
    // Use touches[0] for the first touch, otherwise mouseX/mouseY
    if (touches.length > 0) {
      return { x: touches[0].x, y: touches[0].y };
    } else {
      return { x: mouseX, y: mouseY };
    }
  }

  valueToPos(v) {
    let ratio = (v - this.minVal) / (this.maxVal - this.minVal);
    if (this.vertical) {
      return this.y + this.h - ratio * this.h; // invert Y for vertical slider
    } else {
      return this.x + ratio * this.w;
    }
  }

  posToValue(px, py) {
    if (this.vertical) {
      // Important: 'this.y + this.h - py' for vertical slider
      let ratio = (this.y + this.h - py) / this.h;
      return constrain(this.minVal + ratio * (this.maxVal - this.minVal), this.minVal, this.maxVal);
    } else {
      let ratio = (px - this.x) / this.w;
      return constrain(this.minVal + ratio * (this.maxVal - this.minVal), this.minVal, this.maxVal);
    }
  }

  isPointerOver() {
    let p = this.getPointer();
    // If p.x or p.y are not valid numbers (e.g. when no touch/mouse is active), return false
    if (isNaN(p.x) || isNaN(p.y)) return false;

    if (this.vertical) {
      let knobY = this.valueToPos(this.value);
      return (
        p.x > this.x - this.touchAreaSize/2 &&
        p.x < this.x + this.w + this.touchAreaSize/2 && // Slider width is this.w
        p.y > knobY - this.touchAreaSize/2 &&
        p.y < knobY + this.touchAreaSize/2
      );
    } else {
      let knobX = this.valueToPos(this.value);
      return (
        p.x > knobX - this.touchAreaSize/2 &&
        p.x < knobX + this.touchAreaSize/2 &&
        p.y > this.y - this.touchAreaSize/2 &&
        p.y < this.y + this.h + this.touchAreaSize/2 // Slider height is this.h
      );
    }
  }

  update() {
  if (this.vertical) {
    if (mouseIsPressed || touches.length > 0) {
      let mY = touches.length > 0 ? touches[0].y : mouseY;
      if (mY > this.y && mY < this.y + this.h && mouseX > this.x && mouseX < this.x + this.w) {
        let relY = constrain(mY - this.y, 0, this.h);
        this.value = map(relY, 0, this.h, this.minVal, this.maxVal);
      }
    }
  } else {
    if (mouseIsPressed || touches.length > 0) {
      let mX = touches.length > 0 ? touches[0].x : mouseX;
      if (mX > this.x && mX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
        let relX = constrain(mX - this.x, 0, this.w);
        this.value = map(relX, 0, this.w, this.minVal, this.maxVal);
      }
    }
  }
}

  pressed() {
    if (this.isPointerOver()) {
      this.dragging = true;
      BoxSlider.active = this;
      let p = this.getPointer();
      // Ensure the pointer has valid coordinates before using
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
      // Knob size for vertical slider: this.w is its width
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
      // Knob size for horizontal slider: this.h is its height
      rect(knobX, this.y, this.touchAreaSize, this.touchAreaSize, 3);
    }

    pop();
  }
}