import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Tag } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Main Content */}
            <main className="flex-1 min-h-screen">
                {children}
            </main>
        </div>
    );
}
