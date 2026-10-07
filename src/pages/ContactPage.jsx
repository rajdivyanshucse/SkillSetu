import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Building2, MessageSquare, CheckCircle2, Sparkles, Send, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [category, setCategory] = useState('Organization');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = ['General', 'Partnership', 'Organization', 'Feedback'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast({
        title: 'Required Fields Missing',
        message: 'Please provide your name, email, and message.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast({
        title: 'Inquiry Transmitted',
        message: 'Your message has been queued for our intelligence team.',
        type: 'success',
      });
    }, 600);
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Let's Talk Info (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl text-charcoal-900 font-extrabold tracking-tight">
              Let's Talk
            </h1>
            <p className="text-body-lg text-charcoal-600 leading-relaxed">
              Have questions about deploying SkillSetu workforce intelligence, partner integrations, or roadmap features? Reach out directly.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start gap-3.5">
              <div className="p-2 rounded-xs bg-canvas-subtle border border-surface-border text-brand-700 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-body-sm font-semibold text-charcoal-900">Enterprise Workforce Inquiries</h4>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Direct evaluation pilots for HR, Talent Acquisition & Engineering leaders.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start gap-3.5">
              <div className="p-2 rounded-xs bg-canvas-subtle border border-surface-border text-brand-700 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-body-sm font-semibold text-charcoal-900">Direct Inquiries</h4>
                <p className="text-xs font-mono text-charcoal-700 mt-0.5">
                  hello@skillsetu.intelligence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-2xl bg-surface border border-surface-border shadow-card">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-subtle">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-section-title font-bold text-charcoal-900">
                    Thank You for Reaching Out
                  </h3>
                  <p className="text-body-sm text-charcoal-600 max-w-sm leading-relaxed">
                    Your inquiry has been received. Our workforce intelligence team will review your message and reply to <span className="font-semibold text-charcoal-900">{formData.email}</span> shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', organization: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Category Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block">
                      Inquiry Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`
                            px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer select-none
                            ${category === cat
                              ? 'bg-charcoal-900 text-white font-semibold shadow-subtle'
                              : 'bg-canvas-subtle text-charcoal-600 border border-surface-border hover:bg-canvas-muted'
                            }
                          `}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      required
                      placeholder="e.g. Maya Chen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Work Email"
                      required
                      type="email"
                      placeholder="e.g. maya@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Organization / Company"
                      placeholder="e.g. Apex Global Systems"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                    <Input
                      label="Subject"
                      placeholder="e.g. Workforce Pilot Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <Textarea
                    label="How can we assist you?"
                    required
                    rows={4}
                    placeholder="Tell us about your team size, talent development goals, or specific capability requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                    className="w-full justify-center"
                  >
                    Submit Inquiry
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
