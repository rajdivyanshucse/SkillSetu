/**
 * SkillSetu Frontend API Client (Phase 21)
 * Provides standardized HTTP client communication with the SkillSetu Core Backend API.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = typeof localStorage !== 'undefined' ? localStorage.getItem('skillsetu_token') : null;
  }

  setToken(token) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      if (token) localStorage.setItem('skillsetu_token', token);
      else localStorage.removeItem('skillsetu_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP Error ${response.status}`);
        error.status = response.status;
        error.code = data?.error?.code || 'API_ERROR';
        error.details = data?.error?.details || null;
        error.requestId = data?.error?.requestId || data?.requestId || response.headers.get('x-request-id') || null;
        throw error;
      }

      return data;
    } catch (err) {
      // Graceful error logging
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Auth APIs
  auth = {
    login: (credentials) => this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => this.request('/auth/me'),
    logout: () => this.request('/auth/logout', { method: 'POST' }),
  };

  // Profile APIs
  profile = {
    get: () => this.request('/profile'),
    update: (data) => this.request('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    getSnapshot: () => this.request('/profile/snapshot'),
    getTargetRole: () => this.request('/profile/target-roles'),
    setTargetRole: (targetRoleId) => this.request('/profile/target-roles', { method: 'PUT', body: JSON.stringify({ targetRoleId }) }),
    getSkills: () => this.request('/profile/skills'),
    addSkill: (data) => this.request('/profile/skills', { method: 'POST', body: JSON.stringify(data) }),
    updateSkill: (skillId, data) => this.request(`/profile/skills/${skillId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    removeSkill: (skillId) => this.request(`/profile/skills/${skillId}`, { method: 'DELETE' }),
    getExperience: () => this.request('/profile/experience'),
    addExperience: (data) => this.request('/profile/experience', { method: 'POST', body: JSON.stringify(data) }),
    deleteExperience: (id) => this.request(`/profile/experience/${id}`, { method: 'DELETE' }),
    getEducation: () => this.request('/profile/education'),
    addEducation: (data) => this.request('/profile/education', { method: 'POST', body: JSON.stringify(data) }),
    deleteEducation: (id) => this.request(`/profile/education/${id}`, { method: 'DELETE' }),
  };

  // Intelligence APIs
  intelligence = {
    getSkills: () => this.request('/intelligence/skills'),
    getCoverage: (roleId) => this.request(`/intelligence/skills/coverage${roleId ? `?roleId=${roleId}` : ''}`),
    getGaps: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/intelligence/skill-gaps${q ? `?${q}` : ''}`);
    },
    getGapDetail: (skillId) => this.request(`/intelligence/skill-gaps/${skillId}`),
    getCareer: (roleId) => this.request(`/intelligence/career${roleId ? `?roleId=${roleId}` : ''}`),
    getCareerSemantic: (roleId) => this.request(`/intelligence/career/semantic${roleId ? `?roleId=${roleId}` : ''}`),
    getRoadmap: () => this.request('/intelligence/roadmap'),
    updateRoadmapProgress: (data) => this.request('/intelligence/roadmap/progress', { method: 'PATCH', body: JSON.stringify(data) }),
    getLearningRecommendations: () => this.request('/intelligence/learning/recommendations'),

    // Demand Intelligence (Phase 25)
    getDemandSkills: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/intelligence/demand/skills${q ? `?${q}` : ''}`);
    },
    getSkillDemand: (skillId, params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/intelligence/demand/skills/${skillId}${q ? `?${q}` : ''}`);
    },
    getEmergingSkills: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/intelligence/demand/emerging-skills${q ? `?${q}` : ''}`);
    },
    getDemandForecast: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/intelligence/demand/forecast${q ? `?${q}` : ''}`);
    },
  };

  // Skills APIs (Phase 24 & Phase 25)
  skills = {
    semanticSearch: (query, limit = 10) => {
      const q = new URLSearchParams({ q: query, limit: String(limit) }).toString();
      return this.request(`/skills/semantic-search?${q}`);
    },
    getDemand: (skillId) => this.request(`/intelligence/demand/skills/${skillId}`),
    getEmerging: () => this.request('/intelligence/demand/emerging-skills'),
  };

  // Opportunities APIs
  opportunities = {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/opportunities${q ? `?${q}` : ''}`);
    },
    getById: (id) => this.request(`/opportunities/${id}`),
    getCompatibility: (id) => this.request(`/opportunities/${id}/compatibility`),
    getSaved: () => this.request('/opportunities/saved'),
    save: (id, notes) => this.request(`/opportunities/${id}/save`, { method: 'POST', body: JSON.stringify({ notes }) }),
    unsave: (id) => this.request(`/opportunities/${id}/save`, { method: 'DELETE' }),
  };

  // Applications APIs
  applications = {
    list: () => this.request('/applications'),
    create: (data) => this.request('/applications', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/applications/${id}`, { method: 'DELETE' }),
  };

  // Dashboard API
  dashboard = {
    getIndividual: () => this.request('/dashboard/individual'),
    getOrganization: () => this.request('/dashboard/organization'),
  };

  // Organization & Workforce Intelligence APIs (Phase 22 & Phase 24)
  organization = {
    // Profile
    getProfile: () => this.request('/organization/profile'),
    createProfile: (data) => this.request('/organization/profile', { method: 'POST', body: JSON.stringify(data) }),
    updateProfile: (data) => this.request('/organization/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    resetProfile: () => this.request('/organization/profile', { method: 'DELETE' }),
    getSnapshot: () => this.request('/organization/profile/snapshot'),

    // Members
    getMembers: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/members${q ? `?${q}` : ''}`);
    },
    getMemberById: (id) => this.request(`/organization/members/${id}`),
    addMember: (data) => this.request('/organization/members', { method: 'POST', body: JSON.stringify(data) }),
    updateMember: (id, data) => this.request(`/organization/members/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteMember: (id) => this.request(`/organization/members/${id}`, { method: 'DELETE' }),

    // Departments
    getDepartments: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/departments${q ? `?${q}` : ''}`);
    },
    getDepartmentById: (id) => this.request(`/organization/departments/${id}`),
    createDepartment: (data) => this.request('/organization/departments', { method: 'POST', body: JSON.stringify(data) }),
    updateDepartment: (id, data) => this.request(`/organization/departments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteDepartment: (id) => this.request(`/organization/departments/${id}`, { method: 'DELETE' }),

    // Workforce Inventory & Skills
    getWorkforce: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/workforce${q ? `?${q}` : ''}`);
    },
    getWorkforceSkillById: (id) => this.request(`/organization/workforce/${id}`),
    addWorkforceSkill: (data) => this.request('/organization/workforce/skills', { method: 'POST', body: JSON.stringify(data) }),
    updateWorkforceSkill: (id, data) => this.request(`/organization/workforce/skills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteWorkforceSkill: (id) => this.request(`/organization/workforce/skills/${id}`, { method: 'DELETE' }),

    // Skill Intelligence & Gaps & Clusters
    getSkillIntelligence: () => this.request('/organization/intelligence/skills'),
    getSkillClusters: () => this.request('/organization/intelligence/skill-clusters'),
    getSkillGaps: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/intelligence/skill-gaps${q ? `?${q}` : ''}`);
    },
    getSkillGapById: (id) => this.request(`/organization/intelligence/skill-gaps/${id}`),

    // Future Skills
    getFutureSkills: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/future-skills${q ? `?${q}` : ''}`);
    },
    getFutureSkillById: (id) => this.request(`/organization/future-skills/${id}`),
    createFutureSkill: (data) => this.request('/organization/future-skills', { method: 'POST', body: JSON.stringify(data) }),
    updateFutureSkill: (id, data) => this.request(`/organization/future-skills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteFutureSkill: (id) => this.request(`/organization/future-skills/${id}`, { method: 'DELETE' }),

    // Talent Matching & Comparison
    getTalentPool: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/talent${q ? `?${q}` : ''}`);
    },
    getCandidateById: (id) => this.request(`/organization/talent/${id}`),
    getCandidateCompatibility: (id, roleId) => this.request(`/organization/talent/${id}/compatibility${roleId ? `?roleId=${roleId}` : ''}`),
    getCandidateSemanticCompatibility: (id, roleId) => this.request(`/organization/talent/${id}/semantic-compatibility${roleId ? `?roleId=${roleId}` : ''}`),
    compareCandidates: (candidateIds = [], roleId) => {
      const ids = Array.isArray(candidateIds) ? candidateIds.join(',') : candidateIds;
      return this.request(`/organization/talent/compare?candidateIds=${encodeURIComponent(ids)}${roleId ? `&roleId=${roleId}` : ''}`);
    },
    getShortlist: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/talent/shortlist${q ? `?${q}` : ''}`);
    },
    addToShortlist: (candidateId, data = {}) => this.request(`/organization/talent/${candidateId}/shortlist`, { method: 'POST', body: JSON.stringify(data) }),
    removeFromShortlist: (candidateId) => this.request(`/organization/talent/${candidateId}/shortlist`, { method: 'DELETE' }),

    // Role Requirements & Semantic Analysis
    getRoles: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/roles${q ? `?${q}` : ''}`);
    },
    getRoleById: (id) => this.request(`/organization/roles/${id}`),
    getRoleSemanticSkills: (id) => this.request(`/organization/roles/${id}/semantic-skills`),
    createRole: (data) => this.request('/organization/roles', { method: 'POST', body: JSON.stringify(data) }),
    updateRole: (id, data) => this.request(`/organization/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteRole: (id) => this.request(`/organization/roles/${id}`, { method: 'DELETE' }),

    // Planning & Scenarios
    getPlanningOverview: () => this.request('/organization/planning'),
    getScenarios: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/planning/scenarios${q ? `?${q}` : ''}`);
    },
    getScenarioById: (id) => this.request(`/organization/planning/scenarios/${id}`),
    createScenario: (data) => this.request('/organization/planning/scenarios', { method: 'POST', body: JSON.stringify(data) }),
    updateScenario: (id, data) => this.request(`/organization/planning/scenarios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteScenario: (id) => this.request(`/organization/planning/scenarios/${id}`, { method: 'DELETE' }),
    getPlanningRoadmap: () => this.request('/organization/planning/roadmap'),
    updateRoadmapProgress: (data) => this.request('/organization/planning/roadmap/progress', { method: 'PATCH', body: JSON.stringify(data) }),

    // Compensation Intelligence
    getCompensationOverview: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/compensation${q ? `?${q}` : ''}`);
    },
    getRoleCompensation: (roleId) => this.request(`/organization/compensation/roles/${roleId}`),
    getLocationCompensation: () => this.request('/organization/compensation/locations'),

    // Growth Intelligence
    getGrowthOverview: () => this.request('/organization/growth'),
    getGrowthMilestones: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/growth/milestones${q ? `?${q}` : ''}`);
    },
    getGrowthProjects: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/growth/projects${q ? `?${q}` : ''}`);
    },

    // Learning Intelligence
    getLearningOverview: () => this.request('/organization/learning'),
    getLearningPrograms: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/learning/programs${q ? `?${q}` : ''}`);
    },
    getLearningProgramById: (id) => this.request(`/organization/learning/programs/${id}`),
    createLearningProgram: (data) => this.request('/organization/learning/programs', { method: 'POST', body: JSON.stringify(data) }),
    updateLearningProgram: (id, data) => this.request(`/organization/learning/programs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    // Demand Intelligence (Phase 25)
    getDemandIntelligence: () => this.request('/organization/intelligence/demand'),
    getDemandSkills: () => this.request('/organization/intelligence/demand/skills'),
    getDemandRoles: () => this.request('/organization/intelligence/demand/roles'),
    getDemandForecast: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/intelligence/demand/forecast${q ? `?${q}` : ''}`);
    },

    // Recommendations (Phase 26)
    getRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/recommendations${q ? `?${q}` : ''}`);
    },
    getRecommendationDetails: (id) => this.request(`/organization/recommendations/${id}`),
    generateRecommendations: (data = {}) => this.request('/organization/recommendations/generate', { method: 'POST', body: JSON.stringify(data) }),
    updateRecommendationStatus: (id, status, notes = null) => this.request(`/organization/recommendations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
    getWorkforceRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/recommendations/workforce${q ? `?${q}` : ''}`);
    },
    getSkillRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/recommendations/skills${q ? `?${q}` : ''}`);
    },
    getLearningRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/recommendations/learning${q ? `?${q}` : ''}`);
    },
    getFutureSkillRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/organization/recommendations/future-skills${q ? `?${q}` : ''}`);
    },
  };

  // Recommendation APIs (Phase 26)
  recommendations = {
    getRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/recommendations${q ? `?${q}` : ''}`);
    },
    getRecommendationDetails: (id) => this.request(`/recommendations/${id}`),
    generateRecommendations: (data = {}) => this.request('/recommendations/generate', { method: 'POST', body: JSON.stringify(data) }),
    updateRecommendationStatus: (id, status, notes = null) => this.request(`/recommendations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
    dismissRecommendation: (id, reason = 'NOT_RELEVANT', notes = null) => this.request(`/recommendations/${id}/dismiss`, { method: 'POST', body: JSON.stringify({ reason, notes }) }),
    getSkillRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/recommendations/skills${q ? `?${q}` : ''}`);
    },
    getCareerRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/recommendations/career${q ? `?${q}` : ''}`);
    },
    getLearningRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/recommendations/learning${q ? `?${q}` : ''}`);
    },
    getProjectRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/recommendations/projects${q ? `?${q}` : ''}`);
    },
    getOpportunityRecommendations: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/recommendations/opportunities${q ? `?${q}` : ''}`);
    },
  };

  // Admin APIs (Phase 24, 25, 27)
  admin = {
    getAiStatus: () => this.request('/admin/ai/status'),
    reindexSkillEmbeddings: (options = {}) => this.request('/admin/ai/skills/reindex', { method: 'POST', body: JSON.stringify(options) }),
    getDemandStatus: () => this.request('/admin/ai/demand/status'),
    rebuildDemandData: (options = {}) => this.request('/admin/ai/demand/rebuild', { method: 'POST', body: JSON.stringify(options) }),
    rebuildDemandForecasts: (options = {}) => this.request('/admin/ai/demand/forecast/rebuild', { method: 'POST', body: JSON.stringify(options) }),
    getJobs: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return this.request(`/admin/jobs${q ? `?${q}` : ''}`);
    },
    getJobDetails: (jobId) => this.request(`/admin/jobs/${jobId}`),
    cancelJob: (jobId) => this.request(`/admin/jobs/${jobId}/cancel`, { method: 'POST' }),
    getMetrics: () => this.request('/admin/metrics'),
    ingestion: {
      getSources: () => this.request('/admin/ingestion/sources'),
      createSource: (data) => this.request('/admin/ingestion/sources', { method: 'POST', body: JSON.stringify(data) }),
      getDatasets: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return this.request(`/admin/ingestion/datasets${q ? `?${q}` : ''}`);
      },
      getDatasetDetails: (datasetId) => this.request(`/admin/ingestion/datasets/${datasetId}`),
      createDataset: (data) => this.request('/admin/ingestion/datasets', { method: 'POST', body: JSON.stringify(data) }),
      createVersion: (datasetId, data) => this.request(`/admin/ingestion/datasets/${datasetId}/versions`, { method: 'POST', body: JSON.stringify(data) }),
      getVersions: (datasetId) => this.request(`/admin/ingestion/datasets/${datasetId}/versions`),
      importDataset: (datasetId, data) => this.request(`/admin/ingestion/datasets/${datasetId}/import`, { method: 'POST', body: JSON.stringify(data) }),
      getQualityReport: (versionId) => this.request(`/admin/ingestion/quality/${versionId}`),
      getQuarantine: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return this.request(`/admin/ingestion/quarantine${q ? `?${q}` : ''}`);
      },
      getQuarantinedRecord: (recordId) => this.request(`/admin/ingestion/quarantine/${recordId}`),
      reviewQuarantine: (recordId, data) => this.request(`/admin/ingestion/quarantine/${recordId}/review`, { method: 'PATCH', body: JSON.stringify(data) }),
      getJobs: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return this.request(`/admin/ingestion/jobs${q ? `?${q}` : ''}`);
      },
    },
  };

  // System Health
  health = {
    getHealth: () => this.request('/health'),
    getReadiness: () => this.request('/ready'),
  };

  // AI & NLP Intelligence APIs (Phase 23 & Phase 24)
  ai = {
    getStatus: () => this.request('/ai/status'),
    extractSkills: (text) => this.request('/ai/skills/extract', { method: 'POST', body: JSON.stringify({ text }) }),
    analyzeResume: (text) => this.request('/ai/resume/analyze', { method: 'POST', body: JSON.stringify({ text }) }),
    analyzeJobDescription: (text) => this.request('/ai/job-description/analyze', { method: 'POST', body: JSON.stringify({ text }) }),
  };

  // Direct convenience aliases
  extractSkills = (text) => this.ai.extractSkills(text);
  analyzeResume = (text) => this.ai.analyzeResume(text);
  analyzeJobDescription = (text) => this.ai.analyzeJobDescription(text);
  getRecommendations = (params) => this.recommendations.getRecommendations(params);
  generateRecommendations = (data) => this.recommendations.generateRecommendations(data);
  getSkillRecommendations = (params) => this.recommendations.getSkillRecommendations(params);
  getCareerRecommendations = (params) => this.recommendations.getCareerRecommendations(params);
  getLearningRecommendations = (params) => this.recommendations.getLearningRecommendations(params);
  getProjectRecommendations = (params) => this.recommendations.getProjectRecommendations(params);
  getOpportunityRecommendations = (params) => this.recommendations.getOpportunityRecommendations(params);
}

export const api = new ApiClient(API_BASE_URL);
export default api;


