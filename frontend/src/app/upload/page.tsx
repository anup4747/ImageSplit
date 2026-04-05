'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Sparkles,
  X,
  ArrowRight,
  Layers,
  Download,
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { getCurrentUser } from '@/lib/user-auth';

export default function UploadPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyLogin = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/login?redirect=/upload');
        return;
      }
      setIsAuthChecked(true);
    };

    verifyLogin();
    setIsVisible(true);
  }, [router]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleContinue = () => {
    if (selectedFile) {
      // Store the file in localStorage or context for the next page
      const fileData = {
        file: selectedFile,
        previewUrl: previewUrl,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      };
      localStorage.setItem('selectedImage', JSON.stringify(fileData));
      router.push('/edit');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as any,
        stiffness: 100,
      },
    },
  };

  if (!isAuthChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-sans">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-6 shadow-sm">Checking login...</div>
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-100"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
        {/* Dynamic Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/50 blur-[120px]" />
        </div>
        {/* Header */}
        <motion.header
          className="relative z-10 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.button
              onClick={() => router.push('/')}
              className="group flex items-center gap-3 cursor-pointer bg-slate-100 border border-slate-300 backdrop-blur-md hover:bg-slate-200 rounded-full px-4 py-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium text-slate-700">Back</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Upload Image</h1>
                <p className="text-xs text-slate-500">Step 1 of 4</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          className="relative z-10 px-6 pb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto">
            {/* Title Section */}
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <motion.div
                className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 backdrop-blur-md rounded-full px-4 py-1.5 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-medium tracking-wide text-indigo-700 uppercase">
                  Upload & Preview
                </span>
              </motion.div>

              <motion.h2
                className="text-5xl md:text-7xl lg:text-7xl font-bold mb-8 tracking-tight leading-[1.1]"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Choose Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Image
                </span>
              </motion.h2>

              <motion.p
                className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light"
                variants={itemVariants}
              >
                Upload a high-quality image to transform into stunning multi-panel wall art. We
                support JPG, PNG, and WebP formats up to 10MB.
              </motion.p>
            </motion.div>

            {/* Upload Area */}
            <motion.div className="mb-12" variants={itemVariants}>
              <AnimatePresence mode="wait">
                {!selectedFile ? (
                  <motion.div
                    key="upload-area"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-slate-50 border border-slate-300 backdrop-blur-sm rounded-3xl p-12 text-center hover:border-slate-400 transition-all duration-300">
                      <motion.div
                        className="mb-8"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ImageIcon className="w-12 h-12 text-indigo-600" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold mb-4 text-slate-900">
                        Drop your image here
                      </h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Or click to browse files. We recommend images at least 2000px wide for best
                        results.
                      </p>

                      <ImageUploader onImageSelect={handleImageSelect} isLoading={false} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview-area"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-50 backdrop-blur-sm rounded-3xl border border-slate-300 p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Image Selected</h3>
                        <p className="text-slate-600 text-sm">
                          {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <motion.button
                        onClick={handleRemoveImage}
                        className="p-2 bg-red-100 cursor-pointer hover:bg-red-200 rounded-full transition-colors border border-red-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </motion.button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <motion.div className="flex-shrink-0" whileHover={{ scale: 1.02 }}>
                        <img
                          src={previewUrl!}
                          alt="Preview"
                          className="w-48 h-48 object-cover rounded-2xl shadow-2xl"
                        />
                      </motion.div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-3 border border-slate-300">
                            <p className="text-slate-600 text-xs">File Type</p>
                            <p className="text-slate-900 font-medium">
                              {selectedFile.type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-300">
                            <p className="text-slate-600 text-xs">Dimensions</p>
                            <p className="text-slate-900 font-medium">Auto-detected</p>
                          </div>
                        </div>

                        <motion.button
                          onClick={handleContinue}
                          className="w-full bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_0_60px_-15px_rgba(15,23,42,0.5)] cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Continue
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Tips Section */}
            <motion.div className="grid md:grid-cols-3 gap-6" variants={itemVariants}>
              {[
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: 'High Resolution',
                  description: 'Use images at least 2000px wide for crisp wall art prints',
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: 'Quality Matters',
                  description: 'Choose well-lit, high-contrast images for best splitting results',
                },
                {
                  icon: <Download className="w-6 h-6" />,
                  title: 'Supported Formats',
                  description: 'JPG, PNG, and WebP formats up to 10MB in size',
                },
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  className="group p-8 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors duration-300 shadow-sm hover:shadow-md"
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/10">
                    {tip.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-slate-900">{tip.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-light">{tip.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
}
