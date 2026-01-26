import { X, Mail, MessageCircle, Bug, HelpCircle, FileText } from 'lucide-react';

interface SupportContactProps {
    onClose: () => void;
}

export function SupportContact({ onClose }: SupportContactProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-950/30 rounded-lg">
                            <HelpCircle className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Support & Contact</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            We're here to help! Whether you have a question, need technical support, or want to provide
                            feedback, we're committed to providing you with the best possible experience.
                        </p>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* General Support */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">General Support</h3>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Questions, feedback, or general inquiries
                                    </p>
                                    <a
                                        href="mailto:strkfit@gmail.com"
                                        className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold"
                                    >
                                        strkfit@gmail.com
                                    </a>
                                    <p className="text-xs text-slate-600 mt-2">
                                        Response time: 24-48 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Technical Issues */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-red-500/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bug className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Technical Support</h3>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Bug reports, technical issues, app crashes
                                    </p>
                                    <a
                                        href="mailto:strkfit@gmail.com"
                                        className="text-sm text-red-400 hover:text-red-300 font-semibold"
                                    >
                                        strkfit@gmail.com
                                    </a>
                                    <p className="text-xs text-slate-600 mt-2">
                                        Response time: 12-24 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Data */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Privacy & Data</h3>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Data deletion, privacy concerns, GDPR requests
                                    </p>
                                    <a
                                        href="mailto:strkfit@gmail.com"
                                        className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold"
                                    >
                                        strkfit@gmail.com
                                    </a>
                                    <p className="text-xs text-slate-600 mt-2">
                                        Response time: 48 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-violet-500/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-violet-950/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-6 h-6 text-violet-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Feedback & Ideas</h3>
                                    <p className="text-sm text-slate-400 mb-3">
                                        Feature requests, suggestions, improvements
                                    </p>
                                    <a
                                        href="mailto:strkfit@gmail.com"
                                        className="text-sm text-violet-400 hover:text-violet-300 font-semibold"
                                    >
                                        strkfit@gmail.com
                                    </a>
                                    <p className="text-xs text-slate-600 mt-2">
                                        We read every submission!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* When Contacting Us */}
                    <section className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-white mb-4">When Contacting Us, Please Include:</h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>Your registered email address</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>Device information (iOS/Android, version)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>App version (found in Profile → Settings)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>Detailed description of your issue or question</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>Screenshots (if applicable)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>Steps to reproduce the issue (for bugs)</span>
                            </li>
                        </ul>
                    </section>

                    {/* FAQ */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            <details className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 group">
                                <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                    How do I delete my account?
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm text-slate-400 mt-3 pl-4 border-l-2 border-cyan-500/30">
                                    Go to Profile → Data Options → Reset Application. Or email strkfit@gmail.com
                                    with your deletion request. See our Data Deletion Policy for more details.
                                </p>
                            </details>

                            <details className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 group">
                                <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                    How do I export my data?
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm text-slate-400 mt-3 pl-4 border-l-2 border-cyan-500/30">
                                    Navigate to Profile → Data Options → Export Data. Your fitness data will be
                                    downloaded as a JSON file that you can save and review.
                                </p>
                            </details>

                            <details className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 group">
                                <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                    Is my data secure?
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm text-slate-400 mt-3 pl-4 border-l-2 border-cyan-500/30">
                                    Yes! We use industry-standard encryption (bcrypt for passwords, JWT for
                                    authentication). Your data is stored securely and never sold to third parties.
                                    Read our Privacy Policy for more information.
                                </p>
                            </details>

                            <details className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 group">
                                <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                    Can I use STRK-FIT offline?
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm text-slate-400 mt-3 pl-4 border-l-2 border-cyan-500/30">
                                    Some features work offline using local storage, but syncing and cloud backup
                                    require an internet connection. We're working on enhanced offline capabilities.
                                </p>
                            </details>

                            <details className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 group">
                                <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                                    How do I report a bug?
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm text-slate-400 mt-3 pl-4 border-l-2 border-cyan-500/30">
                                    Email strkfit@gmail.com with detailed information about the bug, including
                                    screenshots and steps to reproduce. We prioritize bug fixes and will respond quickly.
                                </p>
                            </details>
                        </div>
                    </section>

                    {/* Business Hours */}
                    <section className="bg-cyan-950/20 border border-cyan-900/50 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-white mb-3">Support Hours</h3>
                        <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Monday - Friday:</span>
                                <span className="font-semibold">9:00 AM - 6:00 PM EST</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Saturday:</span>
                                <span className="font-semibold">10:00 AM - 4:00 PM EST</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Sunday:</span>
                                <span className="font-semibold">Closed</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-cyan-900/30">
                                Email support is monitored during business hours. We aim to respond to all inquiries
                                within our stated response times.
                            </p>
                        </div>
                    </section>

                    {/* Social Media */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4">Stay Connected</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="https://twitter.com/strkfit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-colors text-slate-300 hover:text-cyan-400"
                            >
                                <span className="font-semibold">Twitter/X</span>
                            </a>
                            <a
                                href="https://instagram.com/strkfit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-pink-500/50 transition-colors text-slate-300 hover:text-pink-400"
                            >
                                <span className="font-semibold">Instagram</span>
                            </a>
                        </div>
                    </section>

                    {/* Mailing Address */}
                    <section className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-white mb-3">Mailing Address</h3>
                        <div className="text-sm text-slate-400 space-y-1">
                            <p className="font-semibold text-white">STRK-FIT</p>
                            <p>Penukonds</p>
                            <p>Sri Satya Sai District</p>
                            <p>Andhra Pradesh, India - 515110</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
