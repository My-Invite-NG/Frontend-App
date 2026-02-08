"use client";

import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && triggerRef.current) {
        // Simple positioning logic (centered bottom)
        // For a more robust solution, use floating-ui or similar
    }
  }, [isVisible]);


  return (
    <div 
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        ref={triggerRef}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 mb-2 text-xs text-white bg-slate-900 rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap dark:bg-slate-700">
           
           {/* Triangle/Arrow */}
           <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
           
           {content}
        </div>
      )}
    </div>
  );
}
