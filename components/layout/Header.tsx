'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Header() {
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gold-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex flex-col items-center">
                            <div className="text-2xl md:text-3xl font-bold text-[#0F172A] group-hover:text-[#D4AF37] transition-colors font-playfair tracking-wide">
                                Tamil<span className="text-[#D4AF37]">Creations</span>
                            </div>
                            <span className="text-[0.4rem] md:text-[0.5rem] uppercase tracking-[0.3em] text-slate-500">Premium Bridal Wear</span>
                        </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar (Simplified) */}
                        <div className="relative flex items-center">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearchSubmit} className="flex items-center">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                        placeholder="Search..."
                                        className="w-40 md:w-64 pl-4 pr-10 py-1.5 border-b-2 border-[#D4AF37] focus:outline-none bg-transparent text-sm transition-all duration-300 ease-in-out placeholder:text-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 hover:bg-slate-50 rounded-full transition-colors text-[#0F172A] hover:text-[#D4AF37]"
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <Link
                            href="/cart"
                            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-[#0F172A] hover:text-[#D4AF37] relative group"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
