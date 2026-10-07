import React from 'react';
import { Router, useRouter } from './router/Router';
import { ToastProvider } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { OnboardingProvider } from './components/onboarding/OnboardingContext';
import { OrganizationOnboardingProvider } from './components/organization-onboarding/OrganizationOnboardingContext';

// Public Pages (Phase 2)
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PricingPage } from './pages/PricingPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Authentication Pages (Phase 3)
import { LoginPage } from './pages/auth/LoginPage';
import { SignupSelectPage } from './pages/auth/SignupSelectPage';
import { IndividualSignupPage } from './pages/auth/IndividualSignupPage';
import { OrganizationSignupPage } from './pages/auth/OrganizationSignupPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { AccountCreatedPage } from './pages/auth/AccountCreatedPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Onboarding Pages (Phase 4)
import { OnboardingStartPage } from './pages/onboarding/OnboardingStartPage';
import { OnboardingProfilePage } from './pages/onboarding/OnboardingProfilePage';
import { OnboardingSkillsPage } from './pages/onboarding/OnboardingSkillsPage';
import { OnboardingExperiencePage } from './pages/onboarding/OnboardingExperiencePage';
import { OnboardingInterestsPage } from './pages/onboarding/OnboardingInterestsPage';
import { OnboardingGoalsPage } from './pages/onboarding/OnboardingGoalsPage';
import { OnboardingResumePage } from './pages/onboarding/OnboardingResumePage';
import { OnboardingPreferencesPage } from './pages/onboarding/OnboardingPreferencesPage';
import { OnboardingReviewPage } from './pages/onboarding/OnboardingReviewPage';
import { OnboardingCompletePage } from './pages/onboarding/OnboardingCompletePage';

// Dashboard & Career Intelligence Pages (Phase 5)
import { DashboardHomePage } from './pages/dashboard/DashboardHomePage';
import { SkillIntelligencePage } from './pages/dashboard/SkillIntelligencePage';
import { CareerIntelligencePage } from './pages/dashboard/CareerIntelligencePage';
import { DashboardPlaceholderPage } from './pages/dashboard/DashboardPlaceholderPage';

// Phase 30 Intelligence, Demo & Admin Pages
import { ExecutiveIntelligencePage } from './pages/dashboard/ExecutiveIntelligencePage';
import { RecommendationsIntelligencePage } from './pages/dashboard/RecommendationsIntelligencePage';
import { DataQualityDashboardPage } from './pages/admin/DataQualityDashboardPage';
import { DemoHubPage } from './pages/demo/DemoHubPage';

// Skill Gap Analysis Pages (Phase 6)
import { SkillGapPage } from './pages/dashboard/SkillGapPage';
import { SkillGapDetailPage } from './pages/dashboard/SkillGapDetailPage';

// Career Roadmap Pages (Phase 7)
import { CareerRoadmapPage } from './pages/dashboard/CareerRoadmapPage';
import { RoadmapDetailPage } from './pages/dashboard/RoadmapDetailPage';
import { RoadmapSkillPage } from './pages/dashboard/RoadmapSkillPage';

// Opportunities & Job Intelligence Pages (Phase 8)
import { OpportunitiesPage } from './pages/dashboard/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/dashboard/OpportunityDetailPage';
import { SavedOpportunitiesPage } from './pages/dashboard/SavedOpportunitiesPage';
import { ApplicationsPage } from './pages/dashboard/ApplicationsPage';

