const textInput = document.getElementById("text-input");
const voiceSelect = document.getElementById("voice-select");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const speakButton = document.getElementById("speak");
const stopButton = document.getElementById("stop");
const rateValue = document.getElementById("rate-value");
const pitchValue = document.getElementById("pitch-value");
const errorMessage = document.getElementById("error-message");

const synth = window.speechSynthesis;
let voices = [];
let utterance = new SpeechSynthesisUtterance();

// Load voices dynamically
function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    errorMessage.textContent = "No voices available. Try refreshing your browser.";
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    voiceSelect.appendChild(option);
  });
}

// Voice change triggers restart
voiceSelect.addEventListener("change", () => {
  if (synth.speaking) {
    stopSpeech();
    speakText();
  }
});

// Rate and pitch sliders
rateInput.addEventListener("input", () => {
  rateValue.textContent = rateInput.value;
});

pitchInput.addEventListener("input", () => {
  pitchValue.textContent = pitchInput.value;
});

// Speak the input text
function speakText() {
  const text = textInput.value.trim();
  if (!text) {
    errorMessage.textContent = "Please enter text to speak.";
    return;
  }
  errorMessage.textContent = "";

  utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);

  synth.speak(utterance);
}

// Stop speaking
function stopSpeech() {
  synth.cancel();
}

// Button Events
speakButton.addEventListener("click", speakText);
stopButton.addEventListener("click", stopSpeech);

// Load voices when available
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}
window.addEventListener("load", populateVoices);
