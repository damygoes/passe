import type { StorybookConfig } from '@storybook/nextjs-vite'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-mcp'),
  ],
  framework: getAbsolutePath('@storybook/nextjs-vite'),
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    const mock = (name: string) => fileURLToPath(new URL(`./__mocks__/${name}`, import.meta.url))

    config.resolve ??= {}

    // Vite alias can be Record<string,string> | { find, replacement }[] — normalize to array
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : Object.entries(config.resolve.alias ?? {}).map(([find, replacement]) => ({ find, replacement }))

    config.resolve.alias = [
      ...existingAliases,
      // Regex anchors prevent '@clerk/nextjs' prefix from eating '@clerk/nextjs/errors'
      { find: /^@clerk\/nextjs\/errors$/, replacement: mock('clerk-errors.ts') },
      { find: /^@clerk\/nextjs$/, replacement: mock('clerk.ts') },
      { find: '@/i18n/navigation', replacement: mock('i18n-navigation.tsx') },
    ]

    // Prevent Vite from pre-bundling Clerk — the alias must intercept it at transform time
    config.optimizeDeps ??= {}
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      '@clerk/nextjs',
      '@clerk/nextjs/errors',
    ]

    return config
  },
}

export default config