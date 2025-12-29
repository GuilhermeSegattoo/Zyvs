'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#funcionalidades', label: 'Features' },
    { href: '#planos', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white brutal-border-b' : 'bg-white/90'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo - brutal style */}
          <Link href="/">
            <motion.div
              whileHover={{ x: 2, y: -2 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-12 h-12 bg-black flex items-center justify-center brutal-border brutal-shadow-sm">
                <span className="text-[#00ff88] font-extrabold text-2xl">T</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tighter">
                THUMDRA
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ x: 2, y: -2 }}
                  className="px-5 py-2 font-bold uppercase text-sm tracking-wide hover:bg-gray-100 transition-colors"
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <motion.button
                whileHover={{ x: 2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-white brutal-border brutal-shadow-sm font-bold uppercase text-sm tracking-wide hover:bg-gray-50 transition-colors"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/cadastro">
              <motion.button
                whileHover={{ x: 4, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-[#00ff88] brutal-border-thick brutal-shadow font-extrabold uppercase text-sm tracking-wide hover:bg-[#00ff88]/90 transition-colors"
              >
                Começar Grátis
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 brutal-border brutal-shadow-sm bg-white hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white brutal-border-t"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 brutal-border brutal-shadow-sm font-bold uppercase text-sm hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Link href="/login">
                  <button className="w-full py-3 brutal-border brutal-shadow-sm font-bold uppercase text-sm">
                    Login
                  </button>
                </Link>
                <Link href="/cadastro">
                  <button className="w-full py-3 bg-[#00ff88] brutal-border-thick brutal-shadow font-extrabold uppercase text-sm">
                    Começar Grátis
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
