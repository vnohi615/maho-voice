const container = document.getElementById("voiceContainer");
let currentAudio = null;  // 再生中の音
let currentButton = null; // 再生中のボタン

fetch("sounds.json")
  .then(res => res.json())
  .then(sounds => {
    sounds.forEach(sound => {
      const btn = document.createElement("button");
      btn.className = "voice-btn";
      btn.innerHTML = `<span>${sound.label}</span><span class="wave"></span>`;
      container.appendChild(btn);

      btn.addEventListener("click", () => {
        // すでに別の音が鳴っていたら止める
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          if (currentButton) currentButton.classList.remove("playing");
        }

        // 新しい音声を再生
        const audio = new Audio(sound.src);
        currentAudio = audio;
        currentButton = btn;

        btn.classList.add("playing");
        audio.play();

        // 再生が終わったらクラスを外す
        audio.addEventListener("ended", () => {
          btn.classList.remove("playing");

        // 💫 収束アニメーションを付与
        btn.classList.add("closing");
          setTimeout(() => btn.classList.remove("closing"), 900); // 0.9秒後に削除
          if (currentAudio === audio) {
            currentAudio = null;
            currentButton = null;
          }
        });
      });
    });
  });

