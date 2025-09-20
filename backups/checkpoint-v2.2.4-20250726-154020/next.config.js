/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  

  
  // Configuração de headers para CSP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  },

  // Configuração de webpack para desenvolvimento
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Configurações específicas para resolver problemas de CSP
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false
        }
      }
    }
    
    return config
  },

  // Configuração de rewrites para API
      async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
        {
          source: '/fidelização',
          destination: '/loyalty',
        },
        {
          source: '/fidelizacao',
          destination: '/loyalty',
        },
        {
          source: '/conte%C3%BAdo',
          destination: '/conteudo',
        },
      ];
    },

  // Configuração de output
  output: 'standalone',
  
  // Configuração de trailing slash
  trailingSlash: false,
  
  // Configuração de compressão
  compress: true,
  
  // Configuração de powered by
  poweredByHeader: false,
}

module.exports = nextConfig 