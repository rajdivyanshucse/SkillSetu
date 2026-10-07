import React from 'react';
import {
  User,
  Shield,
  Compass,
  Bell,
  BookOpen,
  Briefcase,
  Lock,
  Palette,
  Activity,
  HelpCircle,
  MessageSquare,
  Sliders,
  Trash2,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsCard from '../../components/settings/SettingsCard';
import PreferenceSummary from '../../components/settings/PreferenceSummary';

export const SettingsPage = () => {
  const { navigate } = useRouter();

  const settingsHubSections = [
    {
      title: 'Personal Information & Access',
      description: 'Account profile, contact details, active sessions, and credential management.',
      icon: User,
      route: '/dashboard/settings/account',
      badge: 'Account',
      items: ['Profile details & contact info', 'Active browser sessions', 'Change password simulation'],
    },
    {
      title: 'Profile Visibility & Discovery',
      description: 'Control who can discover your skills, experience, and development milestones.',
      icon: Shield,
      route: '/dashboard/settings/profile',
      badge: 'Privacy',
      items: ['Visibility levels (Private to Open)', 'Public profile preview modal', 'Granular field disclosure'],
    },
    {
      title: 'Career & Target Role Preferences',
      description: 'Configure target engineering roles, industry sectors, and preferred working modes.',
      icon: Compass,
      route: '/dashboard/settings/career',
      badge: 'Intelligence',
      items: ['Primary target role benchmark', 'Remote vs. Hybrid modalities', 'Target compensation band'],
    },
    {
      title: 'Learning & Development Settings',
      description: 'Set daily study commitments, curriculum styles, and reminder frequencies.',
      icon: BookOpen,
      route: '/dashboard/settings/learning',
      badge: 'Learning',
      items: ['Learning style & modality', 'Study time (15–60 min/day)', 'Curriculum reminder frequency'],
    },
    {
      title: 'Opportunity & Job Match Alerts',
      description: 'Define opportunity types, compensation thresholds, and match alert cadences.',
      icon: Briefcase,
      route: '/dashboard/settings/opportunities',
      badge: 'Opportunities',
      items: ['Full-time / Contract filters', 'Minimum salary thresholds', 'Digest delivery schedule'],
    },
    {
      title: 'Notification Preferences',
      description: 'Manage email and in-app alerts across Career Intelligence, Learning, and Jobs.',
      icon: Bell,
      route: '/dashboard/settings/notifications',
      badge: 'Communication',
      items: ['Skill gap & roadmap updates', 'Module progress alerts', 'Matching job recommendations'],
    },
    {
      title: 'Privacy & Data Controls',
      description: 'Manage personal data usage, download simulated export archives, or clear caches.',
      icon: Lock,
      route: '/dashboard/settings/privacy',
      badge: 'Governance',
      items: ['Simulated data export JSON', 'Clear saved opportunities & learning', 'Reset all local preferences'],
    },
    {
      title: 'Appearance & Display',
      description: 'Customize interface density, motion effects, and default landing views.',
      icon: Palette,
      route: '/dashboard/settings/appearance',
      badge: 'Display',
      items: ['Comfortable vs. Compact density', 'Motion accessibility toggle', 'Default dashboard landing'],
    },
    {
      title: 'Account Activity Log',
      description: 'Review chronological audit trail of profile updates, calibrations, and saved items.',
      icon: Activity,
      route: '/dashboard/settings/activity',
      badge: 'Audit',
      items: ['Recent calibration timestamps', 'Category-filtered activity', 'Clear history controls'],
    },
    {
      title: 'Help Center & FAQs',
      description: 'Search answers to common questions about calibration formulas, privacy, and roadmap.',
      icon: HelpCircle,
      route: '/dashboard/settings/support',
      badge: 'Support',
      items: ['Searchable FAQ directory', 'Skill gap calculation guide', 'Support contact triggers'],
    },
    {
      title: 'Feedback & Suggestions',
      description: 'Share observations and suggestions to help improve the SkillSetu experience.',
      icon: MessageSquare,
      route: '/dashboard/settings/feedback',
      badge: 'Feedback',
      items: ['Usability feedback submission', 'Feature request logging', 'Prototype rating scale'],
    },
    {
      title: 'Account Closure & Wipe',
      description: 'Permanently close your prototype account and wipe all stored LocalStorage state.',
      icon: Trash2,
      route: '/dashboard/settings/delete-account',
      badge: 'Destructive',
      items: ['Wipe all calibrated profiles', 'Clear learning & growth state', 'Irreversible local closure'],
    },
  ];

  return (
    <SettingsLayout activeRoute="/dashboard/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Settings & Preferences"
          subtitle="Manage your account, career targets, learning commitments, notification alerts, and privacy boundaries."
          badge="Workspace Intelligence"
        />

        {/* Current Active Configuration Snapshot */}
        <PreferenceSummary />

        {/* Grid of Settings Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {settingsHubSections.map((card) => (
            <SettingsCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              route={card.route}
              badge={card.badge}
              items={card.items}
            />
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SettingsPage;
