'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, ArrowLeft, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string;
    stock: number;
    variants: string | null;
    category: { name: string };
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<any>({});
    const [addingToCart, setAddingToCart] = useState(false);

    const inWishlist = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`);
            const data = await res.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        const images = JSON.parse(product.images);
        const variant = Object.keys(selectedVariants).length > 0
            ? Object.entries(selectedVariants).map(([key, value]) => `${key}: ${value}`).join(', ')
            : undefined;

        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity,
            image: images[0] || '/images/placeholder-product.svg',
            variant,
            stock: product.stock,
        });

        setAddingToCart(true);
        setTimeout(() => setAddingToCart(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <button onClick={() => router.push('/shop')} className="btn btn-primary">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const images = JSON.parse(product.images);
    const variants = product.variants ? JSON.parse(product.variants) : [];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Shop
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                            <Image
                                src={images[selectedImage] || '/images/placeholder-product.jpg'}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative aspect-square rounded overflow-hidden border-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent'
                                            }`}
                                    >
                                        <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <p className="text-primary font-medium mb-2">{product.category.name}</p>
                        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                        <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>

                        <div className="mb-6">
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <Check className="w-5 h-5 mr-2" />
                                    <span className="font-medium">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <p className="text-red-600 font-medium">Out of Stock</p>
                            )}
                        </div>

                        {/* Variants */}
                        {variants.length > 0 && (
                            <div className="space-y-4 mb-6">
                                {variants.map((variant: any) => (
                                    <div key={variant.type}>
                                        <label className="block text-sm font-medium mb-2">{variant.type}:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {variant.options.map((option: string) => (
                                                <button
                                                    key={option}
                                                    onClick={() =>
                                                        setSelectedVariants({ ...selectedVariants, [variant.type]: option })
                                                    }
                                                    className={`px-4 py-2 border rounded-lg transition-colors ${selectedVariants[variant.type] === option
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white border-gray-300 hover:border-primary'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Quantity:</label>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                                className="flex-1 btn btn-primary py-4 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addingToCart ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    if (!product) return;
                                    const images = JSON.parse(product.images);
                                    if (inWishlist) {
                                        removeFromWishlist(product.id);
                                    } else {
                                        addToWishlist({
                                            id: product.id,
                                            title: product.title,
                                            price: product.price,
                                            image: images[0] || '/images/placeholder-product.svg',
                                        });
                                    }
                                }}
                                className={`btn p-4 ${inWishlist
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'btn-secondary'
                                    }`}
                                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 border-t pt-6 space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Product Details</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Free shipping on orders above ₹2,000</li>
                                    <li>• 7-day return policy</li>
                                    <li>• Handcrafted with premium materials</li>
                                    <li>• Made in India</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
