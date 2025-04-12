import type { ReactNode } from 'react';

import '@/app/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { getSEOMetadata } from '@/lib/site/seo';
import { ThemeProvider } from '@/providers/theme-provider';

export const metadata = getSEOMetadata();

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='en'>
            <body className={`bg-background text-foreground antialiased`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