// Organization Onboarding & Profile Pages (Phase 9 & 10)
import { OrganizationOnboardingStartPage } from './pages/organization/OrganizationOnboardingStartPage';
import { OrganizationOnboardingProfilePage } from './pages/organization/OrganizationOnboardingProfilePage';
import { OrganizationOnboardingIndustryPage } from './pages/organization/OrganizationOnboardingIndustryPage';
import { OrganizationOnboardingWorkforcePage } from './pages/organization/OrganizationOnboardingWorkforcePage';
import { OrganizationOnboardingSkillsPage } from './pages/organization/OrganizationOnboardingSkillsPage';
import { OrganizationOnboardingPrioritiesPage } from './pages/organization/OrganizationOnboardingPrioritiesPage';
import { OrganizationOnboardingFutureSkillsPage } from './pages/organization/OrganizationOnboardingFutureSkillsPage';
import { OrganizationOnboardingPreferencesPage } from './pages/organization/OrganizationOnboardingPreferencesPage';
import { OrganizationOnboardingReviewPage } from './pages/organization/OrganizationOnboardingReviewPage';
import { OrganizationOnboardingCompletePage } from './pages/organization/OrganizationOnboardingCompletePage';
import { OrganizationProfilePage } from './pages/organization/OrganizationProfilePage';
import { OrganizationDashboardPage } from './pages/organization/OrganizationDashboardPage';
import { WorkforceOverviewPage } from './pages/organization/WorkforceOverviewPage';
import { OrganizationPlaceholderPage } from './pages/organization/OrganizationPlaceholderPage';

// Talent Discovery & Matching Pages (Phase 11)
import { TalentDiscoveryPage } from './pages/organization/TalentDiscoveryPage';
import { CandidateDetailPage } from './pages/organization/CandidateDetailPage';
import { TalentComparePage } from './pages/organization/TalentComparePage';
import { TalentShortlistPage } from './pages/organization/TalentShortlistPage';
import { TalentRolesPage } from './pages/organization/TalentRolesPage';
import { TalentRoleDetailPage } from './pages/organization/TalentRoleDetailPage';

// Workforce Planning & Future Intelligence Pages (Phase 12)
import { WorkforcePlanningPage } from './pages/organization/WorkforcePlanningPage';
import { WorkforcePlanningSkillsPage } from './pages/organization/WorkforcePlanningSkillsPage';
import { WorkforcePlanningScenariosPage } from './pages/organization/WorkforcePlanningScenariosPage';
import { WorkforceScenarioDetailPage } from './pages/organization/WorkforceScenarioDetailPage';
import { WorkforcePlanningRoadmapPage } from './pages/organization/WorkforcePlanningRoadmapPage';

// Compensation & Opportunity Intelligence Pages (Phase 13)
import { CompensationIntelligencePage } from './pages/dashboard/CompensationIntelligencePage';
import { CompensationRolesPage } from './pages/dashboard/CompensationRolesPage';
import { CompensationRoleDetailPage } from './pages/dashboard/CompensationRoleDetailPage';
import { CompensationSkillsPage } from './pages/dashboard/CompensationSkillsPage';
import { CompensationLocationsPage } from './pages/dashboard/CompensationLocationsPage';
import { CompensationComparePage } from './pages/dashboard/CompensationComparePage';
import { OrganizationCompensationPage } from './pages/organization/OrganizationCompensationPage';
import { OrganizationCompensationRolesPage } from './pages/organization/OrganizationCompensationRolesPage';
import { OrganizationCompensationSkillsPage } from './pages/organization/OrganizationCompensationSkillsPage';

// Professional Growth & Success Intelligence Pages (Phase 14)
import ProfessionalGrowthPage from './pages/dashboard/ProfessionalGrowthPage';
import GrowthSkillsPage from './pages/dashboard/GrowthSkillsPage';
import GrowthLearningPage from './pages/dashboard/GrowthLearningPage';
import GrowthProjectsPage from './pages/dashboard/GrowthProjectsPage';
import GrowthMilestonesPage from './pages/dashboard/GrowthMilestonesPage';
import GrowthInsightsPage from './pages/dashboard/GrowthInsightsPage';
import OrganizationGrowthPage from './pages/organization/OrganizationGrowthPage';
import OrganizationGrowthCapabilitiesPage from './pages/organization/OrganizationGrowthCapabilitiesPage';
import OrganizationDevelopmentPage from './pages/organization/OrganizationDevelopmentPage';

