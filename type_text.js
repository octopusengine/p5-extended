let df;

let text_arr = [
"prvni radek",
"druhy radek",
"treti radek a tak dale",
"Lorem ipsum dolor sit amet", 
"consectetur adipiscing elit."
];

const startY = 120;       // první řádek
  const stepY = 30;         // vertikální posun mezi řádky
  const delayStep = 1500;   // zpoždění mezi starty (ms)
  const charDuration = 35;  // čas na 1 znak (ms)

function setup() {
  createCanvas(800, 600);
  df = new DigiFont(DIGI_GLYPHS);
}

function draw() {
  background(0);

  df.setPixel("circle").setColor(80,80,80).setFontSize(3);
  df.drawText("STATIC3: ABC xyz 123", 20, 520);

  // Nastavení pro všechny řádky
  df.setColor(0,255,0).setFontSize(3).setPixel("circle");

  

  for (let i = 0; i < text_arr.length; i++) {
    const y = startY + stepY * i;
    const delay = delayStep * i;  // i=0 → 0ms, i=1 → 2000ms, i=2 → 4000ms...
    const id = "tw" + i;          // unikátní ID animace
    df.typeWriter(id, text_arr[i], 40, y, { delay: delay, duration: charDuration });
  }
}
