let df;
let text_arr = [];

const startY = 60;       // first line position
const stepY = 30;         // vertical step between lines
const delayStep = 1500;   // delay between line starts (ms)
const charDuration = 35;  // time per character (ms)

function setup() {
  createCanvas(900, 600);
  background(0);

  df = new DigiFont(DIGI_GLYPHS);

  // ==== Collect system / browser info ====
  text_arr = [
    "------------ sys.info ------------",
    "p5.js version: " + p5.prototype.VERSION,
    "User Agent: " + navigator.userAgent,
    "Language: " + navigator.language,
    "Platform (OS): " + navigator.platform,
    "Online: " + navigator.onLine,
    "Window size: " + windowWidth + " x " + windowHeight + " px",
    "Screen resolution: " + screen.width + " x " + screen.height + " px"
  ];

  // Extra log in console
  console.log("Navigator:", navigator);
  console.log("Screen:", screen);
}


function draw() {
  background(0);

  // static label at the bottom
  df.setPixel("circle").setColor(80, 80, 80).setFontSize(3);
  df.drawText("SYSTEM INFO", 20, height - 60);

  // settings for all lines
  df.setColor(0, 255, 0).setFontSize(2).setPixel("circle");

  for (let i = 0; i < text_arr.length; i++) {
    const y = startY + stepY * i;
    const delay = delayStep * i;
    const id = "tw" + i;
    df.typeWriter(id, text_arr[i], 40, y, { delay: delay, duration: charDuration });
  }
}
