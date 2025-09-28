// serial_comm.js - pure module for Web Serial API without GUI
// ver. 0.2 | 2025/09

let port = null;
let reader = null;
window.isConnected = false;
let baudRate = 9600;

// Default callbacks (can be overridden)
let callbacks = {
  onConnect: () => {},
  onDisconnect: () => {},
  onData: (line) => {},
  onError: (err) => {}
};

window.setSerialCallbacks = function (cb) {
  callbacks = { ...callbacks, ...cb };
};

window.connectToSerial = async function (baud = 9600) {
  try {
    if (!navigator.serial) {
      throw new Error("Web Serial API is not supported. Please use Chrome or Edge.");
    }

    baudRate = baud;

    port = await navigator.serial.requestPort();
    await port.open({
      baudRate: baudRate,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    });

    window.isConnected = true;
    callbacks.onConnect();
    readSerialData();

  } catch (error) {
    callbacks.onError(error);
  }
};

window.disconnectFromSerial = async function () {
  try {
    if (reader) {
      await reader.cancel();
      reader = null;
    }
    if (port) {
      await port.close();
      port = null;
    }

    window.isConnected = false;
    callbacks.onDisconnect();

  } catch (error) {
    callbacks.onError(error);
  }
};

async function readSerialData() {
  try {
    const decoder = new TextDecoder();
    reader = port.readable.getReader();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      buffer += text;

      let lines = buffer.split("\n");
      buffer = lines.pop();

      for (let line of lines) {
        if (line.trim()) {
          callbacks.onData(line.trim());
        }
      }
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      callbacks.onError(error);
    }
  } finally {
    if (reader) {
      reader.releaseLock();
      reader = null;
    }
  }
}

window.sendToSerial = async function (data) {
  if (!window.isConnected || !port) {
    console.warn("Not connected, cannot send data:", data);
    return;
  }
  try {
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(data));
    writer.releaseLock();
  } catch (error) {
    callbacks.onError(error);
  }
};

window.addEventListener("beforeunload", () => {
  if (port) {
    window.disconnectFromSerial();
  }
});
