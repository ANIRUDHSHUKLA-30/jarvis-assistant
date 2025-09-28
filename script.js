const micBtn = document.getElementById("mic-btn");
const status = document.querySelector(".status");
const notifications = document.getElementById("notifications");
const circle = document.querySelector(".circle");

const music = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
let alarmTimeout;

// 🎶 UI Sounds
const soundBeep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
const soundPing = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
const soundClick = new Audio("https://actions.google.com/sounds/v1/ui/click.ogg");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  status.textContent = "❌ Speech Recognition not supported.";
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    recognition.start();
    status.textContent = "🎤 Listening...";
    circle.classList.add("listening");
    soundBeep.play();
  });

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    status.textContent = `Heard: "${command}"`;
    circle.classList.remove("listening");
    soundClick.play();
    handleCommand(command);
  };

  recognition.onend = () => {
    circle.classList.remove("listening");
  };

  recognition.onerror = (event) => {
    status.textContent = "⚠️ Error: " + event.error;
    circle.classList.remove("listening");
  };
}

function handleCommand(command) {
  if (command.includes("time")) {
    tellTime();
  } else if (command.includes("date")) {
    tellDate();
  } else if (command.includes("whatsapp")) {
    openWhatsApp();
  } else if (command.includes("play music")) {
    playMusic();
  } else if (command.includes("stop music")) {
    stopMusic();
  } else if (command.includes("set alarm")) {
    setAlarm(10);
  } else if (command.includes("stop alarm")) {
    clearAlarm();
  } else {
    addNotification(`❓ Command not recognized: "${command}"`);
  }
}

function tellTime() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  addNotification("⏰ Current Time: " + time);
  speak("The time is " + time);
}

function tellDate() {
  const now = new Date();
  const date = now.toDateString();
  addNotification("📅 Today is: " + date);
  speak("Today's date is " + date);
}

function openWhatsApp() {
  window.open("https://web.whatsapp.com", "_blank");
  addNotification("📱 Opening WhatsApp Web...");
  speak("Opening WhatsApp Web");
}

function playMusic() {
  music.play();
  addNotification("🎶 Playing music...");
  speak("Playing music now");
}

function stopMusic() {
  music.pause();
  music.currentTime = 0;
  addNotification("⏹️ Music stopped");
  speak("Music stopped");
}

function setAlarm(seconds) {
  addNotification(`🔔 Alarm set for ${seconds} seconds`);
  speak(`Alarm set for ${seconds} seconds`);
  alarmTimeout = setTimeout(() => {
    addNotification("🚨 Alarm ringing!");
    speak("Alarm ringing!");
    alert("⏰ Alarm!");
  }, seconds * 1000);
}

function clearAlarm() {
  clearTimeout(alarmTimeout);
  addNotification("🔕 Alarm cleared");
  speak("Alarm cleared");
}

function addNotification(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  notifications.appendChild(li);
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.onstart = () => {
    circle.classList.add("speaking");
    status.textContent = "🔊 Speaking...";
  };

  utterance.onend = () => {
    circle.classList.remove("speaking");
    status.textContent = "Say 'Hello Jarvis'";
    soundPing.play();
  };

  synth.speak(utterance);
}

// 🌌 Background Particles
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 100;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.dx = (Math.random() - 0.5) * 0.5;
    this.dy = (Math.random() - 0.5) * 0.5;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

    this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00eaff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00eaff";
    ctx.fill();
    ctx.closePath();
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
