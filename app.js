// ===============================
//  🎧 MAHO Voice Player + Magic Circle
// ===============================

const container = document.getElementById("voiceContainer");

let currentAudio = null;   // 現在再生中の音声
let currentButton = null;  // 再生中のボタン

fetch("sounds.json")
  .then(res => res.json())
  .then(sounds => {
    sounds.forEach(sound => {
      // ===== ボタン作成 =====
      const btn = document.createElement("button");
      btn.className = "voice-btn";
      btn.innerHTML = `<span>${sound.label}</span><span class="wave"></span>`;
      container.appendChild(btn);

      // ===== クリック時の処理 =====
      btn.addEventListener("click", () => {
        // 🔹 他の音が再生中なら止めて収束アニメ再生
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          if (currentButton) {
            currentButton.classList.remove("playing");
            currentButton.classList.add("closing");
            setTimeout(() => currentButton.classList.remove("closing"), 900); // CSSと同期
          }
        }

        // 🔹 新しい音声再生を準備
        const audio = new Audio(sound.src);
        currentAudio = audio;
        currentButton = btn;

        // 🔹 再生開始：展開アニメON
        btn.classList.add("playing");
        audio.play();

        // 🔹 再生終了時の処理（収束アニメ）
        audio.addEventListener("ended", () => {
          btn.classList.remove("playing");
          btn.classList.add("closing");

          // 収束アニメ完了後にリセット
          setTimeout(() => btn.classList.remove("closing"), 900);

          // 再生中の参照をクリア
          if (currentAudio === audio) {
            currentAudio = null;
            currentButton = null;
          }
        });
      });
    });
  })
  .catch(err => console.error("Error loading sounds:", err));
