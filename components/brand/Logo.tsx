import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function FathomSwoosh({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 18L14 10"
        stroke="#00b2ea"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M10 18L18 10"
        stroke="#00b2ea"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M14 18L22 10"
        stroke="#00b2ea"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = "", size = "md", href = "/home" }: LogoProps) {
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  const content = (
    <div className={`flex items-center gap-1.5 font-bold tracking-wider text-white select-none ${className}`}>
      <span className={textSize}>FATHOM</span>
      <FathomSwoosh className={iconSize} />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
