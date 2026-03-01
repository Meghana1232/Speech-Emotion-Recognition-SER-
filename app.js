// Login + speech emotion demo using pre-recorded dataset samples

const loginView = document.getElementById("login-view");
const demoView = document.getElementById("demo-view");
const loginForm = document.getElementById("login-form");
const fileInput = document.getElementById("file-input");
const fileZone = document.getElementById("file-zone");
const selectedFileDiv = document.getElementById("selected-file");
const fileNameSpan = document.getElementById("file-name");
const playBtn = document.getElementById("play-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const audioPlayer = document.getElementById("audio-player");
const statusText = document.getElementById("status-text");
const emotionLabel = document.getElementById("emotion-label");
const confidenceLabel = document.getElementById("confidence-label");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const logoutBtn = document.getElementById("logout-btn");

let currentFile = null;

// ---- Login handling (demo only) ----
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return;

  loginView.classList.add("hidden");
  demoView.classList.remove("hidden");
});

logoutBtn.addEventListener("click", () => {
  demoView.classList.add("hidden");
  loginView.classList.remove("hidden");
});

// ---- Dataset file selection ----
fileInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  currentFile = file;
  fileNameSpan.textContent = file.name;
  selectedFileDiv.classList.remove("hidden");

  const url = URL.createObjectURL(file);
  audioPlayer.src = url;
  audioPlayer.load();

  emotionLabel.textContent = "–";
  confidenceLabel.textContent = "Confidence: –";
  statusText.textContent = `Selected: ${file.name}. Play to listen, then click Analyze.`;
  statusText.classList.remove("error");
});

// ---- Play / Analyze ----
playBtn.addEventListener("click", () => {
  if (!audioPlayer.src) return;
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

audioPlayer.addEventListener("play", () => {
  playBtn.textContent = "⏸ Pause";
});

audioPlayer.addEventListener("pause", () => {
  playBtn.textContent = "▶ Play";
});

analyzeBtn.addEventListener("click", async () => {
  if (!currentFile) {
    statusText.textContent = "Please select an audio file first.";
    statusText.classList.add("error");
    return;
  }

  analyzeBtn.disabled = true;
  statusText.textContent = "Analyzing pre-recorded sample...";
  statusText.classList.remove("error");

  await fakeInference(currentFile);

  analyzeBtn.disabled = false;
  statusText.textContent = "Analysis complete. Select another file to continue.";
});

async function fakeInference(file) {
  // Simulate inference delay (in real app, send file to backend model)
  await new Promise((r) => setTimeout(r, 800));

  const emotions = [
    "Neutral",
    "Happy",
    "Sad",
    "Angry",
    "Fearful",
    "Disgust",
    "Surprised",
  ];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = 0.6 + Math.random() * 0.35;

  showPrediction(emotion, confidence, file.name);
}

function showPrediction(emotion, confidence, name) {
  emotionLabel.textContent = emotion;
  confidenceLabel.textContent = `Confidence: ${(confidence * 100).toFixed(1)}%`;

  const item = document.createElement("li");
  item.className = "history-item";

  const meta = document.createElement("div");
  meta.className = "history-meta";

  const emo = document.createElement("span");
  emo.className = "history-emotion";
  emo.textContent = emotion;

  const conf = document.createElement("span");
  conf.className = "history-confidence";
  conf.textContent = `${(confidence * 100).toFixed(1)}%`;

  meta.appendChild(emo);
  meta.appendChild(conf);

  const time = document.createElement("span");
  time.className = "history-time";
  time.textContent = new Date().toLocaleTimeString();

  item.appendChild(meta);
  item.appendChild(time);

  historyList.prepend(item);
}

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
});
