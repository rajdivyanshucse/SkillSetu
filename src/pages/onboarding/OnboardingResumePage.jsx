import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const OnboardingResumePage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data, setResume } = useOnboarding();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSimulatedUpload = (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setResume({
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              uploadedAt: new Date().toLocaleDateString(),
            });
            addToast({
              title: 'Resume Added',
              message: `${file.name} saved to profile.`,
              type: 'success',
            });
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleSimulatedUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleSimulatedUpload(file);
  };

  const handleRemove = () => {
    setResume(null);
    setUploadProgress(0);
  };

  return (
    <OnboardingLayout stepIndex={6}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={6}
          badge="Step 06"
          title="Add your resume"
          subtitle="Your resume helps organize your existing career chronology alongside your verified skill profile."
        />

        {/* Upload Box / Success State */}
        {data.resume ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-surface border border-surface-border shadow-card space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-brand-50 border border-brand-200 text-brand-700 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-body-sm font-bold text-charcoal-900">{data.resume.name}</h4>
                  <span className="text-xs text-charcoal-500 font-mono">
                    {data.resume.size} · Uploaded {data.resume.uploadedAt}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-charcoal-400 hover:text-red-600 rounded-xs hover:bg-canvas-subtle transition-colors cursor-pointer"
                aria-label="Remove uploaded resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-md bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Resume attached to profile. You can update or replace this document anytime.</span>
            </div>
          </motion.div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center
              transition-all duration-150 cursor-pointer
              ${isDragging
                ? 'border-brand-500 bg-brand-50/60'
                : 'border-surface-border bg-surface hover:border-surface-border-strong hover:bg-canvas-subtle/40'
              }
            `}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {isUploading ? (
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-xs font-semibold text-charcoal-800">
                  <span>Uploading document...</span>
                  <span className="font-mono">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-canvas-subtle border border-surface-border flex items-center justify-center text-brand-700 shadow-subtle">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-charcoal-900">
                    <span className="text-brand-700 underline">Click to upload</span> or drag and drop your document
                  </p>
                  <p className="text-xs text-charcoal-400 mt-1 font-mono">
                    Supported formats: PDF, DOC, DOCX (up to 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Privacy Note */}
        <div className="p-3 bg-canvas-subtle rounded-md border border-surface-border flex items-start gap-2 text-xs text-charcoal-500">
          <ShieldCheck className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
          <span>
            Privacy First: Your document is stored securely in your profile sandbox and will not be shared without your explicit authorization.
          </span>
        </div>

        <OnboardingNavigation
          onBack={() => navigate('/onboarding/goals')}
          onContinue={() => navigate('/onboarding/preferences')}
          onSkip={() => navigate('/onboarding/preferences')}
          continueLabel="Save & Continue to Preferences"
          skipLabel="Skip for now"
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingResumePage;
