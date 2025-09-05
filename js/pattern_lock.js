// lib pattern_lock.js
// v. 0.1 | 2025/09


class PatternLock {
  constructor(x0 = 100, y0 = 100, radius = 20) {
    // Grid position
    this.x0 = x0;
    this.y0 = y0;
    this.radius = radius;

    // Internal state
    this.grid = [];
    this.userPattern = [];
    this.pattern = [1,2,3,5,7]; // default pattern
    this.isDrawing = false;

    // Colors and display settings (default)
    this.bgColor = "#000000";       // background color
    this.lineColor = "#00FF00";     // lines
    this.pointColor = "#222222";    // points
    this.selectedColor = "#00FF00"; // selected points
    this.showNumbers = true;        // show numbers
    this.pElement = null;           // HTML element for attempts

    // Initialize 3x3 grid
    let id = 1;
    for (let y = this.y0; y <= this.y0+200; y += 100) {
      for (let x = this.x0; x <= this.x0+200; x += 100) {
        this.grid.push({x, y, id});
        id++;
      }
    }
  }

  setup() {
    // Create canvas only if it does not exist
    if (!this.canvas) {
      createCanvas(400, 400);
    }
    textAlign(CENTER, CENTER);
    textSize(16);
  }

  draw() {
    background(this.bgColor);

    // Draw lines
    stroke(this.lineColor);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let id of this.userPattern) {
      let p = this.grid[id-1];
      vertex(p.x, p.y);
    }
    endShape();

    // Draw points
    for (let p of this.grid) {
      fill(this.userPattern.includes(p.id) ? this.selectedColor : this.pointColor);
      stroke(0);
      strokeWeight(2);
      ellipse(p.x, p.y, this.radius*2);

      if (this.showNumbers) {
        fill(this.userPattern.includes(p.id) ? "#000" : "#00FF00");
        noStroke();
        text(p.id, p.x + this.radius + 10, p.y);
      }
    }
  }

  mousePressed() {
    this.userPattern = [];
    this.isDrawing = true;
  }

  mouseDragged() {
    for (let p of this.grid) {
      if (!this.userPattern.includes(p.id) && dist(mouseX, mouseY, p.x, p.y) < this.radius) {
        this.userPattern.push(p.id);
      }
    }
  }

  mouseReleased() {
    this.isDrawing = false;

    if (this.pElement) {
      this.pElement.innerText = "Your pattern: " + this.userPattern.join(", ");
    }

    if (this.arraysEqual(this.userPattern, this.pattern)) {
      alert("Authentication success!");
    } else {
      alert("Wrong pattern!");
    }
  }

  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
