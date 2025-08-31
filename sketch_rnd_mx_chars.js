let box1, box2;

function setup() {
  createCanvas(800, 600);
  textSize(24);
  textFont("monospace");

  box1 = new BoxRandomChars(["finální ukázkový test", "druhý český pokus", "a do třetice 333 stříbrných stříkaček 333 333"], 
5, 6, 100, 100, 35);
  box2 = new BoxRandomChars(["Pro pokračování klikni","BOX TWO", "ANOTHER LINE"], 
5, 5, 100, 350, 35);
}

function draw() {
  background(0);
  box1.draw();
  box2.draw();
}

function mousePressed() {
  box1.nextText();
  box2.nextText();
}