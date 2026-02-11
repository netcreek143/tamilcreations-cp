'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: 1,
            image: item.image,
            stock: 100, // Default stock
        });

        setAddingToCart(item.id);
        setTimeout(() => {
            setAddingToCart(null);
            removeFromWishlist(item.id);
        }, 1000);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-muted py-24">
                <div className="container mx-auto px-4 flex flex-col items-center text-center">
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-md mb-8">
                        <Heart className="w-12 h-12 text-primary fill-primary/10" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-900 mb-6">
                        Your Wishlist is Empty
                    </h1>
                    <br />

                    <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed text-balance">
                        Save your favorite products to your wishlist and come back to them later!
                    </p>
                    <br />

                    <Link href="/shop" className="btn btn-primary px-12 py-4 text-lg min-w-[250px] shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-900 mb-6">My Wishlist</h1>
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
                        <p className="text-lg">{items.length} {items.length !== 1 ? 'items' : 'item'} saved</p>
                    </div>
                    <br />

                    <Link href="/shop" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors border-b border-primary/20 pb-0.5 hover:border-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                </div>
                <br />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                            <div className="relative aspect-square">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </div>

                            <div className="p-4">
                                <Link href={`/products/${item.id}`} className="block mb-2">
                                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                </Link>
                                <p className="text-2xl font-bold text-primary mb-4">
                                    {formatPrice(item.price)}
                                </p>

                                <button
                                    onClick={() => handleAddToCart(item)}
                                    disabled={addingToCart === item.id}
                                    className="w-full btn btn-primary py-2 flex items-center justify-center disabled:opacity-50"
                                >
                                    {addingToCart === item.id ? (
                                        <>Added!</>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
