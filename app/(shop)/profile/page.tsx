'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">My Account</h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span>Profile</span>
                                </button>
                                <Link
                                    href="/orders"
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100"
                                >
                                    <Package className="w-5 h-5" />
                                    <span>Orders</span>
                                </Link>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'addresses'
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span>Addresses</span>
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-3">
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                                {session.user.name}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                                {session.user.email}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Account Type
                                            </label>
                                            <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                                {session.user.role === 'ADMIN' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Customer
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t">
                                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Link
                                                href="/orders"
                                                className="btn btn-secondary py-3 text-center"
                                            >
                                                View Orders
                                            </Link>
                                            <Link
                                                href="/shop"
                                                className="btn btn-primary py-3 text-center"
                                            >
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                                    <p className="text-gray-600">
                                        Your saved addresses will appear here. Addresses are automatically saved when you place an order.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
