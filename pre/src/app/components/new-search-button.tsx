import { Sparkles } from "lucide-react";
import { useState, MouseEvent } from "react";

interface NewSearchButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  size?: "default" | "large";
}

export function NewSearchButton({ onClick, children, size = "default" }: NewSearchButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);

    onClick();
  };

  const sizeClasses = size === "large" 
    ? "px-8 py-4 text-base" 
    : "px-6 py-3 text-sm";

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden bg-primary text-primary-foreground ${sizeClasses} rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_24px_rgba(250,204,21,0.4)] hover:scale-[1.02] active:scale-[0.98] group`}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-[ripple_0.6s_ease-out]"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative flex items-center gap-2">
        <Sparkles className={`${size === "large" ? "w-5 h-5" : "w-4 h-4"} group-hover:rotate-12 transition-transform duration-300`} />
        {children}
      </span>
    </button>
  );
}
