class Piece { 
    constructor(ctx) {  
        this.ctx = ctx;    
        
        // Get random tetromino type
        const typeId = this.randomizeTetrominoType(COLORS.length);  
        this.shape = SHAPES[typeId];  
        this.color = COLORS[typeId];
        
        // Starting position
        this.x = 0;  
        this.y = 0;  
    }
    
    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
    
    // Updates the x and y variables of the tetromino piece p
    move(p) {  
        this.x = p.x;  
        this.y = p.y;
        this.shape = p.shape;
    }
  
    // Get integer between 0 and max number sent in
    randomizeTetrominoType(noOfTypes) {  
        return Math.floor(Math.random() * noOfTypes);  
    }
}