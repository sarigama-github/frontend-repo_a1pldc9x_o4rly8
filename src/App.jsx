import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

// Instagram embed helper (plays inline, no redirects)
function InstagramReel({ id }) {
  return (
    <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
      <iframe
        title={`Instagram Reel ${id}`}
        src={`https://www.instagram.com/reel/${id}/embed`}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  // Interest form
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: 'Plan One: ₹1500/mo' })
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1qL-8JgQc8M085DjIrHZZzsRX4AMnf7C2p-kJJTHmdHY/edit?usp=sharing'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { timestamp: new Date().toISOString(), ...form }
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      alert('Copied your details. Click “Open Interest Sheet” and paste into a new row.')
      window.open(SHEET_URL, '_blank')
    } catch (err) {
      window.open(SHEET_URL, '_blank')
    }
  }

  // 3D card tilt for hero image
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [12, -12])
  const rotateY = useTransform(x, [-50, 50], [-12, 12])
  const onMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left - rect.width / 2
    const py = e.clientY - rect.top - rect.height / 2
    x.set(px / 5)
    y.set(py / 5)
  }
  const onMouseLeave = () => {
    animate(x, 0, { type: 'spring', stiffness: 120, damping: 12 })
    animate(y, 0, { type: 'spring', stiffness: 120, damping: 12 })
  }

  const plans = [
    {
      name: 'Plan One',
      price: '₹1500/mo',
      tag: 'Daily Exercise',
      features: ['Daily guided workouts', 'Weekly progress tracking', 'Form-correction videos', 'Community support'],
      gradient: 'from-fuchsia-500/20 to-cyan-500/20',
      glow: 'from-fuchsia-400/30 to-cyan-400/30',
    },
    {
      name: 'Plan Two',
      price: '₹2000/mo',
      tag: 'Exercise + Diet Plan',
      features: ['Everything in Plan One', 'Personalized calorie target', 'Macro-balanced meal plan', 'Grocery list templates'],
      gradient: 'from-violet-500/20 to-emerald-500/20',
      glow: 'from-violet-400/30 to-emerald-400/30',
      highlight: true,
    },
    {
      name: 'Plan Three',
      price: '₹3000/mo',
      tag: 'Exercise + Diet + Weekly 1:1',
      features: ['Everything in Plan Two', 'Weekly one-on-one check-in', 'Habit coaching + accountability', 'Plateau-busting strategy calls'],
      gradient: 'from-rose-500/20 to-amber-500/20',
      glow: 'from-rose-400/30 to-amber-400/30',
    },
  ]

  // Image fallback
  const [imgSrc, setImgSrc] = useState('https://images.unsplash.com/photo-1579758682665-53f3f2d3243f?q=80&w=1600&auto=format&fit=crop')
  const fallbackImg = 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1600&auto=format&fit=crop'

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white selection:bg-white/10">
      <AnimatedBackground />

      {/* Top navigation */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-white/5 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-black to-neutral-700 dark:from-white/20 dark:to-white/5 ring-1 ring-black/10 dark:ring-white/10 grid place-items-center shadow-lg shadow-black/30">
              <span className="text-[10px] font-black tracking-widest">FG</span>
            </div>
            <span className="font-semibold tracking-wide">fatgo mantra</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#plans" className="px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5">Plans</a>
            <a href="#reviews" className="px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5">Reviews</a>
            <a href="#form" className="px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5">Join</a>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
              {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <GradientRings />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              fatgo mantra
              <span className="block text-transparent bg-clip-text bg-[conic-gradient(from_180deg_at_50%_50%,#fff_0deg,#a78bfa_90deg,#22d3ee_180deg,#fb7185_270deg,#fff_360deg)] dark:drop-shadow-[0_1px_12px_rgba(255,255,255,0.25)] mt-2">The modern way to get lean.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Reduce fat. Build habits. Feel amazing. Choose a plan and start today — daily workouts, personalized nutrition, and weekly one‑on‑one coaching.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#plans" className="btn-primary">See Plans</a>
              <a href="#form" className="btn-ghost">Join the Program</a>
            </div>
            {/* Marquee benefits */}
            <div className="mt-10 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <span className="mx-4">• Daily 25‑min Workouts</span>
                <span className="mx-4">• Science‑based Nutrition</span>
                <span className="mx-4">• Habit Systems</span>
                <span className="mx-4">• Injury‑safe Movements</span>
                <span className="mx-4">• Sustainable Fat Loss</span>
                <span className="mx-4">• Form Checks</span>
              </div>
            </div>
          </div>

          <motion.div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ perspective: 1200 }}
            className="relative h-[420px] sm:h-[520px]">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative h-full w-full rounded-3xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/10 dark:from-white/10 dark:to-white/5" style={{ transform: 'translateZ(40px)' }} />
              <img
                src={imgSrc}
                onError={() => setImgSrc(fallbackImg)}
                alt="Fitness"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'translateZ(70px)' }}
              />
              <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-gradient-to-tr from-fuchsia-500/30 to-cyan-500/30 blur-2xl rounded-full" />
              <div className="absolute -left-10 -top-10 h-48 w-48 bg-gradient-to-tr from-rose-500/30 to-amber-500/30 blur-2xl rounded-full" />
            </motion.div>
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl font-bold">
            Choose your plan
          </motion.h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Transparent pricing — no contracts, cancel anytime.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group relative rounded-3xl p-6 ring-1 ring-white/10 bg-gradient-to-b ${p.gradient} text-white/95 overflow-hidden`}
              >
                {p.highlight && (
                  <div className="absolute top-4 right-4 text-[10px] tracking-widest px-2 py-1 rounded-full bg-white/15 ring-1 ring-white/25">POPULAR</div>
                )}
                <div className={`absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl bg-gradient-to-tr ${p.glow}`} />
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{p.price}</span>
                </div>
                <p className="mt-1 text-sm text-white/80">{p.tag}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#form" className="mt-6 inline-flex btn-glass">Get started</a>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
          {[
            { title: 'Daily Guidance', desc: 'Follow short, effective workouts with perfect pacing and recovery.' },
            { title: 'Personalized Nutrition', desc: 'Meal plans and macros fit to your lifestyle — not the other way around.' },
            { title: 'Accountability', desc: 'Stay on track with weekly reviews, habit systems, and support.' },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative rounded-2xl p-6 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-lg">
              <h4 className="text-lg font-semibold">{f.title}</h4>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews: Instagram Reels */}
      <section id="reviews" className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold">
            Real results from our community
          </motion.h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Watch these short clips — no redirects, playable right here.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['DQVTYWlkkxo','DQbcRE3EnhF','DQgcWvrCEAI','DQ0aEhHEnng'].map(id => (
              <InstagramReel key={id} id={id} />
            ))}
          </div>
        </div>
      </section>

      {/* Interest form */}
      <section id="form" className="relative py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold">
              Ready to transform?
            </motion.h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Fill this quick form. Your details will be copied to clipboard; then you can paste them into our Google Sheet to confirm your interest.</p>

            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="rounded-xl px-3 py-2 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">Fat‑loss systems that fit busy schedules</li>
              <li className="rounded-xl px-3 py-2 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">No extreme diets — sustainable macros</li>
              <li className="rounded-xl px-3 py-2 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">Form cues that prevent injury</li>
              <li className="rounded-xl px-3 py-2 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">Weekly momentum check‑ins</li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <a className="btn-ghost" href={SHEET_URL} target="_blank" rel="noreferrer">Open Interest Sheet</a>
            </div>
          </div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl p-6 bg-white/60 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-xl">
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="input" placeholder="Full name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} required />
              <input className="input" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} required />
              <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({ ...form, phone: e.target.value })} />
              <select className="input" value={form.plan} onChange={e=>setForm({ ...form, plan: e.target.value })}>
                <option>Plan One: ₹1500/mo</option>
                <option>Plan Two: ₹2000/mo</option>
                <option>Plan Three: ₹3000/mo</option>
              </select>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">Copy & Continue</button>
              <a className="btn-glass" href={SHEET_URL} target="_blank" rel="noreferrer">Open Interest Sheet</a>
            </div>
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">We keep it simple: no spam, no pressure — just expert guidance.</p>
          </motion.form>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-bold">FAQ</motion.h3>
          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="rounded-xl p-4 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
              <p className="font-semibold">How fast will I see results?</p>
              <p className="mt-1">Most members notice better energy and visible changes in 3–4 weeks with consistency.</p>
            </div>
            <div className="rounded-xl p-4 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
              <p className="font-semibold">Gym required?</p>
              <p className="mt-1">No — we have bodyweight and minimal‑equipment versions for home or travel.</p>
            </div>
            <div className="rounded-xl p-4 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
              <p className="font-semibold">Will I be hungry?</p>
              <p className="mt-1">We focus on satiety and protein to keep you full while dropping fat sustainably.</p>
            </div>
            <div className="rounded-xl p-4 bg-white/40 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
              <p className="font-semibold">Can I cancel?</p>
              <p className="mt-1">Yes, anytime. Plans are month‑to‑month with no lock‑ins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 border-t border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} fatgo mantra — All rights reserved.</p>
          <div className="flex items-center gap-3 text-sm">
            <a href="#plans" className="hover:underline">Plans</a>
            <a href="#reviews" className="hover:underline">Reviews</a>
            <a href="#form" className="hover:underline">Join</a>
          </div>
        </div>
      </footer>

      {/* Utility styles */}
      <style>{`
        .btn-primary { @apply inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90 active:opacity-80; }
        .btn-ghost { @apply inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold border border-black/10 text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5; }
        .btn-glass { @apply inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-white/50 text-black ring-1 ring-black/10 backdrop-blur-xl hover:bg-white/60 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15; }
        .input { @apply w-full rounded-xl px-3 py-2.5 text-sm border border-black/10 bg-white/70 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-white/20; }
        .animate-marquee { animation: marquee 18s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}

function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Soft blobs */}
      <div className="absolute -top-40 -left-40 h-[40vw] w-[40vw] min-h-[320px] min-w-[320px] rounded-full bg-gradient-to-br from-fuchsia-500/20 via-cyan-500/10 to-transparent blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[45vw] w-[45vw] min-h-[320px] min-w-[320px] rounded-full bg-gradient-to-tr from-rose-500/20 via-amber-500/10 to-transparent blur-3xl" />
      {/* Grid shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.06),transparent)] animate-pulse" />
      {/* Starfield dots */}
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
    </div>
  )
}

function GradientRings() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1200px] w-[1200px] rounded-full border border-white/10 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.06),transparent_60%,rgba(255,255,255,0.06))] animate-spin-slow" />
      <style>{`@keyframes spin-slow { from { transform: translate(-50%, -50%) rotate(0deg);} to { transform: translate(-50%, -50%) rotate(360deg);} } .animate-spin-slow { animation: spin-slow 30s linear infinite; }`}</style>
    </div>
  )
}
