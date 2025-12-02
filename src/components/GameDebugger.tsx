import { useState } from 'react';
import { getNextGeneration, gridsEqual, countLivingCells } from '../utils/gameOfLife';

interface GameDebuggerProps {
  grid: boolean[][];
  generation: number;
  previousGrids: boolean[][][];
  onGridChange?: (newGrid: boolean[][]) => void;
}

export function GameDebugger({ grid, generation, previousGrids, onGridChange }: GameDebuggerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Test the step logic manually
  const testStep = () => {
    console.log('=== DEBUGGING STEP ===');
    console.log('Current grid population:', countLivingCells(grid));
    console.log('Current generation:', generation);
    console.log('Previous grids count:', previousGrids.length);
    
    const nextGrid = getNextGeneration(grid);
    console.log('Next grid population:', countLivingCells(nextGrid));
    
    // Check if static
    const isStatic = gridsEqual(nextGrid, grid);
    console.log('Is static pattern:', isStatic);
    
    // Check for cycles
    const foundCycle = previousGrids.some((oldGrid, index) => {
      const matches = gridsEqual(nextGrid, oldGrid);
      if (matches) {
        console.log(`Found cycle with generation ${generation - previousGrids.length + index}`);
      }
      return matches;
    });
    console.log('Found cycle:', foundCycle);
    
    // Log a small sample of the grids
    console.log('Current grid (first 3x3):', 
      grid.slice(0, 3).map(row => row.slice(0, 3))
    );
    console.log('Next grid (first 3x3):', 
      nextGrid.slice(0, 3).map(row => row.slice(0, 3))
    );
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-red-500 text-white px-3 py-2 rounded text-sm"
        >
          Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold">Game Debugger</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-red-500 text-lg"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>Generation: {generation}</div>
        <div>Population: {countLivingCells(grid)}</div>
        <div>Previous grids: {previousGrids.length}</div>
        
        <button
          onClick={testStep}
          className="bg-blue-500 text-white px-2 py-1 rounded w-full mt-2"
        >
          Test Next Step
        </button>
        
        <button
          onClick={() => {
            console.log('=== CREATING TEST PATTERN ===');
            // Create a simple blinker pattern for testing
            const testGrid = grid.map(row => [...row]);
            // Clear first
            testGrid.forEach(row => row.fill(false));
            // Add blinker at center
            const center = Math.floor(grid.length / 2);
            testGrid[center][center-1] = true;
            testGrid[center][center] = true; 
            testGrid[center][center+1] = true;
            console.log('Created blinker pattern at center with population:', countLivingCells(testGrid));
            onGridChange?.(testGrid);
          }}
          className="bg-green-500 text-white px-2 py-1 rounded w-full mt-1"
        >
          Create Test Blinker
        </button>
        
        <div className="mt-2">
          <div className="text-xs font-bold">Current Grid (5x5 sample):</div>
          <div className="font-mono text-xs">
            {grid.slice(0, 5).map((row, i) => (
              <div key={i}>
                {row.slice(0, 5).map(cell => cell ? '●' : '○').join('')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}