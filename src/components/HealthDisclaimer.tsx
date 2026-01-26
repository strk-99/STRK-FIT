import { X, AlertTriangle, Heart } from 'lucide-react';

interface HealthDisclaimerProps {
    onClose: () => void;
}

export function HealthDisclaimer({ onClose }: HealthDisclaimerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-950/30 rounded-lg">
                            <Heart className="w-6 h-6 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Health & Medical Disclaimer</h2>
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
                    <div className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-400 mb-2">
                                    IMPORTANT MEDICAL DISCLAIMER
                                </p>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    STRK-FIT is a fitness tracking tool and is NOT intended to diagnose, treat, cure,
                                    or prevent any disease or medical condition. This app is not a substitute for
                                    professional medical advice, diagnosis, or treatment.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500 mb-4">
                            Last Updated: December 28, 2025
                        </p>
                        <p className="text-sm leading-relaxed">
                            Please read this disclaimer carefully before using STRK-FIT. By using this application,
                            you acknowledge that you have read, understood, and agree to this Health & Medical Disclaimer.
                        </p>
                    </div>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">1. Not Medical Advice</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            The information and features provided by STRK-FIT, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Fitness tracking and logging</li>
                            <li>Weight monitoring and goal setting</li>
                            <li>Exercise recommendations</li>
                            <li>Nutrition tracking</li>
                            <li>Progress calculations</li>
                        </ul>
                        <p className="text-sm leading-relaxed mt-3">
                            Are provided for informational and tracking purposes only and do NOT constitute medical,
                            health, fitness, dietary, or professional advice of any kind.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">2. Consult Healthcare Professionals</h3>
                        <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                            <p className="text-sm font-bold text-red-400 mb-2">ALWAYS CONSULT YOUR DOCTOR:</p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-4">
                                <li>Before starting any new fitness or exercise program</li>
                                <li>Before making significant changes to your diet</li>
                                <li>If you have any pre-existing medical conditions</li>
                                <li>If you are pregnant or nursing</li>
                                <li>If you are taking any medications</li>
                                <li>If you experience any pain, discomfort, or unusual symptoms</li>
                                <li>If you have any concerns about your health or fitness</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">3. Use at Your Own Risk</h3>
                        <p className="text-sm leading-relaxed">
                            You acknowledge and agree that any use of STRK-FIT and participation in fitness activities
                            tracked through the app is entirely at your own risk. Physical exercise and dietary changes
                            carry inherent risks including, but not limited to:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4 mt-2">
                            <li>Muscle strains, sprains, or other injuries</li>
                            <li>Cardiovascular events</li>
                            <li>Dehydration or nutritional imbalances</li>
                            <li>Fatigue or overexertion</li>
                            <li>Other health complications</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">4. No Professional Relationship</h3>
                        <p className="text-sm leading-relaxed">
                            Using STRK-FIT does NOT create a doctor-patient, therapist-client, nutritionist-client,
                            or any other professional healthcare relationship between you and STRK-FIT, its developers,
                            or any affiliated parties.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">5. Accuracy of Information</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            While we strive to provide accurate and reliable features:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>We make no warranties about the accuracy, completeness, or reliability of any information</li>
                            <li>Calculations (calories, BMI, etc.) are estimates and may not be accurate for everyone</li>
                            <li>Individual results may vary significantly</li>
                            <li>The app relies on user-entered data which may be inaccurate</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">6. When to Seek Immediate Medical Attention</h3>
                        <div className="bg-red-950/30 border border-red-900/70 rounded-lg p-4">
                            <p className="text-sm font-bold text-red-400 mb-2">STOP IMMEDIATELY and seek medical help if you experience:</p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-4">
                                <li>Chest pain, pressure, or discomfort</li>
                                <li>Severe shortness of breath</li>
                                <li>Dizziness or fainting</li>
                                <li>Severe pain or injury</li>
                                <li>Irregular heartbeat or palpitations</li>
                                <li>Numbness or weakness</li>
                                <li>Any other concerning symptoms</li>
                            </ul>
                            <p className="text-xs text-red-300 mt-3 font-bold">
                                In case of emergency, call your local emergency services immediately (911 in US).
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">7. Individual Variations</h3>
                        <p className="text-sm leading-relaxed">
                            Everyone's body is different. Factors such as age, gender, genetics, medical history,
                            current health status, medications, and lifestyle all affect how your body responds to
                            exercise and dietary changes. What works for one person may not work for another and may
                            even be harmful.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">8. Weight Loss & Body Changes</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            Regarding weight management and body composition:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Weight loss should be pursued in a healthy, sustainable manner under medical supervision</li>
                            <li>Rapid weight loss can be dangerous</li>
                            <li>BMI and other metrics are general indicators and may not be appropriate for everyone</li>
                            <li>Body image and mental health are as important as physical health</li>
                            <li>If you have or suspect you have an eating disorder, seek professional help</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">9. Limitation of Liability</h3>
                        <p className="text-sm leading-relaxed">
                            To the fullest extent permitted by law, STRK-FIT and its developers, owners, employees,
                            and affiliates shall NOT be liable for any injuries, damages, or health problems that may
                            result from your use of the app or participation in any fitness activities tracked through
                            the app. This includes but is not limited to direct, indirect, incidental, consequential,
                            or punitive damages.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">10. Third-Party Content</h3>
                        <p className="text-sm leading-relaxed">
                            Any third-party content, links, or resources provided through the app are for informational
                            purposes only. We do not endorse or take responsibility for third-party content and
                            recommendations.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">11. FDA Disclaimer</h3>
                        <p className="text-sm leading-relaxed">
                            STRK-FIT is not a medical device and has not been evaluated by the Food and Drug
                            Administration (FDA) or any other medical regulatory authority. The app is not intended
                            to diagnose, treat, cure, or prevent any disease.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">12. Children and Minors</h3>
                        <p className="text-sm leading-relaxed">
                            STRK-FIT is not intended for use by children under 13 years of age. If you are under 18,
                            you should only use this app with parental or guardian supervision and medical consultation.
                            Growing bodies have different needs and considerations.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">13. Pregnancy & Nursing</h3>
                        <p className="text-sm leading-relaxed">
                            If you are pregnant, nursing, or planning to become pregnant, consult your healthcare
                            provider before using this app or making any changes to your fitness or nutrition routine.
                            Pregnancy and nursing have special nutritional and fitness considerations.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">14. Medical Conditions</h3>
                        <p className="text-sm leading-relaxed mb-2">
                            Certain medical conditions require special consideration. Consult your doctor if you have:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                            <li>Heart disease or cardiovascular conditions</li>
                            <li>Diabetes or blood sugar disorders</li>
                            <li>High or low blood pressure</li>
                            <li>Respiratory conditions (asthma, COPD, etc.)</li>
                            <li>Joint, bone, or muscle conditions</li>
                            <li>Metabolic or hormonal disorders</li>
                            <li>Mental health conditions</li>
                            <li>Any chronic illness or ongoing medical treatment</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3">15. Changes to Disclaimer</h3>
                        <p className="text-sm leading-relaxed">
                            We may update this Health Disclaimer from time to time. Continued use of the app after
                            changes constitutes acceptance of the updated disclaimer.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-slate-800">
                        <div className="bg-cyan-950/20 border border-cyan-900/50 rounded-lg p-4">
                            <p className="text-xs text-slate-300 italic">
                                <strong className="text-cyan-400">Remember:</strong> STRK-FIT is a tool to help you
                                track your fitness journey. Your health and safety are paramount. Always listen to
                                your body, consult healthcare professionals when needed, and use the app as a supplement
                                to - not a replacement for - professional medical care.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
