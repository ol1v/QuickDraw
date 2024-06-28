import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import manifest from './manifest.json'

// @ts-ignore
const viteManifestHackIssue846: Plugin & { renderCrxManifest: (manifest: any, bundle: any) => void } = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: 'manifestHackIssue846',
  renderCrxManifest(_manifest, bundle) {
    bundle['manifest.json'] = bundle['.vite/manifest.json']
    bundle['manifest.json'].fileName = 'manifest.json'
    delete bundle['.vite/manifest.json']
  },
}

export default defineConfig({
  plugins: [svelte(), viteManifestHackIssue846, crx({ manifest })],
})
