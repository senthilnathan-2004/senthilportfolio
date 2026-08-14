"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface InfiniteCarouselProps {
  items: React.ReactNode[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
  itemClassName?: string;
  pauseOnHover?: boolean;
}

export default function InfiniteCarousel({ 
  items, 
  direction = "left",
  speed = "normal",
  className,
  itemClassName,
  pauseOnHover = true
}: InfiniteCarouselProps) {
  
  const speedClass = {
    fast: "animate-[marquee_10s_linear_infinite]",
    normal: "animate-[marquee_20s_linear_infinite]",
    slow: "animate-[marquee_30s_linear_infinite]"
  }[speed];

  const dirClass = direction === "right" ? "reverse" : "normal";

  // Double the items to create the seamless loop effect
  const displayItems = [...items, ...items, ...items];

  return (
    <div className={cn("group relative w-full overflow-hidden flex whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}>
      <div 
        className={cn(
          "flex w-max items-center justify-center gap-8", 
          speedClass,
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ animationDirection: dirClass }}
      >
        {displayItems.map((item, i) => (
          <div key={i} className={cn("flex items-center gap-8", itemClassName)}>
            {item}
            <span className="text-green-accent/30 text-xs font-mono">{"//"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
