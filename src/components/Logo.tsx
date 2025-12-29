import { Scale } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-glow">
          <Scale className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="absolute -inset-1 gradient-hero rounded-xl opacity-30 blur-lg animate-pulse-glow" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Juriscope
          </span>
          <span className="text-xs font-medium text-muted-foreground -mt-0.5">
            Mastermind
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
