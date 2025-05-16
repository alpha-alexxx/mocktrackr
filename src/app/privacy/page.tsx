import Link from "next/link"
import {
    ArrowLeft,
    Shield,
    Mail,
    Globe,
    Lock,
    User,
    Database,
    AlertTriangle,
    UserX,
    Baby,
    Scale,
    RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function PrivacyPage() {
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
                        <Shield className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-50">Privacy Policy</h1>
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
                            Your privacy is important to us. This Privacy Policy explains how MockTrackr collects, uses, and protects
                            your personal information.
                        </p>

                        <Separator className="my-8" />

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "100ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <User className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    1. What We Collect
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">We collect only essential personal data:</p>
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <div>
                                            <span className="font-medium text-slate-900 dark:text-slate-100">Name</span>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                For identification and leaderboard
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <div>
                                            <span className="font-medium text-slate-900 dark:text-slate-100">Email address</span>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">For login and notifications</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <div>
                                            <span className="font-medium text-slate-900 dark:text-slate-100">Avatar</span>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                Optional, used for personalization
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-slate-700 dark:text-slate-300">
                                    We do not collect sensitive information like address, phone number, location, or payment details.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "200ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <Database className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    2. How We Use Your Information
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">We use your data to:</p>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <span>Enable secure login and access to features</span>
                                    </div>
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <span>Display test data and stats</span>
                                    </div>
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <span>Show your name/avatar on leaderboards (if applicable)</span>
                                    </div>
                                    <div className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs flex-shrink-0">
                                            •
                                        </span>
                                        <span>Improve our service experience</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/30 rounded-lg text-green-800 dark:text-green-300">
                                    <p className="font-medium">
                                        Your information is <strong>never sold, rented, or shared</strong> with third parties.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "300ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <Lock className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    3. Data Security
                                </span>
                            </h2>
                            <div className="pl-9">
                                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-slate-700 dark:text-slate-300">
                                        All data is securely stored in our encrypted, self-managed database. We follow industry-standard
                                        best practices to ensure data confidentiality, integrity, and availability.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "400ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <AlertTriangle className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    4. Advertisements
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">
                                    We may serve <strong>minimal and non-invasive ads</strong> to help sustain the service. These ads do
                                    not track you and do not involve sharing your data with ad networks.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "500ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <UserX className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    5. Account Control
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">You have full control over your account:</p>
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs">
                                            •
                                        </span>
                                        <span>
                                            <strong>Update your profile</strong> anytime
                                        </span>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 text-slate-700 dark:text-slate-300 text-xs">
                                            •
                                        </span>
                                        <span>
                                            <strong>Delete your account</strong> anytime, which removes all your data
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-4 text-slate-700 dark:text-slate-300">
                                    We do not retain any backups or logs of your deleted data.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "600ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <Baby className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    6. Children's Privacy
                                </span>
                            </h2>
                            <div className="pl-9">
                                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30 rounded-lg text-amber-800 dark:text-amber-300">
                                    <p>
                                        MockTrackr is intended for users aged 13 and older. We do not knowingly collect information from
                                        children under 13.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "700ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <Scale className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    7. Legal Compliance
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">
                                    We will disclose data only if legally required (e.g., valid subpoena or legal request) and are open to
                                    cooperating with authorities when necessary.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "800ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <RefreshCw className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    8. Changes to This Policy
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">
                                    We may update this Privacy Policy as our service evolves. Changes will be posted on this page with a
                                    revised date.
                                </p>
                            </div>
                        </section>

                        <section
                            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: "900ms" }}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center group">
                                <Mail className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                    9. Contact Us
                                </span>
                            </h2>
                            <div className="pl-9">
                                <p className="text-slate-700 dark:text-slate-300">If you have any questions or concerns:</p>
                                <div className="mt-4 flex flex-col space-y-3">
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <Mail className="h-5 w-5 mr-3 text-slate-500" />
                                        <span>
                                            <strong>Email:</strong> privacy@mocktrackr.app
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
