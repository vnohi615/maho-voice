// ============================
// 魔儡まほ ボイスコレクション
// JSON読込 + ボイス再生 + 魔法陣発動
// ============================

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("voiceContainer");
  const searchBox = document.getElementById("searchBox");

  // JSONからデータ取得
  const response = await fetch("./voices.json");
  const voices = await response.json();

  // ボタン生成
  const renderButtons = (list) => {
    container.innerHTML = "";
    list.forEach(v => {
      const btn = document.createElement("button");
      btn.className = "voice-btn";
      btn.dataset.src = v.src;
      btn.innerHTML = `<span>${v.title}</span>`;
      container.appendChild(btn);

      const audio = new Audio(v.src);
      btn.addEventListener("click", () => {
        document.querySelectorAll(".voice-btn").forEach(b => b.classList.remove("playing"));
        audio.currentTime = 0;
        audio.play();
        btn.classList.add("playing");
        audio.onended = () => btn.classList.remove("playing");
      });
    });
  };

  renderButtons(voices);

  // 検索機能
  searchBox.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = voices.filter(v => v.title.toLowerCase().includes(q));
    renderButtons(filtered);
  });
});
