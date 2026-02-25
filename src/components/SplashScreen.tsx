import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SpiralAnimation } from '@/components/ui/spiral-animation'

interface SplashScreenProps {
  onEnter: () => void
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Fade in content after spiral loads
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => {
      onEnter()
    }, 800)
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Spiral Animation Background */}
          <SpiralAnimation />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  {/* Logo/Brand Name */}
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                  >
                    {/* Glow effect behind text */}
                    <div className="absolute inset-0 blur-3xl opacity-60 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full scale-150" />
                    
                    <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                        Bhorx.ai
                      </span>
                    </h1>
                  </motion.div>

                  {/* Tagline */}
                  <motion.p
                    className="text-white/60 text-lg md:text-xl tracking-widest uppercase font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    The Future of Longevity
                  </motion.p>

                  {/* Enter Button */}
                  <motion.button
                    onClick={handleEnter}
                    className="mt-8 relative group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Button glow */}
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                    
                    <span className="relative px-8 py-3 text-white/80 text-lg tracking-[0.3em] uppercase font-light border border-white/20 rounded-full backdrop-blur-sm hover:border-white/40 hover:text-white transition-all duration-300 block">
                      Enter
                    </span>
                  </motion.button>

                  {/* Subtle pulsing indicator */}
                  <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                  >
                    <motion.div
                      className="w-1 h-8 rounded-full bg-gradient-to-b from-white/40 to-transparent"
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scaleY: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
