// Pomodoro Timer - simple, commentated
const DEFAULTS = { work:25, short:5, long:15, rounds:4 };

const el = id => document.getElementById(id);
const modeWorkBtn = el('mode-work');
const modeShortBtn = el('mode-short');
const modeLongBtn = el('mode-long');
const timeDisplay = el('timeDisplay');
const startPauseBtn = el('startPause');
const resetBtn = el('reset');
const cyclesEl = el('cycles');

const workInput = el('workInput');
const shortInput = el('shortInput');
const longInput = el('longInput');
const roundsInput = el('roundsInput');
const saveSettingsBtn = el('saveSettings');
const resetSettingsBtn = el('resetSettings');

const ring = document.querySelector('.ring');
const RADIUS = 100;
const CIRC = 2 * Math.PI * RADIUS;
ring.style.strokeDasharray = `${CIRC}`;
ring.style.strokeDashoffset = `${CIRC}`;

let settings = loadSettings();
applySettingsToInputs();

let mode = 'work'; // 'work' | 'short' | 'long'
let timerSeconds = settings.work * 60;
let timer = null;
let isRunning = false;
let completedPomodoros = 0;
let roundsBeforeLong = settings.rounds;

updateDisplay();
updateActiveTab();

// ---- Event listeners ----
modeWorkBtn.addEventListener('click', () => switchMode('work'));
modeShortBtn.addEventListener('click', () => switchMode('short'));
modeLongBtn.addEventListener('click', () => switchMode('long'));

startPauseBtn.addEventListener('click', toggleStartPause);
resetBtn.addEventListener('click', resetTimer);

saveSettingsBtn.addEventListener('click', () => {
  saveSettingsFromInputs();
  alert('Settings saved.');
});
resetSettingsBtn.addEventListener('click', () => {
  localStorage.removeItem('pomodoro_settings');
  settings = {...DEFAULTS};
  applySettingsToInputs();
  switchMode('work');
});

// keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); toggleStartPause(); }
  if (e.key.toLowerCase() === 'r') resetTimer();
});

// ---- Functions ----
function switchMode(m){
  stopTimer();
  mode = m;
  if (m === 'work') timerSeconds = settings.work * 60;
  if (m === 'short') timerSeconds = settings.short * 60;
  if (m === 'long') timerSeconds = settings.long * 60;
  updateActiveTab();
  updateDisplay();
  updateRing();
}

function updateActiveTab(){
  [modeWorkBtn, modeShortBtn, modeLongBtn].forEach(btn => btn.classList.remove('active'));
  mode === 'work' && modeWorkBtn.classList.add('active');
  mode === 'short' && modeShortBtn.classList.add('active');
  mode === 'long' && modeLongBtn.classList.add('active');
}

function toggleStartPause(){
  if (!isRunning) startTimer();
  else stopTimer();
}

function startTimer(){
  if (isRunning) return;
  isRunning = true;
  startPauseBtn.textContent = 'Pause';
  timer = setInterval(tick, 1000);
}

function stopTimer(){
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  if (timer) { clearInterval(timer); timer = null; }
}

function resetTimer(){
  stopTimer();
  // reset to current mode's default duration
  if (mode === 'work') timerSeconds = settings.work * 60;
  if (mode === 'short') timerSeconds = settings.short * 60;
  if (mode === 'long') timerSeconds = settings.long * 60;
  updateDisplay();
  updateRing();
}

function tick(){
  if (timerSeconds <= 0) {
    // session finished
    onSessionEnd();
    return;
  }
  timerSeconds -= 1;
  updateDisplay();
  updateRing();
}

function onSessionEnd(){
  stopTimer();
  playBeep();
  if (mode === 'work') {
    completedPomodoros += 1;
    cyclesEl.textContent = completedPomodoros;
    // if reached roundsBeforeLong -> go long break and reset counter
    if (completedPomodoros % roundsBeforeLong === 0) {
      switchMode('long');
    } else {
      switchMode('short');
    }
  } else {
    // break ended -> go to work
    switchMode('work');
  }
  // auto-start next session
  startTimer();
}

// Update time text
function updateDisplay(){
  const mm = Math.floor(timerSeconds / 60).toString().padStart(2,'0');
  const ss = Math.floor(timerSeconds % 60).toString().padStart(2,'0');
  timeDisplay.textContent = `${mm}:${ss}`;
}

// Progress ring update
function updateRing(){
  // determine total for current mode
  let total = (mode === 'work') ? settings.work*60 : (mode === 'short') ? settings.short*60 : settings.long*60;
  let progress = 1 - (timerSeconds / total);
  let offset = CIRC * (1 - progress);
  ring.style.strokeDashoffset = `${offset}`;
}

// Sound beep using WebAudio
function playBeep(){
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    o.stop(now + 0.9);
  } catch (e) {
    // fallback to alert
    alert('Session finished!');
  }
}

// ---- Settings persistence ----
function loadSettings(){
  try {
    const raw = localStorage.getItem('pomodoro_settings');
    if (!raw) return {...DEFAULTS};
    const parsed = JSON.parse(raw);
    return {...DEFAULTS, ...parsed};
  } catch (e) {
    return {...DEFAULTS};
  }
}

function applySettingsToInputs(){
  workInput.value = settings.work;
  shortInput.value = settings.short;
  longInput.value = settings.long;
  roundsInput.value = settings.rounds;
  roundsBeforeLong = settings.rounds;
}

function saveSettingsFromInputs(){
  const w = clampNumber(Number(workInput.value), 1, 180);
  const s = clampNumber(Number(shortInput.value), 1, 60);
  const l = clampNumber(Number(longInput.value), 1, 60);
  const r = clampNumber(Number(roundsInput.value), 1, 8);
  settings = { work: w, short: s, long: l, rounds: r };
  localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
  roundsBeforeLong = settings.rounds;
  // if currently on mode, update timer to new value
  if (mode === 'work') timerSeconds = settings.work * 60;
  if (mode === 'short') timerSeconds = settings.short * 60;
  if (mode === 'long') timerSeconds = settings.long * 60;
  updateDisplay();
  updateRing();
}

function clampNumber(v, min, max){
  if (Number.isNaN(v)) return min;
  return Math.max(min, Math.min(max, v));
}

// initialize ring progress
updateRing();
