/**
 * SkillSetu Design System Tokens
 * Intelligent Workforce & Career Intelligence Platform
 * Pure JavaScript / Design Tokens
 */

export const colors = {
  canvas: {
    DEFAULT: '#FAF8F5',
    subtle: '#F4F0EA',
    muted: '#EAE5DC',
    hover: '#F0ECE4',
  },
  surface: {
    DEFAULT: '#FFFFFF',
    subtle: '#FAF8F5',
    muted: '#F5F2EC',
    hover: '#F8F6F1',
    active: '#F0ECE4',
    border: '#E8E4DC',
    borderStrong: '#D6D0C5',
  },
  charcoal: {
    DEFAULT: '#181716',
    900: '#181716',
    800: '#2A2724',
    700: '#3F3B35',
    600: '#57524A',
    500: '#736E64',
    400: '#948E83',
    300: '#BFB8AC',
    200: '#DDD8CE',
    100: '#EDE9E1',
    50: '#F7F5F0',
  },
  brand: {
    DEFAULT: '#8C5E3C',
    50: '#FAF6F2',
    100: '#F4ECE3',
    200: '#E6D4C2',
    300: '#D5B79C',
    400: '#B58863',
    500: '#8C5E3C',
    600: '#774C2E',
    700: '#603B22',
    800: '#4A2D19',
    900: '#362010',
  },
  status: {
    success: {
      bg: '#F2F8F5',
      border: '#C4E3D4',
      text: '#1F6948',
      dot: '#2A855C',
      label: 'Success / Active',
    },
    warning: {
      bg: '#FDF8EC',
      border: '#F3DFC0',
      text: '#8B5B14',
      dot: '#B47818',
      label: 'Warning / Review',
    },
    danger: {
      bg: '#FCF3F2',
      border: '#F5CBC7',
      text: '#9E2A22',
      dot: '#C23E34',
      label: 'Critical / At Risk',
    },
    info: {
      bg: '#F3F6FA',
      border: '#C9D8EC',
      text: '#295484',
      dot: '#3B6A9F',
      label: 'Info / Emerging',
    },
    neutral: {
      bg: '#F5F2EC',
      border: '#E0DAD0',
      text: '#524E46',
      dot: '#757067',
      label: 'Neutral / Inactive',
    },
  },
};

export const typography = {
  fontFamily: {
    sans: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  hierarchy: [
    { name: 'Display Heading', class: 'text-display', size: '36px / 2.25rem', weight: '700', sample: 'Workforce Intelligence Architecture' },
    { name: 'Page Heading', class: 'text-page-title', size: '28px / 1.75rem', weight: '600', sample: 'Skills Taxonomy & Benchmarks' },
    { name: 'Section Heading', class: 'text-section-title', size: '20px / 1.25rem', weight: '600', sample: 'Organizational Capability Gaps' },
    { name: 'Card Heading', class: 'text-card-title', size: '16px / 1rem', weight: '600', sample: 'Senior Systems Architect' },
    { name: 'Body Large', class: 'text-body-lg', size: '17px / 1.0625rem', weight: '400', sample: 'Predictive career pathways synthesized from over 40,000 workforce telemetry points.' },
    { name: 'Body Medium (Default)', class: 'text-body-md', size: '15px / 0.9375rem', weight: '400', sample: 'Standard body text for descriptions, tables, and narrative cards.' },
    { name: 'Body Small / Secondary', class: 'text-body-sm', size: '13px / 0.8125rem', weight: '400', sample: 'Last verified 3 days ago by Engineering Leadership Council.' },
    { name: 'Caption', class: 'text-caption', size: '12px / 0.75rem', weight: '500', sample: 'Updated automatically via continuous competency tracking.' },
    { name: 'Label / Micro', class: 'text-label', size: '12px / 0.75rem', weight: '600', sample: 'RECOMMENDED ACTION' },
    { name: 'Stat / Metric Display', class: 'text-stat', size: '32px / 2rem', weight: '700', sample: '94.2%' },
  ],
};

export const radius = [
  { name: 'Extra Small (xs)', value: '4px', class: 'rounded-xs', use: 'Badges, micro tags, small indicators' },
  { name: 'Small (sm)', value: '6px', class: 'rounded-sm', use: 'Buttons, input fields, checkboxes, tooltips' },
  { name: 'Medium (md)', value: '8px', class: 'rounded-md', use: 'Standard cards, popovers, dropdown menus' },
  { name: 'Large (lg)', value: '12px', class: 'rounded-lg', use: 'Featured cards, panel containers, modals' },
  { name: 'Extra Large (xl)', value: '16px', class: 'rounded-xl', use: 'Major dashboard surface blocks, dialogs' },
  { name: 'Pill / Full', value: '9999px', class: 'rounded-pill', use: 'Status pills, avatars, circular action icons' },
];

export const shadows = [
  { name: 'Subtle', class: 'shadow-subtle', description: 'Very low elevation for nested containers' },
  { name: 'Card', class: 'shadow-card', description: 'Standard resting elevation for cards' },
  { name: 'Card Hover', class: 'shadow-card-hover', description: 'Interactive card hover state' },
  { name: 'Dropdown', class: 'shadow-dropdown', description: 'Floating menus and select dropdowns' },
  { name: 'Modal', class: 'shadow-modal', description: 'Overlaid modals and dialog boxes' },
  { name: 'Drawer', class: 'shadow-drawer', description: 'Slide-in side drawers and sheets' },
];

export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
  },
  modalScale: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.96, y: 6, transition: { duration: 0.15 } },
  },
  drawerSlideRight: {
    initial: { x: '100%' },
    animate: { x: 0, transition: { type: 'spring', damping: 28, stiffness: 280 } },
    exit: { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
  },
  bottomSheetSlide: {
    initial: { y: '100%' },
    animate: { y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
    exit: { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
  },
  buttonTap: {
    scale: 0.98,
    transition: { duration: 0.08 },
  },
};
