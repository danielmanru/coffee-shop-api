import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    dir: "tests",
    globals: true,
    testTimeout: 30000,
    // setupFiles: ['/tests/setup.js']
  }
});