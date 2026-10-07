import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Sparkles, Building2, MapPin, Award } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

export const Card = ({
  children,
  className = '',
  hover = false,
  interactive = false,
  onClick,
  ...props
}) => {
  const Component = interactive ? motion.div : 'div';
  const interactiveProps = interactive
    ? {
        whileHover: { y: -2, transition: { duration: 0.15 } },
        whileTap: { scale: 0.99 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        bg-surface border border-surface-border rounded-lg
        shadow-card transition-all duration-200
        ${hover ? 'hover:border-surface-border-strong hover:shadow-card-hover' : ''}
        ${interactive ? 'cursor-pointer hover:border-surface-border-strong hover:shadow-card-hover' : ''}
        ${className}
      `}
      {...interactiveProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-5 pb-3 flex flex-col gap-1 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-card-title text-charcoal-900 font-semibold tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className="text-body-sm text-charcoal-500 leading-normal">{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 pt-0 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-5 pt-3 border-t border-surface-border flex items-center justify-between text-body-sm text-charcoal-500 ${className}`}>
    {children}
  </div>
);

/* ==========================================================
   Specialized SkillSetu Domain Cards
   ========================================================== */

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  trendText,
  icon,
  className = '',
}) => {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-body-sm font-medium text-charcoal-500">{title}</span>
        {icon && (
          <div className="p-2 rounded-sm bg-canvas-subtle text-charcoal-600 border border-surface-border">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-stat text-charcoal-900">{value}</span>
      </div>

      {(change !== undefined || trendText) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {change !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-xs ${
                changeType === 'positive'
                  ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                  : changeType === 'negative'
                  ? 'bg-status-danger-bg text-status-danger-text border border-status-danger-border'
                  : 'bg-canvas-subtle text-charcoal-600 border border-surface-border'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
              {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
          {trendText && <span className="text-charcoal-500">{trendText}</span>}
        </div>
      )}
    </Card>
  );
};

export const SkillCard = ({
  name,
  category = 'Technical',
  proficiency = 75,
  verified = false,
  demandIndex = 'High',
  growth = '+14%',
  className = '',
}) => {
  return (
    <Card hover className={`p-4 flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-400">
              {category}
            </span>
            <h4 className="text-body-md font-semibold text-charcoal-900 mt-0.5 flex items-center gap-1.5">
              {name}
              {verified && (
                <span title="Skill verified via telemetry">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                </span>
              )}
            </h4>
          </div>
          <Badge status={demandIndex === 'High' ? 'high_priority' : 'neutral'} size="sm">
            {demandIndex} Demand
          </Badge>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-charcoal-500">Proficiency Index</span>
            <span className="font-semibold text-charcoal-800">{proficiency}%</span>
          </div>
          <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${proficiency}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-500">
        <span>Market Growth</span>
        <span className="font-medium text-status-success-text">{growth}</span>
      </div>
    </Card>
  );
};

export const RecommendationCard = ({
  title,
  category = 'Career Pathway',
  matchScore = 96,
  rationale,
  actionLabel = 'Explore Pathway',
  onAction,
  className = '',
}) => {
  return (
    <Card hover className={`p-5 flex flex-col justify-between border-l-4 border-l-brand-500 ${className}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
            <Sparkles className="w-3 h-3" />
            {category}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-charcoal-800">
            <span className="text-brand-600 font-bold">{matchScore}%</span> Match
          </div>
        </div>

        <h4 className="text-card-title text-charcoal-900 font-semibold mb-1.5">
          {title}
        </h4>
        <p className="text-body-sm text-charcoal-600 leading-normal">
          {rationale}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-end">
        <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
};

export const OpportunityCard = ({
  role,
  department = 'Platform Engineering',
  location = 'Remote / Hybrid',
  matchRate = 92,
  skills = ['Distributed Systems', 'Go', 'Kubernetes'],
  deadline = '14 days left',
  onApply,
  className = '',
}) => {
  return (
    <Card hover className={`p-5 flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-body-md font-semibold text-charcoal-900">{role}</h4>
            <div className="flex items-center gap-3 text-xs text-charcoal-500 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            </div>
          </div>
          <Badge status="recommended" size="sm">
            {matchRate}% Match
          </Badge>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
        <span className="text-xs text-charcoal-400">{deadline}</span>
        <Button variant="secondary" size="xs" onClick={onApply}>
          View Position
        </Button>
      </div>
    </Card>
  );
};

export const ChartContainer = ({
  title,
  subtitle,
  filterSlot,
  actionSlot,
  children,
  footerNote,
  className = '',
}) => {
  return (
    <Card className={`p-5 flex flex-col ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div>
          <h4 className="text-card-title text-charcoal-900 font-semibold">{title}</h4>
          {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {filterSlot}
          {actionSlot}
        </div>
      </div>

      <div className="py-4 flex-1">{children}</div>

      {footerNote && (
        <div className="pt-3 border-t border-surface-border text-xs text-charcoal-400">
          {footerNote}
        </div>
      )}
    </Card>
  );
};

export const InsightCard = ({
  title,
  description,
  metric,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        p-4 rounded-lg bg-brand-50/70 border border-brand-200/80
        flex flex-col sm:flex-row sm:items-center justify-between gap-4
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-sm bg-brand-100 text-brand-700 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-body-sm font-semibold text-charcoal-900">{title}</h4>
          <p className="text-xs text-charcoal-600 mt-0.5 leading-normal">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
        {metric && (
          <span className="text-body-md font-bold text-brand-700">{metric}</span>
        )}
        {actionText && (
          <Button variant="brand" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
