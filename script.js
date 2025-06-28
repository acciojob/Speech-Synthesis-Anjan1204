const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const statusMsg = document.getElementById("status");

let voices = [];
const synth = window.speechSynthesis;
let utterance = null;

function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";

  if (voices.length === 0) {
    statusMsg.textContent = "No voices available on this device.";
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? " [Default]" : ""}`;
    voiceSelect.appendChild(option);
  });
}

// Repopulate voices when they are loaded
synth.onvoiceschanged = populateVoices;

// Start speaking
function speak() {
  const text = textInput.value.trim();
  if (!text) {
    statusMsg.textContent = "Please enter some text to speak.";
    return;
  }

  if (utterance && synth.speaking) {
    synth.cancel(); // Stop current speech if ongoing
  }

  utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceSelect.value];
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);

  synth.speak(utterance);
  statusMsg.textContent = "Speaking...";

  utterance.onend = () => {
    statusMsg.textContent = "Done speaking.";
  };
  utterance.onerror = (e) => {
    statusMsg.textContent = "An error occurred: " + e.error;
  };
}

// Stop speaking
function stopSpeaking() {
  if (synth.speaking) {
    synth.cancel();
    statusMsg.textContent = "Speech stopped.";
  }
}

// Update rate & pitch values on screen
rateInput.addEventListener("input", () => {
  rateValue.textContent = rateInput.value;
});
pitchInput.addEventListener("input", () => {
  pitchValue.textContent = pitchInput.value;
});

// Restart speech if voice changes mid-speech
voiceSelect.addEventListener("change", () => {
  if (synth.speaking) {
    speak();
  }
});

speakBtn.addEventListener("click", speak);
stopBtn.addEventListener("click", stopSpeaking);

// Initial setup
populateVoices();
