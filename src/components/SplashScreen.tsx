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

          <div className="absolute inset-0 flex flex-col items-center z-10">
            {/* Text content positioned above the atom */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className="flex flex-col items-center gap-4 mt-[12vh] md:mt-[15vh]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
                    style={{
                      color: 'white',
                      textShadow: '0 0 60px rgba(0,0,0,0.9), 0 4px 30px rgba(0,0,0,1)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                  >
                    Bohr<span className="font-black italic">X</span>
                  </motion.h1>

                  <motion.p
                    className="text-xs md:text-sm tracking-[0.4em] uppercase font-light"
                    style={{ color: 'rgba(255,255,255,0.5)', textShadow: '0 0 30px rgba(0,0,0,0.9)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    AI for Humanity
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enter button at bottom */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className="absolute bottom-[12vh] flex flex-col items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <motion.button
                    onClick={handleEnter}
                    className="px-12 py-3 text-sm tracking-[0.3em] uppercase font-light border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all duration-300"
                    style={{ color: 'rgba(255,255,255,0.7)', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enter
                  </motion.button>
                  <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
