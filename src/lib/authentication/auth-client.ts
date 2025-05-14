import { siteConfig } from '../site/site-config';
import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    appName: siteConfig.name,

    baseURL: process.env.NEXT_PUBLIC_APP_URL!,
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = '/two-factor';
            }
        })
    ]
});
