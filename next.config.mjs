/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Expose SERVER_URL to both server and client
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  async rewrites() {
    // Always use SERVER_URL as the API base
    let apiBaseUrl = process.env.SERVER_URL || ''

    // Remove /api suffix if present (we'll add it in the destination)
    let baseUrl = apiBaseUrl.trim()
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.slice(0, -4)
    }
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1)
    }
    
    return [
      // Keep /api/docs/* in Next.js (for documentation API routes)
      {
        source: '/api/docs/:path*',
        destination: '/api/docs/:path*',
      },
      {
        source: '/api/docs/swagger',
        destination: '/api/docs/swagger',
      },
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
      {
        source: '/api-docs',
        destination: `${baseUrl}/api-docs`,
      },
      {
        source: '/api-docs/:path*',
        destination: `${baseUrl}/api-docs/:path*`,
      },
    ]
  },
}

export default nextConfig
