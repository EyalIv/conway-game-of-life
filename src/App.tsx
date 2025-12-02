import { useState, useEffect, useCallback, useRef } from 'react';
import { GameGrid } from './components/GameGrid';
import { GameControls } from './components/GameControls';
import { GameStats } from './components/GameStats';
import { toast, Toaster } from 'sonner@2.0.3';

import { 
  createEmptyGrid, 
  createRandomGrid, 
  getNextGeneration, 
  countLivingCells,
  gridsEqual,
  loadPattern,
  patterns,
  getRandomMainPattern
} from './utils/gameOfLife';
import { motion } from 'motion/react';

export default function App() {
  const [gridSize, setGridSize] = useState({ width: 40, height: 25 });
  const [grid, setGrid] = useState(() => createEmptyGrid(gridSize));
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(350);
  const [previousGrids, setPreviousGrids] = useState<boolean[][][]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout>();

  // Calculate population
  const population = countLivingCells(grid);

  // Handle grid size changes from the responsive grid
  const handleGridSizeChange = useCallback((newSize: { width: number; height: number }) => {
    setGridSize(newSize);
  }, []);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isPlaying) return;
    
    setGrid(prevGrid => {
      // Ensure the grid is large enough for the clicked position
      const newGrid = Array(Math.max(prevGrid.length, row + 1)).fill(null).map((_, r) => 
        Array(Math.max(prevGrid[0]?.length || 0, col + 1)).fill(false)
      );
      
      // Copy existing data
      for (let r = 0; r < prevGrid.length; r++) {
        for (let c = 0; c < (prevGrid[r]?.length || 0); c++) {
          if (prevGrid[r] && prevGrid[r][c] !== undefined) {
            newGrid[r][c] = prevGrid[r][c];
          }
        }
      }
      
      // Toggle the clicked cell
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
    
    // Reset generation and previous grids when manually editing
    setGeneration(0);
    setPreviousGrids([]);
  }, [isPlaying]);

  // Step function - separated into calculation and state update
  const step = useCallback(() => {
    let shouldStop = false;
    
    setGrid(currentGrid => {
      const nextGrid = getNextGeneration(currentGrid);
      
      // Check for static patterns
      if (gridsEqual(nextGrid, currentGrid)) {
        shouldStop = true;
        return currentGrid; // No change
      }
      
      // Check for cycles with previous grids
      const foundCycle = previousGrids.some(oldGrid => gridsEqual(nextGrid, oldGrid));
      if (foundCycle) {
        shouldStop = true;
        return currentGrid; // No change
      }
      
      // Update generation and previous grids
      setGeneration(prev => prev + 1);
      setPreviousGrids(prevPrevious => [...prevPrevious.slice(-9), currentGrid]);
      
      return nextGrid;
    });
    
    // Stop playing after state updates are complete
    if (shouldStop) {
      setTimeout(() => setIsPlaying(false), 0);
    }
  }, [previousGrids]);

  // Play/pause toggle
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Clear grid
  const handleClear = useCallback(() => {
    setIsPlaying(false);
    setGrid(createEmptyGrid(gridSize));
    setGeneration(0);
    setPreviousGrids([]);
  }, [gridSize]);

  // Random grid
  const handleRandom = useCallback(() => {
    setIsPlaying(false);
    setGrid(createRandomGrid(gridSize));
    setGeneration(0);
    setPreviousGrids([]);
  }, [gridSize]);

  // Load pattern
  const handleLoadPattern = useCallback((patternName: string) => {
    if (patternName in patterns) {
      setIsPlaying(false);
      const newGrid = loadPattern(createEmptyGrid(gridSize), patternName as keyof typeof patterns);
      setGrid(newGrid);
      setGeneration(0);
      setPreviousGrids([]);
    }
  }, [gridSize]);

  // Random curated pattern
  const handleRandomPattern = useCallback(() => {
    setIsPlaying(false);
    const randomPatternName = getRandomMainPattern();
    const newGrid = loadPattern(createEmptyGrid(gridSize), randomPatternName as keyof typeof patterns);
    setGrid(newGrid);
    setGeneration(0);
    setPreviousGrids([]);
    
    // Show pattern name in toast
    toast(`Loaded: ${randomPatternName}`, {
      duration: 2000,
      style: {
        background: '#fefefe',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        color: '#000',
        fontSize: '12px',
        fontWeight: '400',
      },
    });
  }, [gridSize]);



  // Game loop effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(step, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, step]);

  // Reset grid when size changes
  useEffect(() => {
    setGrid(createEmptyGrid(gridSize));
    setGeneration(0);
    setPreviousGrids([]);
  }, [gridSize]);

  return (
    <div 
      className="min-h-screen" 
      style={{
        background: 'radial-gradient(ellipse at top, #f8f6f0 0%, #f0ede6 40%, #e8e5df 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Paper texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-black" style={{ fontWeight: 300 }}>
              Conway's Game of Life
            </h1>
            <motion.p 
              className="text-base md:text-lg text-black/60 max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A tribute to John Conway's famous cellular automaton.<br />
              Click cells to toggle them, then press play to watch evolution unfold according to simple rules.
            </motion.p>
          </div>
        </motion.header>

        {/* Rules Section */}
        <motion.section 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-8">
            <h2 className="text-2xl text-black mb-6" style={{ fontWeight: 400 }}>
              The Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
              {/* Rule 1: Underpopulation */}
              <div className="space-y-4">
                <div className="flex justify-center items-center mb-3">
                  {/* Mini grid showing live cell with 0-1 neighbors */}
                  <div className="grid grid-cols-3 gap-0.5 mr-3">
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                  </div>
                  <span className="text-black/40 mx-2">→</span>
                  <div className="w-6 h-6 border-2 border-black/20 rounded-full ml-3"></div>
                </div>
                <p className="text-black/70 leading-relaxed text-sm">
                  Any live cell with <strong>fewer than two</strong> live neighbors dies, as if by underpopulation.
                </p>
              </div>
              
              {/* Rule 2: Survival */}
              <div className="space-y-4">
                <div className="flex justify-center items-center mb-3">
                  {/* Mini grid showing live cell with 2-3 neighbors */}
                  <div className="grid grid-cols-3 gap-0.5 mr-3">
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                  </div>
                  <span className="text-black/40 mx-2">→</span>
                  <div className="w-6 h-6 bg-black rounded-full opacity-80 ml-3"></div>
                </div>
                <p className="text-black/70 leading-relaxed text-sm">
                  Any live cell with <strong>two or three</strong> live neighbors lives on to the next generation.
                </p>
              </div>
              
              {/* Rule 3: Overpopulation */}
              <div className="space-y-4">
                <div className="flex justify-center items-center mb-3">
                  {/* Mini grid showing live cell with 4+ neighbors */}
                  <div className="grid grid-cols-3 gap-0.5 mr-3">
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                  </div>
                  <span className="text-black/40 mx-2">→</span>
                  <div className="w-6 h-6 border-2 border-black/20 rounded-full ml-3"></div>
                </div>
                <p className="text-black/70 leading-relaxed text-sm">
                  Any live cell with <strong>more than three</strong> live neighbors dies, as if by overpopulation.
                </p>
              </div>
              
              {/* Rule 4: Reproduction */}
              <div className="space-y-4">
                <div className="flex justify-center items-center mb-3">
                  {/* Mini grid showing dead cell with exactly 3 neighbors */}
                  <div className="grid grid-cols-3 gap-0.5 mr-3">
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 rounded-sm"></div>
                    <div className="w-3 h-3 border-2 border-black/30 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                    <div className="w-3 h-3 border border-black/10 rounded-sm"></div>
                  </div>
                  <span className="text-black/40 mx-2">→</span>
                  <div className="w-6 h-6 bg-black rounded-full opacity-80 ml-3"></div>
                </div>
                <p className="text-black/70 leading-relaxed text-sm">
                  Any dead cell with <strong>exactly three</strong> live neighbors becomes a live cell, as if by reproduction.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bento Box Layout */}
        <div className="grid gap-6 max-w-7xl mx-auto relative">
          {/* Connection lines */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {/* Horizontal connection from grid to controls */}
            <div 
              className="absolute h-0.5 bg-gradient-to-r from-black/10 via-black/20 to-black/10"
              style={{
                top: '50%',
                left: '67%',
                width: '2%',
                transform: 'translateY(-50%)',
              }}
            ></div>
            
            {/* Vertical connection from controls to stats */}
            <div 
              className="absolute w-0.5 bg-gradient-to-b from-black/10 via-black/20 to-black/10"
              style={{
                top: '45%',
                right: '16%',
                height: '10%',
              }}
            ></div>
            
            {/* Circuit-style corner connections */}
            <div 
              className="absolute w-3 h-3 border-l-2 border-b-2 border-black/15"
              style={{
                top: '48%',
                right: '16.5%',
                borderRadius: '0 0 0 4px',
              }}
            ></div>
          </div>
          
          {/* Main Row - Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] relative">
            {/* Game Grid - Large compartment */}
            <motion.div
              className="lg:col-span-8 flex flex-col items-center justify-center relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              {/* Connection points */}
              <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-gray-300 opacity-60 hidden lg:block"></div>
              <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-gray-300 opacity-60 hidden lg:block"></div>
              {/* Grid container with full height matching controls */}
              <div 
                className="w-full h-full flex items-center justify-center rounded-3xl relative overflow-visible"
                style={{
                  background: `
                    linear-gradient(135deg, #fefefe 0%, #fafafa 100%),
                    radial-gradient(circle at 25% 25%, rgba(0,0,0,0.008) 0%, transparent 70%),
                    radial-gradient(circle at 75% 75%, rgba(0,0,0,0.008) 0%, transparent 70%)
                  `,
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: `
                    0 20px 60px rgba(0, 0, 0, 0.04),
                    0 8px 20px rgba(0, 0, 0, 0.02),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.02)
                  `,
                  minHeight: '600px',
                }}
              >
                {/* Grid Module Header */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  <span className="text-xs text-black/70 uppercase tracking-wider" style={{ fontSize: '10px' }}>
                    Grid Matrix
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                </div>
                {/* Paper texture */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.01]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='2'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                  }}
                />
                
                <GameGrid 
                  grid={grid} 
                  onCellClick={handleCellClick}
                  gridSize={gridSize}
                  isPlaying={isPlaying}
                  onGridSizeChange={handleGridSizeChange}
                />
              </div>
            </motion.div>

            {/* Right Column - Controls and Stats */}
            <div className="lg:col-span-4 grid grid-rows-1 lg:grid-rows-[1fr_auto] gap-6">
              {/* Controls - Upper compartment */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <GameControls
                  isPlaying={isPlaying}
                  speed={speed}
                  onPlayPause={handlePlayPause}
                  onStep={step}
                  onClear={handleClear}
                  onRandom={handleRandom}
                  onRandomPattern={handleRandomPattern}
                  onSpeedChange={setSpeed}
                  onLoadPattern={handleLoadPattern}
                />
              </motion.div>

              {/* Stats - Lower compartment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <GameStats 
                  generation={generation} 
                  population={population} 
                  isPlaying={isPlaying}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Attribution Footer */}
        <motion.footer 
          className="mt-20 pt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="text-xs text-black/50 flex items-center justify-center gap-1">
            Made with <span className="text-red-500">❤️</span> by <a href="https://github.com/EyalIv" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors underline decoration-black/20 hover:decoration-black/50">Eyal Ivri</a>
          </div>
        </motion.footer>
      </div>

      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}