'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
    AlertTriangle,
    ArrowLeft,
    Baby,
    Database,
    Globe,
    Lock,
    Mail,
    RefreshCw,
    Scale,
    Shield,
    User,
    UserX
} from 'lucide-react';

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
            <div className='container mx-auto max-w-4xl px-4 py-12'>
                <div className='mb-8 flex items-center justify-between'>
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        onClick={() => router.back()}
                        className='group flex items-center text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'>
                        <ArrowLeft className='size-5 transition-transform group-hover:-translate-x-1' />
                    </Button>
                </div>

                <div className='animate-in fade-in slide-in-from-bottom-4 mb-12 text-center duration-700'>
                    <div className='mb-4 inline-flex items-center justify-center rounded-full bg-slate-100 p-3 shadow-sm dark:bg-slate-800'>
                        <Shield className='h-8 w-8 text-slate-700 dark:text-slate-300' />
                    </div>
                    <h1 className='mb-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
                        Privacy Policy
                    </h1>
                    <div className='flex flex-col items-center justify-center space-y-2 text-sm text-slate-500 sm:flex-row sm:space-y-0 sm:space-x-4 dark:text-slate-400'>
                        <p className='flex items-center'>
                            <span className='mr-2 inline-block h-3 w-3 rounded-full bg-green-500'></span>
                            Effective Date: May 14, 2025
                        </p>
                        <p>Last Updated: May 14, 2025</p>
                    </div>
                </div>

                <Card className='animate-in fade-in mb-8 border-slate-200 bg-white p-6 shadow-lg duration-700 sm:p-8 dark:border-slate-800 dark:bg-slate-900'>
                    <div className='prose prose-slate dark:prose-invert max-w-none'>
                        <p className='text-lg leading-relaxed'>
                            Your privacy is important to us. This Privacy Policy explains how MockTrackr collects, uses,
                            and protects your personal information.
                        </p>

                        <Separator className='my-8' />

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '100ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <User className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    1. What We Collect
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>
                                    We collect only essential personal data:
                                </p>
                                <div className='mt-4 space-y-3'>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <div>
                                            <span className='font-medium text-slate-900 dark:text-slate-100'>Name</span>
                                            <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                                                For identification and leaderboard
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <div>
                                            <span className='font-medium text-slate-900 dark:text-slate-100'>
                                                Email address
                                            </span>
                                            <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                                                For login and notifications
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <div>
                                            <span className='font-medium text-slate-900 dark:text-slate-100'>
                                                Avatar
                                            </span>
                                            <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                                                Optional, used for personalization
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p className='mt-4 text-slate-700 dark:text-slate-300'>
                                    We do not collect sensitive information like address, phone number, location, or
                                    payment details.
                                </p>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '200ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <Database className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    2. How We Use Your Information
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>We use your data to:</p>
                                <div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2'>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <span>Enable secure login and access to features</span>
                                    </div>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <span>Display test data and stats</span>
                                    </div>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <span>Show your name/avatar on leaderboards (if applicable)</span>
                                    </div>
                                    <div className='flex items-start rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <span>Improve our service experience</span>
                                    </div>
                                </div>
                                <div className='mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-300'>
                                    <p className='font-medium'>
                                        Your information is <strong>never sold, rented, or shared</strong> with third
                                        parties.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '300ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <Lock className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    3. Data Security
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <div className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
                                    <p className='text-slate-700 dark:text-slate-300'>
                                        All data is securely stored in our encrypted, self-managed database. We follow
                                        industry-standard best practices to ensure data confidentiality, integrity, and
                                        availability.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '400ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <AlertTriangle className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    4. Advertisements
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>
                                    We may serve <strong>minimal and non-invasive ads</strong> to help sustain the
                                    service. These ads do not track you and do not involve sharing your data with ad
                                    networks.
                                </p>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '500ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <UserX className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    5. Account Control
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>
                                    You have full control over your account:
                                </p>
                                <div className='mt-4 space-y-3'>
                                    <div className='flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <span>
                                            <strong>Update your profile</strong> anytime
                                        </span>
                                    </div>
                                    <div className='flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <span className='mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                                            •
                                        </span>
                                        <span>
                                            <strong>Delete your account</strong> anytime, which removes all your data
                                        </span>
                                    </div>
                                </div>
                                <p className='mt-4 text-slate-700 dark:text-slate-300'>
                                    We do not retain any backups or logs of your deleted data.
                                </p>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '600ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <Baby className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    6. Children's Privacy
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300'>
                                    <p>
                                        MockTrackr is intended for users aged 13 and older. We do not knowingly collect
                                        information from children under 13.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '700ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <Scale className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    7. Legal Compliance
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>
                                    We will disclose data only if legally required (e.g., valid subpoena or legal
                                    request) and are open to cooperating with authorities when necessary.
                                </p>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '800ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <RefreshCw className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    8. Changes to This Policy
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>
                                    We may update this Privacy Policy as our service evolves. Changes will be posted on
                                    this page with a revised date.
                                </p>
                            </div>
                        </section>

                        <section
                            className='animate-in fade-in slide-in-from-bottom-4 mb-8 duration-700'
                            style={{ animationDelay: '900ms' }}>
                            <h2 className='group mb-4 flex items-center text-2xl font-bold'>
                                <Mail className='mr-3 h-6 w-6 text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100' />
                                <span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300'>
                                    9. Contact Us
                                </span>
                            </h2>
                            <div className='pl-9'>
                                <p className='text-slate-700 dark:text-slate-300'>
                                    If you have any questions or concerns:
                                </p>
                                <div className='mt-4 flex flex-col space-y-3'>
                                    <div className='flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <Mail className='mr-3 h-5 w-5 text-slate-500' />
                                        <span>
                                            <strong>Email:</strong> privacy@mocktrackr.app
                                        </span>
                                    </div>
                                    <div className='flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'>
                                        <Globe className='mr-3 h-5 w-5 text-slate-500' />
                                        <span>
                                            <strong>Website:</strong> https://mocktrackr.app
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </Card>

                <div className='mt-12 flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row dark:text-slate-400'>
                    <p>© {new Date().getFullYear()} MockTrackr. All rights reserved.</p>
                    <div className='flex space-x-4'>
                        <Button variant='ghost' size='sm' asChild>
                            <Link href='/terms' className='text-xs'>
                                Terms
                            </Link>
                        </Button>
                        <Button variant='ghost' size='sm' asChild>
                            <Link href='/privacy' className='text-xs'>
                                Privacy
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
