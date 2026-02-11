import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Tag } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0F172A] text-white hidden lg:flex flex-col z-50 shadow-xl">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-playfair font-bold text-[#D4AF37]">
                        Tamil<span className="text-white">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-4">Overview</div>

                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-[#D4AF37] transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-6">Management</div>

                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-[#D4AF37] transition-colors">
                        <Package size={20} />
                        <span>Products</span>
                    </Link>

                    <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-[#D4AF37] transition-colors">
                        <Tag size={20} />
                        <span>Categories</span>
                    </Link>

                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-[#D4AF37] transition-colors">
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </Link>

                    <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-[#D4AF37] transition-colors">
                        <Users size={20} />
                        <span>Customers</span>
                    </Link>

                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-6">Settings</div>
                    {/* Placeholder for settings if needed */}
                </nav>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0F172A] font-bold">A</div>
                        <div>
                            <p className="text-sm font-medium">Administrator</p>
                            <p className="text-xs text-slate-400">admin@tamilcreations.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content - Offset for Sidebar */}
            <main className="flex-1 lg:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
