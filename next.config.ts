import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        nodeMiddleware: true,
        serverComponentsExternalPackages: ['@libsql/client', 'libsql', '@prisma/adapter-libsql']
    },
    webpack: (config, { isServer }) => {
        // Handle binary .node files
        config.module.rules.push({
            test: /\.node$/,
            use: 'ignore-loader'
        });

        // Handle problematic TypeScript declaration files
        config.module.rules.push({
            test: /\.d\.ts$/,
            use: 'ignore-loader'
        });

        // Create external modules for libsql-related packages
        if (!isServer) {
            // For client-side builds, we need to mark these modules as external
            // This prevents webpack from trying to bundle them
            config.resolve.fallback = {
                ...config.resolve.fallback,
                '@libsql/client': false,
                libsql: false,
                '@prisma/adapter-libsql': false
            };
        }

        return config;
    }
};

export default withBundleAnalyzer(nextConfig);
