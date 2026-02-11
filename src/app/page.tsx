'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Image,
  Download,
  Zap,
  Palette,
  Github,
  Mail,
  Play,
  Star,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export default function Portfolio() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: <Image className="w-8 h-8" />,
      title: 'Template-Based Splitting',
      description: 'Choose from curated themes like Love, Bike, Cafe, Travel, and more',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Template Generator',
      description: 'Create custom split layouts with AI prompts and your creativity',
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Custom Panel Resizing',
      description: 'Fine-tune each panel size and position for perfect wall art',
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Export Options',
      description: 'Download as ZIP of individual panels or PDF print sheets',
    },
  ];

  const steps = [
    { step: '01', title: 'Upload Image', description: 'Drop your favorite photo or artwork' },
    { step: '02', title: 'Choose Template', description: 'Pick a theme or let AI create one' },
    { step: '03', title: 'Customize', description: 'Adjust panels and preview in real-time' },
    { step: '04', title: 'Download', description: 'Get your printable wall art panels' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          style={{ y }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">AI-Powered Image Splitting</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Image Splitting
            <br />
            Wallframe
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your images into stunning multi-panel wall art. Choose from themed templates
            or let AI create custom split layouts for your perfect printable wallframe.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/upload">
              <motion.button
                className="group bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-300 shadow-2xl shadow-blue-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <motion.button
              className="group bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-300 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              View Demo
            </motion.button>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [120, 105, 120] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              What is Image Splitting Wallframe?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              A revolutionary web application that transforms single images into multi-panel wall
              art layouts. Perfect for photographers, artists, and design enthusiasts who want to
              create stunning, printable wall installations from their favorite images.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Why Choose Wallframe?</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Create professional wall art from any image</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>AI-powered custom layout generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Print-ready PDF and individual panel exports</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Real-time preview and customization</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <motion.div
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="aspect-square bg-gradient-to-br cursor-pointer from-gray-700 to-gray-800 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image className="w-8 h-8 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Powerful Features
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 cursor-pointer backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="text-center" variants={fadeInUp}>
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Gallery Showcase
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Explore stunning wall art creations from our community
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { title: 'Mountain Landscape', category: 'Nature' },
              { title: 'Urban Architecture', category: 'City' },
              { title: 'Family Moments', category: 'Personal' },
              { title: 'Sunset Vibes', category: 'Travel' },
              { title: 'Ocean Waves', category: 'Nature' },
              { title: 'Abstract Art', category: 'Creative' },
              { title: 'Pet Portraits', category: 'Personal' },
              { title: 'Street Photography', category: 'City' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 cursor-pointer"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative overflow-hidden">
                  <Image className="w-12 h-12 text-gray-500" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
                    whileHover={{ opacity :1 }}
                  >
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.category}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Create Wall Art?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Start transforming your images into beautiful multi-panel wallframes today.
            </p>
            <Link href="/upload">
              <motion.button
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-6 rounded-full font-semibold text-xl flex items-center gap-3 mx-auto transition-all duration-300 shadow-2xl shadow-blue-500/25 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Creating
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Image Splitting Wallframe</h3>
              <p className="text-gray-400">AI-powered wall art creation</p>
            </div>
            <div className="flex gap-6">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-500">
              © 2024 Image Splitting Wallframe. Built with Next.js & AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
