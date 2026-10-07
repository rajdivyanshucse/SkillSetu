import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const ForgotPasswordPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('This field is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      addToast({
        title: 'Reset Link Dispatched',
        message: 'Password reset instructions have been sent.',
        type: 'info',
      });
    }, 700);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center sm:text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto sm:mx-0 shadow-subtle">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
                  Check your inbox
                </h2>
                <p className="text-body-sm text-charcoal-600 leading-relaxed">
                  We've sent a secure password reset link to <span className="font-semibold text-charcoal-900">{email}</span>.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/reset-password')}
                  className="w-full justify-center"
                >
                  Continue to Reset Screen (Demo)
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/login')}
                  className="w-full justify-center"
                >
                  Back to Sign In
                </Button>
              </div>
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
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shadow-subtle">
                <KeyRound className="w-6 h-6" />
              </div>

              <AuthHeader
                badge="Security Recovery"
                title="Reset your password"
                subtitle="Enter your email address and we'll send you a link to choose a new password."
              />

              <Input
                label="Registered Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                error={error}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center mt-2"
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-charcoal-500 hover:text-brand-700 inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
