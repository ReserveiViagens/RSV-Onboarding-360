/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuração do diretório de páginas
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configuração básica para desenvolvimento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  // Configuração de webpack simplificada
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false
        }
      }

      // Reduz warnings Watchpack definindo padrões de ignorados
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: ['**/node_modules/**', '**/.git/**', '**/DumpStack.log.tmp', '**/pagefile.sys']
      }
    }
    return config
  },

  // Configuração de rewrites simplificada
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      }
    ];
  },

  // Configurações básicas
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig 