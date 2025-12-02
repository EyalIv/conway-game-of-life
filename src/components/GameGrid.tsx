import { motion } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';

interface GameGridProps {
  grid: boolean[][];
  onCellClick: (row: number, col: number) => void;
  gridSize: { width: number; height: number };
  isPlaying: boolean;
  onGridSizeChange?: (newSize: { width: number; height: number }) => void;
}

export function GameGrid({ grid, onCellClick, gridSize, isPlaying, onGridSizeChange }: GameGridProps) {
  const [circleSize, setCircleSize] = useState(16);
  const [gap, setGap] = useState(4);
  const [actualGridSize, setActualGridSize] = useState({ width: 15, height: 15 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'paint' | 'erase'>('paint');
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate optimal grid dimensions and circle size based on container
  const calculateOptimalGrid = () => {
    if (!gridRef.current) {
      return { circleSize: 16, gridSize: { width: 15, height: 15 }, gap: 4 };
    }
    
    const container = gridRef.current.parentElement;
    if (!container) return { circleSize: 16, gridSize: { width: 15, height: 15 }, gap: 4 };
    
    const containerRect = container.getBoundingClientRect();
    // Create offset from the box edges (40px total margin)
    const availableWidth = containerRect.width - 80;
    const availableHeight = containerRect.height - 80;
    
    const minGap = 2;
    const maxGap = 6;
    
    // Try different grid configurations to find the best fit
    let bestConfig = { circleSize: 16, gridSize: { width: 15, height: 15 }, gap: 4 };
    let bestFillRatio = 0;
    
    // Test grid sizes from 10x10 to 20x20
    for (let cols = 10; cols <= 20; cols++) {
      for (let rows = 10; rows <= 20; rows++) {
        for (let testGap = minGap; testGap <= maxGap; testGap++) {
          // Calculate circle size that would fit this configuration
          const maxCircleSizeWidth = (availableWidth - (cols - 1) * testGap) / cols;
          const maxCircleSizeHeight = (availableHeight - (rows - 1) * testGap) / rows;
          const testCircleSize = Math.min(maxCircleSizeWidth, maxCircleSizeHeight);
          
          // Ensure reasonable circle size limits
          if (testCircleSize >= 8 && testCircleSize <= 40) {
            // Calculate how well this fills the space
            const totalWidth = cols * testCircleSize + (cols - 1) * testGap;
            const totalHeight = rows * testCircleSize + (rows - 1) * testGap;
            const fillRatio = (totalWidth * totalHeight) / (availableWidth * availableHeight);
            
            // Prefer configurations that fill space better
            if (fillRatio > bestFillRatio) {
              bestFillRatio = fillRatio;
              bestConfig = {
                circleSize: Math.floor(testCircleSize),
                gridSize: { width: cols, height: rows },
                gap: testGap
              };
            }
          }
        }
      }
    }
    
    return bestConfig;
  };

  // Get cell coordinates from mouse position
  const getCellFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!gridRef.current) return null;
    
    // Get the inner grid container (the one with display: grid)
    const gridContainer = gridRef.current.querySelector('[style*="display: grid"]') as HTMLElement;
    if (!gridContainer) return null;
    
    const rect = gridContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (x < 0 || y < 0) return null;
    
    const actualGap = Math.max(1, gap);
    const col = Math.floor(x / (circleSize + actualGap));
    const row = Math.floor(y / (circleSize + actualGap));
    
    if (row >= 0 && row < actualGridSize.height && col >= 0 && col < actualGridSize.width) {
      return { row, col };
    }
    
    return null;
  }, [circleSize, gap, actualGridSize]);

  // Handle mouse down on grid
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPlaying) return;
    
    const cell = getCellFromPosition(e.clientX, e.clientY);
    if (!cell) return;
    
    setIsDragging(true);
    // Determine drag mode based on the clicked cell's current state
    setDragMode(grid[cell.row][cell.col] ? 'erase' : 'paint');
    onCellClick(cell.row, cell.col);
  }, [isPlaying, getCellFromPosition, grid, onCellClick]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isPlaying) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const cell = getCellFromPosition(touch.clientX, touch.clientY);
    if (!cell) return;
    
    setIsDragging(true);
    setDragMode(grid[cell.row][cell.col] ? 'erase' : 'paint');
    onCellClick(cell.row, cell.col);
  }, [isPlaying, getCellFromPosition, grid, onCellClick]);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isPlaying) return;
    
    const cell = getCellFromPosition(e.clientX, e.clientY);
    if (!cell) return;
    
    const currentCellState = grid[cell.row][cell.col];
    const shouldToggle = 
      (dragMode === 'paint' && !currentCellState) || 
      (dragMode === 'erase' && currentCellState);
    
    if (shouldToggle) {
      onCellClick(cell.row, cell.col);
    }
  }, [isDragging, isPlaying, getCellFromPosition, grid, dragMode, onCellClick]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isPlaying) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const cell = getCellFromPosition(touch.clientX, touch.clientY);
    if (!cell) return;
    
    const currentCellState = grid[cell.row][cell.col];
    const shouldToggle = 
      (dragMode === 'paint' && !currentCellState) || 
      (dragMode === 'erase' && currentCellState);
    
    if (shouldToggle) {
      onCellClick(cell.row, cell.col);
    }
  }, [isDragging, isPlaying, getCellFromPosition, grid, dragMode, onCellClick]);

  // Handle mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Update grid configuration on mount and when container size changes
  useEffect(() => {
    const updateGridConfig = () => {
      const config = calculateOptimalGrid();
      setCircleSize(config.circleSize);
      setGap(config.gap);
      const newGridSize = config.gridSize;
      
      // Only update if the grid size actually changed
      if (newGridSize.width !== actualGridSize.width || newGridSize.height !== actualGridSize.height) {
        setActualGridSize(newGridSize);
        // Notify parent component about the new grid size
        if (onGridSizeChange) {
          onGridSizeChange(newGridSize);
        }
      }
    };

    // Use a timeout to ensure container has rendered
    const timeoutId = setTimeout(updateGridConfig, 100);
    
    const handleResize = () => updateGridConfig();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [actualGridSize, onGridSizeChange]);

  // Global mouse up handler to stop dragging even if mouse leaves grid
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);
  
  // Create a responsive grid with ferrofluid neighbor analysis
  const displayGrid = (() => {
    const newGrid = Array(actualGridSize.height).fill(null).map(() => 
      Array(actualGridSize.width).fill(false)
    );
    
    // Copy existing grid data to the new grid (centered if size changed)
    const rowOffset = Math.max(0, Math.floor((actualGridSize.height - grid.length) / 2));
    const colOffset = Math.max(0, Math.floor((actualGridSize.width - (grid[0]?.length || 0)) / 2));
    
    for (let r = 0; r < Math.min(grid.length, actualGridSize.height); r++) {
      for (let c = 0; c < Math.min(grid[r]?.length || 0, actualGridSize.width); c++) {
        if (grid[r] && grid[r][c] !== undefined) {
          const newRow = r + rowOffset;
          const newCol = c + colOffset;
          if (newRow < actualGridSize.height && newCol < actualGridSize.width) {
            newGrid[newRow][newCol] = grid[r][c];
          }
        }
      }
    }
    
    return newGrid;
  })();

  // Calculate neighbor count for mathematical clarity
  const getNeighborInfo = (row: number, col: number) => {
    let liveNeighbors = 0;
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < displayGrid.length && 
            newCol >= 0 && newCol < displayGrid[0].length) {
          if (displayGrid[newRow][newCol]) liveNeighbors++;
        }
      }
    }
    
    return { liveNeighbors };
  };

  return (
    <div 
      ref={gridRef}
      className="select-none relative w-full h-full flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        cursor: isPlaying ? 'default' : (isDragging ? (dragMode === 'paint' ? 'crosshair' : 'not-allowed') : 'pointer'),
        padding: '40px', // Create the offset from the box
      }}
    >
      <div
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${actualGridSize.width}, ${circleSize}px)`,
          gridTemplateRows: `repeat(${actualGridSize.height}, ${circleSize}px)`,
          gap: `${Math.max(1, gap)}px`,
          maxWidth: 'fit-content',
        }}
      >
        {displayGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const { liveNeighbors } = getNeighborInfo(rowIndex, colIndex);
            // Design-focused visual hints based on Conway's rules
            const hasOptimalNeighbors = liveNeighbors === 2 || liveNeighbors === 3;
            const willReproduce = !cell && liveNeighbors === 3;
            const willDie = cell && (liveNeighbors < 2 || liveNeighbors > 3);
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className="border-0 focus:outline-none relative rounded-full overflow-hidden"
                style={{
                  width: circleSize,
                  height: circleSize,
                  // Clean, mathematical state representation
                  background: cell 
                    ? `radial-gradient(circle at 30% 30%, #1a1a1a 0%, #000000 80%)`
                    : `radial-gradient(circle at 30% 30%, #ffffff 0%, #f8f8f8 100%)`,
                  boxShadow: cell
                    ? `
                      0 ${circleSize * 0.15}px ${circleSize * 0.3}px rgba(0, 0, 0, 0.2),
                      inset 0 ${circleSize * 0.06}px ${circleSize * 0.12}px rgba(255, 255, 255, 0.1),
                      inset 0 -${circleSize * 0.06}px ${circleSize * 0.12}px rgba(0, 0, 0, 0.3)
                    `
                    : `
                      0 ${circleSize * 0.08}px ${circleSize * 0.16}px rgba(0, 0, 0, 0.06),
                      inset 0 ${circleSize * 0.06}px ${circleSize * 0.12}px rgba(255, 255, 255, 0.9),
                      inset 0 -${circleSize * 0.06}px ${circleSize * 0.12}px rgba(0, 0, 0, 0.04)
                    `,
                  border: cell 
                    ? '1px solid rgba(0, 0, 0, 0.7)' 
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  // Subtle visual hints for Conway's rules
                  ...(willReproduce && {
                    boxShadow: `
                      0 ${circleSize * 0.08}px ${circleSize * 0.16}px rgba(0, 0, 0, 0.06),
                      inset 0 ${circleSize * 0.06}px ${circleSize * 0.12}px rgba(255, 255, 255, 0.9),
                      inset 0 -${circleSize * 0.06}px ${circleSize * 0.12}px rgba(0, 0, 0, 0.04),
                      0 0 0 1px rgba(34, 197, 94, 0.3)
                    `
                  }),
                  ...(willDie && {
                    boxShadow: `
                      0 ${circleSize * 0.15}px ${circleSize * 0.3}px rgba(0, 0, 0, 0.2),
                      inset 0 ${circleSize * 0.06}px ${circleSize * 0.12}px rgba(255, 255, 255, 0.1),
                      inset 0 -${circleSize * 0.06}px ${circleSize * 0.12}px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(239, 68, 68, 0.3)
                    `
                  }),
                }}
                initial={false}
                // Clean, purposeful animations
                animate={{
                  scale: cell ? 1 : 0.88,
                  opacity: cell ? 1 : 0.9,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1], // Clean easing for mathematical precision
                }}
                onMouseDown={(e) => e.preventDefault()}
                whileHover={{ 
                  scale: cell ? 1.05 : 0.95,
                  opacity: 1,
                  transition: { 
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                whileTap={{ 
                  scale: cell ? 0.95 : 0.85,
                  transition: { 
                    duration: 0.1,
                    ease: "easeOut"
                  }
                }}
              >
                {/* Clean highlight for mathematical clarity */}
                <div 
                  className="absolute top-2 left-2 rounded-full pointer-events-none"
                  style={{
                    width: `${circleSize * 0.4}px`,
                    height: `${circleSize * 0.4}px`,
                    background: cell 
                      ? 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 60%, transparent 80%)'
                      : 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.4) 60%, transparent 80%)',
                    opacity: cell ? 0.8 : 0.7,
                  }}
                />
                
                {/* Mathematical rule visualization - subtle neighbor count hint */}
                {!isPlaying && liveNeighbors > 0 && (
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, 
                        ${cell 
                          ? hasOptimalNeighbors 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)'
                          : willReproduce 
                            ? 'rgba(34, 197, 94, 0.15)' 
                            : 'rgba(0, 0, 0, 0.05)'
                        } 0%, 
                        transparent 70%)`,
                      opacity: 0.6,
                    }}
                  />
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}