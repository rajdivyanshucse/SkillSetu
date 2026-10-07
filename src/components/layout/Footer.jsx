import React from 'react';
import { GraduationCap, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { Link } from '../../router/Router';

export const Footer = () => {
  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Design System', href: '/design-system' },
    ],
    individuals: [
      { label: 'Career Intelligence', href: '/features#individuals' },
      { label: 'Skill Gap Analysis', href: '/features#individuals' },
      { label: 'Predictive Roadmaps', href: '/features#individuals' },
      { label: 'Internal Opportunities', href: '/features#individuals' },
    ],
    organizations: [
      { label: 'Workforce Intelligence', href: '/features#organizations' },
      { label: 'Talent Matching', href: '/features#organizations' },
      { label: 'Workforce Planning', href: '/features#organizations' },
      { label: 'Compensation Telemetry', href: '/features#organizations' },
    ],
    company: [
      { label: 'About SkillSetu', href: '/about' },
      { label: 'Methodology & Principles', href: '/about#principles' },
      { label: 'Contact & Inquiries', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/about' },
      { label: 'Terms of Service', href: '/about' },
      { label: 'Responsible AI & Data', href: '/about' },
    ],
  };

  return (
    <footer className="bg-surface border-t border-surface-border select-none mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Col (2 cols wide on desktop) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-body-md font-bold text-charcoal-900 tracking-tight">
                SkillSetu
              </span>
            </Link>
            <p className="text-body-sm text-charcoal-500 max-w-sm leading-relaxed">
              Intelligent workforce and career intelligence platform connecting industry demand with human capabilities.
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-600 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Continuous Telemetry Engine Active</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Individuals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
              Individuals
            </h4>
            <ul className="space-y-2">
              {footerLinks.individuals.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
              Organizations
            </h4>
            <ul className="space-y-2">
              {footerLinks.organizations.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <div className="flex items-center gap-4">
            <span>© 2026 SkillSetu. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Built with Human-Centered Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            {footerLinks.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-charcoal-700 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
