import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  Type,
  Palette,
  Layout,
  MousePointerClick,
  FormInput,
  Tag,
  CreditCard,
  Compass,
  Maximize2,
  BellRing,
  Loader,
  AlertOctagon,
  Copy,
  Check,
  Search,
  Mail,
  Lock,
  ArrowRight,
  TrendingUp,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

// Design System UI Components
import { Button, IconButton } from '../components/ui/Button';
import { Input, SearchInput } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Radio, RadioGroup } from '../components/ui/Radio';
import { Toggle } from '../components/ui/Toggle';
import { FileUploadUI } from '../components/ui/FileUploadUI';
import { Badge } from '../components/ui/Badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  SkillCard,
  RecommendationCard,
  OpportunityCard,
  ChartContainer,
  InsightCard,
} from '../components/ui/Card';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { Drawer, BottomSheet } from '../components/ui/Drawer';
import { Tooltip, Popover } from '../components/ui/Tooltip';
import { useToast } from '../components/ui/Toast';
import {
  Spinner,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  PageLoadingState,
} from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { Tabs } from '../components/ui/Tabs';
import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from '../components/ui/Dropdown';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

// Layout Building Blocks
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

// Tokens
import { colors, typography, radius, shadows } from '../design-system/tokens';

export const DesignSystemPage = () => {
  const { addToast } = useToast();
  const [activeNavSection, setActiveNavSection] = useState('overview');
  const [copiedToken, setCopiedToken] = useState('');

  // Interactive Form States
  const [inputValue, setInputValue] = useState('Senior Distributed Architect');
  const [searchVal, setSearchVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('Specialized in low-latency event streams and distributed state machines.');
  const [selectVal, setSelectVal] = useState('enterprise');
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(false);
  const [radioVal, setRadioVal] = useState('hybrid');
  const [radioCardVal, setRadioCardVal] = useState('deep');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);

  // Tabs states
  const [activeUnderlineTab, setActiveUnderlineTab] = useState('taxonomy');
  const [activePillTab, setActivePillTab] = useState('weekly');
  const [activeSegmentTab, setActiveSegmentTab] = useState('table');

  // Modal / Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Sidebar preview state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarActiveItem, setSidebarActiveItem] = useState('intelligence');

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(text);
    addToast({
      title: 'Copied to Clipboard',
      message: `${text} copied successfully`,
      type: 'success',
      duration: 2000,
    });
    setTimeout(() => setCopiedToken(''), 2500);
  };

  const sections = [
    { id: 'overview', label: 'Overview & Story', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'colors', label: 'Color System', icon: <Palette className="w-4 h-4" /> },
    { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'spacing', label: 'Surfaces & Elevation', icon: <Layout className="w-4 h-4" /> },
    { id: 'buttons', label: 'Buttons & Actions', icon: <MousePointerClick className="w-4 h-4" /> },
    { id: 'inputs', label: 'Form Controls', icon: <FormInput className="w-4 h-4" /> },
    { id: 'badges', label: 'Status & Badges', icon: <Tag className="w-4 h-4" /> },
    { id: 'cards', label: 'Card System', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'navigation', label: 'Navigation Blocks', icon: <Compass className="w-4 h-4" /> },
    { id: 'overlays', label: 'Modals & Drawers', icon: <Maximize2 className="w-4 h-4" /> },
    { id: 'feedback', label: 'Tooltips & Toasts', icon: <BellRing className="w-4 h-4" /> },
    { id: 'loading', label: 'Skeleton System', icon: <Loader className="w-4 h-4" /> },
    { id: 'empty-states', label: 'Empty & Error States', icon: <AlertOctagon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col">
      {/* Top Banner / Design System Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-border px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-body-md font-bold text-charcoal-900 leading-none">
                  SkillSetu UI Foundation
                </h1>
                <Badge status="new" size="sm">Phase 1 Release</Badge>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Design System & Visual Component Reference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 text-xs text-charcoal-600 bg-canvas-subtle px-3 py-1.5 rounded-sm border border-surface-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Strict JS / Tailwind / Motion Tokens</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => handleCopy('SkillSetu-Design-System-Tokens-v1.0')}
            >
              Export Tokens
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container with Sticky Sidebar Nav and Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Sticky Desktop Navigation */}
        <nav aria-label="Design System Navigation" className="lg:w-60 shrink-0">
          <div className="sticky top-24 space-y-1 bg-surface p-3 rounded-lg border border-surface-border shadow-card">
            <div className="px-3 py-2 text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
              Component Index
            </div>
            <div className="space-y-0.5">
              {sections.map((sec) => {
                const isActive = activeNavSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveNavSection(sec.id)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-medium transition-colors
                      ${isActive
                        ? 'bg-brand-50 text-brand-800 font-semibold border border-brand-200/60'
                        : 'text-charcoal-600 hover:bg-canvas-subtle hover:text-charcoal-900'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-brand-600' : 'text-charcoal-400'}>
                      {sec.icon}
                    </span>
                    <span>{sec.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 space-y-16 min-w-0">
          {/* ==========================================================
              1. OVERVIEW & PRINCIPLES
             ========================================================== */}
          <section id="overview" className="space-y-6 pt-2">
            <div className="space-y-2">
              <span className="text-label text-brand-600">Design Foundation</span>
              <h2 className="text-display text-charcoal-900">
                SkillSetu Platform Architecture
              </h2>
              <p className="text-body-lg text-charcoal-600 max-w-3xl leading-relaxed">
                SkillSetu is designed as a serious, minimal, and enterprise-grade intelligence platform for modern workforce planning, skills benchmarking, and predictive career pathways.
              </p>
            </div>

            {/* Principles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card">
                <div className="w-8 h-8 rounded-sm bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h3 className="text-body-md font-semibold text-charcoal-900">Warm & Editorial Neutral</h3>
                <p className="text-body-sm text-charcoal-500 mt-1 leading-normal">
                  Warm off-white canvases (#FAF8F5), crisp white surfaces, charcoal typography, and muted warm brown accents instead of harsh neon tech clichés.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card">
                <div className="w-8 h-8 rounded-sm bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h3 className="text-body-md font-semibold text-charcoal-900">Data-Driven Precision</h3>
                <p className="text-body-sm text-charcoal-500 mt-1 leading-normal">
                  Clear visual weight on numbers, benchmarking telemetry, structured cards, and subtle status indicators designed for high-density enterprise readability.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card">
                <div className="w-8 h-8 rounded-sm bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h3 className="text-body-md font-semibold text-charcoal-900">Micro-Depth & Restraint</h3>
                <p className="text-body-sm text-charcoal-500 mt-1 leading-normal">
                  Delicate borders, soft layered shadows, purposeful Framer Motion micro-interactions, and zero extraneous decorative fluff.
                </p>
              </div>
            </div>
          </section>

          {/* ==========================================================
              2. COLOR SYSTEM
             ========================================================== */}
          <section id="colors" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Color System</span>
              <h2 className="text-page-title text-charcoal-900">Tokens & Palette</h2>
              <p className="text-body-sm text-charcoal-500 mt-1">
                Click any color token to copy its HEX value.
              </p>
            </div>

            {/* Base Canvas & Surfaces */}
            <div className="space-y-3">
              <h3 className="text-section-title text-charcoal-800">Canvas & Surfaces</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Canvas Base', hex: '#FAF8F5', text: 'text-charcoal-900', border: 'border-charcoal-200' },
                  { name: 'Canvas Subtle', hex: '#F4F0EA', text: 'text-charcoal-900', border: 'border-charcoal-200' },
                  { name: 'Surface White', hex: '#FFFFFF', text: 'text-charcoal-900', border: 'border-surface-border' },
                  { name: 'Surface Muted', hex: '#F5F2EC', text: 'text-charcoal-900', border: 'border-charcoal-200' },
                ].map((c) => (
                  <div
                    key={c.name}
                    onClick={() => handleCopy(c.hex)}
                    className="p-4 rounded-md border shadow-subtle cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-semibold ${c.text}`}>{c.name}</span>
                      <Copy className="w-3.5 h-3.5 text-charcoal-400" />
                    </div>
                    <span className="text-[11px] font-mono text-charcoal-500 block mt-4">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Warm Brown Ramp */}
            <div className="space-y-3">
              <h3 className="text-section-title text-charcoal-800">Brand Warm Brown Ramp (SkillSetu Signature)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { shade: '50', hex: '#FAF6F2', text: 'text-charcoal-900' },
                  { shade: '100', hex: '#F4ECE3', text: 'text-charcoal-900' },
                  { shade: '200', hex: '#E6D4C2', text: 'text-charcoal-900' },
                  { shade: '300', hex: '#D5B79C', text: 'text-charcoal-900' },
                  { shade: '400', hex: '#B58863', text: 'text-white' },
                  { shade: '500 (Base)', hex: '#8C5E3C', text: 'text-white' },
                  { shade: '600', hex: '#774C2E', text: 'text-white' },
                  { shade: '700', hex: '#603B22', text: 'text-white' },
                  { shade: '800', hex: '#4A2D19', text: 'text-white' },
                  { shade: '900', hex: '#362010', text: 'text-white' },
                ].map((c) => (
                  <div
                    key={c.shade}
                    onClick={() => handleCopy(c.hex)}
                    className="p-3 rounded-sm border border-black/5 shadow-subtle cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-semibold ${c.text}`}>brand-{c.shade}</span>
                    </div>
                    <span className={`text-[10px] font-mono opacity-80 block mt-3 ${c.text}`}>{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charcoal & Neutral Ramp */}
            <div className="space-y-3">
              <h3 className="text-section-title text-charcoal-800">Charcoal & Typography Grayscale</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { shade: '50', hex: '#F7F5F0', text: 'text-charcoal-900' },
                  { shade: '100', hex: '#EDE9E1', text: 'text-charcoal-900' },
                  { shade: '300', hex: '#BFB8AC', text: 'text-charcoal-900' },
                  { shade: '500', hex: '#736E64', text: 'text-white' },
                  { shade: '900 (Text)', hex: '#181716', text: 'text-white' },
                ].map((c) => (
                  <div
                    key={c.shade}
                    onClick={() => handleCopy(c.hex)}
                    className="p-3 rounded-sm border border-black/5 shadow-subtle cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className={`text-xs font-semibold ${c.text}`}>charcoal-{c.shade}</span>
                    <span className={`text-[10px] font-mono opacity-80 block mt-3 ${c.text}`}>{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Status Colors */}
            <div className="space-y-3">
              <h3 className="text-section-title text-charcoal-800">Semantic Status Tokens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div
                  onClick={() => handleCopy('#1F6948')}
                  className="p-4 rounded-md bg-status-success-bg border border-status-success-border cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success-dot" />
                    <span className="text-xs font-bold text-status-success-text">Success / Active</span>
                  </div>
                  <span className="text-[11px] font-mono text-status-success-text block mt-2">#1F6948</span>
                </div>

                <div
                  onClick={() => handleCopy('#8B5B14')}
                  className="p-4 rounded-md bg-status-warning-bg border border-status-warning-border cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-warning-dot" />
                    <span className="text-xs font-bold text-status-warning-text">Warning / Review</span>
                  </div>
                  <span className="text-[11px] font-mono text-status-warning-text block mt-2">#8B5B14</span>
                </div>

                <div
                  onClick={() => handleCopy('#9E2A22')}
                  className="p-4 rounded-md bg-status-danger-bg border border-status-danger-border cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-danger-dot" />
                    <span className="text-xs font-bold text-status-danger-text">Critical / Risk</span>
                  </div>
                  <span className="text-[11px] font-mono text-status-danger-text block mt-2">#9E2A22</span>
                </div>

                <div
                  onClick={() => handleCopy('#295484')}
                  className="p-4 rounded-md bg-status-info-bg border border-status-info-border cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-info-dot" />
                    <span className="text-xs font-bold text-status-info-text">Info / Slate</span>
                  </div>
                  <span className="text-[11px] font-mono text-status-info-text block mt-2">#295484</span>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              3. TYPOGRAPHY
             ========================================================== */}
          <section id="typography" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Type System</span>
              <h2 className="text-page-title text-charcoal-900">Typography Hierarchy</h2>
              <p className="text-body-sm text-charcoal-500 mt-1">
                Rendered with Plus Jakarta Sans & JetBrains Mono for data tokens.
              </p>
            </div>

            <div className="bg-surface rounded-lg border border-surface-border divide-y divide-surface-border overflow-hidden shadow-card">
              {typography.hierarchy.map((typeItem) => (
                <div key={typeItem.name} className="p-5 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="w-64 shrink-0">
                    <h4 className="text-body-sm font-semibold text-charcoal-900">{typeItem.name}</h4>
                    <span className="text-[11px] font-mono text-charcoal-400 block mt-0.5">
                      {typeItem.size} · {typeItem.class}
                    </span>
                  </div>
                  <div className={`flex-1 ${typeItem.class} text-charcoal-900`}>
                    {typeItem.sample}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ==========================================================
              4. SURFACES, ELEVATION & RADIUS
             ========================================================== */}
          <section id="spacing" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Surfaces & Radii</span>
              <h2 className="text-page-title text-charcoal-900">Surface Depth & Radii Scale</h2>
            </div>

            {/* Radii System */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {radius.map((r) => (
                <div key={r.name} className="p-4 bg-surface rounded-md border border-surface-border flex flex-col items-center text-center shadow-subtle">
                  <div
                    className={`w-12 h-12 bg-brand-100 border-2 border-brand-500 mb-3 ${r.class}`}
                  />
                  <span className="text-xs font-semibold text-charcoal-900">{r.name}</span>
                  <span className="text-[11px] font-mono text-charcoal-500">{r.value}</span>
                  <span className="text-[10px] text-charcoal-400 mt-1">{r.use}</span>
                </div>
              ))}
            </div>

            {/* Shadows & Surface Depth */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-subtle">
                <span className="text-xs font-semibold text-charcoal-800">Subtle (Resting)</span>
                <p className="text-xs text-charcoal-500 mt-1">Low-contrast elevation for nested elements.</p>
              </div>
              <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card">
                <span className="text-xs font-semibold text-charcoal-800">Card Shadow</span>
                <p className="text-xs text-charcoal-500 mt-1">Standard container elevation.</p>
              </div>
              <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-modal">
                <span className="text-xs font-semibold text-charcoal-800">Modal Elevation</span>
                <p className="text-xs text-charcoal-500 mt-1">Floating dialogs and overlays.</p>
              </div>
            </div>
          </section>

          {/* ==========================================================
              5. BUTTON SYSTEM
             ========================================================== */}
          <section id="buttons" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Action System</span>
              <h2 className="text-page-title text-charcoal-900">Buttons & Micro-Interactions</h2>
            </div>

            {/* Variants */}
            <div className="space-y-3 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              <h3 className="text-section-title text-charcoal-900">Button Variants</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Charcoal</Button>
                <Button variant="brand">Brand Terracotta</Button>
                <Button variant="brand-subtle">Brand Subtle</Button>
                <Button variant="secondary">Secondary Surface</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Sizes & States */}
            <div className="space-y-4 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              <h3 className="text-section-title text-charcoal-900">Sizes & Interactive States</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs" variant="primary">XS Size</Button>
                <Button size="sm" variant="primary">Small (sm)</Button>
                <Button size="md" variant="primary">Medium (md)</Button>
                <Button size="lg" variant="primary">Large (lg)</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="brand" disabled>Disabled State</Button>
                <Button variant="secondary" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Left Icon
                </Button>
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Right Icon
                </Button>
                <IconButton icon={<Search className="w-4 h-4" />} variant="secondary" ariaLabel="Search" />
                <IconButton icon={<Trash2 className="w-4 h-4 text-status-danger-text" />} variant="ghost" ariaLabel="Delete" />
              </div>
            </div>
          </section>

          {/* ==========================================================
              6. FORM INPUTS & CONTROLS
             ========================================================== */}
          <section id="inputs" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Form Controls</span>
              <h2 className="text-page-title text-charcoal-900">Input & Validation System</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              {/* Standard Input */}
              <Input
                label="Target Workforce Role"
                required
                placeholder="e.g. Lead Machine Learning Engineer"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                hint="Used as baseline taxonomy role node"
              />

              {/* Search Input */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-charcoal-800">
                  Global Telemetry Search
                </label>
                <SearchInput
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Filter competency clusters..."
                />
              </div>

              {/* Input with Prefix Icon & Success State */}
              <Input
                label="Verified Contact Email"
                leftIcon={<Mail className="w-4 h-4" />}
                defaultValue="director.talent@enterprise.io"
                success="Enterprise identity verified via SSO"
              />

              {/* Input with Error State */}
              <Input
                label="Competency Minimum Ratio"
                defaultValue="150%"
                error="Ratio must be a percentage between 0% and 100%"
              />

              {/* Select */}
              <Select
                label="Deployment Tier"
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
                options={[
                  { value: 'enterprise', label: 'Enterprise Intelligence (Continuous)' },
                  { value: 'growth', label: 'Growth Plan (Weekly Telemetry)' },
                  { value: 'pilot', label: 'Department Pilot Sandbox' },
                ]}
              />

              {/* Textarea */}
              <div className="md:col-span-2">
                <Textarea
                  label="Role Capability Architecture"
                  rows={2}
                  maxLength={180}
                  showCount
                  value={textareaVal}
                  onChange={(e) => setTextareaVal(e.target.value)}
                  hint="Provide high-level competency domain requirements."
                />
              </div>
            </div>

            {/* Checkboxes, Radios & Switches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              {/* Checkboxes */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-charcoal-900 mb-2">Checkboxes</h4>
                <Checkbox
                  label="Enable telemetry sync"
                  description="Hourly aggregate capability analysis"
                  checked={checkbox1}
                  onChange={(e) => setCheckbox1(e.target.checked)}
                />
                <Checkbox
                  label="Anonymize personal logs"
                  description="Strict GDPR & workforce privacy compliance"
                  checked={checkbox2}
                  onChange={(e) => setCheckbox2(e.target.checked)}
                />
                <Checkbox
                  label="Indeterminate sample"
                  indeterminate
                  checked={false}
                  onChange={() => {}}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <h4 className="text-body-sm font-semibold text-charcoal-900 mb-2">Toggle Switches</h4>
                <Toggle
                  label="Predictive Career Signals"
                  description="Machine synthesized transition maps"
                  checked={toggle1}
                  onChange={setToggle1}
                />
                <Toggle
                  label="Executive Reporting"
                  description="Monthly PDF briefing delivery"
                  checked={toggle2}
                  onChange={setToggle2}
                />
              </div>

              {/* Radio Group List */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-charcoal-900 mb-2">Radio Selection</h4>
                <RadioGroup
                  name="workModel"
                  value={radioVal}
                  onChange={setRadioVal}
                  options={[
                    { value: 'remote', label: 'Fully Remote' },
                    { value: 'hybrid', label: 'Hybrid Distributed', description: 'Recommended for teams' },
                    { value: 'onsite', label: 'Onsite Hub' },
                  ]}
                />
              </div>
            </div>

            {/* Radio Cards & File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-lg border border-surface-border shadow-card space-y-3">
                <h4 className="text-body-sm font-semibold text-charcoal-900">Radio Card Group</h4>
                <RadioGroup
                  name="telemetryMode"
                  layout="cards"
                  value={radioCardVal}
                  onChange={setRadioCardVal}
                  options={[
                    { value: 'standard', label: 'Standard Sync', description: 'Aggregated quarterly reviews' },
                    { value: 'deep', label: 'Deep Intelligence', description: 'Real-time commit & project tracking' },
                  ]}
                />
              </div>

              <div className="bg-surface p-6 rounded-lg border border-surface-border shadow-card">
                <FileUploadUI
                  label="Bulk Taxonomy Import"
                  hint="Upload O*NET, ESCO or internal CSV taxonomy files"
                />
              </div>
            </div>
          </section>

          {/* ==========================================================
              7. BADGES & STATUS INDICATORS
             ========================================================== */}
          <section id="badges" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Status System</span>
              <h2 className="text-page-title text-charcoal-900">Badges & Indicators</h2>
            </div>

            <div className="bg-surface p-6 rounded-lg border border-surface-border shadow-card space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-500">Subtle Badges with Icons</span>
                <div className="flex flex-wrap gap-2.5">
                  <Badge status="active" icon />
                  <Badge status="in_progress" icon />
                  <Badge status="completed" icon />
                  <Badge status="verified" icon />
                  <Badge status="recommended" icon />
                  <Badge status="emerging" icon />
                  <Badge status="high_priority" icon />
                  <Badge status="at_risk" icon />
                  <Badge status="new" />
                  <Badge status="neutral" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-500">Dot-Only Indicators</span>
                <div className="flex flex-wrap items-center gap-6">
                  <Badge status="active" variant="dot" />
                  <Badge status="in_progress" variant="dot" />
                  <Badge status="at_risk" variant="dot" />
                  <Badge status="high_priority" variant="dot" />
                  <Badge status="neutral" variant="dot" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-500">Outline & Size Variations</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge status="recommended" variant="outline" size="sm">Small Outline</Badge>
                  <Badge status="recommended" variant="outline" size="md">Medium Outline</Badge>
                  <Badge status="recommended" variant="outline" size="lg">Large Outline</Badge>
                  <Badge status="active" variant="solid" size="md">Solid Badge</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              8. CARD SYSTEM
             ========================================================== */}
          <section id="cards" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Card System</span>
              <h2 className="text-page-title text-charcoal-900">Domain Cards & Containers</h2>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Capability Index"
                value="88.4%"
                change="+6.2%"
                changeType="positive"
                trendText="vs. benchmark"
                icon={<TrendingUp className="w-4 h-4 text-brand-600" />}
              />
              <StatCard
                title="Identified Attrition Risk"
                value="3.1%"
                change="-1.4%"
                changeType="positive"
                trendText="down this quarter"
                icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              />
              <StatCard
                title="Critical Skill Gaps"
                value="14"
                change="+3"
                changeType="negative"
                trendText="action required"
                icon={<Zap className="w-4 h-4 text-status-warning-text" />}
              />
              <StatCard
                title="Pathways Activated"
                value="1,420"
                change="98% on track"
                changeType="neutral"
                icon={<Sparkles className="w-4 h-4 text-charcoal-600" />}
              />
            </div>

            {/* Specialized Domain Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Skill Card */}
              <SkillCard
                name="Kubernetes Orchestration"
                category="Infrastructure"
                proficiency={84}
                verified={true}
                demandIndex="High"
                growth="+28%"
              />

              {/* Recommendation Card */}
              <RecommendationCard
                title="Transition to Principal Architect"
                category="Predictive Pathway"
                matchScore={94}
                rationale="Candidate possesses 92% of core distributed systems competencies with immediate readiness."
                onAction={() => addToast({ title: 'Pathway Triggered', message: 'Preview opened for career pathway', type: 'info' })}
              />

              {/* Opportunity Card */}
              <OpportunityCard
                role="Staff Infrastructure Engineer"
                department="Platform Core"
                location="Hybrid (San Francisco)"
                matchRate={91}
                skills={['Go', 'Rust', 'eBPF', 'gRPC']}
                deadline="Closes in 6 days"
                onApply={() => addToast({ title: 'Opportunity Opened', message: 'Opening role spec preview', type: 'info' })}
              />
            </div>

            {/* Insight Callout Card */}
            <InsightCard
              title="Emerging Competency Surge Detected"
              description="Platform telemetry identified a 42% surge in Vector Search & RAG engineering requirements across the organization."
              metric="+42% Demand"
              actionText="Review Taxonomy"
              onAction={() => addToast({ title: 'Taxonomy Review', message: 'Navigating to taxonomy editor preview', type: 'success' })}
            />

            {/* Chart Container Example */}
            <ChartContainer
              title="Quarterly Competency Benchmark Trajectory"
              subtitle="Aggregated baseline against top decile peer companies"
              filterSlot={
                <Select
                  value="q3"
                  onChange={() => {}}
                  className="w-32 h-8 text-xs"
                  options={[
                    { value: 'q3', label: 'Q3 2026' },
                    { value: 'q2', label: 'Q2 2026' },
                    { value: 'q1', label: 'Q1 2026' },
                  ]}
                />
              }
              actionSlot={
                <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3" />}>
                  Export Data
                </Button>
              }
              footerNote="Data collected from 4,120 verified peer enterprise roles. Confidence score: 99.4%."
            >
              <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4">
                {[
                  { label: 'Cloud Architecture', val: 82, benchmark: 75 },
                  { label: 'Data Engineering', val: 91, benchmark: 80 },
                  { label: 'ML Operations', val: 68, benchmark: 72 },
                  { label: 'Security & Auth', val: 88, benchmark: 85 },
                  { label: 'Distributed Systems', val: 94, benchmark: 78 },
                  { label: 'Domain Modeling', val: 76, benchmark: 70 },
                ].map((item) => (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Org Value */}
                      <div
                        className="w-4 bg-brand-500 rounded-t-xs transition-all hover:bg-brand-600"
                        style={{ height: `${item.val}%` }}
                        title={`Org: ${item.val}%`}
                      />
                      {/* Peer Benchmark */}
                      <div
                        className="w-4 bg-canvas-muted border-t border-charcoal-300 rounded-t-xs"
                        style={{ height: `${item.benchmark}%` }}
                        title={`Peer: ${item.benchmark}%`}
                      />
                    </div>
                    <span className="text-[10px] text-charcoal-500 truncate max-w-[80px] text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </section>

          {/* ==========================================================
              9. NAVIGATION BUILDING BLOCKS
             ========================================================== */}
          <section id="navigation" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Navigation Building Blocks</span>
              <h2 className="text-page-title text-charcoal-900">Sidebar, Topbar, Tabs & Menus</h2>
            </div>

            {/* Tabs Showcase */}
            <div className="space-y-4 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              <h3 className="text-section-title text-charcoal-900">Tabs Component Variants</h3>

              {/* Animated Underline */}
              <div>
                <span className="text-xs font-semibold text-charcoal-500 block mb-2">Animated Underline Variant</span>
                <Tabs
                  variant="underline"
                  activeTab={activeUnderlineTab}
                  onChange={setActiveUnderlineTab}
                  tabs={[
                    { id: 'taxonomy', label: 'Skill Taxonomy', count: 18 },
                    { id: 'benchmarks', label: 'Industry Benchmarks' },
                    { id: 'pathways', label: 'Active Pathways', count: 4 },
                    { id: 'history', label: 'Historical Telemetry' },
                  ]}
                />
              </div>

              {/* Segmented Variant */}
              <div className="pt-3">
                <span className="text-xs font-semibold text-charcoal-500 block mb-2">Segmented Control Variant</span>
                <Tabs
                  variant="segmented"
                  activeTab={activeSegmentTab}
                  onChange={setActiveSegmentTab}
                  tabs={[
                    { id: 'table', label: 'Table View' },
                    { id: 'matrix', label: 'Capability Matrix' },
                    { id: 'graph', label: 'Dependency Graph' },
                  ]}
                />
              </div>

              {/* Pills Variant */}
              <div className="pt-3">
                <span className="text-xs font-semibold text-charcoal-500 block mb-2">Pill Filter Variant</span>
                <Tabs
                  variant="pills"
                  activeTab={activePillTab}
                  onChange={setActivePillTab}
                  tabs={[
                    { id: 'all', label: 'All Roles' },
                    { id: 'weekly', label: 'Engineering (42)' },
                    { id: 'product', label: 'Product & Design (19)' },
                    { id: 'data', label: 'Data & AI (31)' },
                  ]}
                />
              </div>
            </div>

            {/* Breadcrumbs & Dropdown Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              <div className="space-y-2">
                <h4 className="text-body-sm font-semibold text-charcoal-900">Breadcrumbs</h4>
                <Breadcrumbs
                  items={[
                    { label: 'Workforce Core' },
                    { label: 'Engineering' },
                    { label: 'Staff Architect' },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-body-sm font-semibold text-charcoal-900">Dropdown Menu Action</h4>
                <Dropdown
                  trigger={
                    <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5 rotate-90" />}>
                      Actions Menu
                    </Button>
                  }
                >
                  <DropdownHeader>Intelligence Controls</DropdownHeader>
                  <DropdownItem icon={<Sparkles className="w-4 h-4" />}>
                    Generate Pathway
                  </DropdownItem>
                  <DropdownItem icon={<Download className="w-4 h-4" />} shortcut="⌘E">
                    Export Schema
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={<Trash2 className="w-4 h-4 text-status-danger-text" />} variant="destructive">
                    Archive Node
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>

            {/* Interactive Layout Component Preview */}
            <div className="space-y-2">
              <h3 className="text-section-title text-charcoal-900">Layout Shell Previews (Sidebar & Topbar)</h3>
              <div className="rounded-lg border border-surface-border overflow-hidden bg-canvas h-[380px] flex shadow-card">
                <Sidebar
                  collapsed={isSidebarCollapsed}
                  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  activeItem={sidebarActiveItem}
                  onItemSelect={setSidebarActiveItem}
                />
                <div className="flex-1 flex flex-col min-w-0">
                  <Topbar
                    unreadNotifications={2}
                    onSearchClick={() => addToast({ title: 'Global Search', message: 'Triggered ⌘K search overlay', type: 'info' })}
                    onNotificationClick={() => addToast({ title: 'Notifications', message: 'You have 2 unread intelligence alerts', type: 'info' })}
                  />
                  <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-body-sm font-medium text-charcoal-700">
                      Workforce Main View Container
                    </p>
                    <p className="text-xs text-charcoal-400 mt-1 max-w-sm">
                      Toggle the sidebar button or click navigation items to test layout responsiveness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              10. MODALS, DRAWERS & OVERLAYS
             ========================================================== */}
          <section id="overlays" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Overlays & Dialogs</span>
              <h2 className="text-page-title text-charcoal-900">Modals, Confirm Dialogs & Drawers</h2>
            </div>

            <div className="bg-surface p-6 rounded-lg border border-surface-border shadow-card flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Standard Modal
              </Button>
              <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Open Right Drawer
              </Button>
              <Button variant="outline" onClick={() => setIsBottomSheetOpen(true)}>
                Open Mobile BottomSheet
              </Button>
            </div>

            {/* Modal Instance */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Add Competency Benchmark"
              description="Define standard role requirements to update the global workforce graph."
              footer={
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      addToast({ title: 'Benchmark Added', message: 'Taxonomy node updated', type: 'success' });
                    }}
                  >
                    Save Benchmark
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <Input label="Competency Title" defaultValue="Distributed Consensus Protocols" />
                <Select
                  label="Target Proficiency Tier"
                  options={[
                    { value: 'expert', label: 'Tier 5 - Expert / Authority' },
                    { value: 'advanced', label: 'Tier 4 - Advanced Practitioner' },
                    { value: 'competent', label: 'Tier 3 - Independent Contributor' },
                  ]}
                />
                <Textarea label="Telemetry Verification Criteria" placeholder="e.g. Raft/Paxos implementation history..." />
              </div>
            </Modal>

            {/* Confirm Dialog Instance */}
            <ConfirmDialog
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => {
                setIsConfirmOpen(false);
                addToast({ title: 'Node Deleted', message: 'Competency removed from telemetry', type: 'error' });
              }}
              title="Archive Competency Node?"
              message="Archiving will remove this benchmark from active career path calculations for 14 teams."
              isDestructive={true}
              confirmText="Archive Node"
            />

            {/* Drawer Instance */}
            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              title="Role Intelligence Inspector"
              description="Detailed competency telemetry and career progression curves."
              footer={
                <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(false)}>
                  Close Inspector
                </Button>
              }
            >
              <div className="space-y-5">
                <div className="p-3.5 bg-canvas-subtle rounded-md border border-surface-border">
                  <span className="text-xs font-semibold text-charcoal-800 block">Lead Site Reliability Engineer</span>
                  <span className="text-[11px] text-charcoal-500">Platform Core · Level IC-6</span>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-charcoal-700">Required Competency Clusters</span>
                  <div className="space-y-2">
                    <SkillCard name="Chaos Engineering" proficiency={92} verified={true} />
                    <SkillCard name="Telemetry & Observability" proficiency={88} verified={true} />
                  </div>
                </div>
              </div>
            </Drawer>

            {/* BottomSheet Instance */}
            <BottomSheet
              isOpen={isBottomSheetOpen}
              onClose={() => setIsBottomSheetOpen(false)}
              title="Mobile Quick Actions"
            >
              <div className="space-y-3 py-2">
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Sparkles className="w-4 h-4 text-brand-600" />}>
                  Run Skill Analysis
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Download className="w-4 h-4" />}>
                  Download Telemetry Report
                </Button>
                <Button variant="primary" className="w-full mt-4" onClick={() => setIsBottomSheetOpen(false)}>
                  Done
                </Button>
              </div>
            </BottomSheet>
          </section>

          {/* ==========================================================
              11. TOOLTIPS & TOAST FEEDBACK
             ========================================================== */}
          <section id="feedback" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Feedback System</span>
              <h2 className="text-page-title text-charcoal-900">Tooltips & Interactive Toasts</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-6 rounded-lg border border-surface-border shadow-card">
              {/* Tooltips */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-charcoal-900">Tooltips</h4>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Tooltip content="Calculated from 12,000 internal logs" position="top">
                    <Button variant="secondary" size="sm">Hover Top</Button>
                  </Tooltip>
                  <Tooltip content="Validated by Engineering Council" position="bottom">
                    <Button variant="secondary" size="sm">Hover Bottom</Button>
                  </Tooltip>
                  <Tooltip content="Telemetry confidence: 98%" position="right">
                    <Button variant="secondary" size="sm">Hover Right</Button>
                  </Tooltip>
                </div>
              </div>

              {/* Toast Triggers */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-charcoal-900">Toast Notifications</h4>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <Button
                    variant="brand-subtle"
                    size="sm"
                    onClick={() => addToast({
                      title: 'Capability Synced',
                      message: 'Telemetry refreshed across all 8 engineering squads.',
                      type: 'success',
                    })}
                  >
                    Trigger Success
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addToast({
                      title: 'Sync Warning',
                      message: '3 team member profiles require skill recertification.',
                      type: 'warning',
                    })}
                  >
                    Trigger Warning
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => addToast({
                      title: 'Connection Disrupted',
                      message: 'Unable to stream real-time telemetry.',
                      type: 'error',
                    })}
                  >
                    Trigger Error
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              12. SKELETON & LOADING SYSTEM
             ========================================================== */}
          <section id="loading" className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Loading System</span>
              <h2 className="text-page-title text-charcoal-900">Skeleton Shimmer & Spinners</h2>
            </div>

            {/* Spinners */}
            <div className="bg-surface p-6 rounded-lg border border-surface-border shadow-card space-y-3">
              <h4 className="text-body-sm font-semibold text-charcoal-900">Spinners</h4>
              <div className="flex items-center gap-6">
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
            </div>

            {/* Skeleton Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-500">Skeleton Card</span>
                <SkeletonCard />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-500">Skeleton Table</span>
                <SkeletonTable rows={3} cols={3} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-charcoal-500">Skeleton Chart</span>
              <SkeletonChart />
            </div>
          </section>

          {/* ==========================================================
              13. EMPTY & ERROR STATES
             ========================================================== */}
          <section id="empty-states" className="space-y-6 pb-12">
            <div className="border-b border-surface-border pb-3">
              <span className="text-label text-brand-600">Empty & Error States</span>
              <h2 className="text-page-title text-charcoal-900">Polished Resilience UI</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmptyState
                icon={<Sparkles className="w-6 h-6 text-brand-600" />}
                title="No Career Pathways Generated Yet"
                description="Initialize competency mapping to allow the intelligence engine to synthesize progression pathways."
                actionLabel="Generate First Pathway"
                secondaryActionLabel="Learn More"
                onAction={() => addToast({ title: 'Synthesizing...', message: 'AI pathway synthesis queued', type: 'info' })}
              />

              <ErrorState
                title="Telemetry Pipeline Offline"
                description="Could not connect to the distributed workforce database. Please check your organizational network."
                onRetry={() => addToast({ title: 'Retrying connection...', type: 'info' })}
              />
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface px-4 sm:px-8 py-6 text-center text-xs text-charcoal-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SkillSetu — Intelligent Workforce & Career Intelligence Platform</span>
          <span className="font-mono text-charcoal-400">Phase 1 Design System v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default DesignSystemPage;
