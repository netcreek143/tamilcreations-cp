'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/checkout');
        }
    }, [status, router]);

    useEffect(() => {
        if (items.length === 0 && status === 'authenticated') {
            router.push('/cart');
        }
    }, [items.length, status, router]);

    const shippingCost = totalPrice > 2000 ? 0 : 100;
    const finalTotal = totalPrice + shippingCost;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 1. Create Order in Razorpay
            const orderRes = await fetch('/api/razorpay/order', {
                method: 'POST',
                body: JSON.stringify({ amount: finalTotal }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) throw new Error('Failed to create Razorpay order');

            const razorpayOrderId = orderData.id;

            // 2. Create Order in Database
            const dbOrderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        variant: item.variant,
                    })),
                    address: formData,
                    subtotal: totalPrice,
                    shipping: shippingCost,
                    total: finalTotal,
                    razorpayOrderId: razorpayOrderId, // Link DB order to Razorpay order
                }),
            });

            if (!dbOrderRes.ok) throw new Error('Failed to create local order');

            const dbOrderData = await dbOrderRes.json();
            const dbOrderId = dbOrderData.orderId;

            // 3. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is public env var
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Tamil Creations',
                description: 'Order Payment',
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    // 4. Verify Payment
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            db_order_id: dbOrderId,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        toast.success('Payment successful! Order placed.');
                        clearCart();
                        router.push(`/orders/${dbOrderId}`);
                    } else {
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: session?.user?.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#D4AF37',
                },
                modal: {
                    ondismiss: function () {
                        toast.info('Payment cancelled. You can retry from your order history.');
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    if (!session || items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Cart
                </button>

                <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        pattern="[6-9][0-9]{9}"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="9876543210"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="addressLine" className="block text-sm font-medium mb-2">
                                        Address *
                                    </label>
                                    <input
                                        id="addressLine"
                                        type="text"
                                        required
                                        value={formData.addressLine}
                                        onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="House No, Street, Area"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium mb-2">
                                            City *
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium mb-2">
                                            State *
                                        </label>
                                        <input
                                            id="state"
                                            type="text"
                                            required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-medium mb-2">
                                        Pincode *
                                    </label>
                                    <input
                                        id="pincode"
                                        type="text"
                                        required
                                        pattern="[0-9]{6}"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="600017"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.variant || 'default'}`} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.title}</h4>
                                            {item.variant && (
                                                <p className="text-xs text-gray-500">{item.variant}</p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Qty: {item.quantity} × {formatPrice(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping:</span>
                                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
