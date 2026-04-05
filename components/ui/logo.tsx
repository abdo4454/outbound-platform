import { cn } from "@/lib/utils";

interface LogoProps {
  dark?: boolean; // true = dark text (scrolled/light bg), false = white text (hero/dark bg)
  className?: string;
}

export function Logo({ dark = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon />
      <span
        className={cn(
          "font-display font-bold text-xl tracking-tight transition-colors",
          dark ? "text-midnight-900" : "text-white"
        )}
      >
        Accelerated{" "}
        <span className={cn(dark ? "text-brand-600" : "text-brand-300")}>
          Growth
        </span>
      </span>
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="logoIconGrad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1333e1" />
          <stop offset="100%" stopColor="#3366ff" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="32" height="32" rx="7" fill="url(#logoIconGrad)" />
      {/* Growth line chart — subtle glow layer */}
      <polyline
        points="5,22 11,15 17,18 25,8"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Growth line chart — crisp layer */}
      <polyline
        points="5,22 11,15 17,18 25,8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Peak dot */}
      <circle cx="25" cy="8" r="2.5" fill="white" />
      {/* Arrow tick */}
      <polyline
        points="21,7.5 25,8 24,12"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
