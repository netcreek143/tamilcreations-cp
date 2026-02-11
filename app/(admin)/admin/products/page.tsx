'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
    id: string;
    title: string;
    price: number;
    stock: number;
    images: string;
    featured: boolean;
    category: {
        name: string;
    };
}

export default function AdminProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'ADMIN') {
                router.push('/');
            } else {
                fetchProducts();
            }
        }
    }, [status, session, router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=1000');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id));
                alert('Product deleted successfully');
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete Product');
        }
    };

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
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
                    <div>
                        <Link href="/admin" className="flex items-center text-gray-600 hover:text-primary mb-2">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold">Product Management</h1>
                    </div>
                    <Link href="/admin/products/new" className="btn btn-primary flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Product
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4">Product</th>
                                    <th className="text-left py-3 px-4">Category</th>
                                    <th className="text-left py-3 px-4">Price</th>
                                    <th className="text-left py-3 px-4">Stock</th>
                                    <th className="text-left py-3 px-4">Featured</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    const images = JSON.parse(product.images);
                                    const firstImage = images[0] || '/images/placeholder-product.svg';

                                    return (
                                        <tr key={product.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative w-16 h-16 flex-shrink-0">
                                                        <Image
                                                            src={firstImage}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{product.title}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">{product.category.name}</td>
                                            <td className="py-3 px-4 font-semibold">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10
                                                        ? 'bg-green-100 text-green-800'
                                                        : product.stock > 0
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {product.featured ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Featured
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5 text-blue-600" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && (
                            <p className="text-center text-gray-600 py-8">No products found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
