import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, AlertCircle, Building2, Send, ExternalLink, ShieldCheck } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import FaqAccordion from '../../components/settings/FaqAccordion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

export const OrganizationSupportPage = () => {
  const { addToast } = useToast();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactTopic, setContactTopic] = useState('Workforce Scenario Modeling');
  const [contactMessage, setContactMessage] = useState('');

  const handleSendSupportMessage = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) {
      addToast({
        title: 'Message required',
        message: 'Please provide details regarding your inquiry.',
        type: 'warning',
      });
      return;
    }

    setShowContactModal(false);
    setContactSubject('');
    setContactMessage('');
    addToast({
      title: 'Enterprise Inquiry Logged (Simulated)',
      message: 'Your organization inquiry has been routed to enterprise success telemetry.',
      type: 'success',
    });
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-8">
        <SettingsHeader
          title="Organization Help & Enterprise Support"
          subtitle="Explore documentation on workforce planning algorithms, talent matching matrices, and connect with our enterprise advisory desk."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
          actions={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowContactModal(true)}
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Contact Enterprise Support
            </Button>
          }
        />

        {/* Support Options Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-surface border-surface-border space-y-2 hover:border-brand-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-charcoal-900">Enterprise Advisory</h4>
              <p className="text-caption text-charcoal-500 mt-0.5">
                Guidance on multi-year workforce capacity modeling.
              </p>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              Contact Advisory <ExternalLink className="w-3 h-3" />
            </button>
          </Card>

          <Card className="p-4 bg-surface border-surface-border space-y-2 hover:border-brand-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-charcoal-900">Workforce Feedback</h4>
              <p className="text-caption text-charcoal-500 mt-0.5">
                Share suggestions on planning formulas and cohort tools.
              </p>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              Submit Note <ExternalLink className="w-3 h-3" />
            </button>
          </Card>

          <Card className="p-4 bg-surface border-surface-border space-y-2 hover:border-brand-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-charcoal-900">Report Issue</h4>
              <p className="text-caption text-charcoal-500 mt-0.5">
                Flag discrepancies in capacity deficit calculations.
              </p>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              Report Discrepancy <ExternalLink className="w-3 h-3" />
            </button>
          </Card>
        </div>

        {/* Searchable FAQ Accordion */}
        <div className="space-y-4">
          <div className="border-b border-surface-border pb-3">
            <h3 className="text-body-md font-bold text-charcoal-900 font-serif">
              Enterprise Knowledge Base
            </h3>
            <p className="text-body-sm text-charcoal-500 mt-0.5">
              Methodology explanations for capability gap modeling, candidate compatibility scoring, and cohort tracking.
            </p>
          </div>

          <FaqAccordion />
        </div>

        {/* Contact Support Modal */}
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          size="md"
          title="Contact Enterprise Support (Simulated)"
        >
          <form onSubmit={handleSendSupportMessage} className="space-y-4">
            <p className="text-caption text-charcoal-500">
              Submit an enterprise support or advisory ticket. Inquiries are logged in prototype session memory.
            </p>

            <Input
              label="Subject"
              placeholder="e.g. Planning scenario headcount adjustment question"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Enterprise Topic
              </label>
              <Select
                value={contactTopic}
                onChange={(e) => setContactTopic(e.target.value)}
                options={[
                  'Workforce Scenario Modeling',
                  'Talent Discovery & Compatibility',
                  'Learning Cohort Management',
                  'Compensation Context Shift',
                  'Account & Member Governance',
                  'Other Enterprise Question',
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Details & Description
              </label>
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your organization's inquiry in detail..."
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

export default OrganizationSupportPage;
