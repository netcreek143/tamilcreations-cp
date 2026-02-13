'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Clock, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Category, Product, HeroSlide } from '@prisma/client';
import { useState, useEffect } from 'react';

interface AnimatedHomePageProps {
    categories: Category[];
    featuredProducts: (Product & { category: Category | null })[];
    heroSlides?: HeroSlide[];
}

export default function AnimatedHomePage({ categories, featuredProducts, heroSlides = [] }: AnimatedHomePageProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [heroSlides.length]);
    // Animation Variants
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const scaleIn: Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    // Fallback categories for visual demo if DB is empty
    const displayCategories = categories.length > 0 ? categories : [
        { id: '1', name: 'Bridal Wear', slug: 'bridal-wear', image: null },
        { id: '2', name: 'Silk Sarees', slug: 'silk-sarees', image: null },
        { id: '3', name: 'Designer Blouses', slug: 'designer-blouses', image: null },
        { id: '4', name: 'Accessories', slug: 'accessories', image: null },
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#0F172A] overflow-hidden">

            {/* 1. HERO SECTION (CAROUSEL) */}
            <section className="relative h-[650px] md:h-[800px] overflow-hidden bg-[#0F172A]">
                <AnimatePresence mode='wait'>
                    {heroSlides.length > 0 ? (
                        heroSlides.map((slide, index) => (
                            index === currentSlide && (
                                <motion.div
                                    key={slide.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                        <div className="absolute inset-0 bg-black/40"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
                                        <motion.h1
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 font-playfair tracking-tight leading-tight drop-shadow-2xl"
                                        >
                                            {slide.title}
                                        </motion.h1>
                                        {slide.subtitle && (
                                            <motion.p
                                                initial={{ y: 30, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
                                                className="text-slate-200 text-base sm:text-lg md:text-2xl mb-8 sm:mb-12 max-w-xl md:max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
                                            >
                                                {slide.subtitle}
                                            </motion.p>
                                        )}
                                        <motion.div
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.7, duration: 0.5 }}
                                        >
                                            <Link href={slide.ctaLink} className="group relative overflow-hidden bg-white text-[#0F172A] px-12 py-4 sm:px-14 sm:py-5 rounded-full font-bold uppercase tracking-widest text-sm sm:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:-translate-y-1 inline-block">
                                                <span className="relative z-10 group-hover:text-[#D4AF37] transition-colors">{slide.ctaText}</span>
                                                <div className="absolute inset-0 bg-[#0F172A] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )
                        ))
                    ) : (
                        // Fallback Static Hero if no slides
                        <div className="relative h-full flex items-center justify-center">
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900 animate-gradient-bg"></div>
                            {/* Visual Overlay */}
                            <div className="absolute inset-0 bg-[url('/patterns/noise.svg')] opacity-5"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80"></div>

                            <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={staggerContainer}
                                    className="max-w-4xl"
                                >
                                    <motion.h1
                                        variants={fadeInUp}
                                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 font-playfair tracking-tight leading-tight drop-shadow-2xl"
                                    >
                                        Timeless Elegance
                                    </motion.h1>
                                    <motion.p
                                        variants={fadeInUp}
                                        className="text-slate-300 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
                                    >
                                        Crafting stories of handcrafted sarees and bespoke accessories for the modern muse.
                                    </motion.p>
                                    <motion.div
                                        variants={fadeInUp}
                                        className="flex flex-col sm:flex-row gap-6 justify-center"
                                    >
                                        <Link href="/shop" className="group relative overflow-hidden bg-white text-[#0F172A] px-12 py-4 sm:px-14 sm:py-5 rounded-full font-bold uppercase tracking-widest text-sm sm:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:-translate-y-1">
                                            <span className="relative z-10 group-hover:text-[#D4AF37] transition-colors">Shop Collection</span>
                                            <div className="absolute inset-0 bg-[#0F172A] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Carousel Controls */}
                {heroSlides.length > 1 && (
                    <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[#D4AF37] w-8' : 'bg-white/50 hover:bg-white'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 2. STATS / FEATURES BAR */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-16 bg-white relative z-20 -mt-20 container mx-auto px-6"
            >
                <div className="bg-white rounded-2xl shadow-xl p-10 md:p-14 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {[
                        { icon: Star, title: "Premium Quality", desc: "Handpicked fabrics for unmatched luxury." },
                        { icon: ShieldCheck, title: "Authentic Design", desc: "Traditional patterns meeting modern art." },
                        { icon: Clock, title: "Timeless Style", desc: "Fashion that transcends trends." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37]">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-playfair font-bold mb-3 text-[#0F172A]">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed max-w-xs">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* 3. CATEGORIES GRID */}
            <section className="py-24 bg-[#F8F8F8]">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-20"
                    >
                        <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-playfair font-bold text-[#0F172A] mb-4">Curated Collections</motion.h2>
                        <motion.div variants={fadeInUp} className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></motion.div>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {displayCategories.map((cat: any, index: number) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Link href={`/shop?category=${cat.slug}`} className="group relative h-[450px] block overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-500">
                                    <div className="absolute inset-0 bg-slate-200">
                                        {cat.image ? (
                                            <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100"><Package className="w-12 h-12" /></div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300"></div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-2xl font-playfair font-bold text-white mb-2">{cat.name}</h3>
                                        <div className="flex items-center gap-2 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
                                            <span className="text-sm font-bold tracking-widest uppercase">Explore</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. FEATURED MASTERPIECES */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-20"
                    >
                        <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-playfair font-bold text-[#0F172A] mb-4">Featured Masterpieces</motion.h2>
                        <motion.p variants={fadeInUp} className="text-slate-500 mx-auto text-center">Exquisite designs selected for the discerning eye.</motion.p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
                        {featuredProducts.length > 0 ? featuredProducts.map((product: any, index: number) => {
                            const images = JSON.parse(product.images);
                            const firstImage = images[0] || '/images/placeholder-product.jpg';
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                >
                                    <Link href={`/products/${product.id}`} className="group block">
                                        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-slate-100 mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                            <Image src={firstImage} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />

                                            {/* Quick Action Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <button className="w-full bg-white text-[#0F172A] py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-[#D4AF37] hover:text-[#0F172A] transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-playfair text-xl text-[#0F172A] font-medium truncate mb-2 group-hover:text-[#D4AF37] transition-colors">{product.title}</h3>
                                            <p className="text-[#D4AF37] font-bold text-lg">{formatPrice(product.price)}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        }) : (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[3/4] bg-slate-100 rounded-xl mb-6"></div>
                                    <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto mb-3"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/4 mx-auto"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 5. PARALLAX CTA */}
            <section className="relative py-32 bg-[#0F172A] overflow-hidden flex items-center justify-center">
                {/* Abstract Background Shapes */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-[#D4AF37] rounded-full mix-blend-overlay opacity-5 blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-overlay opacity-5 blur-3xl"
                ></motion.div>

                <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-playfair font-bold mb-8 text-white"
                    >
                        Unique Like You
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-300 text-xl md:text-2xl mb-12 leading-relaxed font-light"
                    >
                        Collaborate with us to create a bespoke ensemble that tells your personal story.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href="/contact" className="inline-block bg-[#D4AF37] text-[#0F172A] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-2xl transform hover:scale-105">
                            Start Custom Journey
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
