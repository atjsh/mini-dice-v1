module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/index.html'],
  theme: {
    fontFamily: {
      sans: [
        'Pretendard',
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'Roboto',
        "'Helvetica Neue'",
        "'Segoe UI'",
        "'Apple SD Gothic Neo'",
        "'Noto Sans KR'",
        "'Malgun Gothic'",
        'sans-serif',
      ],
    },
    extend: {
      colors: {
        gray: {
          100: '#E8EAEC',
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      scale: ['active'],
    },
  },
  plugins: [],
};
