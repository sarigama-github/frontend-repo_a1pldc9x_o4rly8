import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/1VHYoewWfi45VYZ5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        >
          RentHub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl"
        >
          Find, rent, and manage properties with a single beautiful experience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a href="#browse" className="px-5 py-3 rounded-full bg-white text-gray-900 font-semibold shadow/30 shadow-lg">
            Browse Rooms
          </a>
          <a href="#list" className="px-5 py-3 rounded-full bg-black/60 backdrop-blur text-white font-semibold border border-white/20">
            List Your Property
          </a>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/0" />
    </section>
  )
}
