let cf;
let startX = 50;

function setup() {
  createCanvas(800, 600);
  cf = new cisterFont();                    // alias funguje
  cf.setColor(0, 255, 0).setSize(10);
}

function draw() {
  background(0);
  // pár ukázek
  cf.setColor(0,128,0).setSize(12);
  cf.drawNum(1234,  80,  40);
  cf.drawNum(  56, 160,  40);
  cf.setColor(255,128,0).setSize(8);
  cf.drawNum(9876, 240, 100);

      
let stepX = 50;       
let y = 300;          

for (let num = 1; num <= 9; num++) {
  let x = startX + (num - 1) * stepX;
  cf.drawNum(num, x, y);
}


for (let num = 1; num <= 9; num++) {
  let x = startX + (num - 1) * stepX;
  cf.drawNum(num*10, x, y+60);
}



// obyčejný text pod nimi
  fill(0, 255, 0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text("1234   |   56   |   9876", 60, 500);
}