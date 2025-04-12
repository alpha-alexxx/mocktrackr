export const siteConfig = {
    name: 'MockTrackr',
    shortName: 'MockTrackr',
    description:
        'Track your SSC CHSL/CGL mock test performance with real-time analysis, calendar view, and downloadable reports. Built for serious aspirants.',
    url: 'https://mocktrackr.vercel.app',
    ogImage: 'https://mocktrackr.vercel.app/og-image.png',
    keywords: [
        'SSC CGL mock test',
        'SSC CHSL tracker',
        'Tier 1 Tier 2 analysis',
        'Exam preparation',
        'Mock test report',
        'Calendar performance',
        'PDF download',
        'SSC exam tool',
        'Daily mock tracker'
    ],
    seo: {
        title: 'MockTrackr — Daily Mock Test Tracker for SSC CHSL & CGL',
        titleTemplate: '%s | MockTrackr',
        description:
            'Smartly track, analyze, and refine your SSC CHSL/CGL preparation with a digital mock test diary, calendar view, and score breakdown.',
        canonical: 'https://mocktrackr.vercel.app',
        openGraph: {
            type: 'website',
            locale: 'en_IN',
            url: 'https://mocktrackr.vercel.app',
            site_name: 'MockTrackr',
            title: 'MockTrackr — Daily SSC Mock Test Performance Tracker',
            description:
                'Track, review and grow your SSC CHSL/CGL scores with tier-wise performance cards and PDF reports.',
            images: [
                {
                    url: 'https://mocktrackr.vercel.app/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'MockTrackr Preview'
                }
            ]
        },
        twitter: {
            handle: '@mocktrackr',
            site: '@mocktrackr',
            cardType: 'summary_large_image',
            title: 'MockTrackr — SSC CHSL & CGL Mock Test Tracker',
            description:
                'Log, evaluate and improve your exam strategy with clean daily analytics and structured PDF reports.',
            image: 'https://mocktrackr.vercel.app/og-image.png'
        },
        additionalMetaTags: [
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0'
            },
            {
                name: 'author',
                content: 'MockTrackr Team'
            },
            {
                name: 'robots',
                content: 'index, follow'
            },
            {
                httpEquiv: 'X-UA-Compatible',
                content: 'IE=edge'
            },
            {
                name: 'theme-color',
                content: '#222222'
            }
        ]
    },

    navItems: [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '#features' },
        { label: 'Showcase', href: '#showcase' },
        { label: 'Benefits', href: '#benefits' },
        { label: 'About', href: '#about' }
    ],

    hero: {
        title: 'Track Your Mocks Like a Topper',
        subtitle:
            'Master SSC CHSL/CGL Tier 1 & 2 prep with daily insights, performance tracking, and exportable PDFs — all in one place.',
        cta: { label: 'Start Now', href: '/register' }
    },

    features: [
        {
            title: 'Google Calendar Integration',
            description:
                'Visualize mock test activity across days and weeks just like a calendar. Never lose track again.',
            icon: 'CalendarDays'
        },
        {
            title: 'Tier-Specific Tracking',
            description:
                'CHSL or CGL? Tier 1 or Tier 2? Select your target pattern and track subject-wise scores accordingly.',
            icon: 'Target'
        },
        {
            title: 'Real-Time PDF Export',
            description:
                'Generate beautifully formatted PTS-style reports instantly, perfect for revision or mentorship.',
            icon: 'FileDown'
        },
        {
            title: 'Smart Analytics',
            description:
                'Auto-calculated scores with subject breakdown, accuracy rates, and performance delta across mocks.',
            icon: 'BarChart3'
        },
        {
            title: 'Note What Went Wrong',
            description:
                'Record personal mistakes, learnings, and time strategy per subject — refine your approach every day.',
            icon: 'NotebookPen'
        },
        {
            title: 'Unlimited Daily Entries',
            description: 'Add as many mocks as you want for each day with full CRUD support, sorted chronologically.',
            icon: 'ListPlus'
        }
    ],

    showcase: {
        title: 'Showcase of Your Daily Growth',
        description:
            "Here's how your report card looks — clean, structured, and export-ready. Perfectly built to reflect daily performance.",
        images: ['/images/pts-card-preview-1.png', '/images/pts-card-preview-2.png', '/images/pts-card-preview-3.png']
    },

    benefits: {
        title: 'Why Use MockTrackr?',
        items: [
            'Structured daily analysis for serious aspirants.',
            'Tier-based customization for accurate evaluation.',
            'Your prep, your history — always accessible.',
            'Clean UI and fast navigation on all devices.',
            'Crafted by exam-focused developers who understand your grind.'
        ]
    },

    howItWorks: [
        {
            title: '1. Choose Exam & Tier',
            description: "Start by selecting CGL or CHSL, and whether you're preparing for Tier 1 or Tier 2.",
            icon: 'BookOpenCheck'
        },
        {
            title: '2. Add Mock Details',
            description: 'Log subject-wise attempts, corrects, wrongs, time taken, and notes in one intuitive form.',
            icon: 'PencilRuler'
        },
        {
            title: '3. Auto-Calculate Score',
            description:
                'Let us do the math — your score is auto-calculated as per SSC rules including negative marking.',
            icon: 'Calculator'
        },
        {
            title: '4. Analyze & Export',
            description: 'View daily cards, download PDF reports, and refine your strategy based on real insights.',
            icon: 'LineChart'
        }
    ],

    faq: [
        {
            question: 'Is this tool free to use?',
            answer: 'Absolutely. MockTrackr is free for personal use — no hidden fees, no subscriptions.'
        },
        {
            question: 'How many mocks can I add per day?',
            answer: "There's no limit! You can log unlimited mocks per day with full subject-wise analysis."
        },
        {
            question: 'Can I export a PDF of my performance?',
            answer: 'Yes. You can download a neatly formatted PDF of your report card with one click.'
        },
        {
            question: 'Will this support SSC MTS or other exams?',
            answer: "Currently optimized for CGL and CHSL, but we'll be expanding support soon based on demand."
        }
    ],

    cta: {
        title: 'Ready to Track Like a Topper?',
        subtitle: 'Start logging your mock performance today — analyze what matters and stay ahead of the curve.',
        button: {
            label: 'Start Tracking Now',
            href: '/register'
        }
    },

    about: {
        title: 'About Us',
        description:
            "MockTrackr is built by SSC aspirants who believe that daily mock test analysis is the secret to success. We're not just building a tool — we're building a habit."
    },

    footer: {
        links: {
            quick: [
                { label: 'Home', href: '/' },
                { label: 'Features', href: '#features' },
                { label: 'Showcase', href: '#showcase' },
                { label: 'About', href: '#about' }
            ],
            legal: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' }
            ],
            socials: [
                { label: 'GitHub', href: 'https://github.com/your-repo' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname' }
            ]
        },
        copyright: '© 2025 MockTrackr. Made with dedication and ❤️ for SSC aspirants across India.'
    }
};
