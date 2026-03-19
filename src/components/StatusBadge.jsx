import React from 'react';
import { STATUS_CONFIGS } from '../constants/status';


export const StatusBadge = ({
  status,
  wrapperClassName = "absolute top-[50px] left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center justify-center",
}) => {
  if (!status) return null;
  const config = STATUS_CONFIGS[status];
  if (!config) return null;

  return (
    <div className={wrapperClassName}>
      <div
        className="flex items-center justify-center rounded-[12px] whitespace-nowrap"
        style={{
          width: `${config.w}px`,
          height: `${config.h}px`,
          gap: '4px',
          padding: '2px 6px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          color: config.color,
          fontSize: '11px',
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: config.color,
            borderRadius: '50%',
          }}
        />
        {config.text}
      </div>
    </div>
  );
};
