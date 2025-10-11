// カテゴリの日本語表記（メイン版と統一）
const categoryLabels = {
  greeting: "あいさつ",
  reaction: "リアクション",
  badmouth: "お口悪悪",
  quote: "名言・セリフ",
  tasukaru: "たすかる",
  new: "新着",
  uncategorized: "未分類"
};

let currentAudio = null; // 現在再生中の音声

fetch("sounds.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("liteContainer");

    // カテゴリごとにグループ化
    const grouped = {};
    data.forEach(s => {
      const cat = s.category || "uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s);
    });

    // カテゴリ順序（存在するものだけ）
    const order = ["new", "greeting", "reaction", "badmouth", "quote", "tasukaru", "uncategorized"];
    const existingCats = order.filter(c => grouped[c]);

    existingCats.forEach(cat => {
      const section = document.createElement("section");
      const h2 = document.createElement("h2");
      h2.textContent = categoryLabels[cat] || cat;
      section.appendChild(h2);

      const list = document.createElement("div");
      list.className = "voice-list";

      grouped[cat].forEach(s => {
        const btn = document.createElement("button");
        btn.textContent = s.label;

        btn.onclick = () => {
          // 再生中があれば止める
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          }

          // 新しい音声を再生
          const audio = new Audio(s.src);
          currentAudio = audio;
          audio.play();

          // 終了したら状態をリセット
          audio.addEventListener("ended", () => {
            if (currentAudio === audio) currentAudio = null;
          });
        };

        list.appendChild(btn);
      });

      section.appendChild(list);
      container.appendChild(section);
    });
  })
  .catch(() => {
    document.body.innerHTML += "<p>読み込みに失敗しました。</p>";
  });
