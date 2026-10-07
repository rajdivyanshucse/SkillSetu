import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Mail, Users, Globe } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const OrganizationSignupPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    orgName: '',
    workEmail: '',
    industry: 'technology',
    orgSize: '51-200',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.orgName.trim()) {
      errs.orgName = 'This field is required.';
    }

    if (!formData.workEmail.trim()) {
      errs.workEmail = 'This field is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.workEmail)) {
      errs.workEmail = 'Enter a valid work email address.';
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
      try {
        sessionStorage.setItem('skillsetu_registered_email', formData.workEmail);
        sessionStorage.setItem('skillsetu_account_type', 'organization');
      } catch (err) {}

      addToast({
        title: 'Organization Workspace Created',
        message: 'Verification email dispatched to your work address.',
        type: 'success',
      });
      navigate('/verify-email');
    }, 850);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          badge="Enterprise Workforce"
          title="Set up your organization"
          subtitle="Empower your HR, recruiting, and engineering leadership with real-time capability telemetry."
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Organization Name"
            placeholder="e.g. Acme Global Systems"
            value={formData.orgName}
            onChange={(e) => {
              setFormData({ ...formData, orgName: e.target.value });
              if (errors.orgName) setErrors({ ...errors, orgName: null });
            }}
            error={errors.orgName}
            required
            disabled={isLoading}
          />

          <Input
            label="Work Email Address"
            type="email"
            placeholder="director.talent@company.com"
            value={formData.workEmail}
            onChange={(e) => {
              setFormData({ ...formData, workEmail: e.target.value });
              if (errors.workEmail) setErrors({ ...errors, workEmail: null });
            }}
            error={errors.workEmail}
            hint="Please use your corporate email domain"
            required
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              disabled={isLoading}
              options={[
                { value: 'technology', label: 'Technology & Software' },
                { value: 'fintech', label: 'Financial Services & Banking' },
                { value: 'healthcare', label: 'Healthcare & Life Sciences' },
                { value: 'manufacturing', label: 'Advanced Manufacturing' },
                { value: 'telecom', label: 'Telecom & Cloud Infra' },
                { value: 'other', label: 'Other Enterprise Domain' },
              ]}
            />

            <Select
              label="Organization Size"
              value={formData.orgSize}
              onChange={(e) => setFormData({ ...formData, orgSize: e.target.value })}
              disabled={isLoading}
              options={[
                { value: '1-10', label: '1–10 employees' },
                { value: '11-50', label: '11–50 employees' },
                { value: '51-200', label: '51–200 employees' },
                { value: '201-500', label: '201–500 employees' },
                { value: '500+', label: '500+ employees' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <PasswordInput
              label="Admin Password"
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
            label="Confirm Admin Password"
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
            Create Organization Account
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-600 pt-2 gap-2">
          <Link
            href="/signup/individual"
            className="text-charcoal-500 hover:text-brand-700 underline"
          >
            Looking for Individual Account?
          </Link>
          <div>
            <span>Already have an account? </span>
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

export default OrganizationSignupPage;
