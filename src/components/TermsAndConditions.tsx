import { X, FileText } from 'lucide-react';

interface TermsAndConditionsProps {
    onClose: () => void;
}

export function TermsAndConditions({ onClose }: TermsAndConditionsProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-950/30 rounded-lg">
                            <FileText className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
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
                            Welcome to STRK-FIT. By using our fitness tracking application, you agree to these terms and conditions.
                        </p>
                    </div>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h3>
                        <p className="text-sm leading-relaxed">
                            By accessing and using STRK-FIT, you accept and agree to be bound by the terms and provision of this agreement.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">2. User Account</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            When you create an account with us, you must provide accurate, complete, and current information.
                            You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Maintaining the confidentiality of your account password</li>
                            <li>Restricting access to your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized access</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">3. Health and Fitness Disclaimer</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            STRK-FIT is a fitness tracking tool and should not replace professional medical advice.
                            By using this app, you acknowledge that:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>You should consult with a healthcare professional before starting any fitness program</li>
                            <li>We are not responsible for any injuries or health issues that may arise from your use of the app</li>
                            <li>The app provides general fitness tracking and is not medical advice</li>
                            <li>You use the app at your own risk</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">4. User Data and Privacy</h3>
                        <p className="text-sm leading-relaxed">
                            Your use of STRK-FIT is also governed by our Privacy Policy. We collect and store fitness data,
                            including but not limited to weight, exercise logs, food intake, and personal information you provide.
                            This data is stored locally on your device and on our secure servers.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">5. Acceptable Use</h3>
                        <p className="text-sm leading-relaxed mb-2">You agree not to:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Use the service for any illegal purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                            <li>Upload malicious code or viruses</li>
                            <li>Misrepresent your identity or affiliation</li>
                            <li>Share your account with others</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">6. Intellectual Property</h3>
                        <p className="text-sm leading-relaxed">
                            All content, features, and functionality of STRK-FIT, including but not limited to text, graphics,
                            logos, and software, are owned by STRK-FIT and are protected by copyright, trademark, and other
                            intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">7. Data Export and Deletion</h3>
                        <p className="text-sm leading-relaxed">
                            You have the right to export your data at any time through the profile settings.
                            You may also request deletion of your account and all associated data by contacting our support team.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">8. Service Modifications</h3>
                        <p className="text-sm leading-relaxed">
                            We reserve the right to modify, suspend, or discontinue any part of the service at any time
                            without prior notice. We are not liable for any modification, suspension, or discontinuance of the service.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">9. Limitation of Liability</h3>
                        <p className="text-sm leading-relaxed">
                            STRK-FIT is provided "as is" without warranties of any kind. We shall not be liable for any
                            indirect, incidental, special, consequential, or punitive damages resulting from your use of
                            or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">10. Termination</h3>
                        <p className="text-sm leading-relaxed">
                            We may terminate or suspend your account and access to the service immediately, without prior notice,
                            for any reason, including but not limited to breach of these Terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">11. Changes to Terms</h3>
                        <p className="text-sm leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any material
                            changes by updating the "Last Updated" date. Your continued use of the service after such
                            modifications constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">12. Contact Information</h3>
                        <p className="text-sm leading-relaxed">
                            If you have any questions about these Terms & Conditions, please contact us at:
                        </p>
                        <p className="text-sm text-cyan-400 mt-2">
                            pvsuryateja99@gmail.com
                        </p>
                    </section>

                    <div className="pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 italic">
                            By using STRK-FIT, you acknowledge that you have read, understood, and agree to be bound by
                            these Terms & Conditions.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
