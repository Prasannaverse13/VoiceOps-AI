import React from 'react';
import { AppState } from '../types';

interface OrbProps {
  state: AppState;
  isRecording: boolean;
}

const Orb: React.FC<OrbProps> = ({ state, isRecording }) => {
  const isThinking = state === AppState.THINKING;
  const isListening = state === AppState.LISTENING;
  const isResponding = state === AppState.RESPONDING;
  const isError = state === AppState.ERROR;

  // Dynamic Theme Mapping
  const getThemeColors = () => {
    if (isError) return { primary: '#ef4444', secondary: '#991b1b', glow: 'rgba(239, 68, 68, 0.5)' };
    if (isThinking) return { primary: '#22d3ee', secondary: '#0891b2', glow: 'rgba(34, 211, 238, 0.5)' };
    if (isResponding) return { primary: '#ffffff', secondary: '#22c55e', glow: 'rgba(255, 255, 255, 0.6)' };
    if (isListening) return { primary: '#7f0df2', secondary: '#a855f7', glow: 'rgba(127, 13, 242, 0.5)' };
    return { primary: '#ffffff', secondary: '#7f0df2', glow: 'rgba(255, 255, 255, 0.2)' };
  };

  const theme = getThemeColors();

  return (
    <div className="relative flex items-center justify-center w-full max-w-md aspect-square">
      {/* Dynamic Audio Waves / Visualizers - Reduced intensity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ambient Ping Rings */}
        {(isRecording || isThinking || isResponding) && (
          <>
            <div 
              className="absolute w-80 h-80 border rounded-full animate-[ping_4.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" 
              style={{ borderColor: theme.glow }}
            ></div>
            <div 
              className="absolute w-80 h-80 border rounded-full animate-[ping_4.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" 
              style={{ borderColor: theme.glow, animationDelay: '2.25s' }}
            ></div>
          </>
        )}
        
        {/* Radial Wave SVG - Subtle speed */}
        <div className={`absolute w-96 h-96 transition-all duration-1000 ${isListening || isThinking || isResponding ? 'opacity-80 scale-100' : 'opacity-10 scale-90'}`}>
          <svg viewBox="0 0 100 100" className={`w-full h-full 
            ${isThinking ? 'animate-[spin_6s_linear_infinite]' : 
              isResponding ? 'animate-[spin_15s_linear_infinite]' : 
              isListening ? 'animate-[spin_10s_linear_infinite]' : 'animate-[spin_40s_linear_infinite]'}`}>
            <defs>
              <linearGradient id="orbWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme.primary} />
                <stop offset="100%" stopColor={theme.secondary} />
              </linearGradient>
            </defs>
            {[...Array(48)].map((_, i) => (
              <rect
                key={i}
                x="49.5"
                y="2"
                width="1.2"
                height={
                  isListening ? (8 + Math.random() * 12) :
                  isThinking ? (12 + Math.random() * 6) :
                  isResponding ? (6 + Math.random() * 18) : 4
                }
                fill="url(#orbWaveGradient)"
                transform={`rotate(${i * (360/48)} 50 50)`}
                className="transition-all duration-500"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Dynamic Background Glows - Extra Blurry and Vibrant */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 blur-[120px]">
        <div className={`absolute w-72 h-72 rounded-full mix-blend-screen transition-all duration-1000 
          ${isThinking ? 'scale-110' : isResponding ? 'scale-105' : 'scale-90'}`}
          style={{ backgroundColor: theme.primary }}
        ></div>
        <div className={`absolute w-72 h-72 rounded-full mix-blend-screen animate-blob delay-1000 opacity-50`}
          style={{ backgroundColor: theme.secondary, left: '25%' }}
        ></div>
      </div>

      {/* Rotating Mechanical Rings - Slower and more subtle */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <div 
          className={`absolute w-80 h-80 border rounded-full transition-all duration-1000 
            ${isThinking ? 'border-cyan-400/20 animate-[spin_10s_linear_infinite]' : 'border-white/5 animate-[spin_30s_linear_infinite]'}`}
        ></div>
        <div 
          className={`absolute w-72 h-72 border rounded-full transition-all duration-1000 
            ${isThinking ? 'border-primary/20 animate-[spin_14s_linear_infinite_reverse]' : 'border-white/5 animate-[spin_45s_linear_infinite_reverse]'}`}
        ></div>
        
        {/* Core Multi-layered Orb */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* Main Morphing Liquid Body */}
          <div 
            className={`absolute inset-0 rounded-full filter blur-2xl opacity-60 transition-all duration-1000
              ${isThinking ? 'animate-[morph_4s_ease-in-out_infinite]' : 
                isResponding ? 'animate-[morph_8s_ease-in-out_infinite]' : 'animate-[morph_15s_ease-in-out_infinite]'}`}
            style={{ backgroundColor: theme.primary }}
          ></div>
          
          {/* Secondary Highlight Body */}
          <div 
            className={`absolute inset-6 rounded-full filter blur-lg opacity-80 mix-blend-screen transition-all duration-1000
              ${isThinking ? 'animate-[morph_6s_ease-in-out_infinite_reverse]' : 'animate-[morph_12s_ease-in-out_infinite_reverse]'}`}
            style={{ background: `linear-gradient(to top right, ${theme.secondary}, ${theme.primary}, white)` }}
          ></div>

          {/* Core Surface Glow */}
          <div className="absolute inset-12 bg-white/20 rounded-full filter blur-[2px] border border-white/20 animate-pulse"></div>
          
          {/* State Specific Center-piece */}
          <div className={`absolute w-full h-full rounded-full opacity-30 mix-blend-color-dodge transition-all duration-1000
            ${isThinking ? 'animate-pulse-glow' : isResponding ? 'animate-breathe' : 'animate-none'}`}
            style={{ backgroundColor: theme.primary }}
          ></div>
        </div>
      </div>

      {/* Center Label HUD Style */}
      <div className="absolute z-20 pointer-events-none mt-4">
         <span className={`text-[10px] font-bold uppercase tracking-[0.8em] transition-opacity duration-1000
            ${isThinking || isResponding || isListening ? 'opacity-60' : 'opacity-0'}`}
            style={{ color: theme.primary, textShadow: `0 0 10px ${theme.glow}` }}
          >
            {state}
         </span>
      </div>
    </div>
  );
};

export default Orb;