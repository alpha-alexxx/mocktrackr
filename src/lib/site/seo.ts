import type { Metadata } from 'next';

import { siteConfig } from './site-config';

export function getSEOMetadata(): Metadata {
    return {
        metadataBase: new URL(siteConfig.url!),
        title: {
            default: siteConfig.seo.title,
            template: siteConfig.seo.titleTemplate
        },
        description: siteConfig.seo.description,
        keywords: siteConfig.keywords,
        openGraph: {
            type: 'website',
            locale: siteConfig.seo.openGraph.locale,
            url: siteConfig.url,
            title: siteConfig.seo.openGraph.title,
            description: siteConfig.seo.openGraph.description,
            siteName: siteConfig.seo.openGraph.site_name,
            images: siteConfig.seo.openGraph.images
        },
        twitter: {
            card: 'summary_large_image' as const,
            title: siteConfig.seo.twitter.title,
            description: siteConfig.seo.twitter.description,
            site: siteConfig.seo.twitter.site,
            creator: siteConfig.seo.twitter.handle,
            images: [siteConfig.seo.twitter.image]
        },
        authors: [{ name: 'MockTrackr Team', url: siteConfig.url }],
        creator: 'MockTrackr',
        publisher: 'MockTrackr',
        robots: 'index, follow',
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon-16x16.png',
            apple: '/apple-touch-icon.png'
        },
        category: 'Education'
    };
}
