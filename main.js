// Object with current score and cleared lines to keep track of game progress
let accountValues = {  
    score: 0,
    lines: 0,
    level: 0
}

// Update game score or lines on screen, key dependant
function updateAccount(key, value) {  
    let element = document.getElementById(key);  
    if (element) {  
        element.textContent = value;  
    }  
}

// Proxy object to act on changes to the account object
let account = new Proxy(accountValues, {  
    set: (target, key, value) => {  
        target[key] = value;  
        updateAccount(key, value);  
        return true;  
    }  
});

let requestId = null;
let board = null;

drawGrid();
showHighScores();

function handleKeyPress(event) {
    // Stop the event from bubbling
    event.preventDefault();

    if (moves[event.keyCode]) {
        // Get new state of piece
        let p = moves[event.keyCode](board.piece);
        
        // Hard drop
        if (event.keyCode === KEY.SPACE) {
            while (board.valid(p)) {        
                board.piece.move(p);
                account.score += POINTS.HARD_DROP;
                p = moves[KEY.SPACE](board.piece);
            }
        }
        
        // Soft drop
        if (board.valid(p)) { 
            board.piece.move(p);
            if (event.keyCode === KEY.DOWN) {
                account.score += POINTS.SOFT_DROP;
            }  
        }
    }
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

function draw() {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);   
    drawGrid();
    // Draw board with merged tetromino pieces
    board.draw();
    board.piece.draw();
}

// Draw light grey grid pattern on board
function drawGrid() {
    ctx.lineWidth = 1 / BLOCK_SIZE;
    ctx.strokeStyle = '#EFEFEF';
    for (let i = 0; i <= ctx.canvas.width / BLOCK_SIZE; i += 1) {
        for (let j = 0; j <= ctx.canvas.height / BLOCK_SIZE; j += 1) {
            ctx.strokeRect(i, j, 1, 1);
        }
    }
}

// Reset game upon finishing a game
function resetGame() {
    account.score = 0;
    account.lines = 0;
    account.level = 0;
    board = new Board(ctx, ctxNext);
    drawGrid();
    time = { start: performance.now(), elapsed: 0, level: LEVEL[0] };
}

// Starts new game upon pressing the Play button
function play() {
    resetGame();
    addEventListener();

    // If old game instance is running, cancel it
    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    // Set starting time
    time.start = performance.now();

    // Start animations
    animate();
}

time = { start: 0, elapsed: 0, level: 1000 };

function animate(now = 0) {
    // Update elapsed time.
    time.elapsed = now - time.start;

    // If elapsed time has passed time for current level
    if (time.elapsed > time.level) {
        // Restart counting from now
        time.start = now;

        if (!board.drop()) {
            gameOver();
            return;
        }
    }

    draw();
    requestId = requestAnimationFrame(animate);
}

// Behaviors when game over
function gameOver() {
    // Cancel previously scheduled animation frame
    cancelAnimationFrame(requestId);

    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 1.8, 4);

    checkHighScore(account.score);
}

function checkHighScore(score) {
    // Parse string retrieved from localStorage
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];

    // Get lowest score on the list
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;
 
    if (score > lowestScore) {
        saveHighScore(score, highScores);
        showHighScores();
    }
}

function saveHighScore(score, highScores) {
    const name = prompt('You got a highscore! Enter name:');

    // Create new score object to save in the list
    const newScore = { score, name };

    // Add to list
    highScores.push(newScore);
    // Sort the list
    highScores.sort((a, b) => b.score - a.score);
    // Select new list
    highScores.splice(NO_OF_HIGH_SCORES);
    // Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
};

function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
 
    const highScoreList = document.getElementById(HIGH_SCORES);
 
    highScoreList.innerHTML = highScores
        .map((score) => `<li>${score.score} - ${score.name}`)
        .join('');
}
