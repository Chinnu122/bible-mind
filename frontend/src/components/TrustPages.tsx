import { motion } from 'framer-motion';

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto px-6 py-12 md:py-20"
    >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 mb-8 pb-6 border-b border-gold-500/20">
            {title}
        </h1>
        <div className="prose prose-lg prose-charcoal max-w-none font-sans text-charcoal-700 leading-relaxed">
            {children}
        </div>
    </motion.div>
);

export function PrivacyPolicy() {
    return (
        <PageLayout title="Privacy Policy">
            <div className="space-y-8">
                <section>
                    <h3 className="text-2xl font-serif font-semibold text-charcoal-800 mb-4">Our Commitment</h3>
                    <p>
                        Bible-Mind respects your privacy. We are committed to protecting the little personal information you share with us.
                        Our platform is designed for study and spiritual growth, not for data collection.
                    </p>
                </section>

                <section className="bg-ivory-200 p-6 rounded-xl border border-gold-500/10">
                    <h4 className="font-semibold text-charcoal-900 mb-2">Key Points:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>We do not sell personal data to third parties.</li>
                        <li>We only collect minimal technical data (cookies) necessary for website performance and remembering your preferences (like language settings).</li>
                        <li>No tracking pixels from social media networks are used.</li>
                    </ul>
                </section>
            </div>
        </PageLayout>
    );
}

export function TermsOfUse() {
    return (
        <PageLayout title="Terms of Use">
            <div className="space-y-8">
                <section>
                    <p className="text-xl text-charcoal-600 mb-6">
                        Welcome to Bible-Mind. By using this platform, you agree to the following simple terms.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-serif font-semibold text-charcoal-800 mb-4">Educational & Devotional Use</h3>
                    <p>
                        Bible-Mind is a study platform. It is not a replacement for personal faith study, church teaching, or professional counseling.
                        All content, including word meanings and maps, is provided for educational and devotional purposes.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-serif font-semibold text-charcoal-800 mb-4">Content Accuracy</h3>
                    <p>
                        While we strive for accuracy in our Hebrew and Greek study tools, we encourage users to verify findings with other standard biblical resources.
                    </p>
                </section>
            </div>
        </PageLayout>
    );
}

export function BibleSources() {
    return (
        <PageLayout title="Bible Sources">
            <div className="space-y-10">
                <section>
                    <p className="text-lg mb-6">
                        Bible-Mind is built with a commitment to textual accuracy and integrity. We do not modify Scripture text; we only apply formatting and study tools.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-charcoal-100">
                        <h3 className="text-xl font-serif font-bold text-gold-600 mb-2">Old Testament</h3>
                        <p className="font-medium text-charcoal-900">Hebrew Source Text</p>
                        <p className="text-sm text-charcoal-500 mt-2">
                            Based on the Westminster Leningrad Codex (WLC), accurate to the Masoretic Text.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-charcoal-100">
                        <h3 className="text-xl font-serif font-bold text-gold-600 mb-2">New Testament</h3>
                        <p className="font-medium text-charcoal-900">Greek Source Text</p>
                        <p className="text-sm text-charcoal-500 mt-2">
                            Based on the Textus Receptus and Nestle-Aland critical texts where noted.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-charcoal-100">
                        <h3 className="text-xl font-serif font-bold text-gold-600 mb-2">English Translation</h3>
                        <p className="font-medium text-charcoal-900">Standard Public Context</p>
                        <p className="text-sm text-charcoal-500 mt-2">
                            Primarily uses the King James Version (KJV) and World English Bible (WEB) for public domain accessibility.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-charcoal-100">
                        <h3 className="text-xl font-serif font-bold text-gold-600 mb-2">Telugu Translation</h3>
                        <p className="font-medium text-charcoal-900">Regional Standard</p>
                        <p className="text-sm text-charcoal-500 mt-2">
                            Uses the trusted Telugu Bible (BSI equivalent text) widely accepted by churches in Andhra Pradesh and Telangana.
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

export function ContactPage() {
    return (
        <PageLayout title="Contact Us">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
                <p className="text-lg">
                    Have questions, suggestions, or found a bug? We'd love to hear from you.
                </p>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gold-500/20 inline-block">
                    <h3 className="text-xl font-medium text-charcoal-900 mb-4">Email Support</h3>
                    <a href="mailto:support@bible-mind.com" className="text-2xl font-serif text-gold-600 hover:text-gold-700 underline underline-offset-4">
                        support@bible-mind.com
                    </a>
                    <p className="text-sm text-charcoal-400 mt-4">
                        We try to respond to all inquiries within 24-48 hours.
                    </p>
                </div>
            </div>
        </PageLayout>
    );
}
