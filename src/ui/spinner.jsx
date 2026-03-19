import { cn } from "../lib/utils";

function Spinner({ className, ...props }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative h-5 w-5 animate-spin", className)}
      {...props}
    >
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-[20%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded bg-current opacity-80"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-150%)`,
            opacity: 1 - i * 0.12,
          }}
        />
      ))}
    </div>
  );
}

export { Spinner };