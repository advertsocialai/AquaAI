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

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className="flex flex-col items-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground uppercase tracking-[0.15em]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                  >
                    BOHRX.AI
                  </motion.h1>

                  <motion.p
                    className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    The Future of Longevity
                  </motion.p>

                  <motion.button
                    onClick={handleEnter}
                    className="mt-6 px-10 py-3 text-foreground/80 text-sm tracking-[0.3em] uppercase font-light border border-border hover:border-foreground/40 hover:text-foreground transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enter
                  </motion.button>

                  <motion.div
                    className="absolute bottom-16 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                  >
                    <div className="w-px h-10 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
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
