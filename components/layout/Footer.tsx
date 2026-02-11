import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0F172A] text-slate-300 relative overflow-hidden">
            {/* Decorative Top Border */}
            <div className="h-1 w-full bg-gradient-to-r from-[#0F172A] via-[#D4AF37] to-[#0F172A]"></div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold font-playfair tracking-wide text-white">
                            Tamil<span className="text-[#D4AF37]">Creations</span>
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                            Your premier destination for exquisite sarees, fashion accessories, and traditional attire. Timeless elegance crafted for every occasion.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {[Facebook, Instagram, Youtube].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0F172A] hover:border-[#D4AF37] transition-all duration-300 group"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-playfair font-semibold mb-8 text-[#D4AF37]">Collections</h4>
                        <ul className="space-y-3 text-sm">
                            {['Shop All', 'Bridal Wear', 'Silk Sarees', 'Designer Blouses', 'Accessories'].map((item) => (
                                <li key={item}>
                                    <Link href="/shop" className="hover:text-[#D4AF37] transition-colors hover:translate-x-1 inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-playfair font-semibold mb-8 text-[#D4AF37]">Support</h4>
                        <ul className="space-y-3 text-sm">
                            {['My Account', 'Track Order', 'Wishlist', 'Shipping Policy', 'Returns & Exchanges'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-[#D4AF37] transition-colors hover:translate-x-1 inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-playfair font-semibold mb-8 text-[#D4AF37]">Contact Us</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                                <span className="leading-relaxed">
                                    123 Mount Road,<br />T. Nagar, Chennai,<br />Tamil Nadu - 600017
                                </span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                <a href="tel:+918056122849" className="hover:text-[#D4AF37] transition-colors">
                                    +91 8056122849
                                </a>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                <a href="mailto:info@tamilcreations.com" className="hover:text-[#D4AF37] transition-colors">
                                    info@tamilcreations.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {currentYear} Tamil Creations. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Designed with excellence in Chennai</p>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37] opacity-[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </footer>
    );
}
