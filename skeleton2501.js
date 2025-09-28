let toggRun1,toggFull,toggPal,homeBtn,pinBtn,jacobBtn,oscsphBtn,gearsBtn,c64sBtn,go10Btn,radioCol,sl1;
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
function skeletonSetup() {

  t0 = new Template();

  // --- btns skeleton
  homeBtn = new ButtonBox(t0.btnX0, 20, t0.btnW, t0.btnH, "Home"); 
  oscsphBtn = new ButtonBox(t0.btnX0, 20+t0.btnD, t0.btnW, t0.btnH, "osc.sphere");
  jacobBtn = new ButtonBox(t0.btnX0, 20+t0.btnD*2, t0.btnW, t0.btnH, "jacob");
  gearsBtn = new ButtonBox(t0.btnX0, 20+t0.btnD*3, t0.btnW, t0.btnH, "gears");
  go10Btn = new ButtonBox(t0.btnX0, 20+t0.btnD*4, t0.btnW, t0.btnH, "go10");
  c64sBtn = new ButtonBox(t0.btnX0, 20+t0.btnD*5, t0.btnW, t0.btnH, "c64.sprite");
  pinBtn  = new ButtonBox(t0.btnX0, 20+t0.btnD*7, t0.btnW, t0.btnH, "PIN");

  let x0L = 220; 

  toggRun1 = new CheckBox(t0.xC + x0L, t0.yC-200, t0.btnH, true); 
  toggRun1.textLabel("RUN1");
  toggFull = new CheckBox(t0.xC+x0L, t0.yC-150, t0.btnH, false); 
  toggFull.textLabel("Screen size");  
  toggPal = new CheckBox(t0.xC+x0L, t0.yC-100, t0.btnH, false); 
  toggPal.textLabel("Palette"); 
  radioCol = new RadioGroup();
  let ry = t0.yC+50;
  radioCol.addButton(t0.xC+x0L+25, ry,    25, "dark green", true, "dark")
          .addButton(t0.xC+x0L+25, ry+35, 25, "light B&W", false, "light")
          .addButton(t0.xC+x0L+25, ry+70, 25, "colorfull", false, "color");

  sl1 = new SimpleLabel(t0.xC+200,t0.h-50,p5.prototype.VERSION);

  allWidgets = [t0,toggRun1,toggFull,toggPal,radioCol,sl1,
  homeBtn,pinBtn,jacobBtn,oscsphBtn,gearsBtn,c64sBtn,go10Btn];
}


function skeletonDraw(){
  allWidgets.forEach(w => { if(w.draw) w.draw(); });
  if (toggPal.checked) { drawColorPalette(t0.xC+220, t0.yC-50, 12, true); }
}


function skeletonMousePressed() {
  if (toggRun1.pressed()) { sph1.running = toggRun1.checked; }
  if (toggFull.pressed()) { fullscreen(!fullscreen()); applyScreenMode(); } 

  let idx = radioCol.pressed();
  if (idx>=0){ let val = radioCol.getValue(); setColorStyle(val); }
  if (toggPal.pressed()) { /* :.: */ };
  if (homeBtn.pressed()) window.location.href = "index.html";
  if (oscsphBtn.pressed()) window.location.href = "osc_sphere.html";
  if (jacobBtn.pressed()) window.location.href = "jacob_3colors.html";
  if (gearsBtn.pressed()) window.location.href = "gears3x3.html";
  if (go10Btn.pressed())  window.location.href = "go10.html";
  if (c64sBtn.pressed())  window.location.href = "c64sprite.html";
  if (pinBtn.pressed())  window.location.href = "kbd_pin.html";

}
