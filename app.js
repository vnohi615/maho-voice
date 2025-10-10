// ============================
// 魔儡まほ ボイスコレクション
// sounds.json読込 + 魔法陣再生制御
// ============================

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("voiceContainer");
  const searchBox = document.getElementById("searchBox");

  // sounds.jsonを読み込み
  const response = await fetch("./sounds.json");
  const sounds = await response.json();

  // ボタン生成
  const renderButtons = (list) => {
    container.innerHTML = "";
    list.forEach(sound => {
      const btn = document.createElement("button");
      btn.className = "voice-btn";
      btn.dataset.src = sound.src;
      btn.innerHTML = `<span>${sound.label}</span>`;
      container.appendChild(btn);

      const audio = new Audio(sound.src);
      btn.addEventListener("click", () => {
        document.querySelectorAll(".voice-btn").forEach(b => b.classList.remove("playing"));
        audio.currentTime = 0;
        audio.play();
        btn.classList.add("playing");
        audio.onended = () => btn.classList.remove("playing");
      });
    });
  };

  renderButtons(sounds);

  // 検索機能
  searchBox.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = sounds.filter(s => s.title.toLowerCase().includes(q));
    renderButtons(filtered);
  });
});

