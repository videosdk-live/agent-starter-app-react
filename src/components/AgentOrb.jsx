import React from 'react';
import { Spinner } from '../ui/spinner';
import { WaveformIcon } from './icons/WaveformIcon';

export const AgentOrb = ({ 
  isActive, 
  showLoader, 
  onTalkToAgent, 
  onEndAgent, 
  status, 
  sampleGif 
}) => {
  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: '297px', height: '297px' }}
      onDoubleClick={onEndAgent}
    >
      {/* Subtle glow behind the GIF */}
      <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] rounded-full point-events-none"></div>

      {/* GIF & Blurring */}
      <div className={`absolute inset-0 z-10 transition-all duration-300 ${isActive || status === "Disconnected" ? 'blur-md opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
        <img 
          src={sampleGif} 
          alt="Agent" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Independent Loader Overlay for Exactly 3 Seconds */}
      {showLoader && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Spinner className="w-[24px] h-[24px] text-white/80" />
        </div>
      )}

      {/* Talk to agent button overlay */}
      {!status && !showLoader && (
        <button 
          onClick={onTalkToAgent}
          className="absolute z-30 flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-sm font-medium text-gray-800 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
        >
          <WaveformIcon />
          Talk to agent
        </button>
      )}
    </div>
  );
};
