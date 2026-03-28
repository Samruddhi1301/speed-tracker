const display = document.getElementById('quote-display');
const input = document.getElementById('quote-input');
const timerLabel = document.getElementById('timer');

let timeLeft, timerId, startTime;
let currentMode = "";
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Generate a subtle mechanical click using white noise
function playSoftClick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const bufferSize = audioCtx.sampleRate * 0.02; // Very short: 20ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    // Create random noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Filter out the "thump" (bass) to leave only the "click" (treble)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200; 

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Low volume for subtlety
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
}

if (!sessionStorage.getItem('usedParas')) {
    sessionStorage.setItem('usedParas', JSON.stringify({ 1: [], 5: [], 10: [] }));
}

function startTest(mins) {
    currentMode = mins;
    timeLeft = mins * 60;
    
    const used = JSON.parse(sessionStorage.getItem('usedParas'));
    let available = Array.from({length: 15}, (_, i) => i).filter(i => !used[mins].includes(i));
    
    if (available.length === 0) {
        used[mins] = [];
        available = Array.from({length: 15}, (_, i) => i);
    }

    const index = available[Math.floor(Math.random() * available.length)];
    used[mins].push(index);
    sessionStorage.setItem('usedParas', JSON.stringify(used));

    document.getElementById('setup-menu').classList.add('hidden');
    document.getElementById('test-area').classList.remove('hidden');

    const wordGoal = mins === 1 ? 350 : (mins === 5 ? 1000 : 2200);
    loadText(wordGoal, index);
}

function loadText(words, id) {
    const base = "Maintaining a consistent pace is the secret to high-level typing. Every keypress should be deliberate, building a smooth flow that reduces fatigue. ";
    let content = (base.repeat(Math.ceil(words / 15)) + " (ID: " + (id + 1) + ")").substring(0, words * 6);
    
    display.innerHTML = '';
    content.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        display.appendChild(span);
    });
    input.value = '';
    input.focus();
}

input.addEventListener('keydown', (e) => {
    if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
        playSoftClick();
    }
});

input.addEventListener('input', () => {
    if (!startTime) startTimer();
    const spans = display.querySelectorAll('span');
    const typed = input.value.split('');
    
    spans.forEach((span, i) => {
        const char = typed[i];
        if (char == null) span.className = '';
        else if (char === span.innerText) span.className = 'correct';
        else span.className = 'incorrect';
        if (i === typed.length - 1) span.scrollIntoView({ block: 'center' });
    });
});

function startTimer() {
    startTime = new Date();
    timerId = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60), s = timeLeft % 60;
        timerLabel.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        
        const timePassed = (new Date() - startTime) / 60000;
        const wpm = Math.round((input.value.length / 5) / timePassed);
        document.getElementById('wpm').innerText = wpm || 0;

        if (timeLeft <= 0) endTest();
    }, 1000);
}

function endTest() {
    clearInterval(timerId);
    input.disabled = true;
    const finalWpm = document.getElementById('wpm').innerText;
    document.getElementById('final-stats').innerHTML = `
        <h3 style="font-size: 2.8rem; color: #8db596;">${finalWpm} WPM</h3>
        <p>Mode: ${currentMode} Minutes</p>
    `;
    document.getElementById('result-modal').classList.remove('hidden');

    fetch('/save_score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ wpm: finalWpm, accuracy: 100, mode: currentMode + " min" })
    });
}