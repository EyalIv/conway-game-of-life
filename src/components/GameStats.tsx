import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';

interface GameStatsProps {
  generation: number;
  population: number;
  isPlaying: boolean;
}

export function GameStats({ generation, population, isPlaying }: GameStatsProps) {
  return (
    <div 
      className="p-6 rounded-2xl relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #fefefe 0%, #fafafa 100%),
          radial-gradient(circle at 30% 30%, rgba(0,0,0,0.008) 0%, transparent 70%)
        `,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: `
          0 8px 24px rgba(0, 0, 0, 0.03),
          0 2px 6px rgba(0, 0, 0, 0.02),
          inset 0 1px 0 rgba(255, 255, 255, 0.7)
        `,
      }}
    >
      {/* Connection points */}
      <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gray-300 opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gray-300 opacity-60"></div>
      
      {/* Module Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-1 h-1 rounded-full bg-red-400"></div>
          <h3 className="text-sm text-black/70 uppercase tracking-wider" style={{ fontWeight: 400, fontSize: '11px' }}>
            Monitor Module
          </h3>
          <div className="w-1 h-1 rounded-full bg-red-400"></div>
        </div>

      </div>
      
      {/* Digital Display Style */}
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-xs tracking-wider text-black/60 uppercase mb-3" style={{ fontSize: '9px' }}>
            GENERATION
          </div>
          <div 
            className="bg-black/5 rounded-lg p-3 border border-black/10"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            }}
          >
            <motion.div 
              className="text-2xl text-black tabular-nums"
              style={{ 
                fontWeight: 400,
                fontFamily: 'monospace',
              }}
              animate={{ 
                scale: isPlaying ? [1, 1.02, 1] : 1,
                opacity: isPlaying ? [1, 0.9, 1] : 1
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {generation.toLocaleString().padStart(3, '0')}
            </motion.div>
          </div>
        </div>
        
        <div className="text-center relative">
          <div className="text-xs tracking-wider text-black/60 uppercase mb-3" style={{ fontSize: '9px' }}>
            POPULATION
          </div>
          <div 
            className="bg-black/5 rounded-lg p-3 border border-black/10 relative"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            }}
          >
            <motion.div 
              className="text-2xl tabular-nums"
              style={{ 
                fontWeight: 400,
                fontFamily: 'monospace',
                color: population > 0 ? '#000000' : '#999999'
              }}
              animate={{ 
                scale: isPlaying ? [1, 1.02, 1] : 1,
                opacity: isPlaying ? [1, 0.9, 1] : 1,
                color: population > 0 ? '#000000' : '#999999'
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {population.toLocaleString().padStart(3, '0')}
            </motion.div>
            
            {/* Activity LED */}
            {isPlaying && (
              <motion.div 
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#ff4444',
                  boxShadow: '0 0 6px rgba(255, 68, 68, 0.4)',
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle paper texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.01]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='4'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}