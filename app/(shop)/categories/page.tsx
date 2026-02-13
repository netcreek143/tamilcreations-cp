import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Package, ArrowRight } from 'lucide-react';

async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-[#0F172A] text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] font-medium mb-4 block">Collections</span>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Browse Categories</h1>
                    <p className="text-slate-300 text-lg mx-auto font-light leading-relaxed text-center">
                        Explore our thoughtfully curated collections, from traditional silk sarees to contemporary accessories.
                    </p>
                </div>
            </div>
            <br />

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.slug}`}
                            className="group relative h-[400px] overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 bg-slate-200">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                        <Package className="w-16 h-16" />
                                    </div>
                                )}
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h2 className="text-3xl font-playfair font-bold mb-3">{category.name}</h2>
                                    <p className="text-slate-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {category.description || 'Discover our exclusive collection of premium designs.'}
                                    </p>

                                    <div className="flex items-center text-[#D4AF37] font-medium text-sm tracking-widest uppercase">
                                        View Collection
                                        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Border */}
                            <div className="absolute inset-4 border border-white/20 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No categories found.</p>
                    </div>
                )}
            </div>
            <br />
        </div>
    );
}
