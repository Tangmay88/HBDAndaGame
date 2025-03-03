const puzzle = document.querySelector(".puzzle");
const pieces = document.querySelector(".pieces");
const paths = document.querySelectorAll(".puzzle path");
const endImg = document.querySelector(".endImg");
const timerDisplay = document.querySelector(".timer");  // ใช้แสดงเวลานับถอยหลัง
const kittens = [
  "./images/AndaXBirthDay/andaj1.png",
  "./images/AndaXBirthDay/andaj2.png",
  "./images/AndaXBirthDay/andaj3.png",
  "./images/AndaXBirthDay/andaj4.png",
  "./images/AndaXBirthDay/andaj5.png",
  "./images/AndaXBirthDay/andaj6.png",
  "./images/AndaXBirthDay/andaj7.png",
  "./images/AndaXBirthDay/andaj8.png",
  "./images/AndaXBirthDay/andaj9.png",
  "./images/AndaXBirthDay/andaj.png"
];

const startPos = [
  { x: 164, y: 56 },
  { x: 77, y: -35 },
  { x: -98, y: -23 },
  { x: -57, y: 105 },
  { x: -168, y: 39 },
  { x: -33, y: -5 },
  { x: -38, y: -60 },
  { x: -122, y: 71 },
  { x: 91, y: -13 },
  { x: 35, y: -5 },
  { x: -38, y: 16 },
  { x: 8, y: -88 },
  { x: 81, y: 4 },
  { x: 62, y: -66 },
  { x: -174, y: -45 },
  { x: 101, y: 36 },
  { x: 38, y: 33 },
  { x: -80, y: 29 },
  { x: -7, y: -106 },
  { x: 42, y: 19 }
];

// เสียงเมื่อชนะและแพ้
const winSound = new Audio("./music/victory1.mp3");  // เสียงเมื่อชนะ
const loseSound = new Audio("./music/gameover.mp3");  // เสียงเมื่อแพ้
const bgMusic = new Audio("./music/soundgame.mp3");  // เพลงพื้นหลัง

// Set initial time limit (60 seconds)
let timeLeft = 80;
let timer;

paths.forEach((p, i) => {
  const piece = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const shadow = p.cloneNode("true");
  pieces.append(piece);
  piece.append(shadow);
  piece.append(p);

  gsap.set(piece, {
    transformOrigin: "50%",
    x: startPos[i].x,
    y: startPos[i].y,
    rotate: "random(-25,25)",
    attr: { class: "piece" }
  });
  gsap.set(shadow, { opacity: 0.35 });
  gsap.set(p, { attr: { fill: "url(#img)", filter: "url(#bevel)" } });
  let draggable = Draggable.create(piece, {
    onPress: () => {
      gsap
        .timeline({ defaults: { duration: 0.3 } })
        .to(
          piece,
          {
            scale: 1.1,
            rotate: "random(-5,5)",
            ease: "back.out(3)"
          },
          0
        )
        .to(
          shadow,
          { x: 1, y: 5, opacity: 0.15, scale: 0.9, ease: "back.out(1)" },
          0
        );
      pieces.append(piece);
    },
    onRelease: () => {
      gsap
        .timeline({ defaults: { duration: 0.2 } })
        .to(piece, { scale: 1, ease: "back.out(3)" }, 0)
        .to(shadow, { opacity: 0.35, x: 0, y: 0, scale: 1, ease: "power2" }, 0)
        .add(check);
      if (
        Math.abs(gsap.getProperty(piece, "x")) < 9 &&
        Math.abs(gsap.getProperty(piece, "y")) < 9
      ) {
        gsap.to(piece, { duration: 0.2, x: 0, y: 0, rotate: 0 });
      }
    }
  });
});

function check() {
  let n = 0;
  document.querySelectorAll(".piece").forEach((p) => {
    n += Math.abs(gsap.getProperty(p, "x"));
    n += Math.abs(gsap.getProperty(p, "y"));
  });
  if (n < 1) {
    puzzle.append(endImg);
    gsap.to(endImg, { duration: 1, opacity: 1, ease: "power2.inOut" });
    winSound.play();  // เล่นเสียงเมื่อชนะ
    bgMusic.pause();  // หยุดเพลงพื้นหลังเมื่อชนะ
    clearInterval(timer);  // หยุดจับเวลาหลังจากชนะ
  }
}

// Timer function
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;  // Decrease the time by 1 every second
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);  // Stop the timer when time is up
      endGame();  // End the game when time runs out
    }
  }, 1000);
}

// Function to show end image when time is up
function endGame() {
  puzzle.append(endImg);
  gsap.to(endImg, { duration: 1, opacity: 1, ease: "power2.inOut" });
  loseSound.play();  // เล่นเสียงเมื่อแพ้
  bgMusic.pause();  // หยุดเพลงพื้นหลังเมื่อแพ้
  alert("Time's up! The game is over!");
}

// เริ่มต้นเพลงพื้นหลัง
bgMusic.loop = true;  // ตั้งให้เพลงเล่นวนซ้ำ
bgMusic.volume = 0.5;  // ปรับระดับเสียง (0 - 1)
bgMusic.play();  // เริ่มเล่นเพลงพื้นหลัง

// เริ่มจับเวลาเมื่อเกมเริ่ม
startTimer();

gsap.set(".endImg, .box, .pieces", { x: 82.5, y: 50 });
gsap.set("body", { background: "hsl(" + "random(0,360)" + ", 70%, 80%)" });
gsap.set("#imgSrc", {
  attr: {
    href: kittens[gsap.utils.random(0, kittens.length - 1, 1)] + "?q=50&w=2000"
  }
});
