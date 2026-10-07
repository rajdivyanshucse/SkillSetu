import React, { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';

export const FeedbackForm = () => {
  const { addToast } = useToast();
  const [feedbackType, setFeedbackType] = useState('Feature suggestion');
  const [rating, setRating] = useState(5);
  const [featureArea, setFeatureArea] = useState('Learning Intelligence (Phase 15)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      addToast({
        title: 'Message required',
        message: 'Please provide brief details in your feedback message.',
        type: 'warning',
      });
      return;
    }

    setSubmitted(true);
    addToast({
      title: 'Feedback Recorded',
      message: 'Thank you for your feedback! It has been logged in prototype session telemetry.',
      type: 'success',
    });
  };

  const handleReset = () => {
    setMessage('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center bg-surface border-surface-border space-y-4 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-body-lg font-bold text-charcoal-900 font-serif">
            Thanks for your feedback
          </h3>
          <p className="text-body-sm text-charcoal-600 leading-relaxed">
            Your observations help us refine SkillSetu’s career intelligence, learning paths, and workforce planning models.
          </p>
        </div>
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Submit Another Note
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-surface border-surface-border space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Feedback Type */}
        <div className="space-y-1.5">
          <label className="text-body-sm font-semibold text-charcoal-900 block">
            Feedback Category
          </label>
          <Select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            options={[
              'Feature suggestion',
              'Bug report',
              'Usability issue',
              'Data concern',
              'General feedback',
            ]}
          />
        </div>

        {/* Rating 1-5 */}
        <div className="space-y-1.5">
          <label className="text-body-sm font-semibold text-charcoal-900 block">
            Overall Prototype Experience
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className={`
                  p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer
                  ${
                    rating >= val
                      ? 'bg-amber-50 border-amber-300 text-amber-600'
                      : 'bg-canvas-subtle border-surface-border text-charcoal-400 hover:border-charcoal-300'
                  }
                `}
              >
                <Star className={`w-5 h-5 ${rating >= val ? 'fill-current' : ''}`} />
              </button>
            ))}
            <span className="text-xs text-charcoal-500 font-medium ml-2 font-mono">
              {rating === 5 ? '5/5 — Excellent' : `${rating}/5`}
            </span>
          </div>
        </div>

        {/* Which feature were you using */}
        <div className="space-y-1.5">
          <label className="text-body-sm font-semibold text-charcoal-900 block">
            Which workspace area were you using? <span className="text-charcoal-400 font-normal">(Optional)</span>
          </label>
          <Select
            value={featureArea}
            onChange={(e) => setFeatureArea(e.target.value)}
            options={[
              'Skill Intelligence & Gaps (Phase 5 & 6)',
              'Career Roadmap (Phase 7)',
              'Opportunities & Job Match (Phase 8)',
              'Workforce Planning (Phase 12)',
              'Compensation Intelligence (Phase 13)',
              'Professional Growth (Phase 14)',
              'Learning Intelligence (Phase 15)',
              'Account & Settings (Phase 16)',
            ]}
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-body-sm font-semibold text-charcoal-900 block">
            Feedback Message & Suggestions
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your suggestion, observation, or usability friction point in detail..."
            className="w-full p-3 rounded-md bg-surface text-charcoal-900 border border-surface-border text-body-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none resize-y"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <Button type="submit" variant="primary" size="md">
            <Send className="w-4 h-4 mr-1.5" />
            Send Feedback
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FeedbackForm;
