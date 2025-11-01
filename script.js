// --- DOM Element References ---
const targetArea = document.getElementById('target-area');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const nextLevelBtn = document.getElementById('next-level-btn');
const shootSound = document.getElementById('shoot-sound'); 

// --- Game Variables and Configuration ---
let score = 0;
let level = 1;
let timer;

const levels = [
    // Level 1: 15 balloons, no time limit, near distance
    { numBalloons: 15, time: 0, distance: 'near' }, 
    // Level 2: 15 balloons, no time limit, far distance (smaller)
    { numBalloons: 15, time: 0, distance: 'far' },  
    // Level 3: 10 balloons, 15 seconds, far distance (timed challenge)
    { numBalloons: 20, time: 15, distance: 'far' }   
];

// --- Core Game Functions ---

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `POINTS: ${score}`;
}

function playShootSound() {
    shootSound.currentTime = 0; 
    shootSound.play();
}

function popBalloon(event) {
    if (event.target.classList.contains('balloon')) {
        playShootSound(); 
        updateScore(10); 
        event.target.remove();
        
        if (document.querySelectorAll('.balloon').length === 0) {
            endLevel();
        }
    }
}

function startTimer() {
    clearInterval(timer); 
    let timeLeft = levels[level - 1].time; 
    
    if (timeLeft > 0) {
        timerDisplay.textContent = `TIMER: ${timeLeft}`;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `TIMER: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endLevel(true); // Time's up!
            }
        }, 1000);
    } else {
        timerDisplay.textContent = `TIMER: --`;
    }
}

function generateBalloons(config) {
    targetArea.innerHTML = ''; 

    for (let i = 0; i < config.numBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        // Random positioning
        const x = Math.random() * 80 + 10; 
        const y = Math.random() * 80 + 10; 

        balloon.style.left = `${x}%`;
        balloon.style.top = `${y}%`;

        if (config.distance === 'far') {
            balloon.style.transform = 'scale(0.6)'; // Simulate distance (smaller target)
        }

        targetArea.appendChild(balloon);
    }
}

function endLevel(timeExpired = false) {
    clearInterval(timer);
    modal.classList.remove('hidden');
    
    const modalInstructor = document.getElementById('modal-instructor');

    if (timeExpired) {
        modalTitle.textContent = "🐻 TIME'S UP!";
        modalInstructor.textContent = "You need to shoot faster! Click 'Try Again' to continue.";
        modalMessage.textContent = `You missed some balloons! Score: ${score}.`;
        nextLevelBtn.textContent = "Try Again?";
    } else if (level < 3) {
        modalTitle.textContent = "🐻 GREAT JOB!";
        
        // Custom instructions based on the next level
        if (level === 1) {
            modalInstructor.textContent = "Instructions: Shoot 15 balloons. They will be SMALLER this time!";
        } else if (level === 2) {
            modalInstructor.textContent = "Instructions: Shoot 20 balloons in 15 seconds! Speed is key!";
        }
        
        modalMessage.textContent = `Level ${level} complete! Preparing for Level ${level + 1}...`;
        nextLevelBtn.textContent = `Start Level ${level + 1}`;
    } else {
        modalTitle.textContent = "🐻 GAME OVER!";
        let prize = score >= 100 ? "BIG PRIZE" : score >= 50 ? "MEDIUM PRIZE" : "SMALL PRIZE";
        modalInstructor.textContent = "You've earned your prize! Thanks for playing.";
        modalMessage.textContent = `Final Score: ${score}! You win the ${prize}!`;
        nextLevelBtn.textContent = "Play Again?";
    }
}

function nextLevel() {
    modal.classList.add('hidden');
    
    if (level === 3 && document.getElementById('modal-title').textContent.includes("GAME OVER")) {
        // Reset game after final level
        score = 0;
        level = 1;
        scoreDisplay.textContent = `POINTS: 0`;
    } else if (level < 3) {
        level++;
    }

    startGame();
}


// --- New Function to Preload Audio (Fixes sound loading issue) ---
function initAudio() {
    if (shootSound) {
        shootSound.load();
        console.log("Audio element initialized.");
    }
}

function startGame() {
    const currentLevelConfig = levels[level - 1];
    generateBalloons(currentLevelConfig);
    startTimer();
}


// ------------------------------------------------------------------
// --- FINAL INITIALIZATION BLOCK ---
// ------------------------------------------------------------------

// --- Event Listeners ---
targetArea.addEventListener('click', popBalloon);
nextLevelBtn.addEventListener('click', nextLevel);

// Initial game start
initAudio(); 
startGame();