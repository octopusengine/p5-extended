// box_calendar.js
// ver. 0.1 | 2025/08


class BoxCalendar {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.textSize = 16;
    this.textColor = color(0,200,0);
    this.fillColor = color(16);
    this.strokeColor = color(0);
    this.strokeWeight = 2;
    this.cornerRadius = 5;

    let now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth(); // 0 = leden

    // Jazykové sady
    this.monthNames = {
      en: ["January","February","March","April","May","June",
           "July","August","September","October","November","December"],
      cz: ["Leden","Únor","Březen","Duben","Květen","Červen",
           "Červenec","Srpen","Září","Říjen","Listopad","Prosinec"]
    };

    this.daysShort = {
      en: ["Mo","Tu","We","Th","Fr","Sa","Su"],
      cz: ["Po","Út","St","Čt","Pá","So","Ne"]
    };

    this.language = "en"; // default

    // ovládací prvky v JS
    this.btnPrev = createButton("Prev");
    this.btnPrev.position(this.x, this.y + this.h + 10);
    this.btnPrev.mousePressed(() => this.prevMonth());

    this.btnNext = createButton("Next");
    this.btnNext.position(this.x + 60, this.y + this.h + 10);
    this.btnNext.mousePressed(() => this.nextMonth());

    this.rbLang = createRadio();
    this.rbLang.option("EN", "en");
    this.rbLang.option("CZ", "cz");
    this.rbLang.selected("en");
    this.rbLang.position(this.x + 140, this.y + this.h + 10);
    this.rbLang.style("width", "80px");
    this.rbLang.changed(() => this.setLanguage(this.rbLang.value()));
  }

  setLanguage(lang) {
    if (lang === "en" || lang === "cz") this.language = lang;
  }

  nextMonth() {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
  }

  prevMonth() {
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
  }

  draw() {
    push();
    // rámeček
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight);
    fill(this.fillColor);
    rect(this.x, this.y, this.w, this.h, this.cornerRadius);

    noStroke();
    fill(this.textColor);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(this.textSize);

    let monthName = this.monthNames[this.language][this.month];
    text(monthName + " " + this.year, this.x + this.w/2, this.y + 20);

    let days = this.daysShort[this.language];
    let colW = this.w / 7;
    let rowH = 24;

    // hlavička dní
    for (let i = 0; i < 7; i++) {
      text(days[i], this.x + colW*i + colW/2, this.y + 50);
    }

    // DD MM
    let firstDay = new Date(this.year, this.month, 1);
    let lastDay = new Date(this.year, this.month+1, 0);
    let numDays = lastDay.getDate();

    // index prvního dne (pondělí=0)
    let start = firstDay.getDay();
    if (start === 0) start = 7;
    start--;

    let today = new Date();

    let d = 1;
    let row = 0;
    while (d <= numDays) {
      for (let i = 0; i < 7; i++) {
        if (row === 0 && i < start) continue;
        if (d > numDays) break;

        // today
        if (today.getFullYear() === this.year &&
            today.getMonth() === this.month &&
            today.getDate() === d) {
          fill(32, 64, 32);
          rect(this.x + colW*i + 2, this.y + 80 + row*rowH - rowH/2, colW-4, rowH-2, 4);
          fill(this.textColor);
        }

        text(d, this.x + colW*i + colW/2, this.y + 80 + row*rowH);
        d++;
      }
      row++;
    }

    pop();
  }
}