// Education, Learning & Skill Development Intelligence Pages (Phase 15)
import LearningIntelligencePage from './pages/dashboard/LearningIntelligencePage';
import LearningRecommendationsPage from './pages/dashboard/LearningRecommendationsPage';
import LearningPathDetailPage from './pages/dashboard/LearningPathDetailPage';
import LearningCatalogPage from './pages/dashboard/LearningCatalogPage';
import SavedLearningPage from './pages/dashboard/SavedLearningPage';
import LearningProjectsPage from './pages/dashboard/LearningProjectsPage';
import OrganizationLearningPage from './pages/organization/OrganizationLearningPage';
import OrganizationLearningProgramsPage from './pages/organization/OrganizationLearningProgramsPage';
import OrganizationLearningCapabilitiesPage from './pages/organization/OrganizationLearningCapabilitiesPage';

// Settings, Notifications, Support & Account Intelligence Pages (Phase 16)
import SettingsPage from './pages/dashboard/SettingsPage';
import AccountSettingsPage from './pages/dashboard/AccountSettingsPage';
import ProfileSettingsPage from './pages/dashboard/ProfileSettingsPage';
import CareerSettingsPage from './pages/dashboard/CareerSettingsPage';
import NotificationSettingsPage from './pages/dashboard/NotificationSettingsPage';
import LearningSettingsPage from './pages/dashboard/LearningSettingsPage';
import OpportunitySettingsPage from './pages/dashboard/OpportunitySettingsPage';
import PrivacySettingsPage from './pages/dashboard/PrivacySettingsPage';
import AppearanceSettingsPage from './pages/dashboard/AppearanceSettingsPage';
import AccountActivityPage from './pages/dashboard/AccountActivityPage';
import SupportPage from './pages/dashboard/SupportPage';
import FeedbackPage from './pages/dashboard/FeedbackPage';
import DeleteAccountPage from './pages/dashboard/DeleteAccountPage';

import OrganizationSettingsPage from './pages/organization/OrganizationSettingsPage';
import OrganizationCompanySettingsPage from './pages/organization/OrganizationCompanySettingsPage';
import OrganizationMembersSettingsPage from './pages/organization/OrganizationMembersSettingsPage';
import OrganizationNotificationSettingsPage from './pages/organization/OrganizationNotificationSettingsPage';
import OrganizationWorkforceSettingsPage from './pages/organization/OrganizationWorkforceSettingsPage';
import OrganizationPrivacySettingsPage from './pages/organization/OrganizationPrivacySettingsPage';
import OrganizationAppearanceSettingsPage from './pages/organization/OrganizationAppearanceSettingsPage';
import OrganizationActivityPage from './pages/organization/OrganizationActivityPage';
import OrganizationSupportPage from './pages/organization/OrganizationSupportPage';

