import type { ReactNode } from 'react';

import '@/app/globals.css';
import { getSEOMetadata } from '@/lib/site/seo';
import { ThemeProvider } from '@/providers/theme-provider';

export const metadata = getSEOMetadata();

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='en'>
            <body className={`bg-background text-foreground antialiased`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
};

export default Layout;
