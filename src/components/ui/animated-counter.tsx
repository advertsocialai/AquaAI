import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 2000, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!isInView) return;
    
    // Extract numeric part and suffix (like K, M, +, %)
    const numericMatch = value.match(/^([\d.]+)/);
    const suffixMatch = value.match(/[^\d.]+$/);
    
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }
    
    const targetNum = parseFloat(numericMatch[1]);
    const suffix = suffixMatch ? suffixMatch[0] : "";
    const isDecimal = value.includes(".");
    const decimalPlaces = isDecimal ? (value.split(".")[1]?.match(/\d+/)?.[0]?.length || 1) : 0;
    
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (targetNum - startValue) * easeOutQuart;
      
      if (isDecimal) {
        setDisplayValue(currentValue.toFixed(decimalPlaces) + suffix);
      } else {
        setDisplayValue(Math.floor(currentValue).toLocaleString() + suffix);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);
  
  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
