import { useSettings } from '../contexts/SettingsContext';

interface FooterProps {
    onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
    const { language } = useSettings();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-charcoal-900 text-crema-200 py-12 border-t border-gold-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-serif text-gold-400 mb-4">Bible Mind</h3>
                        <p className="text-sm leading-relaxed text-crema-400 max-w-sm mb-6">
                            A simple and focused Bible study platform created to help believers read and understand Scripture with clarity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gold-200 font-medium mb-4 uppercase tracking-wider text-sm">Explore</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => onNavigate('landing')} className="hover:text-gold-400 transition-colors">Home</button></li>
                            <li><button onClick={() => onNavigate('reader')} className="hover:text-gold-400 transition-colors">Read Bible</button></li>
                            <li><button onClick={() => onNavigate('study')} className="hover:text-gold-400 transition-colors">Study Tools</button></li>
                            <li><button onClick={() => onNavigate('about')} className="hover:text-gold-400 transition-colors">About Us</button></li>
                        </ul>
                    </div>

                    {/* Legal / Trust */}
                    <div>
                        <h4 className="text-gold-200 font-medium mb-4 uppercase tracking-wider text-sm">Trust & Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => onNavigate('privacy')} className="hover:text-gold-400 transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => onNavigate('terms')} className="hover:text-gold-400 transition-colors">Terms of Use</button></li>
                            <li><button onClick={() => onNavigate('sources')} className="hover:text-gold-400 transition-colors">Bible Sources</button></li>
                            <li><button onClick={() => onNavigate('contact')} className="hover:text-gold-400 transition-colors">Contact</button></li>
                        </ul>
                    </div>
                </div>

                <div className="h-px bg-white/10 w-full mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-crema-500">
                    <p>© {year} Bible-Mind. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>Soli Deo Gloria</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
