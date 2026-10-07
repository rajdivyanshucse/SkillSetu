import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col antialiased selection:bg-brand-100 selection:text-brand-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex-1 w-full"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
