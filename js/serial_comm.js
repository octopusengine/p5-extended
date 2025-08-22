// serial_connection - testing with ESP32 Micropython
// ver. 0.1 | 2025/08

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.createElement("div");
  wrapper.className = "serial-wrapper";
  wrapper.innerHTML = `
    <div class="controls">
      <div id="statusIndicator" class="status-indicator"></div>
      
      <label>
        <input type="radio" name="baud" value="9600" checked> 9600
      </label>
      <label>
        <input type="radio" name="baud" value="115200"> 115200
      </label>

      <button id="connectBtn">Connect</button>
      <button id="disconnectBtn">Disconnect</button>
    </div>

    <div id="status">Disconnected</div>
  `;
  document.body.prepend(wrapper);
});

let port = null;
let reader = null;
let isConnected = false;
let baudRate = 9600;

async function connectToSerial() {
  try {
    if (!navigator.serial) {
      alert('Web Serial API is not supported. Please use Chrome or Edge.');
      return;
    }

    // Get selected baudrate from radio buttons
    const selected = document.querySelector('input[name="baud"]:checked');
    baudRate = parseInt(selected.value);

    port = await navigator.serial.requestPort();
    await port.open({
      baudRate: baudRate,
      dataBits: 8,
      stopBits: 1,
      parity: 'none'
    });

    isConnected = true;
    updateStatusDisplay();

    lastValue = "Connected...";
    valueHistory = [];

    readSerialData();

  } catch (error) {
    console.error('Connection error:', error);
    alert('Failed to connect: ' + error.message);
  }
}

async function disconnectFromSerial() {
  try {
    if (reader) {
      await reader.cancel();
      reader = null;
    }
    if (port) {
      await port.close();
      port = null;
    }

    isConnected = false;
    updateStatusDisplay();
    lastValue = "Disconnected";

  } catch (error) {
    console.error('Disconnection error:', error);
  }
}

async function readSerialData() {
  try {
    const decoder = new TextDecoder();
    reader = port.readable.getReader();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      buffer += text;

      let lines = buffer.split('\n');
      buffer = lines.pop();

      for (let line of lines) {
        if (line.trim()) {
          processNewValue(line.trim());
        }
      }
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Read error:', error);
      lastValue = "Read error";
    }
  } finally {
    if (reader) {
      reader.releaseLock();
      reader = null;
    }
  }
}

async function sendToSerial(data) {
  if (!isConnected || !port) {
    console.warn("Not connected, cannot send data:", data);
    return;
  }
  try {
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(data));
    writer.releaseLock();
  } catch (error) {
    console.error("Send error:", error);
  }
}

function updateStatusDisplay() {
  const statusDiv = document.getElementById('status');
  const indicator = document.getElementById('statusIndicator');
  if (isConnected) {
    statusDiv.textContent = 'Connected';
    indicator.classList.add('connected');
  } else {
    statusDiv.textContent = 'Disconnected';
    indicator.classList.remove('connected');
  }
}

// Disconnect before closing the window
window.addEventListener('beforeunload', () => {
  if (port) {
    disconnectFromSerial();
  }
});
