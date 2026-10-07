import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Sparkles, BookOpen, GitBranch, Briefcase, TrendingUp, Building2, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { supportFaqCategories } from '../../data/settingsData';

const categoryIconMap = {
  'getting-started': Sparkles,
  'skill-gaps': GitBranch,
  learning: BookOpen,
  opportunities: Briefcase,
  growth: TrendingUp,
  organization: Building2,
  privacy: ShieldCheck,
};

export const FaqAccordion = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (qKey) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [qKey]: !prev[qKey],
    }));
  };

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return supportFaqCategories
      .filter((cat) => selectedCategory === 'ALL' || cat.id === selectedCategory)
      .map((cat) => {
        const matchingQuestions = cat.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(query) ||
            q.a.toLowerCase().includes(query)
        );
        return {
          ...cat,
          questions: matchingQuestions,
        };
      })
      .filter((cat) => cat.questions.length > 0);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            placeholder="Search SkillSetu help topics, formulas, calibration, or privacy questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-charcoal-400" />}
            className="bg-white pl-10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`
              px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
              ${
                selectedCategory === 'ALL'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-canvas-subtle text-charcoal-600 hover:bg-stone-200/80 border border-surface-border'
              }
            `}
          >
            All Topics
          </button>
          {supportFaqCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = categoryIconMap[cat.id] || HelpCircle;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer
                  ${
                    isSelected
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-canvas-subtle text-charcoal-600 hover:bg-stone-200/80 border border-surface-border'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-6">
          {filteredCategories.map((cat) => {
            const Icon = categoryIconMap[cat.id] || HelpCircle;
            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-brand-50 text-brand-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-body-sm font-bold text-charcoal-900 font-serif">
                    {cat.name}
                  </h3>
                  <Badge variant="outline" className="text-[10px] bg-stone-50 text-charcoal-500 border-stone-200">
                    {cat.questions.length} questions
                  </Badge>
                </div>

                <div className="space-y-2">
                  {cat.questions.map((item, idx) => {
                    const qKey = `${cat.id}-${idx}`;
                    const isOpen = !!openQuestions[qKey];

                    return (
                      <Card
                        key={idx}
                        className="border-surface-border bg-surface overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(qKey)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-canvas-subtle/40 transition-colors cursor-pointer"
                        >
                          <span className="text-body-sm font-semibold text-charcoal-900 pr-4">
                            {item.q}
                          </span>
                          <div className="p-1 rounded text-charcoal-400 shrink-0">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-surface-border/60 bg-canvas-subtle/20 text-body-sm text-charcoal-600 leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center border-dashed border-surface-border bg-canvas-subtle/30 space-y-2">
          <HelpCircle className="w-8 h-8 text-charcoal-400 mx-auto" />
          <h4 className="text-body-sm font-bold text-charcoal-800">No matching help articles found</h4>
          <p className="text-caption text-charcoal-500">
            Try adjusting your search terms or selecting a different category above.
          </p>
        </Card>
      )}
    </div>
  );
};

export default FaqAccordion;
