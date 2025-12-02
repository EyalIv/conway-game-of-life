// Create an empty grid
export function createEmptyGrid(size: number | { width: number; height: number }): boolean[][] {
  if (typeof size === 'number') {
    return Array(size).fill(null).map(() => Array(size).fill(false));
  }
  return Array(size.height).fill(null).map(() => Array(size.width).fill(false));
}

// Create a random grid
export function createRandomGrid(size: number | { width: number; height: number }, density = 0.3): boolean[][] {
  if (typeof size === 'number') {
    return Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => Math.random() < density)
    );
  }
  return Array(size.height).fill(null).map(() => 
    Array(size.width).fill(null).map(() => Math.random() < density)
  );
}

// Count living neighbors for a cell
function countNeighbors(grid: boolean[][], row: number, col: number): number {
  let count = 0;
  const height = grid.length;
  const width = grid[0].length;
  
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the cell itself
      
      const newRow = row + i;
      const newCol = col + j;
      
      // Check bounds
      if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
        if (grid[newRow][newCol]) count++;
      }
    }
  }
  
  return count;
}

// Apply Game of Life rules to get the next generation
export function getNextGeneration(grid: boolean[][]): boolean[][] {
  const height = grid.length;
  const width = grid[0].length;
  const newGrid = createEmptyGrid({ width, height });
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const neighbors = countNeighbors(grid, row, col);
      const isAlive = grid[row][col];
      
      // Game of Life rules:
      // 1. Any live cell with 2-3 neighbors survives
      // 2. Any dead cell with exactly 3 neighbors becomes alive
      // 3. All other cells die or stay dead
      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        newGrid[row][col] = true;
      } else if (!isAlive && neighbors === 3) {
        newGrid[row][col] = true;
      }
    }
  }
  
  return newGrid;
}

// Count total living cells
export function countLivingCells(grid: boolean[][]): number {
  return grid.flat().filter(cell => cell).length;
}

// Check if two grids are identical
export function gridsEqual(grid1: boolean[][], grid2: boolean[][]): boolean {
  if (grid1.length !== grid2.length) return false;
  
  for (let i = 0; i < grid1.length; i++) {
    for (let j = 0; j < grid1[i].length; j++) {
      if (grid1[i][j] !== grid2[i][j]) return false;
    }
  }
  
  return true;
}

// Pattern definitions - Curated famous Conway's Game of Life patterns
export const patterns = {
  // ==== BASIC PATTERNS ====
  glider: [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],
  blinker: [
    [true, true, true]
  ],
  block: [
    [true, true],
    [true, true]
  ],
  beehive: [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, true, false]
  ],
  loaf: [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, true],
    [false, false, true, false]
  ],
  boat: [
    [true, true, false],
    [true, false, true],
    [false, true, false]
  ],
  tub: [
    [false, true, false],
    [true, false, true],
    [false, true, false]
  ],

  // ==== OSCILLATORS ====
  beacon: [
    [true, true, false, false],
    [true, true, false, false],
    [false, false, true, true],
    [false, false, true, true]
  ],
  toad: [
    [false, true, true, true],
    [true, true, true, false]
  ],
  pulsar: [
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, true, false, false, false, true, true, true, false, false]
  ],
  pentadecathlon: [
    [false, false, true, false, false, false, false, true, false, false],
    [true, true, false, true, true, true, true, false, true, true],
    [false, false, true, false, false, false, false, true, false, false]
  ],

  // ==== SPACESHIPS ====
  lwss: [
    [true, false, false, true, false],
    [false, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, true]
  ],
  mwss: [
    [false, false, true, false, false, false],
    [true, false, false, false, true, false],
    [false, false, false, false, false, true],
    [true, false, false, false, false, true],
    [false, true, true, true, true, true]
  ],
  hwss: [
    [false, false, true, true, false, false, false],
    [true, false, false, false, false, true, false],
    [false, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [false, true, true, true, true, true, true]
  ],

  // ==== GUNS AND GENERATORS ====
  gosper: [
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
    [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
    [true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [true, true, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  ],

  // ==== METHUSELAHS (Long-lived patterns) ====
  rpentomino: [
    [false, true, true],
    [true, true, false],
    [false, true, false]
  ],
  acorn: [
    [false, true, false, false, false, false, false],
    [false, false, false, true, false, false, false],
    [true, true, false, false, true, true, true]
  ],
  diehard: [
    [false, false, false, false, false, false, true, false],
    [true, true, false, false, false, false, false, false],
    [false, true, false, false, false, true, true, true]
  ],

  // ==== EXOTIC PATTERNS ====
  bheptomino: [
    [true, false, true, true],
    [true, true, true, false],
    [false, true, false, false]
  ],
  piheptomino: [
    [true, true, true],
    [true, false, true],
    [true, false, true]
  ],
  rabbits: [
    [true, true, true, false, true],
    [true, false, false, false, false],
    [false, false, false, true, true],
    [false, true, true, false, true],
    [true, false, true, false, true]
  ],
  thunderbird: [
    [true, true, true],
    [false, false, false],
    [false, true, false],
    [false, true, false],
    [false, true, false]
  ],

  // ==== INTERESTING SMALL PATTERNS ====
  clock: [
    [false, true, false, false],
    [false, false, true, true],
    [true, true, false, false],
    [false, false, true, false]
  ],
  koks: [
    [false, false, true, true, false, false],
    [false, false, true, true, false, false],
    [false, false, false, false, false, false],
    [true, true, false, false, true, true],
    [true, true, false, false, true, true]
  ],
  figure8: [
    [true, true, true, false, false, false],
    [true, true, true, false, false, false],
    [false, false, false, true, true, true],
    [false, false, false, true, true, true]
  ],
  tumbler: [
    [false, true, true, false, true, true, false],
    [false, true, true, false, true, true, false],
    [false, false, true, false, true, false, false],
    [true, false, true, false, true, false, true],
    [true, false, true, false, true, false, true],
    [true, true, false, false, false, true, true]
  ]
};

// Curated list of 30 main patterns for random selection
export const mainPatterns = [
  'glider', 'blinker', 'block', 'beehive', 'loaf', 'boat', 'tub',
  'beacon', 'toad', 'pulsar', 'pentadecathlon', 'clock', 'figure8',
  'lwss', 'mwss', 'hwss', 'gosper',
  'rpentomino', 'acorn', 'diehard',
  'bheptomino', 'piheptomino', 'rabbits', 'thunderbird',
  'koks', 'tumbler'
] as const;

// Load a pattern into the grid at a specific position
export function loadPattern(grid: boolean[][], patternName: keyof typeof patterns, startRow?: number, startCol?: number): boolean[][] {
  const newGrid = grid.map(row => [...row]);
  const pattern = patterns[patternName];
  
  if (!pattern) return newGrid;
  
  // Center the pattern by default
  const defaultStartRow = startRow ?? Math.floor((grid.length - pattern.length) / 2);
  const defaultStartCol = startCol ?? Math.floor((grid[0].length - pattern[0].length) / 2);
  
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const row = defaultStartRow + i;
      const col = defaultStartCol + j;
      
      if (row >= 0 && row < newGrid.length && col >= 0 && col < newGrid[0].length) {
        newGrid[row][col] = pattern[i][j];
      }
    }
  }
  
  return newGrid;
}

// Get a random pattern from the curated main patterns
export function getRandomMainPattern(): string {
  const randomIndex = Math.floor(Math.random() * mainPatterns.length);
  return mainPatterns[randomIndex];
}