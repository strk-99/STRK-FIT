import { X, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
    onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-950/30 rounded-lg">
                            <Shield className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
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
                        <p className="text-sm">
                            At STRK-FIT, we are committed to protecting your privacy. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your information when you use our fitness tracking application.
                        </p>
                    </div>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">1. Information We Collect</h3>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Personal Information</h4>
                        <p className="text-sm leading-relaxed mb-2">
                            When you create an account, we collect:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Name and email address</li>
                            <li>Phone number</li>
                            <li>Date of birth</li>
                            <li>Password (encrypted)</li>
                        </ul>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Health and Fitness Data</h4>
                        <p className="text-sm leading-relaxed mb-2">
                            We collect and store:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Height and weight information</li>
                            <li>Target weight goals</li>
                            <li>Daily exercise logs and workout data</li>
                            <li>Food and nutrition intake records</li>
                            <li>Step count and water consumption</li>
                            <li>Weight history and progress tracking</li>
                            <li>Work shift schedules</li>
                        </ul>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Usage Data</h4>
                        <p className="text-sm leading-relaxed mb-2">
                            We automatically collect:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Login activity and timestamps</li>
                            <li>Feature usage patterns</li>
                            <li>Device information and browser type</li>
                            <li>IP address and general location</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Provide and maintain the fitness tracking service</li>
                            <li>Calculate your progress, levels, and achievements</li>
                            <li>Generate personalized fitness insights and recommendations</li>
                            <li>Send you notifications about your fitness streak and goals</li>
                            <li>Send monthly email reports (if you opt-in)</li>
                            <li>Improve and optimize our service</li>
                            <li>Ensure security and prevent fraud</li>
                            <li>Communicate with you about updates and changes</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">3. Data Storage and Security</h3>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Local Storage</h4>
                        <p className="text-sm leading-relaxed">
                            Some of your data is stored locally on your device using browser localStorage. This includes
                            your daily logs, preferences, and cached profile information.
                        </p>

                        <h4 className="text-md font-semibold text-slate-200 mb-2 mt-4">Server Storage</h4>
                        <p className="text-sm leading-relaxed mb-2">
                            Your account information and fitness data are stored securely on our servers using:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Encrypted database connections</li>
                            <li>Bcrypt password hashing</li>
                            <li>JWT token-based authentication</li>
                            <li>Regular security audits and updates</li>
                        </ul>

                        <p className="text-sm leading-relaxed mt-3 text-amber-400">
                            Note: While we implement security measures, no system is 100% secure. We cannot guarantee
                            absolute security of your data.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">4. Data Sharing and Disclosure</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            We do NOT sell your personal information. We may share your data only in these circumstances:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li><strong>With Your Consent:</strong> When you explicitly agree to share your data</li>
                            <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., email service, hosting)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">5. Your Data Rights</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li><strong>Access:</strong> Request a copy of your data at any time</li>
                            <li><strong>Export:</strong> Download your data in JSON format through the profile page</li>
                            <li><strong>Update:</strong> Modify your profile information and settings</li>
                            <li><strong>Delete:</strong> Request deletion of your account and all associated data</li>
                            <li><strong>Opt-out:</strong> Disable email notifications and monthly reports</li>
                            <li><strong>Portability:</strong> Transfer your data to another service</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">6. Cookies and Tracking</h3>
                        <p className="text-sm leading-relaxed">
                            We use localStorage to store your authentication token and preferences. We do not use traditional
                            cookies for tracking. Your JWT token is stored in localStorage and sent with API requests to
                            authenticate your identity.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">7. Children's Privacy</h3>
                        <p className="text-sm leading-relaxed">
                            STRK-FIT is not intended for users under the age of 13. We do not knowingly collect personal
                            information from children under 13. If you believe we have collected information from a child
                            under 13, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">8. International Users</h3>
                        <p className="text-sm leading-relaxed">
                            Your data may be transferred to and processed in countries other than your own. By using STRK-FIT,
                            you consent to the transfer of your information to our servers and those of our service providers.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">9. Data Retention</h3>
                        <p className="text-sm leading-relaxed">
                            We retain your personal data for as long as your account is active or as needed to provide services.
                            If you delete your account, we will delete your data within 30 days, except where we are required
                            to retain it for legal purposes.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">10. Email Communications</h3>
                        <p className="text-sm leading-relaxed">
                            If you opt-in to monthly email reports, we will send you a summary of your fitness progress.
                            You can opt-out at any time through your settings or by clicking the unsubscribe link in emails.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">11. Changes to This Policy</h3>
                        <p className="text-sm leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any material changes
                            by updating the "Last Updated" date and, where appropriate, sending you a notification.
                            Your continued use after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">12. Third-Party Links</h3>
                        <p className="text-sm leading-relaxed">
                            Our service may contain links to external websites. We are not responsible for the privacy
                            practices of these third-party sites. We encourage you to review their privacy policies.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">13. Contact Us</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            If you have questions about this Privacy Policy or wish to exercise your data rights, contact us at:
                        </p>
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 mt-3">
                            <p className="text-sm"><strong>Email:</strong> <span className="text-cyan-400">pvsuryateja99@gmail.com</span></p>
                            <p className="text-sm mt-1"><strong>Data Protection Officer:</strong> <span className="text-cyan-400">pvsuryateja99@gmail.com</span></p>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 italic">
                            By using STRK-FIT, you acknowledge that you have read and understood this Privacy Policy and
                            consent to the collection and use of your information as described.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3 rounded-lg transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
