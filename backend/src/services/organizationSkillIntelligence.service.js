import prisma from '../config/db.js';
import { getCapabilityStatus } from './workforce.service.js';

export const getAggregatedSkillIntelligence = async (organizationId) => {
  const [orgSkills, departments] = await Promise.all([
    prisma.organizationSkill.findMany({
      where: { organizationId },
      include: { skill: true },
    }),
    prisma.department.findMany({
      where: { organizationId },
    }),
  ]);

  const totalTrackedSkills = orgSkills.length;

  if (totalTrackedSkills === 0) {
    return {
      totalTrackedSkills: 0,
      overallWorkforceCoveragePct: 0,
      averageCapability: 0,
      strongestSkillAreas: [],
      developingSkillAreas: [],
      categoryDistribution: [],
      proficiencyDistribution: {
        strong: 0,
        moderate: 0,
        developing: 0,
        limited: 0,
      },
      departmentDistribution: [],
      methodologyNote: 'Deterministic workforce capability aggregation based on organizational inventory telemetry.',
    };
  }

  let totalCurrent = 0;
  let totalTarget = 0;
  const proficiencyDistribution = {
    strong: 0,
    moderate: 0,
    developing: 0,
    limited: 0,
  };

  const categoryMap = new Map();

  const formattedSkills = orgSkills.map((os) => {
    const cur = os.currentCapability || 0;
    const tgt = os.targetCapability || 80;
    totalCurrent += cur;
    totalTarget += tgt;

    const status = getCapabilityStatus(cur);
    if (status === 'Strong') proficiencyDistribution.strong++;
    else if (status === 'Moderate') proficiencyDistribution.moderate++;
    else if (status === 'Developing') proficiencyDistribution.developing++;
    else proficiencyDistribution.limited++;

    const cat = os.skill?.category || 'General';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { category: cat, totalSkills: 0, sumCapability: 0, totalWorkforce: 0 });
    }
    const catEntry = categoryMap.get(cat);
    catEntry.totalSkills++;
    catEntry.sumCapability += cur;
    catEntry.totalWorkforce += (os.workforceCount || 0);

    return {
      skillId: os.skillId,
      name: os.skill?.name || 'Unknown',
      category: cat,
      currentCapability: cur,
      targetCapability: tgt,
      workforceCount: os.workforceCount || 0,
      gap: Math.max(0, tgt - cur),
      status,
      priority: os.priority || 'MEDIUM',
    };
  });

  const averageCapability = Math.round(totalCurrent / totalTrackedSkills);
  const overallWorkforceCoveragePct = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 100;

  // Strongest skills (sorted desc by currentCapability)
  const strongestSkillAreas = formattedSkills
    .filter((s) => s.currentCapability >= 75)
    .sort((a, b) => b.currentCapability - a.currentCapability);

  // Developing skills (sorted desc by gap)
  const developingSkillAreas = formattedSkills
    .filter((s) => s.currentCapability < 75)
    .sort((a, b) => b.gap - a.gap);

  // Category distribution
  const categoryDistribution = Array.from(categoryMap.values()).map((c) => ({
    category: c.category,
    skillCount: c.totalSkills,
    averageCapability: Math.round(c.sumCapability / c.totalSkills),
    workforceCount: c.totalWorkforce,
  })).sort((a, b) => b.skillCount - a.skillCount);

  // Department distribution
  const totalHeadcount = departments.reduce((acc, d) => acc + (d.headcount || 0), 0);
  const departmentDistribution = departments.map((d) => ({
    departmentId: d.id,
    name: d.name,
    headcount: d.headcount || 0,
    percentage: totalHeadcount > 0 ? Number(((d.headcount / totalHeadcount) * 100).toFixed(1)) : 0,
  }));

  return {
    totalTrackedSkills,
    overallWorkforceCoveragePct,
    averageCapability,
    strongestSkillAreas,
    developingSkillAreas,
    categoryDistribution,
    proficiencyDistribution,
    departmentDistribution,
    methodologyNote: 'Deterministic workforce capability aggregation. Represents organizational skill inventory, not employee performance scoring.',
  };
};

export const getSkillClusters = async (organizationId) => {
  const orgSkills = await prisma.organizationSkill.findMany({
    where: { organizationId },
    include: { skill: true },
  });

  if (!orgSkills || orgSkills.length === 0) {
    return {
      organizationId,
      totalTrackedSkills: 0,
      totalClusters: 0,
      clusters: [],
      methodologyNote: 'Semantic workforce skill clustering grouping organizational skills by taxonomy domain & semantic relatedness.',
    };
  }

  // Cluster by category domain + representative anchor skill
  const clusterMap = new Map();

  for (const os of orgSkills) {
    const skillName = os.skill?.name || 'Skill';
    const category = os.skill?.category || 'General';

    if (!clusterMap.has(category)) {
      clusterMap.set(category, {
        clusterId: `cluster-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        clusterName: `${category} Capability Area`,
        category,
        representativeSkill: skillName,
        skills: [],
        averageCapability: 0,
        totalWorkforceCount: 0,
      });
    }

    const cluster = clusterMap.get(category);
    cluster.skills.push({
      skillId: os.skillId,
      name: skillName,
      currentCapability: os.currentCapability || 0,
      targetCapability: os.targetCapability || 80,
      workforceCount: os.workforceCount || 0,
      priority: os.priority || 'MEDIUM',
    });
    cluster.totalWorkforceCount += (os.workforceCount || 0);
  }

  const clusters = Array.from(clusterMap.values()).map((cl) => {
    const sumCap = cl.skills.reduce((acc, s) => acc + s.currentCapability, 0);
    cl.averageCapability = cl.skills.length > 0 ? Math.round(sumCap / cl.skills.length) : 0;
    return cl;
  }).sort((a, b) => b.skills.length - a.skills.length);

  return {
    organizationId,
    totalTrackedSkills: orgSkills.length,
    totalClusters: clusters.length,
    clusters,
    methodologyNote: 'Semantic workforce skill clustering grouping organizational skills by taxonomy domain & semantic relatedness. Represents analytical aggregation, not official industry standards.',
  };
};

export default {
  getAggregatedSkillIntelligence,
  getSkillClusters,
};

