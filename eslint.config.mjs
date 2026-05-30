import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", ".next/**", "out/**", "playwright-report/**"] },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
