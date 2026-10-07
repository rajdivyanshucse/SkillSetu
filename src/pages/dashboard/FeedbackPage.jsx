import React from 'react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import FeedbackForm from '../../components/settings/FeedbackForm';

export const FeedbackPage = () => {
  return (
    <SettingsLayout activeRoute="/dashboard/settings/feedback">
      <div className="space-y-6">
        <SettingsHeader
          title="Feedback & Suggestions"
          subtitle="Help us improve SkillSetu. Your observations on formulas, usability, and features directly inform future calibration phases."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        <div className="max-w-2xl">
          <FeedbackForm />
        </div>
      </div>
    </SettingsLayout>
  );
};

export default FeedbackPage;
