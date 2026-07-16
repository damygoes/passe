// @ts-check
const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

// getSentryExpoConfig (not getDefaultConfig + withSentryConfig) — the legacy
// withSentryConfig wrapper hooks debug-ID injection onto config.serializer.customSerializer,
// which on Expo SDK 57's metro collides with the unstable_beforeAssetSerializationPlugins
// pipeline and crashes bundling with "Cannot read properties of undefined (reading 'match')"
// (https://github.com/getsentry/sentry-react-native/issues/5315). getSentryExpoConfig hooks
// through that modern plugin slot instead.
/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(projectRoot)

// Watch only what mobile actually imports (workspace packages + hoisted deps).
// Watching the monorepo root would include apps/web/.next, whose constant dev-server
// writes trigger endless Fast Refresh ("Refreshing...") in the dev client.
config.watchFolders = [
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'packages'),
]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

// Workspace packages (e.g. @passe/hooks) resolve peer deps like
// @tanstack/react-query from their own node_modules, which pnpm keys against a
// different react version — yielding two module instances and a broken React
// context ("No QueryClient set"). Pin singletons to the app's copy.
const singletonModules = ['react', 'react-dom', '@tanstack/react-query']
const defaultResolveRequest = config.resolver.resolveRequest

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const singleton = singletonModules.find(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  )
  const resolve = defaultResolveRequest ?? context.resolveRequest
  if (singleton) {
    return resolve(
      { ...context, originModulePath: path.join(projectRoot, 'package.json') },
      moduleName,
      platform,
    )
  }
  return resolve(context, moduleName, platform)
}

module.exports = config
