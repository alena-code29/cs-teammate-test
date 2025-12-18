const app = document.getElementById("app");
const progressBar = document.getElementById("progress-bar");

let step = 0;

// Настрой здесь пути к картинкам (как мы договаривались)
const steps = [
  {
    title: "Что происходит в голосовом чате?",
    sub: "Коммуникация решает. Иногда.",
    image: "img/voice.png",
    answers: ["Спокойно даю инфу", "Ору в микро"]
  },
  {
    title: "Почему ты не попал?",
    sub: "Самый важный вопрос.",
    image: "img/miss.png",
    answers: ["Мой косяк", "Не регает просто", "Я отвлёкся"]
  },
  {
    title: "Флешка от тиммейта?",
    sub: "Открываем глаза. Закрываем глаза.",
    image: "img/flash.png",
    answers: ["Предупреждаю", "АЙ МОИ ГЛАЗА"]
  },
  {
    title: "Часто ли ты в лоутабе?",
    sub: "Ответь честно. (ха-ха)",
    runaway: true
  }
];

function setProgress() {
  const pct = Math.round((step / steps.length) * 100);
  progressBar.style.width = `${pct}%`;
}

function clearApp() {
  app.innerHTML = "";
}

function render() {
  clearApp();
  setProgress();

  const s = steps[step];

  const block = document.createElement("div");
  block.className = "screen";

  const title = document.createElement("h2");
  title.className = "question";
  title.textContent = s.title;
  block.appendChild(title);

  const sub = document.createElement("div");
  sub.className = "sub";
  sub.textContent = s.sub || "";
  block.appendChild(sub);

  // Картинка (если есть)
  if (s.image) {
    const imgWrap = document.createElement("div");
    imgWrap.className = "img-wrap";

    const img = document.createElement("img");
    img.className = "question-img";
    img.src = s.image;
    img.alt = "";

    imgWrap.appendChild(img);
    block.appendChild(imgWrap);
  }

  // Ответы
  if (s.runaway) {
    const answers = document.createElement("div");
    answers.className = "answers";

    const yes = makeBtn("Да", () => showTraining());
    answers.appendChild(yes);

    const no = makeBtn("Нет", () => {});
    no.id = "noBtn";
    answers.appendChild(no);

    block.appendChild(answers);
    app.appendChild(block);

    setupRunaway(no);
    return;
  }

  const answers = document.createElement("div");
  answers.className = "answers";

  s.answers.forEach((t) => {
    const btn = makeBtn(t, () => {
      step++;
      render();
    });
    answers.appendChild(btn);
  });

  block.appendChild(answers);
  app.appendChild(block);
}

function makeBtn(text, onClick) {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.type = "button";
  btn.textContent = text;
  btn.addEventListener("click", onClick);
  return btn;
}

/* ===== УБЕГАЮЩАЯ КНОПКА + ВСПЛЫВАШКИ ===== */

const taunts = ["ой", "ай!", "не поймать?", "мимо!", "хоп!", "почти!"];

function setupRunaway(btn) {
  btn.style.position = "fixed";
  btn.style.zIndex = "9999";

  const move = () => moveButton(btn);

  btn.addEventListener("mouseenter", move);
  btn.addEventListener("mousemove", move);
  btn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    move();
  });
  btn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      move();
    },
    { passive: false }
  );

  // начальное положение
  setTimeout(move, 200);
}

function moveButton(btn) {
  const rect = btn.getBoundingClientRect();
  const margin = 12;

  const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxY = Math.max(margin, window.innerHeight - rect.height - margin);

  const x = margin + Math.random() * (maxX - margin);
  const y = margin + Math.random() * (maxY - margin);

  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;

  spawnPopup();
  if (Math.random() < 0.5) spawnPopup();
}

function spawnPopup() {
  const p = document.createElement("div");
  p.className = "popup";
  p.textContent = taunts[Math.floor(Math.random() * taunts.length)];

  const pad = 20;
  const x = pad + Math.random() * (window.innerWidth - pad * 2);
  const y = pad + Math.random() * (window.innerHeight - pad * 2);

  p.style.left = `${x}px`;
  p.style.top = `${y}px`;

  document.body.appendChild(p);
  setTimeout(() => p.remove(), 2000); // подольше читается
}

/* ===== ЭКРАН TRAINING ===== */

function showTraining() {
  clearApp();
  setProgress();

  app.innerHTML = `
    <div class="training-screen">
      <img src="img/training.png" class="training-img" alt="">
      <div class="training-text">ИДИ ТРЕНИРУЙСЯ ЛОУТАБ!!!!</div>
      <button class="main-btn" id="goTrain">пошёл тренироваться</button>
    </div>
  `;

  document.getElementById("goTrain").addEventListener("click", showResult);
}

/* ===== ФИНАЛ: ТОЛЬКО КАРТИНКА ===== */

function showResult() {
  clearApp();
  progressBar.style.width = "100%";

  app.innerHTML = `
    <div class="result-screen">
      <img src="img/result.png" class="result-img" alt="">
    </div>
  `;
}

render();
