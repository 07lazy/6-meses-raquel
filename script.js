/* =========================
   Datas e cálculos
   ========================= */
function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((ub - ua) / ms);
}

function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function formatDatePT(d) {
  return d.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getMonthsTogether(start, now) {
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  const startPlusMonths = addMonths(start, months);
  if (now < startPlusMonths) months -= 1;

  return Math.max(0, months);
}

function formatMonthsLabel(months) {
  return `${months} ${months === 1 ? "mês" : "meses"}`;
}

/* =========================
   Datas
   ========================= */
const START_DATE = new Date((window.__START_DATE__ || "2025-08-02") + "T00:00:00");
const NOW = new Date();

/* Topo */
const sinceEl = document.getElementById("sinceDate");
if (sinceEl) sinceEl.textContent = formatDatePT(START_DATE);

const todayEl = document.getElementById("todayDate");
if (todayEl) todayEl.textContent = formatDatePT(NOW);

/* Stats */
const daysEl = document.getElementById("daysTogether");
if (daysEl) daysEl.textContent = String(daysBetween(START_DATE, NOW));

const monthsTogether = getMonthsTogether(START_DATE, NOW);

const monthsEl = document.getElementById("monthsTogether");
if (monthsEl) monthsEl.textContent = String(monthsTogether);

const monthsLabel = formatMonthsLabel(monthsTogether);

const badgeMonthsEl = document.getElementById("badgeMonths");
if (badgeMonthsEl) badgeMonthsEl.textContent = `💖 ${monthsLabel}`;

const heroTitleEl = document.getElementById("heroTitle");
if (heroTitleEl) heroTitleEl.innerHTML = `Feliz ${monthsLabel} <span class="heart">❤️</span>`;

const messageMonthsEl = document.getElementById("messageMonths");
if (messageMonthsEl) messageMonthsEl.textContent = monthsLabel;

document.title = `Feliz ${monthsLabel} ❤️`;

(function nextMonthCountdown() {
  const next = addMonths(START_DATE, monthsTogether + 1);
  const el = document.getElementById("nextMilestone");
  if (el) el.textContent = String(daysBetween(NOW, next));
})();

/* =========================
   Confetti
   ========================= */
function popConfetti() {
  const n = 90;

  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = "-10px";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.opacity = String(0.75 + Math.random() * 0.25);
    p.style.setProperty("--h", Math.floor(Math.random() * 360));
    document.body.appendChild(p);

    const fall = 900 + Math.random() * 1200;
    const drift = (Math.random() - 0.5) * 320;

    p.animate(
      [
        { transform: p.style.transform + " translate(0, 0)" },
        {
          transform:
            p.style.transform +
            ` translate(${drift}px, ${window.innerHeight + 80}px)`,
        },
      ],
      { duration: fall, easing: "cubic-bezier(.2,.7,.2,1)" }
    );

    setTimeout(() => p.remove(), fall + 50);
  }
}

const confettiBtn = document.getElementById("confettiBtn");
if (confettiBtn) confettiBtn.addEventListener("click", popConfetti);

/* =========================
   Fundo: fotos flutuantes
   ========================= */
(function floatingBackgroundPhotos() {
  const imgs = document.querySelectorAll(".float-img");
  if (!imgs.length) return;

  imgs.forEach((img, i) => {
    const size = 160 + Math.random() * 220;
    img.style.width = size + "px";
    img.style.left = Math.random() * 100 + "vw";
    img.style.animationDelay = -Math.random() * 55 + "s";
    img.style.animationDuration = 45 + Math.random() * 55 + "s";
    img.style.transform = `rotate(${Math.random() * 16 - 8}deg)`;
    img.style.opacity = String(0.09 + Math.random() * 0.08);

    if (i % 2 === 1) {
      img.style.animationTimingFunction = "cubic-bezier(.2,.7,.2,1)";
    }
  });
})();

/* =========================
   Envelope + digitação
   ========================= */
const letterBox = document.getElementById("letterBox");
const toggleLetterBtn = document.getElementById("toggleLetterBtn");
const closeLetterBtn = document.getElementById("closeLetterBtn");
const envelope = document.getElementById("envelope");

const typedEl = document.getElementById("typedText");
const rawEl = document.getElementById("letterRaw");
const paperDate = document.getElementById("paperDate");

let typingTimer = null;
let typingIndex = 0;
let typingText = "";

function setPaperDate() {
  if (paperDate) paperDate.textContent = formatDatePT(new Date());
}

function resetTyping() {
  if (!typedEl) return;

  typedEl.textContent = "";
  typedEl.classList.add("typing-cursor");
  typingIndex = 0;

  if (typingTimer) clearInterval(typingTimer);
  typingTimer = null;
}

function startTyping(speed = 18) {
  if (!typedEl || !rawEl) return;

  typingText = rawEl.value || "";
  resetTyping();

  typingTimer = setInterval(() => {
    if (typingIndex >= typingText.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      typedEl.classList.remove("typing-cursor");
      return;
    }

    typedEl.textContent += typingText.charAt(typingIndex++);
    typedEl.scrollTop = typedEl.scrollHeight;
  }, speed);
}

function openLetter() {
  if (!letterBox) return;

  letterBox.classList.add("open");
  if (envelope) envelope.classList.add("open");

  setPaperDate();
  startTyping(18);

  if (toggleLetterBtn) {
    toggleLetterBtn.textContent = "Fechar carta 💌";
  }

  setTimeout(() => {
    letterBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function closeLetter() {
  if (!letterBox) return;

  if (envelope) envelope.classList.remove("open");
  resetTyping();

  setTimeout(() => {
    letterBox.classList.remove("open");
    if (toggleLetterBtn) {
      toggleLetterBtn.textContent = "Abrir carta 💌";
    }
  }, 1400);
}

if (toggleLetterBtn) {
  toggleLetterBtn.addEventListener("click", () => {
    const isOpen = letterBox.classList.contains("open");
    if (isOpen) closeLetter();
    else openLetter();
  });
}

if (closeLetterBtn) {
  closeLetterBtn.addEventListener("click", closeLetter);
}
