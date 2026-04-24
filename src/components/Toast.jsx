import React from 'react';
import { TriangleAlert, X } from 'lucide-react';

export const Toast = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute z-[60] flex items-start top-[50px] left-1/2 -translate-x-1/2 w-[360px] h-[70px] rounded-xl border border-error-border py-2 pr-2 pl-3 gap-3 bg-error-bg shadow-button box-border">
      <div className="flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-full bg-error-border mt-1">
        <TriangleAlert size={14} className="text-danger" strokeWidth={2.5} />
      </div>

      <div className="flex flex-col flex-1 w-[274px] gap-[2px]">
        <div className="font-semibold text-[14px] leading-[20px] text-black">
          Unable to Join Meeting
        </div>
          <div className="font-normal text-[12px] leading-[16px] text-footer">
            We couldn’t connect you to the meeting. Please check your internet connection and try again.
          </div>
      </div>

      <button
        onClick={onClose}
        className="shrink-0 flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity w-[14px] h-[14px] mt-1 bg-transparent border-none p-0"
      >
        <X size={14} className="text-black" strokeWidth={2.5} />
      </button>
    </div>
  );
};
