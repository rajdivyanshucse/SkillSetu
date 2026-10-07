import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Layers, Compass, User, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../onboarding/OnboardingContext';
import { getMergedDashboardData } from '../../data/dashboardData';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import Drawer from '../ui/Drawer';

export const DashboardLayout = ({
  children,
  activeRoute = '/dashboard',
  breadcrumbItems,
}) => {
  const { navigate } = useRouter();
  const { data: onboardingData, calculateCompleteness } = useOnboarding();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const completeness = calculateCompleteness ? calculateCompleteness() : 92;
  const dashboardData = getMergedDashboardData(onboardingData, completeness);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchItems = [
    { label: 'Dashboard Overview', category: 'Navigation', route: '/dashboard', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Skill Intelligence Preview', category: 'Intelligence', route: '/dashboard/skill-intelligence', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Career Intelligence Fit', category: 'Intelligence', route: '/dashboard/career-intelligence', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Edit Profile Calibration', category: 'Profile', route: '/onboarding/review', icon: <User className="w-3.5 h-3.5" /> },
    { label: 'Java (Advanced)', category: 'Skill', route: '/dashboard/skill-intelligence', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'AWS (Priority Gap)', category: 'Skill Gap', route: '/dashboard/skill-intelligence', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Backend Software Engineer', category: 'Target Role', route: '/dashboard/career-intelligence', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchItems.filter((i) =>
        i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchItems;

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col antialiased">
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden">
        {/* Desktop / Tablet Sidebar */}
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeRoute={activeRoute}
          userProfile={dashboardData.profile}
          className="hidden md:flex sticky top-0 h-screen"
        />

        {/* Mobile Navigation Drawer */}
        <Drawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          position="left"
          size="sm"
          className="p-0 bg-surface md:hidden"
        >
          <div className="h-full flex flex-col">
            <DashboardSidebar
              collapsed={false}
              activeRoute={activeRoute}
              userProfile={dashboardData.profile}
              className="border-none w-full h-full"
            />
          </div>
        </Drawer>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar
            breadcrumbItems={breadcrumbItems}
            onMenuClick={() => setMobileMenuOpen(true)}
            userProfile={dashboardData.profile}
            onSearchOpen={() => setSearchOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>

      {/* Global ⌘K Quick Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="bg-surface border border-surface-border rounded-xl shadow-modal w-full max-w-lg overflow-hidden"
            >
              <div className="p-3.5 border-b border-surface-border flex items-center gap-3">
                <Search className="w-4 h-4 text-charcoal-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search skills, roles, telemetry or sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-sm text-charcoal-400 hover:text-charcoal-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-72 overflow-y-auto space-y-1">
                {filteredSearch.length === 0 ? (
                  <div className="p-6 text-center text-xs text-charcoal-500">
                    No matching intelligence items found.
                  </div>
                ) : (
                  filteredSearch.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        navigate(item.route);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-canvas-subtle text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-charcoal-500 group-hover:text-brand-600 transition-colors">
                          {item.icon}
                        </span>
                        <span className="text-xs font-semibold text-charcoal-900">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-charcoal-400 bg-canvas-muted px-1.5 py-0.2 rounded-xs">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3 h-3 text-charcoal-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-surface-border bg-canvas-subtle/50 flex items-center justify-between text-[11px] text-charcoal-400">
                <span>Navigate with mouse or touch</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-surface border border-surface-border rounded-xs">
                  ESC to close
                </kbd>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
