import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Sparkles, Check, HelpCircle } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { SearchInput } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const SKILL_DATABASE = [
  { name: 'Java', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'Go', category: 'Programming' },
  { name: 'Rust', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'React', category: 'Web Development' },
  { name: 'Node.js', category: 'Web Development' },
  { name: 'Next.js', category: 'Web Development' },
  { name: 'Tailwind CSS', category: 'Web Development' },
  { name: 'Spring Boot', category: 'Web Development' },
  { name: 'GraphQL', category: 'Web Development' },
  { name: 'SQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'AWS', category: 'Cloud & DevOps' },
  { name: 'Docker', category: 'Cloud & DevOps' },
  { name: 'Kubernetes', category: 'Cloud & DevOps' },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps' },
  { name: 'Terraform', category: 'Cloud & DevOps' },
  { name: 'Machine Learning', category: 'Data & AI' },
  { name: 'Data Analysis', category: 'Data & AI' },
  { name: 'PyTorch', category: 'Data & AI' },
  { name: 'Pandas', category: 'Data & AI' },
  { name: 'Vector Databases', category: 'Data & AI' },
  { name: 'Figma', category: 'Design' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Design Systems', category: 'Design' },
  { name: 'Project Management', category: 'Management' },
  { name: 'Agile & Scrum', category: 'Management' },
  { name: 'Product Strategy', category: 'Business' },
  { name: 'Financial Modeling', category: 'Business' },
];

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Cloud & DevOps',
  'Data & AI',
  'Databases',
  'Design',
  'Management',
  'Business',
];

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const OnboardingSkillsPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data, addSkill, removeSkill, updateSkillProficiency } = useOnboarding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = SKILL_DATABASE.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const notSelected = !data.skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase());
    return matchesSearch && matchesCategory && notSelected;
  });

  const handleAddCustomSkill = () => {
    if (!searchQuery.trim()) return;
    addSkill({
      name: searchQuery.trim(),
      category: selectedCategory === 'All' ? 'Custom' : selectedCategory,
      proficiency: 'Intermediate',
    });
    setSearchQuery('');
  };

  const handleContinue = () => {
    if (data.skills.length === 0) {
      addToast({
        title: 'Select at least one skill',
        message: 'Please add at least one skill to calibrate your ontology.',
        type: 'error',
      });
      return;
    }
    navigate('/onboarding/experience');
  };

  return (
    <OnboardingLayout stepIndex={2}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={2}
          badge="Step 02"
          title="Map your current skills"
          subtitle="Add the skills and tools you already have. You can update your proficiency levels anytime."
        />

        {/* Selected Skills Pool */}
        <div className="p-4 sm:p-5 rounded-xl bg-canvas-subtle/80 border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-charcoal-900">Your Selected Skills</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-100 text-brand-800">
                {data.skills.length} added
              </span>
            </div>
            <span className="text-[11px] text-charcoal-500">
              Click proficiency badge to adjust level
            </span>
          </div>

          {data.skills.length === 0 ? (
            <p className="text-xs text-charcoal-500 italic py-3 text-center">
              No skills added yet. Select from suggestions below or use search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <AnimatePresence>
                {data.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 bg-surface rounded-md border border-surface-border shadow-subtle flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <span className="text-xs font-bold text-charcoal-900 block truncate">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-charcoal-400 block truncate">
                        {skill.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <select
                        value={skill.proficiency}
                        onChange={(e) => updateSkillProficiency(skill.name, e.target.value)}
                        className="text-[11px] font-semibold py-1 px-2 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-800 outline-none cursor-pointer"
                      >
                        {PROFICIENCY_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="p-1 text-charcoal-400 hover:text-red-600 rounded-xs hover:bg-canvas-subtle transition-colors cursor-pointer"
                        aria-label={`Remove ${skill.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Search and Category Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchInput
                placeholder="Search competencies (e.g. Python, Docker, AWS, Figma)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="h-9 px-3.5 text-xs font-semibold rounded-sm bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add "{searchQuery}"</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-2.5 py-1 rounded-sm text-xs font-medium transition-colors cursor-pointer select-none
                  ${selectedCategory === cat
                    ? 'bg-charcoal-900 text-white font-semibold'
                    : 'bg-canvas-subtle text-charcoal-600 border border-surface-border hover:bg-canvas-muted'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Skills Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block">
            Suggested for Your Domain:
          </span>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {filteredSkills.slice(0, 20).map((skill) => (
              <button
                key={skill.name}
                type="button"
                onClick={() =>
                  addSkill({
                    name: skill.name,
                    category: skill.category,
                    proficiency: 'Intermediate',
                  })
                }
                className="px-3 py-1.5 rounded-sm bg-surface border border-surface-border hover:border-brand-500 hover:bg-brand-50/40 text-charcoal-800 text-xs font-medium transition-all flex items-center gap-1.5 group cursor-pointer shadow-subtle"
              >
                <Plus className="w-3 h-3 text-charcoal-400 group-hover:text-brand-600 transition-colors" />
                <span>{skill.name}</span>
                <span className="text-[10px] text-charcoal-400 group-hover:text-charcoal-600">
                  · {skill.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-charcoal-500 italic">
          * You can change these proficiency ratings later as your verified telemetry expands.
        </p>

        <OnboardingNavigation
          onBack={() => navigate('/onboarding/profile')}
          onContinue={handleContinue}
          continueLabel="Save & Continue to Experience"
          canContinue={data.skills.length > 0}
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingSkillsPage;
