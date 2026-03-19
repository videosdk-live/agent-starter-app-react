export const WaveformIcon = (props) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`text-gray-500 ${props.className || ''}`}
  >
    <rect x="1" y="6" width="2" height="4" rx="1" />
    <rect x="4.5" y="4" width="2" height="8" rx="1" />
    <rect x="8" y="2" width="2" height="12" rx="1" />
    <rect x="11.5" y="4" width="2" height="8" rx="1" />
    <rect x="15" y="6" width="2" height="4" rx="1" />
  </svg>
);
