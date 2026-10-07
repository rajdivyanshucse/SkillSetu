import React, { useState } from 'react';
import { Link } from '../../router/Router';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import OrganizationCapabilityDevelopment from '../../components/growth/OrganizationCapabilityDevelopment';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Target, ArrowLeft, Filter, Search, Compass, Users } from 'lucide-react';
import { ORGANIZATION_CAPABILITIES } from '../../data/growthData';

export default function OrganizationGrowthCapabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredCapabilities = ORGANIZATION_CAPABILITIES.filter((cap) => {
    const matchesSearch = cap.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || cap.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  return (
    <OrganizationLayout activeRoute="/organization/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-charcoal-light/10 pb-5">
          <div>
            <Link
              to="/organization/growth"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-warm-brown transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Workforce Growth Overview
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-warm-charcoal tracking-tight">
                Workforce Capability Development
              </h1>
              <Badge variant="primary" size="sm">
                {ORGANIZATION_CAPABILITIES.length} Tracked Capabilities
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Detailed aggregate analysis of current capability coverage, target benchmark coverage, and active development pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/organization/planning">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <Compass className="w-3.5 h-3.5" />
                Workforce Scenarios
              </Button>
            </Link>
            <Link to="/organization/talent">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                Talent Pool
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-4 border-charcoal-light/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search capability or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-charcoal-light/20 rounded-md focus:outline-none focus:ring-1 focus:ring-warm-brown bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-charcoal-muted flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Priority:
            </span>
            {['all', 'High', 'Medium', 'Standard'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  priorityFilter === p
                    ? 'bg-warm-brown text-white font-medium'
                    : 'bg-warm-sand/40 text-charcoal-muted hover:bg-warm-sand/80'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        {/* Full Capabilities Component */}
        <OrganizationCapabilityDevelopment
          capabilities={filteredCapabilities}
        />

        <GrowthDisclaimer isOrganization={true} />
      </div>
    </OrganizationLayout>
  );
}
