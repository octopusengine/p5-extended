// torus_points.js
// External library for parametric torus point visualization in p5.js
// v.0.2 | 2025/08


// =====================================
// Torus drawn as connected line (Lissajous form)
class BoxTorusLines {
  constructor(x, y, size = 100) {
    this.x = x;
    this.y = y;
    this.size = size;

    // base params
    this.radius0 = 65;
    this.radius1 = 40;
    this.freq = 14;
    this.freq2 = 15;

    // angles for rotation
    this.angleX = 0;
    this.angleY = 0;

    // unified rotation speeds
    this.speedX = 0.01;
    this.speedY = 0.013;
    this.speedOffset = 0; // not used here, but kept for consistency
  }

  update() {
    this.angleX += this.speedX;
    this.angleY += this.speedY;
  }

  draw() {
    push();
    translate(this.x, this.y);
    noFill();
    stroke(0, 200, 0);
    strokeWeight(2);

    beginShape();
    for (let phi = 0; phi < TWO_PI; phi += 0.02) {
      // 3D torus coordinates
      let x3 = (this.radius0 + this.radius1 * cos(phi * this.freq2)) * sin(phi * this.freq);
      let y3 = this.radius1 * sin(phi * this.freq2);
      let z3 = (this.radius0 + this.radius1 * cos(phi * this.freq2)) * cos(phi * this.freq);

      // rotation around X
      let yRot = y3 * cos(this.angleX) - z3 * sin(this.angleX);
      let zRot = y3 * sin(this.angleX) + z3 * cos(this.angleX);

      // rotation around Y
      let xRot = x3 * cos(this.angleY) + zRot * sin(this.angleY);
      // let zFinal = -x3 * sin(this.angleY) + zRot * cos(this.angleY); // unused

      vertex(xRot, yRot);
    }
    endShape();

    pop();
  }
}

// =====================================
// Torus drawn as points cloud
class BoxTorusPoints {
  constructor(x, y, size = 200) {
    this.x = x;
    this.y = y;
    this.size = size;

    // base params
    this.radius0 = 100;
    this.radius1 = 40;
    this.sigmaMax = 360;
    this.phiMax = 360;
    this.sigmaDensity = 36;
    this.phiDensity = 30;

    this.offset = 0;
    this.rotX = 0;
    this.rotY = 0;

    // unified rotation speeds
    this.speedX = 0.01;
    this.speedY = 0.02;
    this.speedOffset = 0.02;

    // style
    this.strokeCol = color(0, 255, 0); // green
    this.bgCol = color(20);
    this.strokeW = 2;
  }

  update() {
    this.rotX += this.speedX;
    this.rotY += this.speedY;
    this.offset += this.speedOffset;
  }

  draw() {
    push();
    translate(this.x, this.y);
    stroke(this.strokeCol);
    strokeWeight(this.strokeW);
    noFill();

    let fov = 200; // perspective factor

    for (let sigma = 0; sigma < this.sigmaMax; sigma += 360 / this.sigmaDensity) {
      for (let phi = 0; phi < this.phiMax; phi += 360 / this.phiDensity) {
        // torus coordinates
        let x = (this.radius0 + this.radius1 * cos(phi + this.offset)) * cos(sigma + this.offset);
        let y = (this.radius0 + this.radius1 * cos(phi + this.offset)) * sin(sigma + this.offset);
        let z = this.radius1 * sin(phi + this.offset);

        // rotation around X and Y
        let y1 = y * cos(this.rotX) - z * sin(this.rotX);
        let z1 = y * sin(this.rotX) + z * cos(this.rotX);

        let x2 = x * cos(this.rotY) - z1 * sin(this.rotY);
        let z2 = x * sin(this.rotY) + z1 * cos(this.rotY);

        // perspective projection
        let scale = fov / (fov + z2);
        let sx = x2 * scale * (this.size / 200);
        let sy = y1 * scale * (this.size / 200);

        point(sx, sy);
      }
    }

    pop();
  }
}
