'use client';

import { JSX } from 'react';

import Loader from '@/components/app-ui/loader';
import { About, Cta, Faq, Features, Footer, Hero, HowItWorks, Navbar, Showcase } from '@/components/pages/onboarding';
import Benefits from '@/components/pages/onboarding/benefits';
import { useIsClient } from '@/hooks/use-is-client';

/**
 * @component OnboardingPage
 * @description The main landing page component of ScoreSnap application. This component serves as the
 * entry point for the onboarding experience, featuring various sections to showcase the application's
 * features and benefits to potential users.
 *
 * The page implements a modern, gradient-based design with a dark theme and includes multiple
 * sections such as Hero, Features, Showcase, Benefits, How It Works, FAQ, CTA, and About.
 * Each section is designed to guide users through the application's value proposition.
 *
 * @returns {JSX.Element} A fully structured landing page with navigation, main content sections,
 * and footer wrapped in a responsive container with a gradient background.
 *
 */
const OnboardingPage = (): JSX.Element => {
    const isClient = useIsClient();

    if (!isClient) return <Loader />;

    return (
        <div>
            <Navbar />
            <main className='min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white'>
                <Hero />
                <Features />
                <Showcase />
                <Benefits />
                <HowItWorks />
                <Faq />
                <Cta />
                <About />
            </main>
            <Footer />
        </div>
    );
};

export default OnboardingPage;
