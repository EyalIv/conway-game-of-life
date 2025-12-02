import { Play, Pause, SkipForward, RotateCcw, Shuffle, Download, Grid3x3 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCallback, useState } from 'react';

interface GameControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onStep: () => void;
  onClear: () => void;
  onRandom: () => void;
  onRandomPattern: () => void;
  onSpeedChange: (speed: number) => void;
  onLoadPattern: (pattern: string) => void;
}

export function GameControls({
  isPlaying,
  speed,
  onPlayPause,
  onStep,
  onClear,
  onRandom,
  onRandomPattern,
  onSpeedChange,
  onLoadPattern,
}: GameControlsProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const patterns = [
    { name: 'Glider', value: 'glider' },
    { name: 'Beacon', value: 'beacon' },
    { name: 'Toad', value: 'toad' },
    { name: 'Pulsar', value: 'pulsar' },
    { name: 'Gosper Gun', value: 'gosper' },
  ];

  // Convert speed to angle for circular dial (50-1000ms -> 0-270 degrees)
  const speedToAngle = (speed: number) => {
    const normalized = (speed - 50) / (1000 - 50);
    return normalized * 270;
  };

  // Handle circular dial interaction
  const handleKnobInteraction = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = angle + 90; // Adjust so 0° is at top
    
    if (angle < 0) angle += 360;
    if (angle > 270) angle = 270;
    
    const normalized = angle / 270;
    const newSpeed = Math.round(50 + normalized * (1000 - 50));
    const clampedSpeed = Math.max(50, Math.min(1000, newSpeed));
    
    onSpeedChange(clampedSpeed);
  }, [onSpeedChange]);

  return (
    <div className="h-full flex flex-col">
      {/* Primary Controls Card */}
      <div 
        className="p-8 rounded-3xl relative overflow-hidden flex-1 flex flex-col justify-center"
        style={{
          background: `
            linear-gradient(135deg, #fefefe 0%, #fafafa 100%),
            radial-gradient(circle at 20% 20%, rgba(0,0,0,0.01) 0%, transparent 70%)
          `,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: `
            0 20px 60px rgba(0, 0, 0, 0.04),
            0 8px 20px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.02)
          `,
        }}
      >
        {/* Connection points */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gray-300 opacity-60"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gray-300 opacity-60"></div>
        <div className="space-y-8">
          {/* Module Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="w-1 h-1 rounded-full bg-green-400"></div>
              <h3 className="text-sm text-black/70 uppercase tracking-wider" style={{ fontWeight: 400, fontSize: '11px' }}>
                Control Module
              </h3>
              <div className="w-1 h-1 rounded-full bg-green-400"></div>
            </div>

          </div>

          {/* Status Indicators Row */}
          <div className="flex items-center justify-center gap-6">
            {/* Play Status LED */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border-2 transition-all duration-300"
                style={{
                  backgroundColor: isPlaying ? '#ffcc00' : 'transparent',
                  borderColor: isPlaying ? '#ffcc00' : '#cccccc',
                  boxShadow: isPlaying ? '0 0 8px rgba(255, 204, 0, 0.4)' : 'none',
                }}
              ></div>
              <span className="text-xs text-black/60 tracking-wide" style={{ fontSize: '9px' }}>PLAY</span>
            </div>

            {/* Step Status LED */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border-2 transition-all duration-150"
                style={{
                  backgroundColor: (!isPlaying && isDragging) ? '#00ccff' : 'transparent',
                  borderColor: '#cccccc',
                  boxShadow: (!isPlaying && isDragging) ? '0 0 8px rgba(0, 204, 255, 0.4)' : 'none',
                }}
              ></div>
              <span className="text-xs text-black/60 tracking-wide" style={{ fontSize: '9px' }}>STEP</span>
            </div>

            {/* Active Status LED */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: '#00ff88',
                  borderColor: '#cccccc',
                  boxShadow: '0 0 8px rgba(0, 255, 136, 0.3)',
                }}
              ></div>
              <span className="text-xs text-black/60 tracking-wide" style={{ fontSize: '9px' }}>PWR</span>
            </div>
          </div>
          
          {/* Primary action buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onPlayPause}
              size="lg"
              className="flex items-center gap-3 px-8 py-4 text-base relative group"
              style={{
                background: isPlaying 
                  ? 'linear-gradient(135deg, #2c2c2c 0%, #000000 100%)'
                  : 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                border: '2px solid rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                boxShadow: `
                  0 8px 20px rgba(0, 0, 0, 0.15),
                  0 4px 8px rgba(0, 0, 0, 0.1),
                  inset 0 2px 0 rgba(255, 255, 255, 0.1),
                  inset 0 -2px 0 rgba(0, 0, 0, 0.2)
                `,
              }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </Button>
            
            <Button
              onClick={onStep}
              variant="outline"
              size="lg"
              disabled={isPlaying}
              className="flex items-center gap-3 px-6 py-4 text-base"
              style={{
                background: 'linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%)',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                color: isPlaying ? '#999999' : '#000000',
                boxShadow: isPlaying 
                  ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  : `
                    0 4px 12px rgba(0, 0, 0, 0.06),
                    0 2px 4px rgba(0, 0, 0, 0.04),
                    inset 0 2px 0 rgba(255, 255, 255, 0.8),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.05)
                  `,
              }}
            >
              <SkipForward className="w-5 h-5" />
              STEP
            </Button>
          </div>

          {/* Secondary controls */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onRandomPattern}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: 'linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                color: '#666666',
                boxShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <Grid3x3 className="w-4 h-4" />
              PATTERN
            </Button>
            
            <Button
              onClick={onRandom}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: 'linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                color: '#666666',
                boxShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <Shuffle className="w-4 h-4" />
              RANDOM
            </Button>
            
            <Button
              onClick={onClear}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: 'linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                color: '#666666',
                boxShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <RotateCcw className="w-4 h-4" />
              CLEAR
            </Button>
          </div>
        </div>
        
        {/* Paper texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='4'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Settings Card */}
      <div 
        className="p-6 rounded-3xl relative overflow-hidden mt-6"
        style={{
          background: `
            linear-gradient(135deg, #fefefe 0%, #fafafa 100%),
            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.01) 0%, transparent 70%)
          `,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: `
            0 20px 60px rgba(0, 0, 0, 0.04),
            0 8px 20px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.02)
          `,
        }}
      >
        {/* Connection points */}
        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gray-300 opacity-60"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gray-300 opacity-60"></div>
        
        <div className="space-y-8">
          {/* Module Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
              <h3 className="text-sm text-black/70 uppercase tracking-wider" style={{ fontWeight: 400, fontSize: '11px' }}>
                Parameter Module
              </h3>
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
            </div>

          </div>
          
          {/* Speed Control - Circular Dial */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <label className="block text-black/80 text-xs uppercase tracking-wider" style={{ fontSize: '10px' }}>
                TEMPO
              </label>
              <div className="text-black/90 text-sm tracking-wider" style={{ fontFamily: 'monospace' }}>
                {speed}ms
              </div>
            </div>
            
            {/* Hardware Slider */}
            <div className="px-2">
              <div className="relative">
                {/* Slider track */}
                <div 
                  className="h-2 rounded-full relative"
                  style={{
                    background: 'linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Progress fill */}
                  <div 
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${((speed - 50) / (1000 - 50)) * 100}%`,
                      background: 'linear-gradient(135deg, #666666 0%, #333333 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                  ></div>
                </div>
                
                {/* Slider input */}
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {/* Scale marks */}
                <div className="flex justify-between mt-2 px-1">
                  {['FAST', '', '', 'SLOW'].map((label, i) => (
                    <div key={i} className="text-xs text-black/40 tracking-wider" style={{ fontSize: '8px' }}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>



          {/* Pattern Presets */}

        </div>
        
        {/* Paper texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='5'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  );
}