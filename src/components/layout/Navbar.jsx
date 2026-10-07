import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { currentPath, navigate } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { label: 'Intelligence', href: '/intelligence' },
    { label: 'Demo Mode', href: '/demo' },
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <header
      className={`
        sticky top-0 z-40 w-full transition-all duration-200 select-none
        ${isScrolled
          ? 'bg-surface/92 backdrop-blur-md border-b border-surface-border shadow-subtle py-3'
          : 'bg-canvas/80 backdrop-blur-sm border-b border-transparent py-4'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: SkillSetu Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle group-hover:bg-brand-600 transition-colors">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-body-md font-bold text-charcoal-900 tracking-tight leading-none">
              SkillSetu
            </span>
            <span className="text-[10px] font-medium text-brand-700 tracking-wider uppercase mt-0.5">
              Workforce Intelligence
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 bg-surface-muted/60 p-1 rounded-pill border border-surface-border/80">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-3.5 py-1.5 text-xs font-medium rounded-pill transition-all duration-150
                  ${isActive
                    ? 'text-charcoal-900 font-semibold bg-surface shadow-subtle border border-surface-border'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-surface/50 border border-transparent'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/design-system"
            className="text-[11px] font-mono text-charcoal-500 hover:text-brand-700 px-2 py-1 rounded-xs bg-canvas-subtle border border-surface-border transition-colors flex items-center gap-1"
          >
            <span>DS v1.0</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile: Hamburger toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-subtle rounded-sm transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-surface border-b border-surface-border overflow-hidden px-4 py-5 shadow-modal"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      px-3 py-2.5 rounded-sm text-body-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-brand-50 text-brand-800 font-semibold border border-brand-200/60'
                        : 'text-charcoal-700 hover:bg-canvas-subtle hover:text-charcoal-900'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/design-system"
                className="px-3 py-2 rounded-sm text-xs font-mono text-charcoal-500 hover:bg-canvas-subtle flex items-center justify-between"
              >
                <span>Design System Showcase</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
