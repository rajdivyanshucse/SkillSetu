import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { AuthDivider } from '../../components/auth/AuthDivider';
import { SocialAuthButton } from '../../components/auth/SocialAuthButton';
import { useToast } from '../../components/ui/Toast';

export const LoginPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'This field is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!password) {
      errs.password = 'This field is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: 'Authentication Successful',
        message: 'Welcome back to SkillSetu Intelligence OS.',
        type: 'success',
      });
      navigate('/dashboard');
    }, 800);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: 'Google Account Connected',
        message: 'Signed in via Google Workspace.',
        type: 'success',
      });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          badge="Secure Account Entry"
          title="Welcome back"
          subtitle="Continue your SkillSetu career & workforce intelligence journey."
        />

        <SocialAuthButton
          provider="google"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        />

        <AuthDivider text="OR" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Checkbox
              label="Remember this browser"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <Link
              href="/forgot-password"
              className="text-brand-700 hover:text-brand-900 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-charcoal-600 pt-2">
          <span>Don't have an account? </span>
          <Link
            href="/signup"
            className="font-bold text-brand-700 hover:text-brand-900 underline ml-1"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
