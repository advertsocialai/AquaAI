import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AtomAnimation } from '@/components/ui/atom-animation'

interface SplashScreenProps {
  onEnter: () => void
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => onEnter(), 800)
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <AtomAnimation />

          {/* Centered BohrX over nucleus */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            {/* Radial vignette behind text */}
            <div
              className="absolute w-[280px] h-[280px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
              }}
            />
            <AnimatePresence>
              {showContent && (
                <motion.h1
                  className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight relative"
                  style={{
                    color: 'white',
                    textShadow: '0 0 80px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,1)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  Bohr<span className="font-black italic">X</span>
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          {/* Enter button at very bottom */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                className="absolute bottom-8 left-0 right-0 flex justify-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <motion.button
                  onClick={handleEnter}
                  className="px-10 py-2.5 text-xs tracking-[0.3em] uppercase font-light border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-300 pointer-events-auto"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enter
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
