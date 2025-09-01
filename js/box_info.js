// box_info.js - dark mode
// ver. 0.1 - 2025/08

// BC: BOX COLORS
const BC_BG   = [240, 240, 240];  
const BC_TEXT = [0, 0, 0];        
const BC_STROKE  = [0, 200, 0];      
const BC_BOX_FILL = [16,16,16];

const BC_BLUE = [0, 0, 200];
const BC_GREEN= [0, 150, 0];     
const BC_LGREEN= [0, 255, 0];



class BoxTime {
  constructor(x0, y0, bw, bh) {
    this.x0 = x0;
    this.y0 = y0;
    this.bw = bw;
    this.bh = bh;
    this.radius = 5;

    // default
    this.strokeColor = color(BC_STROKE);
    this.strokeWeight = 1;
    this.fillColor = color(BC_BOX_FILL); 
    this.textSize = 16;
    this.textColor = color(0);

    this.currentTime = this.getTimeString();
  }

  getTimeString() {
    let now = new Date();
    return nf(now.getHours(), 2) + ":" +
           nf(now.getMinutes(), 2) + ":" +
           nf(now.getSeconds(), 2);
  }

  refresh() {
    this.currentTime = this.getTimeString();
  }

  draw() {
    push();
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    fill(this.fillColor);
    rect(this.x0, this.y0, this.bw, this.bh, this.radius);

    fill(this.textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(this.textSize);
    text(this.currentTime, this.x0 + this.bw / 2, this.y0 + this.bh / 2 + 3);
    pop();
  }
}


class BoxLabel {
  constructor(x0, y0, bw, bh) {
    this.x0 = x0;
    this.y0 = y0;
    this.bw = bw;
    this.bh = bh;

    // výchozí vzhled
    this.strokeColor = color(BC_STROKE);
    this.strokeWeight = 1;
    this.fillColor = color(BC_BOX_FILL);
    this.textSize = 16;
    this.textColor = color(0);
    this.cornerRadius = 5;

    // výchozí text
    this.text = "...";
  }

  draw() {
    push();
    // rámeček
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    fill(this.fillColor);
    rect(this.x0, this.y0, this.bw, this.bh, this.cornerRadius);

    // text
    noStroke();
    fill(this.textColor);
    textAlign(CENTER, CENTER);
    textSize(this.textSize);
    text(this.text, this.x0 + this.bw / 2, this.y0 + this.bh / 2+2);
    pop();
  }
}




class BoxP5Ver {
  constructor(x0, y0, bw, bh) {
    this.x0 = x0;
    this.y0 = y0;
    this.bw = bw;
    this.bh = bh;
    this.radius = 5;


    // 
    this.strokeColor = color(BC_STROKE);
    this.strokeWeight = 1;
    this.fillColor = color(BC_BOX_FILL);
    this.textSize = 16;
    this.textColor = color(0);

    this.version = "p5.js " + p5.prototype.VERSION;
  }

  draw() {
    push();
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    fill(this.fillColor);
    rect(this.x0, this.y0, this.bw, this.bh, this.radius);

    fill(this.textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.textSize);
    text(this.version, this.x0 + this.bw / 2, this.y0 + this.bh / 2 + 3);
    pop();
  }
}
