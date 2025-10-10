// ===============================
//  🩵 MAHO Voice Magic Collection — 完全版
// ===============================

const container = document.getElementById("voiceContainer");
const nav = document.getElementById("categoryNav");

let currentAudio = null;
let currentButton = null;
let sounds = [];
let activeCategory = "all";

// ===== カテゴリ翻訳テーブル =====
const categoryLabels = {
  all: "すべて",
  new: "新着",
  greeting: "あいさつ",
  reaction: "リアクション",
  badmouth: "お口悪悪",
  quote: "名言・セリフ",
  tasukaru: "たすかる"
};

// ===== JSON読込 =====
fetch("sounds.json")
  .then(res => res.json())
  .then(data => {
    sounds = data;

    // カテゴリ一覧を抽出
    const categories = ["all", ...new Set(sounds.map(s => s.category))];

    // ナビ生成
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = categoryLabels[cat] || cat;
      btn.className = "cat-btn";
      if (cat === "all") btn.classList.add("active");
      btn.addEventListener("click", () => changeCategory(cat));
      nav.appendChild(btn);
    });

    // 初期描画
    renderButtons(sounds);
  })
  .catch(err => console.error("Error loading sounds:", err));

// ===== カテゴリ切替 =====
function changeCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  const targetBtn = [...document.querySelectorAll(".cat-btn")].find(
    b => b.textContent === (categoryLabels[cat] || cat)
  );
  if (targetBtn) targetBtn.classList.add("active");

  const filtered = cat === "all" ? sounds : sounds.filter(s => s.category === cat);
  container.classList.add("fade-out");
  setTimeout(() => {
    container.innerHTML = "";
    renderButtons(filtered);
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
    setTimeout(() => container.classList.remove("fade-in"), 400);
  }, 300);
}

// ===== ボタン描画 =====
function renderButtons(list) {
  list.forEach(sound => {
    const btn = document.createElement("button");
    btn.className = "voice-btn";
    btn.innerHTML = `
      <div class="magic-wrap">
        <div class="magic-layer outer"></div>
        <div class="magic-layer inner"></div>
      </div>
      <span>${sound.label}</span>
      <span class="wave"></span>
    `;
    container.appendChild(btn);

    btn.addEventListener("click", () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
          currentButton.classList.remove("playing");
          currentButton.classList.add("closing");
          setTimeout(() => currentButton.classList.remove("closing"), 1000);
        }
      }

      const audio = new Audio(sound.src);
      currentAudio = audio;
      currentButton = btn;

      btn.classList.add("playing");
      audio.play();

      audio.addEventListener("ended", () => {
        btn.classList.remove("playing");
        btn.classList.add("closing");
        setTimeout(() => btn.classList.remove("closing"), 1000);
        if (currentAudio === audio) {
          currentAudio = null;
          currentButton = null;
        }
      });
    });
  });
}
