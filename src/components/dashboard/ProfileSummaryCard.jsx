import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Target, GraduationCap, ArrowRight, ShieldCheck, Edit3 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const ProfileSummaryCard = ({
  profile = {},
  skills = [],
  className = '',
}) => {
  const { navigate } = useRouter();

  // Pick top skills
  const topSkills = skills.slice(0, 5);

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <User className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>
                Calibrated individual career identity.
              </CardDescription>
            </div>
          </div>

          <Badge status="verified" size="sm">
            Active Profile
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* User Identity Banner */}
        <div className="flex items-start gap-3.5 p-3 rounded-lg bg-canvas-subtle/70 border border-surface-border">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-subtle">
            {profile.avatarInitials || 'RS'}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="text-body-md font-bold text-charcoal-900 truncate">
              {profile.fullName || 'Rahul Sharma'}
            </h4>
            <p className="text-xs text-charcoal-600 font-medium truncate">
              {profile.currentRole || 'Computer Science Student'}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-charcoal-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-charcoal-400" />
                {profile.location || 'Bengaluru, India'}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-charcoal-400" />
                {profile.degree || "Bachelor's, Computer Science"}
              </span>
            </div>
          </div>
        </div>

        {/* Target Archetype Pillar */}
        <div className="p-3 rounded-lg bg-brand-50/40 border border-brand-200/60 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
            Target Career Archetype
          </span>
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-extrabold text-charcoal-900">
              {profile.targetRole || 'Backend Software Engineer'}
            </span>
            <span className="text-xs font-bold text-brand-800">
              84% Match
            </span>
          </div>
        </div>

        {/* Top Skills Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block">
            Top Skills In Inventory ({skills.length}):
          </span>

          <div className="flex flex-wrap gap-1.5">
            {topSkills.map((s) => (
              <span
                key={s.name}
                className="text-xs px-2.5 py-1 rounded-sm bg-surface border border-surface-border text-charcoal-800 font-medium flex items-center gap-1.5"
              >
                <span>{s.name}</span>
                <span className="text-[10px] text-charcoal-400 font-normal">
                  · {s.proficiency}
                </span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between bg-canvas-subtle/40">
        <span className="text-xs text-charcoal-500">
          Completeness: {profile.completeness || 92}%
        </span>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => navigate('/onboarding/review')}
        >
          View Calibration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSummaryCard;
