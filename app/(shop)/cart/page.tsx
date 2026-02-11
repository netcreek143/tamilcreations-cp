'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
    const router = useRouter();
    const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateQuantity = async (id: string, newQuantity: number, variant?: string) => {
        setIsUpdating(true);
        updateQuantity(id, newQuantity, variant);
        setTimeout(() => setIsUpdating(false), 300);
    };

    const handleRemove = (id: string, variant?: string) => {
        if (confirm('Remove this item from your cart?')) {
            removeFromCart(id, variant);
        }
    };

    const shippingCost = totalPrice > 2000 ? 0 : 100;
    const finalTotal = totalPrice + shippingCost;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-10">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                </div>
                <h2 className="text-3xl font-playfair font-bold mb-6 text-gray-900">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-12 max-w-sm mx-auto leading-relaxed">
                    Looks like you haven't added any items to your cart yet. Browse our collections to find something you love.
                </p>
                <Link
                    href="/shop"
                    className="btn btn-primary px-10 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Continue Shopping
                </button>

                <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={`${item.id}-${item.variant || 'default'}`}
                                className="bg-white rounded-lg shadow-sm p-6 flex gap-6"
                            >
                                {/* Product Image */}
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                    {item.variant && (
                                        <p className="text-sm text-gray-500 mb-2">Variant: {item.variant}</p>
                                    )}
                                    <p className="text-primary font-bold text-xl">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => handleRemove(item.id, item.variant)}
                                        className="text-red-600 hover:text-red-700 p-2"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(item.id, item.quantity - 1, item.variant)
                                            }
                                            disabled={isUpdating}
                                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            <Minus className="w-4 h-4 mx-auto" />
                                        </button>
                                        <span className="font-semibold w-12 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(item.id, item.quantity + 1, item.variant)
                                            }
                                            disabled={isUpdating || item.quantity >= item.stock}
                                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4 mx-auto" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Subtotal: {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items ({totalItems}):</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping:</span>
                                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                                </div>
                                {totalPrice < 2000 && (
                                    <p className="text-sm text-gray-500">
                                        Add {formatPrice(2000 - totalPrice)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="btn btn-primary w-full py-3 text-lg mb-4 block text-center"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/shop"
                                className="btn btn-secondary w-full py-2 text-center block"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Secure Checkout
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    7-Day Returns
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Premium Quality
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
