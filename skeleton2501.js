let toggRun1, toggFull, toggPal, homeBtn, pinBtn, radioCol, sl1;
let allWidgets = [];

//ext: colorsDarkGreenMode, colorsLightBlaWhiMode, colorsColorMode
currentColors = colorsDarkGreenMode; // defaul

function setColorStyle(cs) {
  if (cs === "dark")  currentColors = colorsDarkGreenMode;
  if (cs === "light") currentColors = colorsLightBlaWhiMode;
  if (cs === "color") currentColors = colorsColorMode;
  allWidgets.forEach(w => w.changeColorStyle?.());
}

RadioButton.prototype.changeColorStyle = function() {
  this.strokeColor = color(currentColors[2]);
  this.fillColor   = color(currentColors[1]);
  this.activeColor = color(currentColors[3]);
  this.labelColor  = color(currentColors[3]);
};

RadioGroup.prototype.changeColorStyle = function() {
  this.buttons.forEach(b => b.changeColorStyle?.());
};

// --------- Screen mode ---------
function windowResized() { applyScreenMode(); }
function applyScreenMode() {
  if (fullscreen()) {
    resizeCanvas(windowWidth, windowHeight);
    toggFull.textLabel("Base"); 
  } else {
    toggFull.textLabel("Full");
    resizeCanvas(baseW, baseH);
    cnv.parent("cnv-holder");
  }
  toggFull.checked = fullscreen(); 
  updateScreenInfo();
  setupPosition();
}

//=========================================================
function setup_skeleton() {

  t0 = new Template();

  // --- btns skeleton
  homeBtn = new ButtonBox(t0.btnX0, 20, t0.btnW, t0.btnH, "Home"); 
  pinBtn  = new ButtonBox(t0.btnX0, 20+t0.btnD, t0.btnW, t0.btnH, "PIN");

  toggRun1 = new CheckBox(t0.xC + 200, t0.yC-200, t0.btnH, true); 
  toggRun1.textLabel("RUN1");
  toggFull = new CheckBox(t0.xC+200, t0.yC-150, t0.btnH, false); 
  toggFull.textLabel("Screen size");  
  toggPal = new CheckBox(t0.xC+200, t0.yC-100, t0.btnH, false); 
  toggPal.textLabel("Palette"); 
  radioCol = new RadioGroup();
  let rx = t0.xC+220, ry = t0.yC+25;
  radioCol.addButton(rx, ry,    25, "dark green", true, "dark")
          .addButton(rx, ry+35, 25, "light black&white", false, "light")
          .addButton(rx, ry+70, 25, "colorfull", false, "color");

  sl1 = new SimpleLabel(t0.xC+200,t0.h-50,p5.prototype.VERSION);

  allWidgets = [t0, homeBtn, pinBtn, toggRun1, toggFull, toggPal, radioCol, sl1];
}