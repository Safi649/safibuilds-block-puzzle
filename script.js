class BlockBlast {
    constructor() {
        this.grid = Array(8).fill().map(() => Array(8).fill(0));
        this.score = 0;
        this.level = 1;
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        this.dragging = false;
        this.dragStart = null;
        this.init();
    }

    init() {
        this.createGrid();
        this.showNextPiece();
        this.updateDisplay();
        this.bindEvents();
    }

    createGrid() {
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                if (this.grid[row][col]) cell.classList.add('filled');
                grid.appendChild(cell);
            }
        }
    }

    showNextPiece() {
        const nextGrid = document.getElementById('next-piece');
        nextGrid.innerHTML = '';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.classList.add('next-cell');
                if (this.nextPiece.shape[row] && this.nextPiece.shape[row][col]) {
                    cell.style.background = this.nextPiece.color;
                }
                nextGrid.appendChild(cell);
            }
        }
    }

    generatePiece() {
        const shapes = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[1,1,0],[0,1,1]], // Z
            [[0,1,1],[1,1,0]], // S
            [[1,1,1],[0,0,1]], // J
            [[1,1,1],[1,0,0]], // L
            [[1,1,1],[1,1,0]]  // T
        ];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        return {
            shape,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    bindEvents() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('mousedown', (e) => this.startDrag(e));
            cell.addEventListener('mousemove', (e) => this.drag(e));
            cell.addEventListener('mouseup', () => this.endDrag());
        });

        document.getElementById('reset').addEventListener('click', () => this.reset());
    }

    startDrag(e) {
        this.dragging = true;
        this.dragStart = { row: parseInt(e.target.dataset.row), col: parseInt(e.target.dataset.col) };
    }

    drag(e) {
        if (!this.dragging) return;
        e.target.classList.add('dragging');
    }

    endDrag() {
        if (!this.dragging || !this.dragStart) return;
        this.dragging = false;

        const endCell = document.querySelector('.dragging');
        if (!endCell) return;
        const endPos = { row: parseInt(endCell.dataset.row), col: parseInt(endCell.dataset.col) };

        // Simple placement: place piece at end position (for demo; enhance for full drag-drop of shape)
        this.placePiece(this.nextPiece, endPos.row, endPos.col);
        this.nextPiece = this.generatePiece();
        this.showNextPiece();

        document.querySelectorAll('.dragging').forEach(c => c.classList.remove('dragging'));
        this.dragStart = null;

        this.clearLines();
        this.updateDisplay();
        if (this.isGameOver()) {
            alert(`Game Over! Final Score: ${this.score}`);
        }
    }

    placePiece(piece, row, col) {
        for (let pr = 0; pr < piece.shape.length; pr++) {
            for (let pc = 0; pc < piece.shape[pr].length; pc++) {
                if (piece.shape[pr][pc]) {
                    const nr = row + pr;
                    const nc = col + pc;
                    if (nr >= 8 || nc >= 8 || this.grid[nr][nc]) {
                        return false; // Can't place
                    }
                }
            }
        }
        // Place it
        for (let pr = 0; pr < piece.shape.length; pr++) {
            for (let pc = 0; pc < piece.shape[pr].length; pc++) {
                if (piece.shape[pr][pc]) {
                    this.grid[row + pr][col + pc] = piece.color;
                }
            }
        }
        this.createGrid();
        return true;
    }

    clearLines() {
        let cleared = 0;
        // Rows
        for (let row = 0; row < 8; row++) {
            if (this.grid[row].every(cell => cell)) {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(8).fill(0));
                cleared++;
            }
        }
        // Columns
        for (let col = 0; col < 8; col++) {
            if (this.grid.every(row => row[col])) {
                this.grid.forEach(row => { row.splice(col, 1); row.push(0); });
                cleared++;
            }
        }
        this.score += cleared * 10 * this.level;
        if (cleared > 0) this.level = Math.min(10, this.level + 1);
    }

    isGameOver() {
        return this.nextPiece.shape.some((row, r) => row.some((cell, c) => {
            const testRow = 0 + r;
            const testCol = 0 + c; // Check if can place anywhere starting from top-left
            return testRow < 8 && testCol < 8 && this.grid[testRow][testCol];
        })); // Simplified; full check would try all positions
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }

    reset() {
        this.grid = Array(8).fill().map(() => Array(8).fill(0));
        this.score = 0;
        this.level = 1;
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        this.createGrid();
        this.showNextPiece();
        this.updateDisplay();
    }
}

new BlockBlast();
