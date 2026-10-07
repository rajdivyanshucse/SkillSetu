import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const ResetPasswordPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!password) {
      errs.password = 'This field is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'This field is required.';
    } else if (password !== confirmPassword) {
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
      setIsSuccess(true);
      addToast({
        title: 'Password Updated',
        message: 'Your account credentials have been updated securely.',
        type: 'success',
      });
    }, 800);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
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
                  Password updated successfully
                </h2>
                <p className="text-body-sm text-charcoal-600 leading-relaxed">
                  Your new password is active. You can now sign in to your SkillSetu account.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate('/login')}
                  className="w-full justify-center"
                >
                  Sign In With New Password
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
              className="space-y-4"
            >
              <AuthHeader
                badge="Credential Update"
                title="Create a new password"
                subtitle="Ensure your new password meets the security requirements below."
              />

              <div className="space-y-1">
                <PasswordInput
                  label="New Password"
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
                <PasswordStrength password={password} />
              </div>

              <PasswordInput
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
                Update Password
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
