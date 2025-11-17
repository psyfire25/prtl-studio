import { createEngine } from "./engine/engine.js";
import { defaultFragmentShader, altFragmentShader } from "./shaders.js";

const canvas = document.getElementById("app-canvas");
const engine = createEngine({ canvas });

// ---------- resize handling ----------
function handleResize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.floor(rect.width * dpr);
  const height = Math.floor(rect.height * dpr);
  engine.resize(width, height);
}

window.addEventListener("resize", handleResize);
handleResize();

// ---------- engine start ----------
engine.setFragmentShader(defaultFragmentShader);
engine.start();

// ---------- audio analyser ----------
let audioContext = null;
let analyser = null;
let dataArray = null;

async function initAudio() {
  try {
    // Ask for microphone input
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.fftSize;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    // Kick off audio update loop
    updateAudio();
    console.log("Audio initialised");
  } catch (err) {
    console.error("Error initialising audio", err);
  }
}

function updateAudio() {
  if (analyser && dataArray) {
    analyser.getByteTimeDomainData(dataArray);

    // Compute RMS (root mean square) for a rough loudness
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      // convert from [0,255] to [-1,1]
      const v = (dataArray[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // scale/clamp a bit so it's in a nice 0-1-ish range
    const level = Math.min(1, rms * 4.0);

    // feed into engine uniform
    engine.setUniform("audioLevel", level);
  }

  requestAnimationFrame(updateAudio);
}

// Call this once to request mic access and start audio processing
initAudio();

// ---------- keyboard shader switch ----------
window.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    engine.setFragmentShader(defaultFragmentShader);
  } else if (e.key === "2") {
    engine.setFragmentShader(altFragmentShader);
  }
});