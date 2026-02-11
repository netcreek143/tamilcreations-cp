'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    ArrowLeft,
    TrendingUp,
    IndianRupee,
    List,
} from 'lucide-react';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        recentOrders: [] as any[],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'ADMIN') {
                router.push('/');
            } else {
                fetchDashboardData();
            }
        }
    }, [status, session, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Store
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +12%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-green-50 rounded-xl">
                                <IndianRupee className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-orange-50 rounded-xl">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Customers</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    <Link
                        href="/admin/categories"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <List className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Categories</h3>
                                <p className="text-sm text-gray-500">Create and edit categories</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/products"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <Package className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Products</h3>
                                <p className="text-sm text-gray-500">Add, edit, or remove products</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <ShoppingCart className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Orders</h3>
                                <p className="text-sm text-gray-500">View and update order status</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/customers"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Customers</h3>
                                <p className="text-sm text-gray-500">View customer information</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No recent orders</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Order ID</th>
                                        <th className="text-left py-3 px-4">Customer</th>
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                        <th className="text-right py-3 px-4">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order: any) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    #{order.id.substring(0, 8).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">{order.user.name}</td>
                                            <td className="py-3 px-4">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold">
                                                ₹{order.total.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
