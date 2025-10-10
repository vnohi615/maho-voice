// ===============================
// 🎧 MAHO Voice Player + 2回転ギュイン収束 Ver.
// ===============================

const container = document.getElementById("voiceContainer");

let currentAudio = null;
let currentButton = null;

fetch("sounds.json")
  .then(res => res.json())
  .then(sounds => {
    sounds.forEach(sound => {
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
        // 既存再生を止めて収束
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          if (currentButton) {
            currentButton.classList.remove("playing");
            currentButton.classList.add("closing");
            setTimeout(() => currentButton.classList.remove("closing"), 1000);
          }
        }

        // 新規再生
        const audio = new Audio(sound.src);
        currentAudio = audio;
        currentButton = btn;

        btn.classList.add("playing");
        audio.play();

        // 再生終了→収束
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
  })
  .catch(err => console.error("Error loading sounds:", err));

