import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  
  {
    files: ["**/*.js"], 
    languageOptions: {sourceType: "commonjs"}
  },
  {
    languageOptions: { 
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    }, 
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
      "semi": "error",
      'prefer-destructuring':['error',{'array':true,'object':true},{'enforceForRenamedProperties':false}],
    },
  },
  pluginJs.configs.recommended,
  
];
