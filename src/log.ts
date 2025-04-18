/* eslint-disable no-console */
import type { ResolvedConfig } from 'vite'
import type { BuildResult } from 'workbox-build'
import type { ResolvedVitePWAOptions } from './types'
import { relative } from 'node:path'
import { cyan, dim, green, magenta, yellow } from 'kolorist'
import { normalizePath } from './utils'

export function logSWViteBuild(
  version: string,
  swName: string,
  viteOptions: ResolvedConfig,
  format: 'es' | 'iife',
) {
  const { logLevel = 'info' } = viteOptions
  if (logLevel === 'silent')
    return

  if (logLevel === 'info') {
    console.info([
      '',
      `${cyan(`PWA v${version}`)}`,
      `Building ${magenta(swName)} service worker ("${magenta(format)}" format)...`,
    ].join('\n'))
  }
}

export function logWorkboxResult(
  version: string,
  throwMaximumFileSizeToCacheInBytes: boolean,
  strategy: ResolvedVitePWAOptions['strategies'],
  buildResult: BuildResult,
  viteOptions: ResolvedConfig,
  format: 'es' | 'iife' | 'none' = 'none',
) {
  if (throwMaximumFileSizeToCacheInBytes) {
    const entries = buildResult.warnings.filter(w => w.includes('maximumFileSizeToCacheInBytes'))
    if (entries.length) {
      const prefix = strategy === 'generateSW' ? 'workbox' : 'injectManifest'
      throw new Error(`
  Configure "${prefix}.maximumFileSizeToCacheInBytes" to change the limit: the default value is 2 MiB.
  Check https://vite-pwa-org.netlify.app/guide/faq.html#missing-assets-from-sw-precache-manifest for more information.
  Assets exceeding the limit:
${entries.map(w => `  - ${w.replace('. Configure maximumFileSizeToCacheInBytes to change this limit', '')}`).join('\n')}
`)
    }
  }

  const { root, logLevel = 'info' } = viteOptions

  if (logLevel === 'silent')
    return

  const { count, size, filePaths, warnings } = buildResult

  if (logLevel === 'info') {
    const entries = [
      '',
      `${cyan(`PWA v${version}`)}`,
      `mode      ${magenta(strategy)}`,
    ]
    if (strategy === 'injectManifest')
      entries.push(`format:   ${magenta(format)}`)

    entries.push(
      `precache  ${green(`${count} entries`)} ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
      'files generated',
      ...filePaths.map(p => `  ${dim(normalizePath(relative(root, p)))}`),
    )

    console.info(entries.join('\n'))
  }

  // log build warning
  warnings && warnings.length > 0 && console.warn(yellow([
    'warnings',
    ...warnings.map(w => `  ${w}`),
    '',
  ].join('\n')))
}
