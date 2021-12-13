const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = 'highScores';
const COLORS = ['cyan', 'blue', '#FF9200', '#FFE000', 'green', 'purple', 'red'];

// Array of matrices of each of the seven shapes and colors of tetrominoes
const SHAPES = [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];

// Points system object
const POINTS = {  
    SINGLE: 100,  
    DOUBLE: 300,  
    TRIPLE: 500,  
    TETRIS: 800,  
    SOFT_DROP: 1,  
    HARD_DROP: 2  
}
Object.freeze(POINTS);

// Number of lines cleared to advance to next level
const LINES_PER_LEVEL = 10;

// Match each level to number of miliseconds for each drop
const LEVEL = {
    0: 800,
    1: 720,
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30,
    // 29+ is 20ms
}
Object.freeze(LEVEL);

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');  
const ctxNext = canvasNext.getContext('2d');
 
// Calculate size of canvas from constants
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Size Next canvas for four blocks
ctxNext.canvas.width = 4 * BLOCK_SIZE;  
ctxNext.canvas.height = 4 * BLOCK_SIZE; 
 
// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE); 
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

// Object to map the keycodes to common names
const KEY = {
    SPACE: 32, 
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}
Object.freeze(KEY); 

// Lookup object of computed property keys to match key codes to state-changing functions
const moves = {
    [KEY.LEFT]:  (p) => ({ ...p, x: p.x - 1 }),  
    [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),  
    [KEY.DOWN]:  (p) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]:    (p) => board.rotate(p),
    [KEY.SPACE]:  (p) => ({ ...p, y: p.y + 1 }),
};