/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/:path*',  // All routes will be proxied
          destination: 'http://51.20.144.82:3500/:path*',  // Backend server URL
        },
      ];
    },
  };
  
  export default nextConfig;
  