import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // @vitejs/plugin-react configures the automatic JSX runtime and, crucially, dedupes
  // React so react-dom's renderer and the component under test share a single instance.
  // Without it, React 19's module-level hooks dispatcher is set on one copy of `react`
  // while components read `useMemo` from another and see `null`.
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
