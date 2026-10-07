/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base canvas & neutral surfaces (warm off-white / cream)
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
          'border-strong': '#D6D0C5',
        },
        // Charcoal & Neutral Grayscale
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
        // Warm Brown Accent (SkillSetu signature brand)
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
        // Semantic status colors (refined, muted, professional)
        status: {
          success: {
            bg: '#F2F8F5',
            border: '#C4E3D4',
            text: '#1F6948',
            dot: '#2A855C',
          },
          warning: {
            bg: '#FDF8EC',
            border: '#F3DFC0',
            text: '#8B5B14',
            dot: '#B47818',
          },
          danger: {
            bg: '#FCF3F2',
            border: '#F5CBC7',
            text: '#9E2A22',
            dot: '#C23E34',
          },
          info: {
            bg: '#F3F6FA',
            border: '#C9D8EC',
            text: '#295484',
            dot: '#3B6A9F',
          },
          neutral: {
            bg: '#F5F2EC',
            border: '#E0DAD0',
            text: '#524E46',
            dot: '#757067',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.03em', fontWeight: '700' }],
        'page-title': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        'section-title': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'card-title': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em', fontWeight: '500' }],
        'label': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.04em', fontWeight: '600', textTransform: 'uppercase' }],
        'stat': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(24, 23, 22, 0.04)',
        'card': '0 1px 3px 0 rgba(24, 23, 22, 0.05), 0 1px 2px -1px rgba(24, 23, 22, 0.05)',
        'card-hover': '0 4px 12px -2px rgba(24, 23, 22, 0.08), 0 2px 6px -1px rgba(24, 23, 22, 0.04)',
        'dropdown': '0 6px 16px -2px rgba(24, 23, 22, 0.09), 0 2px 6px -1px rgba(24, 23, 22, 0.05)',
        'modal': '0 16px 32px -4px rgba(24, 23, 22, 0.12), 0 6px 16px -2px rgba(24, 23, 22, 0.06)',
        'drawer': '0 0 32px 0 rgba(24, 23, 22, 0.10)',
        'glow-brand': '0 0 0 3px rgba(140, 94, 60, 0.15)',
        'glow-focus': '0 0 0 2px #FAF8F5, 0 0 0 4px #8C5E3C',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }
    },
  },
  plugins: [],
}
