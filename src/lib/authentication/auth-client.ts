import { siteConfig } from '../site/site-config';
import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    appName: siteConfig.name,
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = '/two-factor';
            }
        })
    ]
});
