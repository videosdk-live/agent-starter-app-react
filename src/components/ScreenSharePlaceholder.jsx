import React from "react";
import { MonitorOff } from "lucide-react";

const ScreenSharePlaceholder = ({ onStopSharing }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-card rounded-tile border border-white/5">
      <div className="flex flex-col items-center gap-6">
        <span className="text-white text-[18px] font-medium opacity-90">
          You're sharing your screen with everyone
        </span>

        <button
          onClick={onStopSharing}
          className="flex items-center gap-2 bg-card hover:bg-card-alt text-white px-4 py-2 rounded-lg border border-white/20 transition-all duration-200 shadow-lg pointer-events-auto"
        >
          <MonitorOff className="w-5 h-5 text-white" />
          <span className="text-[14px]">Stop Sharing</span>
        </button>
      </div>
    </div>
  );
};

export default ScreenSharePlaceholder;
