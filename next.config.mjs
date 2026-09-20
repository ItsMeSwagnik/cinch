import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@midnight-ntwrk/midnight-js-contracts',
    '@midnight-ntwrk/midnight-js-fetch-zk-config-provider',
    '@midnight-ntwrk/midnight-js-http-client-proof-provider',
    '@midnight-ntwrk/midnight-js-indexer-public-data-provider',
    '@midnight-ntwrk/midnight-js-network-id',
    '@midnight-ntwrk/midnight-js-protocol',
    '@midnight-ntwrk/compact-runtime',
    '@midnight-ntwrk/ledger-v8',
    '@midnight-ntwrk/onchain-runtime-v3',
  ],
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  devIndicators: false,
  webpack(config, { isServer }) {
    config.resolve.alias['@/managed'] = path.resolve(__dirname, 'managed')
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    if (!isServer) config.target = 'web'
    // isomorphic-ws tries to import 'ws' which breaks in browser — point to native WebSocket
    if (!isServer) {
      config.resolve.alias['isomorphic-ws'] = path.resolve(__dirname, 'src/lib/ws-shim.js')
    }
    // Midnight SDK WASM modules must only run client-side
    if (isServer) {
      config.resolve.alias['@midnight-ntwrk/ledger-v8'] = false
      config.resolve.alias['@midnight-ntwrk/onchain-runtime-v3'] = false
      config.resolve.alias['@midnight-ntwrk/compact-runtime'] = false
      config.resolve.alias['@midnight-ntwrk/midnight-js-indexer-public-data-provider'] = false
      config.resolve.alias['@midnight-ntwrk/midnight-js-contracts'] = false
      config.resolve.alias['@midnight-ntwrk/midnight-js-fetch-zk-config-provider'] = false
      config.resolve.alias['@midnight-ntwrk/midnight-js-http-client-proof-provider'] = false
      config.resolve.alias['@midnight-ntwrk/midnight-js-network-id'] = false
      config.resolve.alias['@midnight-ntwrk/midnight-js-protocol'] = false
    }
    return config
  },
}
export default nextConfig
