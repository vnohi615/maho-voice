fetch("sounds.json")
  .then(res => res.json())
  .then(data => {
    const board = document.getElementById("sound-board");
    const search = document.getElementById("search");

    function render(list) {
      board.innerHTML = "";
      list.forEach(sound => {
        const btn = document.createElement("button");
        btn.innerHTML = `<span>${sound.label}</span>`;
        btn.addEventListener("click", () => {
          const audio = new Audio(sound.src);
          audio.play();
          btn.classList.add("playing");
          audio.addEventListener("ended", () => btn.classList.remove("playing"));
        });
        board.appendChild(btn);
      });
    }

    render(data);

    search.addEventListener("input", () => {
      const q = search.value.toLowerCase();
      const filtered = data.filter(s => s.label.toLowerCase().includes(q));
      render(filtered);
    });
  });
