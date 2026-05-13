import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextVitals,
  {
    rules: {
      "@next/next/no-page-custom-font": "off",
      "import/no-anonymous-default-export": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      ".playwright-mcp/**",
      ".vercel/**",
      "node_modules/**",
      "tsconfig.tsbuildinfo",
    ],
  },
];
