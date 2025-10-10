const container = document.getElementById("voiceContainer");

let currentAudio = null;   // 現在再生中の音声
let currentButton = null;  // 現在再生中のボタン

fetch("sounds.json")
  .then(res => res.json())
  .then(sounds => {
    sounds.forEach(sound => {
      const btn = document.createElement("button");
      btn.className = "voice-btn";
      btn.innerHTML = `<span>${sound.label}</span><span class="wave"></span>`;
      container.appendChild(btn);

      btn.addEventListener("click", () => {
        // ✅ 既に別の音が再生中なら止めてリセット
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          if (currentButton) {
            currentButton.classList.remove("playing");
            currentButton.classList.add("closing");
            setTimeout(() => currentButton.classList.remove("closing"), 900);
          }
        }

        // ✅ 新しい音声を作成・再生
        const audio = new Audio(sound.src);
        currentAudio = audio;
        currentButton = btn;

        btn.classList.add("playing");
        audio.play();

        // ✅ 再生終了時の処理（収束アニメ）
        audio.addEventListener("ended", () => {
          btn.classList.remove("playing");
          btn.classList.add("closing");

          // 収束アニメ完了後にクラスを消す
          setTimeout(() => btn.classList.remove("closing"), 900);

          if (currentAudio === audio) {
            currentAudio = null;
            currentButton = null;
          }
        });
      });
    });
  })
  .catch(err => console.error("Error loading sounds:", err));
