import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, RotateCw, ExternalLink, ArrowLeft } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const VerifyEmailPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState('maya.chen@enterprise.io');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = sessionStorage.getItem('skillsetu_registered_email');
      if (savedEmail) setEmail(savedEmail);
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(45);
    addToast({
      title: 'Verification Dispatched',
      message: `A fresh link was sent to ${email}`,
      type: 'info',
    });
  };

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addToast({
        title: 'Email Verified',
        message: 'Your identity has been authenticated successfully.',
        type: 'success',
      });
      navigate('/account-created');
    }, 750);
  };

  const formattedCountdown = `00:${countdown < 10 ? `0${countdown}` : countdown}`;

  return (
    <AuthLayout>
      <div className="space-y-6 text-center sm:text-left">
        {/* Envelope Icon */}
        <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto sm:mx-0 shadow-subtle">
          <Mail className="w-6 h-6" />
        </div>

        <AuthHeader
          badge="Email Verification Required"
          title="Check your inbox"
          subtitle="We've sent a secure authentication link to confirm your identity."
        />

        {/* Email Pill Display */}
        <div className="p-3 bg-canvas-subtle rounded-md border border-surface-border text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-body-sm font-semibold text-charcoal-900 truncate">
            {email}
          </span>
          <Link
            href="/signup"
            className="text-xs text-brand-700 hover:text-brand-900 underline shrink-0 font-medium"
          >
            Change email
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            isLoading={isVerifying}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleSimulateVerification}
            className="w-full justify-center"
          >
            Verify Link (Demo Simulator)
          </Button>

          <Button
            variant="outline"
            size="md"
            disabled={!canResend}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${!canResend ? 'opacity-40' : ''}`} />}
            onClick={handleResend}
            className="w-full justify-center text-xs"
          >
            {canResend ? 'Resend Verification Email' : `Resend in ${formattedCountdown}`}
          </Button>
        </div>

        {/* Help Note */}
        <div className="pt-4 border-t border-surface-border text-xs text-charcoal-500 space-y-1">
          <p>Can't find the email? Check your spam or corporate quarantine folders.</p>
          <p>
            Links expire in 24 hours for security.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
