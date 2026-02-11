'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    variant: string | null;
    product: {
        id: string;
        title: string;
        images: string;
        category: {
            name: string;
        };
    };
}

interface Order {
    id: string;
    total: number;
    subtotal: number;
    shipping: number;
    status: string;
    createdAt: string;
    address: {
        fullName: string;
        phone: string;
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
    };
    orderItems: OrderItem[];
}

export default function OrderDetailPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && params.id) {
            fetchOrder();
        }
    }, [status, params.id, router]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                setOrder(data.order);
            } else {
                router.push('/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            router.push('/orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PROCESSING: 'bg-blue-100 text-blue-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            REFUNDED: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading order...</p>
                </div>
            </div>
        );
    }

    if (!session || !order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/orders"
                        className="flex items-center text-gray-600 hover:text-primary mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Orders
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Order #{order.id.substring(0, 8).toUpperCase()}
                                </h1>
                                <p className="text-gray-600">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                                    order.status
                                )}`}
                            >
                                {order.status}
                            </span>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Items Ordered
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => {
                                    const images = JSON.parse(item.product.images);
                                    const firstImage = images[0] || '/images/placeholder-product.svg';

                                    return (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                            <div className="relative w-20 h-20 flex-shrink-0">
                                                <Image
                                                    src={firstImage}
                                                    alt={item.product.title}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                    className="font-semibold hover:text-primary"
                                                >
                                                    {item.product.title}
                                                </Link>
                                                <p className="text-sm text-gray-500">{item.product.category.name}</p>
                                                {item.variant && (
                                                    <p className="text-sm text-gray-600">{item.variant}</p>
                                                )}
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping:</span>
                                    <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Shipping Address
                        </h2>
                        <div className="text-gray-700">
                            <p className="font-semibold">{order.address.fullName}</p>
                            <p>{order.address.addressLine}</p>
                            <p>
                                {order.address.city}, {order.address.state} - {order.address.pincode}
                            </p>
                            <p className="mt-2">Phone: {order.address.phone}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Payment Information
                        </h2>
                        <p className="text-gray-600">
                            Payment method: Cash on Delivery
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
