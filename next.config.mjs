/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enable React's strict mode for catching potential issues
    experimental: {
      logging: true, // Enable additional logging for debugging
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        // Enables verbose logs on the server-side
        console.log("Building for the server...");
      } else {
        console.log("Building for the client...");
      }
      return config;
    },
  };
  
  export default nextConfig;
  