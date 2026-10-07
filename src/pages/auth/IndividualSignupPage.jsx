import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Briefcase, GraduationCap } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { Button } from '../../components/ui/Button';
import { AuthDivider } from '../../components/auth/AuthDivider';
import { SocialAuthButton } from '../../components/auth/SocialAuthButton';
import { useToast } from '../../components/ui/Toast';

export const IndividualSignupPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentRole: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'This field is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'This field is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'This field is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'This field is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords don't match.";
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
      // Save mock registered email & account type to sessionStorage if available
      try {
        sessionStorage.setItem('skillsetu_registered_email', formData.email);
        sessionStorage.setItem('skillsetu_account_type', 'individual');
      } catch (err) {}

      addToast({
        title: 'Account Registered',
        message: 'Verification email sent. Please verify your address.',
        type: 'success',
      });
      navigate('/verify-email');
    }, 800);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          badge="Individual Account"
          title="Create your individual account"
          subtitle="Begin mapping your verified competencies and exploring target role fit."
        />

        <SocialAuthButton
          provider="google"
          label="Sign up with Google"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              navigate('/verify-email');
            }, 600);
          }}
          disabled={isLoading}
        />

        <AuthDivider text="OR WITH EMAIL" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Maya Chen"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: null });
            }}
            error={errors.fullName}
            required
            disabled={isLoading}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@domain.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <Input
            label="Current Role or Field of Study (Optional)"
            placeholder="e.g. Software Engineer / CS Student"
            value={formData.currentRole}
            onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
            disabled={isLoading}
            hint="Helps calibrate your initial skill ontology baseline"
          />

          <div className="space-y-1">
            <PasswordInput
              label="Create Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              required
              disabled={isLoading}
            />
            <PasswordStrength password={formData.password} />
          </div>

          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
            }}
            error={errors.confirmPassword}
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
            Create Account
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-600 pt-2 gap-2">
          <Link
            href="/signup/organization"
            className="text-charcoal-500 hover:text-brand-700 underline"
          >
            Registering as an Organization?
          </Link>
          <div>
            <span>Already registered? </span>
            <Link
              href="/login"
              className="font-bold text-brand-700 hover:text-brand-900 underline ml-0.5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default IndividualSignupPage;
