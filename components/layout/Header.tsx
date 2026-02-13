'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, X, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useSession } from 'next-auth/react';

export default function Header() {
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCart();
    const { totalItems: wishlistCount } = useWishlist();
    const { data: session } = useSession();
    const pathname = usePathname();
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
                            <div className="text-xl md:text-3xl font-bold text-[#0F172A] group-hover:text-[#D4AF37] transition-colors font-playfair tracking-wide text-center">
                                Tamil<span className="text-[#D4AF37]">Creations</span>
                            </div>
                            <span className="text-[0.35rem] md:text-[0.5rem] uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500">Premium Bridal Wear</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${pathname === '/' ? 'text-[#D4AF37]' : 'text-slate-600'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${pathname === '/shop' ? 'text-[#D4AF37]' : 'text-slate-600'}`}
                        >
                            Shop
                        </Link>
                        <Link
                            href="/categories"
                            className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${pathname === '/categories' ? 'text-[#D4AF37]' : 'text-slate-600'}`}
                        >
                            Categories
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar (Simplified) */}
                        <div className="relative flex items-center">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white z-20 p-3 shadow-xl rounded-xl border border-slate-200 min-w-[320px]">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                        placeholder="Search..."
                                        className="flex-1 min-w-[280px] px-10 py-3 focus:outline-none bg-transparent text-base tracking-wide placeholder:text-slate-400 text-slate-900 rounded-lg"

                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input blur
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="ml-2 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
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

                        {/* Wishlist Icon */}
                        <Link
                            href="/wishlist"
                            className="hidden md:block p-2 hover:bg-slate-50 rounded-full transition-colors text-[#0F172A] hover:text-[#D4AF37] relative group"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile Icon */}
                        <Link
                            href={session ? (session.user.role === 'ADMIN' ? '/admin' : '/profile') : '/login'}
                            className="hidden md:block p-2 hover:bg-slate-50 rounded-full transition-colors text-[#0F172A] hover:text-[#D4AF37] relative group"
                            aria-label="Profile"
                        >
                            <User className="w-5 h-5" />
                        </Link>

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
