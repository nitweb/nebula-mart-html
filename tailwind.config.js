const v = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        ink: v('ink'),
        paper: v('paper'),
        line: v('line'),
        star: v('star'),
        success: v('success'),
        danger: v('danger'),
        primary: {
          DEFAULT: v('primary'),
          dark: v('primary-dark'),
          soft: v('primary-soft'),
          100: v('primary-100'),
          200: v('primary-200'),
          300: v('primary-300')
        },
        accent: {
          DEFAULT: v('accent'),
          dark: v('accent-dark'),
          soft: v('accent-soft')
        }
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-body)'
      }
    }
  }
}
