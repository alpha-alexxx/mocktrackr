import type { ReactNode } from 'react';

import '@/app/globals.css';
import { ThemeToggle } from '@/components/app-ui/theme-switch';
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
                    <div className='fixed right-5 bottom-5'>
                        <ThemeToggle />
                    </div>
                    <Toaster richColors closeButton />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
