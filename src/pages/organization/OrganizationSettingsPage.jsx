import React from 'react';
import {
  Building2,
  Users,
  CalendarCheck,
  Bell,
  Lock,
  Palette,
  Activity,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsCard from '../../components/settings/SettingsCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getStoredOrganizationSettings } from '../../utils/settingsIntelligence';

export const OrganizationSettingsPage = () => {
  const orgSettings = getStoredOrganizationSettings();

  const orgSections = [
    {
      title: 'Company Profile & Identity',
      description: 'Organization name, industry classification, corporate website, and company size.',
      icon: Building2,
      route: '/organization/settings/company',
      badge: 'Profile',
      items: [orgSettings.companyName, orgSettings.industry, `${orgSettings.companySize}`],
    },
    {
      title: 'Members & Role Governance',
      description: 'Manage collaborator invitations, planning permissions, and recruiter access tiers.',
      icon: Users,
      route: '/organization/settings/members',
      badge: 'Access',
      items: ['5 Active team members', 'Role permission assignments', 'Simulated invite dispatcher'],
    },
    {
      title: 'Workforce Planning Preferences',
      description: 'Configure default planning horizons, growth scenarios, and capability priorities.',
      icon: CalendarCheck,
      route: '/organization/settings/workforce',
      badge: 'Planning',
      items: [`Planning horizon: ${orgSettings.planningHorizon || '12 months'}`, 'Default scenario parameters', 'Capability focus areas'],
    },
    {
      title: 'Organization Alert Rules',
      description: 'Manage notification alerts across workforce planning, talent discovery, and upskilling.',
      icon: Bell,
      route: '/organization/settings/notifications',
      badge: 'Alerts',
      items: ['Capacity gap shift alerts', 'Cohort milestone updates', 'Candidate pipeline notifications'],
    },
    {
      title: 'Privacy & Data Controls',
      description: 'Organization data usage policies, talent discovery visibility, and export archives.',
      icon: Lock,
      route: '/organization/settings/privacy',
      badge: 'Governance',
      items: ['Talent network visibility', 'Export organization data (JSON)', 'Reset workspace settings'],
    },
    {
      title: 'Workspace Display & Theme',
      description: 'Customize organizational interface density, default landing dashboard, and motion.',
      icon: Palette,
      route: '/organization/settings/appearance',
      badge: 'Display',
      items: ['Enterprise density layout', 'Sidebar expanded state', 'Default planning landing'],
    },
    {
      title: 'Organization Audit Log',
      description: 'Chronological activity stream of workforce scenario calibrations and member invites.',
      icon: Activity,
      route: '/organization/settings/activity',
      badge: 'Audit',
      items: ['Scenario adjustment logs', 'Member role modifications', 'Clear activity history'],
    },
    {
      title: 'Help Center & Enterprise Support',
      description: 'Knowledge base on workforce modeling, talent compatibility formulas, and support contact.',
      icon: HelpCircle,
      route: '/organization/settings/support',
      badge: 'Support',
      items: ['Workforce planning FAQs', 'Talent matching algorithms guide', 'Enterprise support contact'],
    },
  ];

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Organization Settings"
          subtitle="Manage company information, team permissions, workforce planning parameters, and governance rules."
          badge="Enterprise Controls"
        />

        {/* Overview Banner Card */}
        <Card className="p-5 bg-gradient-to-r from-stone-900 via-stone-800 to-brand-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-body-md font-bold font-serif">{orgSettings.companyName}</h3>
              <Badge className="bg-white/10 text-white border border-white/20 text-[10px]">
                {orgSettings.companySize}
              </Badge>
            </div>
            <p className="text-caption text-stone-300 max-w-xl">
              {orgSettings.description}
            </p>
          </div>
          <div className="text-xs text-stone-300 shrink-0 font-mono">
            HQ: {orgSettings.location}
          </div>
        </Card>

        {/* Grid of Organization Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orgSections.map((card) => (
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

export default OrganizationSettingsPage;
