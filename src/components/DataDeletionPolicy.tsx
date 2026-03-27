import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DataDeletionPolicyProps {
    onClose: () => void;
}

export function DataDeletionPolicy({ onClose }: DataDeletionPolicyProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-950/30 rounded-lg">
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Data Deletion Policy</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
                    <div>
                        <p className="text-sm text-slate-500 mb-4">
                            Last Updated: December 28, 2025
                        </p>
                        <p className="text-sm leading-relaxed">
                            At STRK-FIT, we respect your right to control your personal data. This Data Deletion Policy
                            explains how you can request deletion of your account and all associated data.
                        </p>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-400 mb-1">
                                    Important Notice
                                </p>
                                <p className="text-xs text-slate-400">
                                    Data deletion is permanent and cannot be undone. Please ensure you have exported
                                    any data you wish to keep before proceeding with deletion.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">1. Your Right to Deletion</h3>
                        <p className="text-sm leading-relaxed">
                            Under data protection laws including GDPR (General Data Protection Regulation) and CCPA
                            (California Consumer Privacy Act), you have the right to request deletion of your personal
                            data. We are committed to honoring this right.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">2. What Data Will Be Deleted</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            When you request account deletion, the following data will be permanently removed:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Your profile information (name, email, phone, date of birth)</li>
                            <li>Body metrics (height, weight history, target weight)</li>
                            <li>All daily fitness logs and workout records</li>
                            <li>Exercise and food intake logs</li>
                            <li>Work shift schedules and location data</li>
                            <li>Saved resources and bookmarks</li>
                            <li>Progress levels, XP, and achievements</li>
                            <li>Account settings and preferences</li>
                            <li>Any other personal data associated with your account</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">3. How to Request Data Deletion</h3>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Method 1: In-App Deletion</h4>
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 mb-3">
                            <ol className="list-decimal list-inside text-sm space-y-2">
                                <li>Open the STRK-FIT app and log in to your account</li>
                                <li>Navigate to the <strong className="text-cyan-400">Profile</strong> tab</li>
                                <li>Scroll down to <strong className="text-cyan-400">Data Options</strong></li>
                                <li>Click the <strong className="text-red-400">Reset Application</strong> button</li>
                                <li>Confirm your decision when prompted</li>
                            </ol>
                            <p className="text-xs text-slate-500 mt-3">
                                Your data will be deleted immediately and you will be logged out.
                            </p>
                        </div>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Method 2: Email Request</h4>
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                            <p className="text-sm mb-2">Send an email to our Data Protection Team:</p>
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                <p className="text-sm"><strong>Email:</strong> <span className="text-cyan-400">pvsuryateja99@gmail.com</span></p>
                                <p className="text-sm mt-1"><strong>Subject:</strong> Data Deletion Request</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">
                                Include in your email:
                            </p>
                            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 ml-4 mt-2">
                                <li>Your registered email address</li>
                                <li>Your full name</li>
                                <li>Confirmation that you want to delete your account</li>
                                <li>Any additional verification information we may request</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">4. Deletion Timeline</h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-semibold text-white">In-App Deletion:</p>
                                    <p className="text-sm text-slate-400">Immediate (within seconds)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Email Request:</p>
                                    <p className="text-sm text-slate-400">Within 30 days of verification</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Backup Systems:</p>
                                    <p className="text-sm text-slate-400">Fully purged within 90 days</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">5. Data Retention Exceptions</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            We may retain certain data even after deletion in these limited circumstances:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li><strong>Legal Compliance:</strong> If required by law to retain data for a specific period</li>
                            <li><strong>Fraud Prevention:</strong> To prevent fraud, abuse, or security incidents</li>
                            <li><strong>Dispute Resolution:</strong> If there's an ongoing legal dispute or investigation</li>
                            <li><strong>Anonymized Data:</strong> We may retain anonymized statistical data for analytics</li>
                        </ul>
                        <p className="text-xs text-slate-500 mt-3 italic">
                            Anonymized data cannot be linked back to you and doesn't constitute personal data.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">6. Before You Delete</h3>
                        <div className="bg-cyan-950/20 border border-cyan-900/50 rounded-lg p-4">
                            <p className="text-sm font-bold text-cyan-400 mb-2">We recommend:</p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-4">
                                <li>Export your data first (Profile → Export Data)</li>
                                <li>Cancel any active subscriptions (if applicable)</li>
                                <li>Consider temporarily deactivating instead of deleting</li>
                                <li>Review your download to ensure you have everything</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">7. After Deletion</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            Once your data is deleted:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>You will no longer be able to log in to your account</li>
                            <li>Your progress, achievements, and history will be permanently lost</li>
                            <li>You will not receive any further communications from us</li>
                            <li>You can create a new account anytime using the same email</li>
                            <li>Previous data cannot be recovered or restored</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">8. Third-Party Data</h3>
                        <p className="text-sm leading-relaxed">
                            If you've connected third-party services (e.g., Google Fit, Apple Health), you'll need to
                            separately revoke STRK-FIT's access from those platforms. Deletion from STRK-FIT does not
                            automatically delete data from third-party services.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">9. Verification Process</h3>
                        <p className="text-sm leading-relaxed">
                            For email deletion requests, we may require additional verification to ensure the request
                            is legitimate and protect against unauthorized deletion. This may include:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4 mt-2">
                            <li>Confirming your identity through the registered email</li>
                            <li>Answering security questions</li>
                            <li>Providing account-specific information</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">10. Contact Information</h3>
                        <p className="text-sm leading-relaxed mb-3">
                            For questions about data deletion or this policy:
                        </p>
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                            <p className="text-sm"><strong>Data Protection Officer:</strong></p>
                            <p className="text-sm text-cyan-400 mt-1">pvsuryateja99@gmail.com</p>
                            <p className="text-sm mt-3"><strong>Privacy Team:</strong></p>
                            <p className="text-sm text-cyan-400 mt-1">pvsuryateja99@gmail.com</p>
                            <p className="text-sm mt-3"><strong>Support Team:</strong></p>
                            <p className="text-sm text-cyan-400 mt-1">pvsuryateja99@gmail.com</p>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 italic">
                            This Data Deletion Policy is part of our commitment to transparency and respecting your
                            privacy rights. We regularly review and update this policy to ensure compliance with
                            applicable data protection laws.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