const AppRoutes = () => {
  const { currentPath } = useRouter();

  // Phase 30 Demo & Executive Intelligence Routes
  if (currentPath === '/demo') {
    return <DemoHubPage />;
  }
  if (currentPath === '/demo/individual') {
    return <DemoHubPage initialTab="individual" />;
  }
  if (currentPath === '/demo/organization') {
    return <DemoHubPage initialTab="organization" />;
  }
  if (currentPath === '/intelligence') {
    return <ExecutiveIntelligencePage />;
  }
  if (currentPath === '/dashboard/recommendations' || currentPath === '/organization/recommendations') {
    return <RecommendationsIntelligencePage />;
  }
  if (currentPath === '/admin' || currentPath === '/admin/data-quality') {
    return <DataQualityDashboardPage />;
  }

  // Internal design system showcase
  if (currentPath === '/design-system') {
    return <DesignSystemPage />;
  }

  // Parameterized learning path detail route: /dashboard/learning/path/:pathId
  if (
    currentPath.startsWith('/dashboard/learning/path/') &&
    currentPath.length > '/dashboard/learning/path/'.length
  ) {
    const pathId = currentPath.replace('/dashboard/learning/path/', '').split('/')[0].split('?')[0].trim();
    return <LearningPathDetailPage pathId={pathId} />;
  }

  // Parameterized workforce scenario detail route: /organization/planning/scenarios/:scenarioId
  if (
    currentPath.startsWith('/organization/planning/scenarios/') &&
    currentPath.length > '/organization/planning/scenarios/'.length
  ) {
    const scenarioId = currentPath.replace('/organization/planning/scenarios/', '').trim();
    return <WorkforceScenarioDetailPage scenarioId={scenarioId} />;
  }

  // Parameterized talent role detail route: /organization/talent/roles/:roleId
  if (currentPath.startsWith('/organization/talent/roles/') && currentPath.length > '/organization/talent/roles/'.length) {
    const roleId = currentPath.replace('/organization/talent/roles/', '').trim();
    return <TalentRoleDetailPage roleId={roleId} />;
  }

  // Parameterized talent candidate detail route: /organization/talent/:candidateId
  if (
    currentPath.startsWith('/organization/talent/') &&
    currentPath.length > '/organization/talent/'.length &&
    !currentPath.startsWith('/organization/talent/roles') &&
    currentPath !== '/organization/talent/compare' &&
    currentPath !== '/organization/talent/shortlist'
  ) {
    const candidateId = currentPath.replace('/organization/talent/', '').trim();
    return <CandidateDetailPage candidateId={candidateId} />;
  }

  // Parameterized skill gap detail route: /dashboard/skill-gaps/:skillId
  if (currentPath.startsWith('/dashboard/skill-gaps/') && currentPath.length > '/dashboard/skill-gaps/'.length) {
    const skillId = currentPath.replace('/dashboard/skill-gaps/', '').trim();
    return <SkillGapDetailPage skillId={skillId} />;
  }

  // Parameterized career roadmap skill detail route: /dashboard/career-roadmap/skill/:skillId
  if (currentPath.startsWith('/dashboard/career-roadmap/skill/') && currentPath.length > '/dashboard/career-roadmap/skill/'.length) {
    const skillId = currentPath.replace('/dashboard/career-roadmap/skill/', '').trim();
    return <RoadmapSkillPage skillId={skillId} />;
  }

  // Parameterized career roadmap stage detail route: /dashboard/career-roadmap/:roadmapId
  if (
    currentPath.startsWith('/dashboard/career-roadmap/') &&
    currentPath.length > '/dashboard/career-roadmap/'.length &&
    !currentPath.startsWith('/dashboard/career-roadmap/skill/')
  ) {
    const roadmapId = currentPath.replace('/dashboard/career-roadmap/', '').trim();
    return <RoadmapDetailPage roadmapId={roadmapId} />;
  }

  // Parameterized opportunity detail route: /dashboard/jobs/:jobId
  if (currentPath.startsWith('/dashboard/jobs/') && currentPath.length > '/dashboard/jobs/'.length) {
    const jobId = currentPath.replace('/dashboard/jobs/', '').trim();
    return <OpportunityDetailPage jobId={jobId} />;
  }

  // Parameterized compensation role detail route: /dashboard/compensation/roles/:roleId
  if (
    currentPath.startsWith('/dashboard/compensation/roles/') &&
    currentPath.length > '/dashboard/compensation/roles/'.length
  ) {
    const roleId = currentPath.replace('/dashboard/compensation/roles/', '').trim();
    return <CompensationRoleDetailPage roleId={roleId} />;
  }

  // Phase 9, 10 & 11 Organization Workspace & Intelligence Routes
  switch (currentPath) {
    case '/organization/onboarding':
      return <OrganizationOnboardingStartPage />;
    case '/organization/onboarding/company':
      return <OrganizationOnboardingProfilePage />;
    case '/organization/onboarding/industry':
      return <OrganizationOnboardingIndustryPage />;
    case '/organization/onboarding/workforce':
      return <OrganizationOnboardingWorkforcePage />;
    case '/organization/onboarding/skills':
      return <OrganizationOnboardingSkillsPage />;
    case '/organization/onboarding/priorities':
      return <OrganizationOnboardingPrioritiesPage />;
    case '/organization/onboarding/future-skills':
      return <OrganizationOnboardingFutureSkillsPage />;
    case '/organization/onboarding/preferences':
      return <OrganizationOnboardingPreferencesPage />;
    case '/organization/onboarding/review':
      return <OrganizationOnboardingReviewPage />;
    case '/organization/onboarding/complete':
      return <OrganizationOnboardingCompletePage />;
    case '/organization/profile':
      return <OrganizationProfilePage />;
    case '/organization/dashboard':
      return <OrganizationDashboardPage />;
    case '/organization/workforce':
    case '/organization/skills':
      return <WorkforceOverviewPage />;
    case '/organization/talent':
      return <TalentDiscoveryPage />;
    case '/organization/talent/compare':
      return <TalentComparePage />;
    case '/organization/talent/shortlist':
      return <TalentShortlistPage />;
    case '/organization/talent/roles':
      return <TalentRolesPage />;
    case '/organization/skill-gaps':
      return <WorkforcePlanningSkillsPage />;
    case '/organization/future-skills':
      return <OrganizationGrowthCapabilitiesPage />;
    case '/organization/planning':
      return <WorkforcePlanningPage />;
    case '/organization/planning/skills':
      return <WorkforcePlanningSkillsPage />;
    case '/organization/planning/scenarios':
      return <WorkforcePlanningScenariosPage />;
    case '/organization/planning/roadmap':
      return <WorkforcePlanningRoadmapPage />;
    case '/organization/compensation':
      return <OrganizationCompensationPage />;
    case '/organization/compensation/roles':
      return <OrganizationCompensationRolesPage />;
    case '/organization/compensation/skills':
      return <OrganizationCompensationSkillsPage />;
    case '/organization/growth':
      return <OrganizationGrowthPage />;
    case '/organization/growth/capabilities':
      return <OrganizationGrowthCapabilitiesPage />;
    case '/organization/growth/development':
      return <OrganizationDevelopmentPage />;
    case '/organization/learning':
      return <OrganizationLearningPage />;
    case '/organization/learning/programs':
      return <OrganizationLearningProgramsPage />;
    case '/organization/learning/capabilities':
      return <OrganizationLearningCapabilitiesPage />;
    case '/organization/settings':
      return <OrganizationSettingsPage />;
    case '/organization/settings/company':
      return <OrganizationCompanySettingsPage />;
    case '/organization/settings/members':
      return <OrganizationMembersSettingsPage />;
    case '/organization/settings/notifications':
      return <OrganizationNotificationSettingsPage />;
    case '/organization/settings/workforce':
      return <OrganizationWorkforceSettingsPage />;
    case '/organization/settings/privacy':
      return <OrganizationPrivacySettingsPage />;
    case '/organization/settings/appearance':
      return <OrganizationAppearanceSettingsPage />;
    case '/organization/settings/activity':
      return <OrganizationActivityPage />;
    case '/organization/settings/support':
      return <OrganizationSupportPage />;
    default:
      break;
  }

  // Phase 5, 6, 7, 8, 13, 14, 15 & 16 Individual Dashboard & Intelligence Routes
  switch (currentPath) {
    case '/dashboard':
      return <DashboardHomePage />;
    case '/dashboard/skill-intelligence':
      return <SkillIntelligencePage />;
    case '/dashboard/career-intelligence':
      return <CareerIntelligencePage />;
    case '/dashboard/skill-gaps':
      return <SkillGapPage />;
    case '/dashboard/career-roadmap':
      return <CareerRoadmapPage />;
    case '/dashboard/growth':
      return <ProfessionalGrowthPage />;
    case '/dashboard/growth/skills':
      return <GrowthSkillsPage />;
    case '/dashboard/growth/learning':
      return <GrowthLearningPage />;
    case '/dashboard/growth/projects':
      return <GrowthProjectsPage />;
    case '/dashboard/growth/milestones':
      return <GrowthMilestonesPage />;
    case '/dashboard/growth/insights':
      return <GrowthInsightsPage />;
    case '/dashboard/learning':
      return <LearningIntelligencePage />;
    case '/dashboard/learning/recommendations':
      return <LearningRecommendationsPage />;
    case '/dashboard/learning/catalog':
      return <LearningCatalogPage />;
    case '/dashboard/learning/saved':
      return <SavedLearningPage />;
    case '/dashboard/learning/projects':
      return <LearningProjectsPage />;
    case '/dashboard/jobs':
      return <OpportunitiesPage />;
    case '/dashboard/compensation':
      return <CompensationIntelligencePage />;
    case '/dashboard/compensation/roles':
      return <CompensationRolesPage />;
    case '/dashboard/compensation/skills':
      return <CompensationSkillsPage />;
    case '/dashboard/compensation/locations':
      return <CompensationLocationsPage />;
    case '/dashboard/compensation/compare':
      return <CompensationComparePage />;
    case '/dashboard/saved':
      return <SavedOpportunitiesPage />;
    case '/dashboard/applications':
      return <ApplicationsPage />;
    case '/dashboard/settings':
      return <SettingsPage />;
    case '/dashboard/settings/account':
      return <AccountSettingsPage />;
    case '/dashboard/settings/profile':
      return <ProfileSettingsPage />;
    case '/dashboard/settings/career':
      return <CareerSettingsPage />;
    case '/dashboard/settings/notifications':
      return <NotificationSettingsPage />;
    case '/dashboard/settings/learning':
      return <LearningSettingsPage />;
    case '/dashboard/settings/opportunities':
      return <OpportunitySettingsPage />;
    case '/dashboard/settings/privacy':
      return <PrivacySettingsPage />;
    case '/dashboard/settings/appearance':
      return <AppearanceSettingsPage />;
    case '/dashboard/settings/activity':
      return <AccountActivityPage />;
    case '/dashboard/settings/support':
      return <SupportPage />;
    case '/dashboard/settings/feedback':
      return <FeedbackPage />;
    case '/dashboard/settings/delete-account':
      return <DeleteAccountPage />;
    case '/profile':
      return <OnboardingReviewPage />;
    default:
      break;
  }

  // Phase 4 Individual Onboarding Routes
  switch (currentPath) {
    case '/onboarding':
      return <OnboardingStartPage />;
    case '/onboarding/profile':
      return <OnboardingProfilePage />;
    case '/onboarding/skills':
      return <OnboardingSkillsPage />;
    case '/onboarding/experience':
      return <OnboardingExperiencePage />;
    case '/onboarding/interests':
      return <OnboardingInterestsPage />;
    case '/onboarding/goals':
      return <OnboardingGoalsPage />;
    case '/onboarding/resume':
      return <OnboardingResumePage />;
    case '/onboarding/preferences':
      return <OnboardingPreferencesPage />;
    case '/onboarding/review':
      return <OnboardingReviewPage />;
    case '/onboarding/complete':
      return <OnboardingCompletePage />;
    default:
      break;
  }

  // Phase 3 Authentication Routes
  switch (currentPath) {
    case '/login':
      return <LoginPage />;
    case '/signup':
      return <SignupSelectPage />;
    case '/signup/individual':
      return <IndividualSignupPage />;
    case '/signup/organization':
      return <OrganizationSignupPage />;
    case '/verify-email':
      return <VerifyEmailPage />;
    case '/account-created':
      return <AccountCreatedPage />;
    case '/forgot-password':
      return <ForgotPasswordPage />;
    case '/reset-password':
      return <ResetPasswordPage />;
    default:
      break;
  }

  // Phase 2 Public Marketing Pages & Fallback Route Handling
  const publicRoutes = ['/', '/features', '/how-it-works', '/about', '/contact', '/pricing'];
  
  if (!publicRoutes.includes(currentPath)) {
    return <NotFoundPage />;
  }

  const renderPublicContent = () => {
    switch (currentPath) {
      case '/features':
        return <FeaturesPage />;
      case '/how-it-works':
        return <HowItWorksPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/pricing':
        return <PricingPage />;
      case '/':
      default:
        return <LandingPage />;
    }
  };

  return <PublicLayout>{renderPublicContent()}</PublicLayout>;
};

export function App() {
  return (
    <Router>
      <ToastProvider>
        <OnboardingProvider>
          <OrganizationOnboardingProvider>
            <AppRoutes />
          </OrganizationOnboardingProvider>
        </OnboardingProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
