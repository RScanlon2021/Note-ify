(function () {
  const root = document.documentElement;
  const fretboard = document.querySelector(".fretboard");
  const instrumentSelector = document.querySelector("#instrument-selector");
  const woodSelector = document.querySelector("#wood-selector");
  const accidentalSelector = document.querySelector(".accidental-selector");
  const fretsSelector = document.querySelector(".frets-selector");
  const showAllNotesSelector = document.querySelector("#show-all-notes");
  const showMultipleNotesSelector = document.querySelector(
    "#show-multiple-notes"
  );
  const noteNameSection = document.querySelector(".note-name-section");
  const singleFretmarkPosition = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleFretmarkPosition = [12, 24];
  const stringGauge = [1, 2, 3, 6, 7, 8];

  document.getElementById("show-multiple-notes").checked = false;
  document.getElementById("show-all-notes").checked = false;

  const notesFlat = [
    "A",
    "B♭",
    "B",
    "C",
    "D♭",
    "D",
    "E♭",
    "E",
    "F",
    "G♭",
    "G",
    "A♭",
  ];
  const notesSharp = [
    "A",
    "A♯",
    "B",
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
  ];

  const guitarTuning = [4, 11, 7, 2, 9, 4];
  const instrumentTuningPresets = {
    Guitar: [7, 2, 10, 5, 0, 7],
    "Bass (Four Strings)": [10, 5, 0, 7],
    "Bass (Five Strings)": [10, 5, 0, 7, 2],
    Ukulele: [0, 7, 3, 10],
  };

  const woodPresets = {
    Maple: `url(../images/maple.jpg)`,
    Ebony: `url(../images/ebony.jpg)`,
    Rosewood: `url(../images/rosewood.jpg)`,
  };

  let numberOfFrets = 12;
  let accidentals = "sharps";
  let showAllNotes = false;
  let allNotes;
  let showMultipleNotes = false;
  let selectedInstrument = "Guitar";
  let selectedWood = "maple";
  let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
  let tonewood = woodPresets.selectedwood;

  const app = {
    init() {
      this.setupFretboard();
      this.setupinstrumentSelector();
      this.setupWoodSelector();
      this.setupNoteNameSection();
      handlers.setupEventListeners();
    },
    setupFretboard() {
      fretboard.innerHTML = "";
      root.style.setProperty("--number-of-strings", numberOfStrings);

      // add strings to fretboard
      for (let i = 0; i < numberOfStrings; i++) {
        let string = tools.createElement("div");
        string.classList.add("string");
        fretboard.appendChild(string);
        root.style.setProperty(`--string-height-${i + 1}`, stringGauge[i]);

        // add frets to fretboard
        for (let fret = 0; fret <= numberOfFrets; fret++) {
          let noteFret = tools.createElement("div");
          noteFret.classList.add("note-fret");
          string.appendChild(noteFret);

          let noteName = this.generateNoteNames(
            fret + instrumentTuningPresets[selectedInstrument][i],
            accidentals
          );
          noteFret.setAttribute("data-note", noteName);

          //add fretmarks
          if (i === 0 && singleFretmarkPosition.indexOf(fret) !== -1) {
            noteFret.classList.add("single-fretmark");
          } else if (i === 0 && doubleFretmarkPosition.indexOf(fret) !== -1) {
            let dblNoteFret = tools.createElement("div");
            dblNoteFret.classList.add("double-fretmark");
            noteFret.appendChild(dblNoteFret);
          }
        }
      }
      allNotes = document.querySelectorAll(".note-fret");
    },
    generateNoteNames(noteIndex, accidentals) {
      noteIndex = noteIndex % 12;
      let noteName;
      if (accidentals === "flats") {
        noteName = notesFlat[noteIndex];
      } else if (accidentals === "sharps") {
        noteName = notesSharp[noteIndex];
      }
      return noteName;
    },
    setupinstrumentSelector() {
      for (instrument in instrumentTuningPresets) {
        let instrumentOption = tools.createElement("option", instrument);
        instrumentSelector.appendChild(instrumentOption);
      }
    },
    // set up the tonewood selector dropdown menu
    setupWoodSelector() {
      for (wood in woodPresets) {
        let woodOption = tools.createElement("option", wood);
        woodSelector.appendChild(woodOption);
      }
    },
    setupNoteNameSection() {
      noteNameSection.innerHTML = "";
      let noteNames;
      if (accidentals === "flats") {
        noteNames = notesFlat;
      } else {
        noteNames = notesSharp;
      }
      noteNames.forEach((noteName) => {
        let noteNameElement = tools.createElement("span", noteName);
        noteNameSection.appendChild(noteNameElement);
      });
    },

    toggleMultipleNotes(noteName, opacity) {
      for (i = 0; i < allNotes.length; i++) {
        if (allNotes[i].dataset.note === noteName) {
          allNotes[i].style.setProperty("--noteDotOpacity", opacity);
        }
      }
    },
  };

  const handlers = {
    showNoteDot(e) {
      // check if show all notes is selected
      if (showAllNotes) {
        return;
      }
      if (e.target.classList.contains("note-fret")) {
        if (showMultipleNotes) {
          app.toggleMultipleNotes(e.target.dataset.note, 1);
        } else {
          e.target.style.setProperty("--noteDotOpacity", 1);
        }
      }
    },
    hideNoteDot(e) {
      if (showAllNotes) {
        return;
      }
      if (e.target.classList.contains("note-fret")) {
        if (showMultipleNotes) {
          app.toggleMultipleNotes(e.target.dataset.note, 0);
        } else {
          e.target.style.setProperty("--noteDotOpacity", 0);
        }
      }
    },
    setSelectedInstrument(e) {
      selectedInstrument = e.target.value;
      numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
      app.setupFretboard();
    },
    // apply selected tonewoods to the fretboard and corresponding fret markers
    setSelectedWood(e) {
      selectedWood = e.target.value;
      tonewood = woodPresets[selectedWood];
      fretboard.style.background = tonewood;
      if (selectedWood === "Ebony" || selectedWood === "Rosewood") {
        root.style.setProperty("--noteDotColor", "#b0966b");
      } else {
        root.style.setProperty("--noteDotColor", "#4b4130");
      }

      app.setupFretboard();
    },
    setAccidentals(e) {
      if (e.target.classList.contains("acc-select")) {
        accidentals = e.target.value;
        app.setupFretboard();
        app.setupNoteNameSection();
      } else {
        return;
      }
    },
    setFrets(e) {
      if (e.target.classList.contains("fret-select")) {
        numberOfFrets = e.target.value;
        app.setupFretboard();
      } else {
        return;
      }
    },
    setShowAllNotes() {
      showAllNotes = showAllNotesSelector.checked;
      if (showAllNotes) {
        root.style.setProperty("--noteDotOpacity", 1);
        app.setupFretboard();
      } else {
        root.style.setProperty("--noteDotOpacity", 0);
        app.setupFretboard();
      }
    },
    setShowMultipleNotes() {
      showMultipleNotes = !showMultipleNotes;
    },
    setNotesToShow(e) {
      let noteToShow = e.target.innerText;
      app.toggleMultipleNotes(noteToShow, 1);
    },
    setNotesToHide(e) {
      if (!showAllNotes) {
        let noteToHide = e.target.innerText;
        app.toggleMultipleNotes(noteToHide, 0);
      } else {
        return;
      }
    },
    setupEventListeners() {
      fretboard.addEventListener("mouseover", this.showNoteDot);
      fretboard.addEventListener("mouseout", this.hideNoteDot);
      instrumentSelector.addEventListener("change", this.setSelectedInstrument);
      woodSelector.addEventListener("change", this.setSelectedWood);
      accidentalSelector.addEventListener("click", this.setAccidentals);
      fretsSelector.addEventListener("click", this.setFrets);
      showAllNotesSelector.addEventListener("change", this.setShowAllNotes);
      showMultipleNotesSelector.addEventListener(
        "change",
        this.setShowMultipleNotes
      );
      noteNameSection.addEventListener("mouseover", this.setNotesToShow);
      noteNameSection.addEventListener("mouseout", this.setNotesToHide);
      //       noteNameSection.addEventListener("click", this.setNotesToShow);
      //       noteNameSection.addEventListener("click", this.setNotesToHide);
    },
  };

  const tools = {
    createElement(el, content) {
      el = document.createElement(el);
      if (arguments.length > 1) {
        el.innerHTML = content;
      }
      return el;
    },
  };

  app.init();

  //////////////////////////////////////TIMER FUNCTIONALITY

  const minutes = document.querySelector(".timer__part--minutes");
  const seconds = document.querySelector(".timer__part--seconds");
  const resetBtn = document.querySelector(".timer__btn--reset");
  const control = document.querySelector(".timer__btn--control");

  let interval = null;
  let remainingSeconds = 10;
  updateInterfaceTime();
  stop();

  control.addEventListener("click", () => {
    if (interval === null) {
      start();
    } else {
      stop();
    }
  });
  resetBtn.addEventListener("click", () => {
    const inputMinutes = prompt("Set Timer (in minutes): ");

    if (inputMinutes < 60) {
      stop();
      remainingSeconds = inputMinutes * 60;
      updateInterfaceTime();
    }
  });

  function updateInterfaceTime() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    minutes.textContent = mins.toString().padStart(2, "0");
    seconds.textContent = secs.toString().padStart(2, "0");
  }

  function updateInterfaceControls() {
    if (interval === null) {
      control.innerHTML = `<span class="material-symbols-outlined"> play_arrow </span>`;
      control.classList.add("timer__btn--start");
      control.classList.remove("timer__btn--stop");
    } else {
      control.innerHTML = `<span class="material-symbols-outlined"> pause </span>`;
      control.classList.remove("timer__btn--start");
      control.classList.add("timer__btn--stop");
    }
  }

  function start() {
    if (remainingSeconds === 0) {
      return;
    } else {
      interval = setInterval(() => {
        remainingSeconds--;
        updateInterfaceTime();
        let clickTwo = new Audio("click1.mp3");
        let clickOne = new Audio("click2.mp3");
        if (remainingSeconds <= 3) {
          clickOne.play();
        } else {
          clickTwo.play();
        }

        if (remainingSeconds === 0) {
          stop();
        }
      }, 1000);
      updateInterfaceControls();
    }
  }

  function stop() {
    clearInterval(interval);
    interval = null;
    updateInterfaceControls();
  }

  //////////////////////////////////////////EXERCISE CONTENT

  const tabs = document.querySelectorAll(".exercises__tab");
  const tabsContainer = document.querySelector(".exercises__tab-container");
  const tabsContent = document.querySelectorAll(".exercises__content");

  tabsContainer.addEventListener("click", (e) => {
    const clicked = e.target.closest(".exercises__tab");

    if (!clicked) return;
    tabs.forEach((tab) => tab.classList.remove("exercises__tab--active"));
    tabsContent.forEach((content) =>
      content.classList.remove("exercises__content--active")
    );
    clicked.classList.add("exercises__tab--active");

    document
      .querySelector(`.exercises__content--${clicked.dataset.tab}`)
      .classList.add("exercises__content--active");
  });
})();
