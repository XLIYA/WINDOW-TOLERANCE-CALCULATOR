// eslint.config.ts
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "dist",
      "build",
      "coverage",
      "node_modules",
      // اگر فولدر خروجی دیگری داری، این‌جا اضافه کن
    ],
  },

  // قوانین عمومی برای TS/TSX
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Fast Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // ترجیحاً روشن باشه؛ ولی طبق تنظیم فعلی تو خاموش می‌ذاریم
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // override: خاموش کردن هشدار Fast Refresh فقط برای UI (الگوی shadcn)
  {
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  }
);
