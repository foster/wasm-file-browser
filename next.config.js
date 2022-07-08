/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // alias /github/ to git-tree file browser
      {
        source: '/github/:user/:repo',
        destination: '/git-tree'
      },
      // alias /github/../tree to git-tree file browser
      {
        source: '/github/:user/:repo/tree/:path*',
        destination: '/git-tree'
      },
      // alias /github/../blob to git-blob viewer
      {
        source: '/github/:user/:repo/blob/:path*',
        destination: '/git-blob'
      },
      // server-side github proxy
      {
        source: '/_github.com/:path*',
        destination: 'https://github.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
