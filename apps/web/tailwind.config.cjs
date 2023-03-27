module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
        minidice_red: '#ea4f43',
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
