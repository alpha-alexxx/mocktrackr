'use client'
import Link from "next/link"
import { ArrowLeft, Book, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function TermsPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        onClick={() => router.back()}
                        className="group flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </div>

                <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 shadow-sm">
                        <Book className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-50">Terms of Service</h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-slate-500 dark:text-slate-400 space-y-2 sm:space-y-0 sm:space-x-4">
                        <p className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            Effective Date: May 14, 2025
                        </p>
                        <p>Last Updated: May 14, 2025</p>
                    </div>
                </div>

                <Card className="p-6 sm:p-8 mb-8 shadow-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 animate-in fade-in duration-700">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed">
                            Welcome to <span className="font-semibold text-slate-900 dark:text-slate-100">MockTrackr</span>. These
                            Terms of Service ("Terms") govern your access to and use of our platform, including any content, features,
                            or services offered.
                        </p>
                        <p className="text-lg leading-relaxed">
                            By using MockTrackr, you agree to these Terms. If you do not agree, please do not use our service.
                        </p>

                        <Separator className="my-8" />

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "100ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    1
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Use of Service
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    MockTrackr is a personal productivity tool designed to help students track mock tests and performance
                                    data. You agree to use this service responsibly and in compliance with all applicable laws.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "200ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    2
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    User Accounts
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    To access some features, you may need to create an account. We only collect minimal information (name,
                                    email, and optional avatar). You are responsible for keeping your login credentials secure.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "300ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    3
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Data Storage and Usage
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    All user data is securely stored in our private database. We do not share your information with third
                                    parties.
                                </p>
                                <p className="text-slate-700 dark:text-slate-300 mt-2">
                                    Test data may be used to generate <strong>leaderboards</strong> that display your{" "}
                                    <strong>name and avatar</strong> (if provided) in a public or semi-public format.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "400ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    4
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Advertisements
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    MockTrackr may display <strong>non-intrusive, harmless advertisements</strong>. These are minimal and
                                    do not compromise user experience or privacy.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "500ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    5
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Account Deletion
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    You may delete your account at any time. Upon deletion, all associated personal and test data will be
                                    permanently erased from our systems.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "600ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    6
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Compliance with Law
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    We are willing to <strong>cooperate with any legal authority</strong> as required by law and to ensure
                                    user safety and platform integrity.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "700ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    7
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Modifications
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">
                                    We may update these Terms periodically. Continued use of the platform after changes constitutes your
                                    acceptance of the updated Terms.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "800ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    8
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    Contact
                                </span>
                            </h2>
                            <div className="pl-11">
                                <p className="text-slate-700 dark:text-slate-300">For questions or legal inquiries:</p>
                                <div className="mt-4 flex flex-col space-y-3">
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <Mail className="h-5 w-5 mr-3 text-slate-500" />
                                        <span>
                                            <strong>Email:</strong> support@mocktrackr.app
                                        </span>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <Globe className="h-5 w-5 mr-3 text-slate-500" />
                                        <span>
                                            <strong>Website:</strong> https://mocktrackr.app
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </Card>

                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-12 gap-4">
                    <p>© {new Date().getFullYear()} MockTrackr. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/terms" className="text-xs">
                                Terms
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/privacy" className="text-xs">
                                Privacy
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
