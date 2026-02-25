import { motion } from "framer-motion";

interface PulsingRingsProps {
  className?: string;
}

export function PulsingRings({ className }: PulsingRingsProps) {
  return (
    <div className={className}>
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{
              scale: [0.8, 1.5, 2],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 1,
              ease: "easeOut",
            }}
          />
        ))}
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-primary"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Orbital dots */}
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={`orbital-${index}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-3px",
              marginLeft: "-3px",
            }}
            animate={{
              x: [
                Math.cos((index * Math.PI) / 2) * 30,
                Math.cos((index * Math.PI) / 2 + Math.PI) * 30,
                Math.cos((index * Math.PI) / 2 + Math.PI * 2) * 30,
              ],
              y: [
                Math.sin((index * Math.PI) / 2) * 30,
                Math.sin((index * Math.PI) / 2 + Math.PI) * 30,
                Math.sin((index * Math.PI) / 2 + Math.PI * 2) * 30,
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
