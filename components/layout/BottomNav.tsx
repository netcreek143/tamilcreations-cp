'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, Search, ShoppingBag, Heart, User, LayoutGrid } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useSession } from 'next-auth/react';

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems: cartCount } = useCart();
    const { totalItems: wishlistCount } = useWishlist();
    const { data: session } = useSession();

    const navItems = [
        {
            name: 'Home',
            href: '/',
            icon: Home,
        },
        {
            name: 'Shop',
            href: '/shop',
            icon: Store,
        },
        {
            name: 'Categories',
            href: '/categories',
            icon: LayoutGrid,
        },
        {
            name: 'Wishlist',
            href: '/wishlist',
            icon: Heart,
            count: wishlistCount,
        },
        {
            name: 'Cart',
            href: '/cart',
            icon: ShoppingBag,
            count: cartCount,
        },
        {
            name: 'Profile',
            href: session ? (session.user.role === 'ADMIN' ? '/admin' : '/profile') : '/login',
            icon: User,
        },
    ];

    // Hide BottomNav on admin routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-900'
                                } transition-colors relative group`}
                        >
                            <div className="relative">
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white px-1">
                                        {item.count > 99 ? '99+' : item.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">
                                {item.name}
                            </span>

                            {/* Active Indicator */}
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D4AF37] rounded-b-full"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
