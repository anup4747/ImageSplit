'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export default function UploadPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
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
              className="group flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full px-4 py-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Upload Image</h1>
                <p className="text-xs text-gray-400">Step 1 of 4</p>
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
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Upload Your Image</span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Choose Your Image
              </motion.h2>

              <motion.p
                className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
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
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border-2 border-dashed border-white/20 hover:border-white/40 transition-all duration-300 p-12 text-center">
                      <motion.div
                        className="mb-8"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ImageIcon className="w-12 h-12 text-blue-400" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold mb-4 text-white">Drop your image here</h3>
                      <p className="text-gray-400 mb-8 max-w-md mx-auto">
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
                    className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/20 p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Image Selected</h3>
                        <p className="text-gray-400 text-sm">
                          {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <motion.button
                        onClick={handleRemoveImage}
                        className="p-2 bg-red-500/20 cursor-pointer hover:bg-red-500/30 rounded-full transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4 text-red-400" />
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
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">File Type</p>
                            <p className="text-white font-medium">
                              {selectedFile.type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Dimensions</p>
                            <p className="text-white font-medium">Auto-detected</p>
                          </div>
                        </div>

                        <motion.button
                          onClick={handleContinue}
                          className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-blue-500/25"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Continue to Split
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Tips Section */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 cursor-pointer"
              variants={itemVariants}
            >
              {[
                {
                  icon: <ImageIcon className="w-6 h-6" />,
                  title: 'High Resolution',
                  description: 'Use images at least 2000px wide for crisp wall art prints',
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: 'Quality Matters',
                  description: 'Choose well-lit, high-contrast images for best splitting results',
                },
                {
                  icon: <Upload className="w-6 h-6" />,
                  title: 'Supported Formats',
                  description: 'JPG, PNG, and WebP formats up to 10MB in size',
                },
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ y: -5 }}
                  variants={itemVariants}
                >
                  <div className="text-blue-400 mb-3">{tip.icon}</div>
                  <h4 className="text-lg font-semibold mb-2 text-white">{tip.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{tip.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.main>

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
