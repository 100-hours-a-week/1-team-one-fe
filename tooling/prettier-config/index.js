/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  // 10) Markdown도 보기 좋게 (문장 강제 줄바꿈 최소화)
  proseWrap: 'preserve',
  // (선택) 탭/스페이스: 팀이 스페이스면 2가 보통
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
