import type { ReactNode } from 'react';

import { Poppins } from 'next/font/google';

import '@/app/globals.css';
import { ThemeToggle } from '@/components/app-ui/theme-switch';
// --- Tiptap Editor Styles ---
import '@/components/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/components/tiptap-templates/simple/simple-editor.scss';
import { Toaster } from '@/components/ui/sonner';
import { getSEOMetadata } from '@/lib/site/seo';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = getSEOMetadata();

export const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
    preload: true,
    style: ['normal', 'italic'],
    fallback: ['Arial', 'sans-serif'],
    adjustFontFallback: false
});

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='en'>
            <body className={`bg-background text-foreground antialiased ${poppins.className}`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    <QueryProvider>
                        {children}
                        <div className='fixed right-5 bottom-5'>
                            <ThemeToggle />
                        </div>
                        <Toaster richColors closeButton />
                    </QueryProvider>
                </ThemeProvider>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
};

export default RootLayout;
