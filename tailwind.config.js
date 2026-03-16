import tailwindTypography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./src/**/*.md', './src/**/*.html', './src/_includes/**/*.njk'],
  plugins: [tailwindTypography],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#1e1e2e",
          light: "#eff1f5",
        },
        text: {
          dark: "#eff1f5",
          light: "#1e1e2e",
        },
        surface: {
          dark: "#28283e",
          light: "#e0e4eb"
        },
        border: {
          dark: "#51517b",
          light: "#a1adc4"
        },
        hover: {
          dark: "#32324e",
          light: "#d0d7e1"
        },
      },
    },
  },
}
