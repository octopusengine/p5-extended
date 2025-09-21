// gear.js
class Gear {
  constructor(x, y, radius, toothHeight, flatSize, teeth, col = 0, strokeW = 2) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.toothHeight = toothHeight;
    this.flatSize = flatSize;
    this.teeth = teeth;
    this.col = col;
    this.strokeW = strokeW;
    this.rotation = 0;
    this.rotationOffset = 0;
    this.ratio = 1; // for animation
  }

  draw(fillCol = null) {
  push();
  translate(this.x, this.y);
  rotate(this.rotation + this.rotationOffset);

  if (fillCol !== null) {
    noStroke();
    fill(fillCol);
    ellipse(0, 0, this.radius * 2); //gear body (filled circle)
  }

  // --- gear teeth
  stroke(this.col);
  strokeWeight(this.strokeW);
  noFill();
  beginShape();

  let toothAngle = TWO_PI / this.teeth;
  let flatAngle = this.flatSize / this.radius;

  for (let i = 0; i < this.teeth; i++) {
    let base = i * toothAngle;
    vertex(this.radius * cos(base), this.radius * sin(base));
    vertex(this.radius * cos(base + flatAngle), this.radius * sin(base + flatAngle));
    vertex((this.radius + this.toothHeight) * cos(base + toothAngle/2 - flatAngle/2),
           (this.radius + this.toothHeight) * sin(base + toothAngle/2 - flatAngle/2));
    vertex((this.radius + this.toothHeight) * cos(base + toothAngle/2 + flatAngle/2),
           (this.radius + this.toothHeight) * sin(base + toothAngle/2 + flatAngle/2));
    vertex(this.radius * cos(base + toothAngle - flatAngle),
           this.radius * sin(base + toothAngle - flatAngle));
    vertex(this.radius * cos(base + toothAngle), this.radius * sin(base + toothAngle));
  }

  endShape(CLOSE);
  pop();
}

  updateRotation(speed) {
    this.rotation += speed;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setRotationOffset(offset) {
    this.rotationOffset = offset;
  }

  setRatio(r) {
    this.ratio = r;
  }
}
