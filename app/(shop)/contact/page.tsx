'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to send message');

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-[#0F172A] text-white py-20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] font-medium mb-4 block">Here to Help</span>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Get in Touch</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Have a question about our collections or need a custom design? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-playfair font-bold text-[#0F172A] mb-8">Visit Our Boutique</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F172A] mb-2 uppercase tracking-wide text-sm">Address</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Tamil Creations<br />
                                            123 Mount Road, T. Nagar<br />
                                            Chennai, Tamil Nadu - 600017
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F172A] mb-2 uppercase tracking-wide text-sm">Phone</h3>
                                        <div className="space-y-1">
                                            <a href="tel:+918056122849" className="block text-slate-600 hover:text-[#D4AF37] transition-colors">+91 8056122849</a>
                                            <a href="tel:+918056122849" className="block text-slate-600 hover:text-[#D4AF37] transition-colors">+91 8056122849</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F172A] mb-2 uppercase tracking-wide text-sm">Email</h3>
                                        <a href="mailto:info@tamilcreations.com" className="text-slate-600 hover:text-[#D4AF37] transition-colors">
                                            info@tamilcreations.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F172A] mb-2 uppercase tracking-wide text-sm">Store Hours</h3>
                                        <p className="text-slate-600 mb-1"><span className="font-medium">Mon - Sat:</span> 10:00 AM - 9:00 PM</p>
                                        <p className="text-slate-600"><span className="font-medium">Sunday:</span> 11:00 AM - 7:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15547.511394747!2d80.2209772!3d13.0437637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526655a5555555%3A0x5555555555555555!2sT.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale group-hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-slate-100">
                        <h2 className="text-3xl font-playfair font-bold text-[#0F172A] mb-2">Send us a Message</h2>
                        <p className="text-slate-500 mb-8">We'll get back to you within 24 hours.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-300"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-300"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-300"
                                        placeholder="+91"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-300"
                                        placeholder="How can we help?"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded border border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-300 resize-none"
                                    placeholder="Tell us about your dream outfit or inquiry..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-[#0F172A] text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#0F172A] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (
                                    <>Sending...</>
                                ) : (
                                    <>
                                        Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <div className="p-4 bg-green-50 text-green-700 rounded flex items-center gap-2 text-sm animate-fade-in border border-green-200">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="p-4 bg-red-50 text-red-700 rounded flex items-center gap-2 text-sm animate-fade-in border border-red-200">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {errorMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
