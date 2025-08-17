// simple video capture - ver 0.2 (2025/08) | for m5.js (ver 1.9.0)


// ========== UNIVERSAL UI ELEMENTS (autocreate if missing) ==========
function ensureUIElements() {
  let ui = document.getElementById('ui');
  if (!ui) {
    ui = document.createElement('div');
    ui.id = 'ui';
    ui.className = 'tt';
    ui.style.margin = '10px';
    document.body.appendChild(ui);
  }

  // --- Render FPS ---
  if (!document.querySelector('input[name="renderfps"]')) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <b>Render FPS</b><br>
      <label><input type="radio" name="renderfps" value="30"> 30</label>
      <label><input type="radio" name="renderfps" value="60" checked> 60</label>
    `;
    ui.appendChild(row);
  }

  // --- Speed ---
  if (!document.querySelector('input[name="speed"]')) {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.marginTop = '8px';
    row.innerHTML = `
      <b>Speed</b><br>
      <label><input type="radio" name="speed" value="1" checked> 1×</label>
      <label><input type="radio" name="speed" value="2"> 2×</label>
    `;
    ui.appendChild(row);
  }

  // --- Buttons + Timer ---
  if (!document.getElementById('btn-start')) {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.marginTop = '8px';
    row.innerHTML = `
      <a href="#" class="button" id="btn-start">Start recording</a>
      <a href="#" class="button" id="btn-stop" style="display:none">Stop &amp; Save</a>
      <div id="rec-time" style="margin-top:4px;font-size:14px;opacity:0.8;">0&nbsp;s</div>
    `;
    ui.appendChild(row);
  }

  // --- Progress bar ---
  if (!document.getElementById('progress')) {
    const progress = document.createElement('div');
    progress.id = 'progress';
    progress.style.cssText = 'height:4px;background:#f00;width:0;transition:width 0.2s;';
    document.body.appendChild(progress);
  }
}

// ========== VIDEO RECORDING + TIMER ==========

let mrRecorder = null;
let mrChunks = [];
let capturing = false;

// Timer
let recTimer = null;
let recSeconds = 0;
let recTimeEl = null;

function ensureRecTimeElement() {
  if (recTimeEl && document.contains(recTimeEl)) return recTimeEl;
  recTimeEl = document.getElementById('rec-time');
  if (recTimeEl) return recTimeEl;
  const stopBtn = document.getElementById('btn-stop');
  recTimeEl = document.createElement('div');
  recTimeEl.id = 'rec-time';
  recTimeEl.style.marginTop = '4px';
  recTimeEl.style.fontSize = '14px';
  recTimeEl.style.opacity = '0.8';
  recTimeEl.textContent = '0 s';
  (stopBtn?.parentElement || document.getElementById('ui') || document.body).appendChild(recTimeEl);
  return recTimeEl;
}

function startRecTimer() {
  ensureRecTimeElement();
  recSeconds = 0;
  recTimeEl.textContent = '0 s';
  clearInterval(recTimer);
  recTimer = setInterval(() => {
    recSeconds++;
    recTimeEl.textContent = recSeconds + ' s';
  }, 1000);
}

function stopRecTimer(markSaved = true) {
  clearInterval(recTimer);
  recTimer = null;
  ensureRecTimeElement();
  recTimeEl.textContent = recSeconds + (markSaved ? ' s saved' : ' s');
}

// Timestamp-based filename
function pad(n){ return String(n).padStart(2,'0'); }
function tsName(prefix){
  const d = new Date();
  const YY = d.getFullYear().toString().slice(-2);
  const MM = pad(d.getMonth()+1);
  const DD = pad(d.getDate());
  const HH = pad(d.getHours());
  const MI = pad(d.getMinutes());
  const SS = pad(d.getSeconds());
  return `${prefix}_${YY}${MM}${DD}_${HH}${MI}${SS}`;
}

// Set canvas frameRate based on UI
function setRenderFpsFromUI(){
  const v = document.querySelector('input[name="renderfps"]:checked')?.value || '60';
  if (typeof frameRate === 'function') frameRate(parseInt(v,10));
}

// Listen for FPS changes
document.querySelectorAll('input[name="renderfps"]').forEach(r => {
  r.addEventListener('change', setRenderFpsFromUI);
});

// Get selected playback speed (1× or 2×)
function getSpeedFactor(){
  return parseInt(document.querySelector('input[name="speed"]:checked')?.value || '1', 10);
}

// ========== ON PAGE LOAD ==========
window.addEventListener('load', () => {
  ensureUIElements();
  setRenderFpsFromUI();

  const startBtn = document.getElementById('btn-start');
  const stopBtn  = document.getElementById('btn-stop');
  const progress = document.getElementById('progress');

  ensureRecTimeElement();

  // --- Start recording ---
  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (capturing) return;

    const fps = parseInt(document.querySelector('input[name="renderfps"]:checked')?.value || '60', 10);
    if (typeof frameRate === 'function') frameRate(fps);

    const cnv = (window.canvasP5?.elt) || document.querySelector('canvas');
    if(!cnv){ alert('Canvas not found.'); return; }

    const speed = getSpeedFactor();
    window.postMessage({ type: 'SET_SPEED', value: speed }, '*');

    const stream = cnv.captureStream(fps);
    mrChunks = [];

    try {
      mrRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    } catch(e) {
      try { mrRecorder = new MediaRecorder(stream); }
      catch(err){ alert('MediaRecorder is not supported by this browser.'); console.error(err); return; }
    }

    mrRecorder.ondataavailable = ev => { if(ev.data && ev.data.size) mrChunks.push(ev.data); };

    mrRecorder.onstop = () => {
      const blob = new Blob(mrChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = tsName(`vid_${speed}x`) + '.webm';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      progress.style.width = '0';
      stopRecTimer(true);

      if (speed !== 1) window.postMessage({ type: 'SET_SPEED', value: 1 }, '*');
    };

    mrRecorder.start();
    startRecTimer();

    capturing = true;
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
  });

  // --- Stop recording ---
  stopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!capturing) return;
    mrRecorder?.stop();
    capturing = false;
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    stopRecTimer(false);
  });

  // Fake progress bar animation while recording
  let w = 0, dir = 1;
  function tick(){
    if(capturing){
      w += dir * 2;
      if(w >= 100 || w <= 0) dir *= -1;
      progress.style.width = w + '%';
    }
    requestAnimationFrame(tick);
  }
  tick();
});
