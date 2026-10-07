import React, { useState } from 'react';
import { HelpCircle, MessageSquare, AlertCircle, Mail, Phone, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import FaqAccordion from '../../components/settings/FaqAccordion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

export const SupportPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactCategory, setContactCategory] = useState('Calibration Question');
  const [contactMessage, setContactMessage] = useState('');

  const handleSendSupportMessage = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) {
      addToast({
        title: 'Message required',
        message: 'Please provide a short explanation for support.',
        type: 'warning',
      });
      return;
    }

    setShowContactModal(false);
    setContactSubject('');
    setContactMessage('');
    addToast({
      title: 'Support Inquiry Logged (Simulated)',
      message: 'Your request has been routed to prototype customer support telemetry.',
      type: 'success',
    });
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/support">
      <div className="space-y-8">
        <SettingsHeader
          title="Help & Support Center"
          subtitle="Search knowledge base articles, understand skill calculation formulas, or connect with our support desk."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
          actions={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowContactModal(true)}
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Contact Support
            </Button>
          }
        />

        {/* Support Options Banner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-surface border-surface-border space-y-2 hover:border-brand-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-charcoal-900">Direct Support</h4>
              <p className="text-caption text-charcoal-500 mt-0.5">
                Dispatch an inquiry ticket for calibration assistance.
              </p>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              Open Ticket <ExternalLink className="w-3 h-3" />
            </button>
          </Card>

          <Card className="p-4 bg-surface border-surface-border space-y-2 hover:border-brand-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-charcoal-900">Give Feedback</h4>
              <p className="text-caption text-charcoal-500 mt-0.5">
                Share suggestions, usability notes, or feature requests.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/settings/feedback')}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              Leave Note <ExternalLink className="w-3 h-3" />
            </button>
          </Card>

          <Card className="p-4 bg-surface border-surface-border space-y-2 hover:border-brand-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-charcoal-900">Report an Issue</h4>
              <p className="text-caption text-charcoal-500 mt-0.5">
                Flag unexpected formula output or visual rendering bugs.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/settings/feedback')}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              Report Bug <ExternalLink className="w-3 h-3" />
            </button>
          </Card>
        </div>

        {/* Searchable FAQ Accordion */}
        <div className="space-y-4">
          <div className="border-b border-surface-border pb-3">
            <h3 className="text-body-md font-bold text-charcoal-900 font-serif">
              Frequently Asked Questions
            </h3>
            <p className="text-body-sm text-charcoal-500 mt-0.5">
              Detailed answers regarding calculations, formulas, and platform governance.
            </p>
          </div>

          <FaqAccordion />
        </div>

        {/* Contact Support Modal */}
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          size="md"
          title="Contact SkillSetu Support (Simulated)"
        >
          <form onSubmit={handleSendSupportMessage} className="space-y-4">
            <p className="text-caption text-charcoal-500">
              Submit a support ticket. In this prototype, inquiries are logged in local session telemetry.
            </p>

            <Input
              label="Subject"
              placeholder="e.g. Skill gap calculation question"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Inquiry Topic
              </label>
              <Select
                value={contactCategory}
                onChange={(e) => setContactCategory(e.target.value)}
                options={[
                  'Calibration Question',
                  'Career Roadmap Guidance',
                  'Learning Path Issue',
                  'Opportunity Matching Help',
                  'Privacy & Account Controls',
                  'Other Technical Support',
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Description of Issue or Question
              </label>
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your question or difficulty..."
                className="w-full p-3 rounded-md bg-surface text-charcoal-900 border border-surface-border text-body-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowContactModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                <Send className="w-3.5 h-3.5 mr-1" />
                Dispatch Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </SettingsLayout>
  );
};

export default SupportPage;
