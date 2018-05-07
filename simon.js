const squares = document.querySelectorAll(".square"),
  display = document.querySelector("#text-display"),
  onOff = document.querySelector("#switch"),
  start = document.querySelector("#start"),
  strict = document.querySelector("#strict"),
  strictLight = document.querySelector("#light"),
  five = document.querySelector("#five"),
  twenty = document.querySelector("#twenty"),
  nineNine = document.querySelector("#nine-nine"),
  sounds = [
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  ],
  brighterColors = [
    "brighter-green",
    "brighter-red",
    "brighter-yellow",
    "brighter-blue"
  ];

let nextColorIndex = 0,
  sequence = [],
  playerSeq = [],
  playTo = 5,
  power = false, // on-off switch
  computerTurn = true, //flag to turn off buttons during computer's turn
  startButton = true, //prevent start button from being clicked twice in quick succession
  strictOn = false; // strict button

onOff.addEventListener("click", () => {
  onOff.classList.toggle("move-switch");

  if (!power) {
    power = true;
    display.style.color = "red";
  } else {
    power = false;
    strictOn = false;
    display.style.color = "rgb(94, 23, 23)";
    strictLight.style.backgroundColor = "rgb(26, 2, 2)";
    reset();
  }
});

strict.addEventListener("click", () => {
  if (power) {
    if (!strictOn) {
      strictOn = true;
      strictLight.style.backgroundColor = "red";
    } else {
      strictOn = false;
      strictLight.style.backgroundColor = "rgb(26, 2, 2)";
    }
  }
});

start.addEventListener("click", () => {
  if (power && startButton) {
    reset();
    startButton = false;
    power = false; //to break out of any loops already in action;
    power = true;
    displayBlink();
    setTimeout(() => {
      startButton = true;
      playSequence(true);
    }, 2000);
  }
});

five.classList.add("active");
five.style.boxShadow = "0 0 0";

five.addEventListener("click", () => {
  // these listeners should be cleaned up
  if (sequence.length < 5) {
    playTo = 5;
    twenty.classList.remove("active");
    twenty.style.boxShadow = "0 3px 2px rgb(59, 59, 59)";
    nineNine.classList.remove("active");
    nineNine.style.boxShadow = "0 3px 2px rgb(59, 59, 59)";
    five.classList.add("active");
    five.style.boxShadow = "0 0 0";
  }
});

twenty.addEventListener("click", () => {
  if (sequence.length < 20) {
    playTo = 20;
    five.classList.remove("active");
    five.style.boxShadow = "0 3px 2px rgb(59, 59, 59)";
    nineNine.classList.remove("active");
    nineNine.style.boxShadow = "0 3px 2px rgb(59, 59, 59)";
    twenty.classList.add("active");
    twenty.style.boxShadow = "0 0 0";
  }
});

nineNine.addEventListener("click", () => {
  playTo = 99;
  five.classList.remove("active");
  five.style.boxShadow = "0 3px 2px rgb(59, 59, 59)";
  twenty.classList.remove("active");
  twenty.style.boxShadow = "0 3px 2px rgb(59, 59, 59)";
  nineNine.classList.add("active");
  nineNine.style.boxShadow = "0 0 0";
});

function displayBlink() {
  display.classList.toggle("blink");
  setTimeout(() => {
    display.classList.toggle("blink");
  }, 2000);
}

function playSequence(addColor) {
  if (addColor) {
    // condition to allow playing sequence after error in normal mode
    nextColorIndex = Math.floor(Math.random() * 4);
    sequence.push(nextColorIndex); // add a color to the sequence
  }

  sequence.length >= 10
    ? (display.textContent = sequence.length)
    : (display.textContent = "0" + sequence.length);

  for (let index = 0; index < sequence.length; index++) {
    // for loop to allow for break condition

    if (!power) {
      // stop this for loop if game is turned off
      break;
    }

    setTimeout(() => {
      squares[sequence[index]].classList.toggle(
        brighterColors[sequence[index]]
      );
      let audio = new Audio(sounds[sequence[index]]);
      audio.play();
      setTimeout(() => {
        squares[sequence[index]].classList.toggle(
          brighterColors[sequence[index]]
        );
      }, 1000);
    }, index * 1500);
  }

  setTimeout(() => {
    // player can click after sequence has played
    computerTurn = false;
  }, sequence.length * 1500 - 1000);
}

function reset() {
  sequence = [];
  playerSeq = [];
  computerTurn = true;
  display.textContent = "- -";
  squares.forEach((square, index) => {
    square.classList.remove(brighterColors[index]);
  });
}

squares.forEach((square, index) => {
  square.addEventListener("click", () => {
    if (!computerTurn && power) {
      let audio = new Audio(sounds[index]);
      audio.play();
      squares[index].classList.toggle(brighterColors[index]);
      setTimeout(() => {
        squares[index].classList.toggle(brighterColors[index]);
      }, 600);

      playerSeq.push(index);

      if (playerSeq[playerSeq.length - 1] !== sequence[playerSeq.length - 1]) {
        //if player makes mistake
        display.textContent = "! !";
        displayBlink();
        computerTurn = true; // place here to prevent button clicks once have right sequence

        if (strictOn) {
          setTimeout(() => {
            reset();
            playSequence(true);
          }, 2000);
        } else {
          setTimeout(() => {
            playerSeq = [];
            playSequence(false);
          }, 2000);
        }
      } else if (playerSeq.length === sequence.length) {
        if (sequence.length === playTo) {
          //if player gets sequence of n length right for victory
          display.textContent = "win";
          displayBlink();
          computerTurn = true;
          setTimeout(() => {
            for (let index = 0; index < 3; index++) {
              setTimeout(() => {
                squares.forEach((square, index) => {
                  setTimeout(() => {
                    let audio = new Audio(sounds[index]);
                    audio.play();
                    square.classList.toggle(brighterColors[index]);
                  }, 300 * index);
                });
              }, 1500 * index);
            }
          }, 1500);
        } else {
          // if player gets sequence correct before victory
          playerSeq = [];
          computerTurn = true;
          setTimeout(() => {
            playSequence(true);
          }, 2000);
        }
      }
    }
  });
});
