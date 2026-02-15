'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, scale, scalePoint } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Download,
  Zap,
  Palette,
  Github,
  Mail,
  Play,
  ChevronDown,
  Layers,
  Crop,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export default function Portfolio() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/50 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="mb-10 inline-block"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 backdrop-blur-md shadow-lg shadow-indigo-500/5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-medium tracking-wide text-indigo-700 uppercase">
                Next-Gen Wall Art Studio
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Elevate Your Space
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              With Precision
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform sophisticated imagery into gallery-grade multi-panel masterpieces. Intelligent
            splitting, seamless layouts, and print-ready exports defined by precision.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/upload">
              <motion.button
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg cursor-pointer overflow-hidden shadow-[0_0_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_0_60px_-15px_rgba(15,23,42,0.5)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  start creating
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
                The Art of <br />
                <span className="text-indigo-600">Deconstruction</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We believe that a single image can tell a grander story when given space to breathe.
                Our platform isn't just a tool; it's a creative studio that empowers you to
                reimagine your photography as immersive architectural elements.
              </p>
              <ul className="space-y-4">
                {[
                  'Gallery-quality resolution retention',
                  'AI-assisted composition analysis',
                  'Calibrated for professional printing',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="relative cursor-pointer"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 border border-slate-200 backdrop-blur-sm p-8 relative">
                <div className="absolute inset-0 bg-grid-slate-900/[0.02]" />
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-slate-200/50 rounded-lg animate-pulse" />
                  <div className="grid grid-rows-2 gap-4">
                    <div className="bg-slate-200/30 rounded-lg" />
                    <div className="bg-slate-200/30 rounded-lg" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50/20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Designed for Perfectionists</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A suite of professional tools crafted to give you absolute control over your wall art.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Layers className="w-6 h-6" />,
                title: 'Smart Segmentation',
                desc: 'Intelligent algorithms that respect focal points and image composition while splitting.',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI Layout Engine',
                desc: 'Generative layout suggestions based on the unique geometry of your image.',
              },
              {
                icon: <Crop className="w-6 h-6" />,
                title: 'Precision Cropping',
                desc: 'Lossless cropping and resizing to ensure every panel is print-perfect.',
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: 'Visualizer Mode',
                desc: 'Preview your split artwork in realistic 3D room environments before exporting.',
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: 'Production Ready',
                desc: 'Export high-fidelity PDFs with bleed lines and cut marks for professional printers.',
              },
              {
                icon: <Share2 className="w-6 h-6" />,
                title: 'Cloud Sync',
                desc: 'Save your projects and access your designs from any device, anywhere.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="group p-8 rounded-2xl cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 transition-colors duration-300 shadow-sm hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Gallery */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex justify-between items-end mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Community Curations</h2>
              <p className="text-slate-600">Inspiring layouts created by our users.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
              View All Gallery <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            {[
              'bg-gradient-to-b from-slate-200 to-slate-300',
              'bg-gradient-to-tr from-indigo-200 to-slate-300',
              'bg-gradient-to-br from-purple-200 to-slate-200',
              'bg-gradient-to-tl from-slate-300 to-slate-200',
            ].map((bg, i) => (
              <motion.div
                key={i}
                className={`relative cursor-pointer rounded-xl overflow-hidden ${bg} ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-slate-900 font-medium text-lg">Composition {i + 1}</h4>
                  <p className="text-slate-600 text-sm">Fine Art Series</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-xl font-bold tracking-tight text-slate-900">ImageSplit Studio</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Redefining the boundaries of digital imagery and physical space.
              </p>
            </div>

            <div className="flex gap-8">
              {['Product', 'Company', 'Legal'].map((col, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">
                    {col}
                  </h4>
                  {['Features', 'Pricing', 'About'].map((link, j) => (
                    <a
                      key={j}
                      href="#"
                      className="text-slate-500 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2024 ImageSplit Studio. All rights reserved.</p>
            <div className="flex gap-6">
              <Github className="w-5 h-5 hover:text-slate-900 transition-colors cursor-pointer" />
              <Mail className="w-5 h-5 hover:text-slate-900 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
