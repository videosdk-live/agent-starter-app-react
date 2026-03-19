import React from "react";

const Waveform = ({ isOn }) => {
  return (
    <div className="flex items-end gap-[2px] h-[10px] w-full justify-center">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-[3px] bg-white rounded-full transition-all duration-300 ${
            isOn ? "animate-waveform" : "h-[2px]"
          }`}
          style={{
            animationDelay: `${i * 0.15}s`,
            height: isOn ? `${Math.random() * 8 + 2}px` : "2px",
          }}
        />
      ))}
      <style>{`
        @keyframes waveform {
          0%, 100% { height: 4px; }
          50% { height: 10px; }
        }
        .animate-waveform {
          animation: waveform 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Waveform;
