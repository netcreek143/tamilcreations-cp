'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Grid3x3, List, Filter, ChevronDown, X, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string;
    category: { name: string; slug: string };
    stock: number;
}

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Initialize state from URL params
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

    const [categories, setCategories] = useState<any[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Sync state with URL params when they change (e.g., from Header search)
    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
        setSelectedCategory(searchParams.get('category') || '');
        setPriceRange({
            min: searchParams.get('minPrice') || '',
            max: searchParams.get('maxPrice') || ''
        });
        setSortBy(searchParams.get('sort') || 'newest');
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products whenever filters change
    useEffect(() => {
        fetchProducts(true);
    }, [searchTerm, selectedCategory, sortBy, priceRange.min, priceRange.max]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchProducts = async (reset = false) => {
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);
            if (priceRange.min) params.append('minPrice', priceRange.min);
            if (priceRange.max) params.append('maxPrice', priceRange.max);
            params.append('sort', sortBy);
            params.append('page', currentPage.toString());
            params.append('limit', '12');

            // Update URL without reloading page
            const newUrl = `/shop?${params.toString()}`;
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);

            const res = await fetch(`/api/products?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();

            if (reset) {
                setProducts(data.products || []);
                setPage(2);
            } else {
                setProducts(prev => {
                    const newProducts = (data.products || []).filter((p: Product) =>
                        !prev.some(existing => existing.id === p.id)
                    );
                    return [...prev, ...newProducts];
                });
                setPage(prev => prev + 1);
            }

            const totalPages = data.pagination?.totalPages || 1;
            setHasMore(currentPage < totalPages);

        } catch (error) {
            console.error('Error fetching products:', error);
            if (reset) setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger fetch via dependency array by updating URL
        const params = new URLSearchParams(searchParams);
        if (searchTerm) params.set('search', searchTerm);
        else params.delete('search');
        router.push(`/shop?${params.toString()}`);
    };

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`/shop?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/shop');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header / Hero */}
            <div className="bg-[#0F172A] text-white py-16 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/patterns/noise.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-playfair font-bold mb-4"
                    >
                        Shop Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 text-lg max-w-7xl mx-auto font-light text-center"
                    >
                        Discover our range of handcrafted sarees and bespoke accessories.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                {/* Filter Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 mb-8 sticky top-20 z-30">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                        {/* Search */}
                        <div className="w-full  lg:w-1/3 relative ">
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-4 py-2.5 border border-slate-200 rounded focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder:text-slate-400 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </form>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
                            {/* Category */}
                            <div className="relative min-w-[160px]">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => updateFilter('category', e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded bg-white text-sm focus:border-[#D4AF37] outline-none cursor-pointer hover:border-slate-300 transition-colors"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Sort */}
                            <div className="relative min-w-[160px]">
                                <select
                                    value={sortBy}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded bg-white text-sm focus:border-[#D4AF37] outline-none cursor-pointer hover:border-slate-300 transition-colors"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Price Toggle / View Mode */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`p-2.5 border rounded flex items-center justify-center gap-2 text-sm font-medium transition-colors ${isFilterOpen ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="hidden sm:inline">Price</span>
                            </button>

                            <div className="flex border border-slate-200 rounded overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters (Price) */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-700">Price Range:</span>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        className="w-24 px-3 py-1.5 border border-slate-200 rounded text-sm outline-none focus:border-[#D4AF37]"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="w-24 px-3 py-1.5 border border-slate-200 rounded text-sm outline-none focus:border-[#D4AF37]"
                                    />
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(searchParams);
                                            if (priceRange.min) params.set('minPrice', priceRange.min);
                                            if (priceRange.max) params.set('maxPrice', priceRange.max);
                                            router.push(`/shop?${params.toString()}`);
                                        }}
                                        className="px-4 py-1.5 bg-[#D4AF37] text-[#0F172A] text-sm font-semibold rounded hover:bg-[#B5952F] transition-colors"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-slate-500 hover:text-red-500 underline ml-auto flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" /> Clear All Filters
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-end">
                    <p className="text-slate-500 text-sm">
                        Showing <span className="font-semibold text-[#0F172A]">{products.length}</span> results
                    </p>
                </div>

                {/* Products Grid/List */}
                {loading && products.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-lg p-3">
                                <div className="animate-pulse bg-slate-200 h-[300px] w-full rounded mb-4"></div>
                                <div className="animate-pulse bg-slate-200 h-4 w-3/4 mb-2"></div>
                                <div className="animate-pulse bg-slate-200 h-4 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-lg border border-dashed border-slate-200"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-6">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-medium text-[#0F172A] mb-4">No products found</h3>
                        <br />
                        <p className="text-slate-500 mb-8 max-w-md mx-auto text-center">
                            We couldn't find any products matching your filters. Try adjusting your search or category selection.
                        </p>
                        <br />
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 border border-slate-300 text-slate-600 rounded hover:border-[#0F172A] hover:text-[#0F172A] transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8'
                                : 'space-y-4 max-w-4xl mx-auto'
                        }
                    >
                        <AnimatePresence>
                            {products.map((product) => {
                                const images = JSON.parse(product.images);
                                const firstImage = images[0] || '/images/placeholder-product.svg';

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        key={product.id}
                                    >
                                        <Link
                                            href={`/products/${product.id}`}
                                            className={`group block bg-white hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden ${viewMode === 'list' ? 'flex gap-6 p-4 border border-transparent hover:border-[#D4AF37]/30' : ''}`}
                                        >
                                            <div className={`relative overflow-hidden bg-slate-100 ${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0 rounded' : 'aspect-[3/4]'}`}>
                                                <Image
                                                    src={firstImage}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                {viewMode === 'grid' && (
                                                    <>
                                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                                                            <button className="w-full bg-white text-[#0F172A] py-3 font-semibold text-sm uppercase tracking-wider hover:bg-[#0F172A] hover:text-white transition-colors shadow-lg rounded">
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className={`${viewMode === 'list' ? 'flex-1 py-1' : 'p-5 text-center'}`}>
                                                <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-2">{product.category.name}</p>
                                                <h3 className={`font-playfair font-medium text-[#0F172A] mb-2 group-hover:text-[#D4AF37] transition-colors ${viewMode === 'list' ? 'text-xl font-semibold' : 'text-lg px-2 truncate'}`}>
                                                    {product.title}
                                                </h3>
                                                {viewMode === 'list' && (
                                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                        {product.description}
                                                    </p>
                                                )}
                                                <div className={viewMode === 'list' ? 'flex items-center justify-between mt-auto' : ''}>
                                                    <p className={`text-[#0F172A] font-bold ${viewMode === 'list' ? 'text-xl' : 'text-lg text-slate-700'}`}>
                                                        {formatPrice(product.price)}
                                                    </p>
                                                    {viewMode === 'list' && (
                                                        <span className="text-sm font-medium underline decoration-[#D4AF37] decoration-2 underline-offset-4 text-[#0F172A] group-hover:text-[#D4AF37] transition-colors">
                                                            View Details
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Load More */}
                {products.length > 0 && hasMore && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={() => fetchProducts(false)}
                            disabled={loading}
                            className="px-10 py-3 border border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all uppercase tracking-widest text-sm font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Load More Products'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div></div>}>
            <ShopContent />
        </Suspense>
    );
}
