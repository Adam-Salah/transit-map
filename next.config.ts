import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env: {
        REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL
    }
};

export default nextConfig;
