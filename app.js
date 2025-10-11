// ===============================
//  🩵 Maho Voice Collection — カテゴリ対応・演出完全版
// ===============================

const container = document.getElementById("voiceContainer");
const nav = document.getElementById("categoryNav");

let currentAudio = null;
let currentButton = null;
let sounds = [];
let activeCategory = "all";

/** カテゴリ表示名（英語キー→日本語） */
const categoryLabels = {
  all: "すべて",
  new: "新着",
  greeting: "あいさつ",
  reaction: "リアクション",
  badmouth: "お口悪悪",
  quote: "名言・セリフ",
  tasukaru: "たすかる",
  uncategorized: "未分類"
};

/** 目次の並び順（存在するものだけをこの順で並べる） */
const categoryOrder = ["all", "new", "greeting", "reaction", "badmouth", "quote", "tasukaru", "uncategorized"];

/** 既存の再生を安全に停止し、演出の収束を走らせる */
function stopCurrentPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentButton) {
    currentButton.classList.remove("playing");
    currentButton.classList.add("closing");
    setTimeout(() => currentButton.classList.remove("closing"), 1000); // CSSの収束時間と合わせる
  }
  currentAudio = null;
  currentButton = null;
}

/** 目次UI生成 */
function buildNav(categories) {
  nav.innerHTML = "";

  // 指定の順序で存在するカテゴリのみ並べる
  const ordered = categoryOrder.filter(key => categories.includes(key));

  ordered.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.textContent = categoryLabels[cat] || cat;
    if (cat === activeCategory) btn.classList.add("active");
    btn.addEventListener("click", () => changeCategory(cat));
    nav.appendChild(btn);
  });
}

/** カテゴリ切替 */
function changeCategory(cat) {
  if (activeCategory === cat) return;
  activeCategory = cat;

  // ナビ表示のactive切替
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  [...document.querySelectorAll(".cat-btn")].find(b => b.textContent === (categoryLabels[cat] || cat))?.classList.add("active");

  // 再生中なら必ず止める（演出も収束）
  stopCurrentPlayback();

  // フィルタ適用
  const filtered = cat === "all" ? sounds : sounds.filter(s => (s.category || "uncategorized") === cat);

  // 軽いフェード切替
  container.classList.add("fade-out");
  setTimeout(() => {
    container.innerHTML = "";
    renderButtons(filtered);
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
    setTimeout(() => container.classList.remove("fade-in"), 350);
  }, 220);
}

/** ボタン群描画 */
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
      // 他の音が鳴っていたら確実に停止・収束
      stopCurrentPlayback();

      // 新しい音声を再生
      const audio = new Audio(sound.src);
      currentAudio = audio;
      currentButton = btn;

      btn.classList.add("playing");
      audio.play();

      audio.addEventListener("ended", () => {
        // 終了時は収束アニメを実行
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

/** 初期化 */
fetch("sounds.json")
  .then(res => res.json())
  .then(data => {
    // 後方互換: categoryが無いアイテムは "uncategorized" にする（旧JSONでも動く）
    sounds = (Array.isArray(data) ? data : []).map(item => ({
      ...item,
      category: item.category || "uncategorized"
    }));

    // 画面に存在するカテゴリを抽出して、順序に沿って目次を生成
    const setCats = new Set(sounds.map(s => s.category));
    const categories = ["all", ...setCats];

    buildNav(categories);
    renderButtons(sounds);
  })
  .catch(err => {
    console.error("Error loading sounds:", err);
    // 失敗時も空UIが崩れないように
    nav.innerHTML = "";
    container.innerHTML = "<p>ボイスの読み込みに失敗しました。</p>";
  });




