import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

// Initialize bundle analyzer with the condition to enable based on environment variable
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

// Main Next.js config object
const nextConfig: NextConfig = {
    output: 'standalone', // Produces a standalone build for serverless deployments
    experimental: {
        nodeMiddleware: true // Enables experimental Node.js middleware support
    },
    webpack(config) {
        // Add a new rule to ignore markdown (.md) and LICENSE files
        config.module.rules.push({
            test: /\.(md|LICENSE)$/,
            use: 'ignore-loader'
        });

        return config;
    }
};

// Export the configuration with bundle analyzer applied
export default withBundleAnalyzer(nextConfig);
