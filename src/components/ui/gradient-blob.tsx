import { motion } from "framer-motion";

export function GradientBlob() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary blob */}
      <motion.div
        className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(210, 100%, 50%) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary blob */}
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(260, 80%, 60%) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Accent blob */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(200, 80%, 55%) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
