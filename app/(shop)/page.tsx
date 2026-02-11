import { prisma } from '@/lib/prisma';
import AnimatedHomePage from '@/components/layout/AnimatedHomePage';

async function getCategories() {
  try {

    const categories = await prisma.category.findMany({
      take: 4,
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 4,
      include: { category: true },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

async function getHeroSlides() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return slides;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const heroSlides = await getHeroSlides();

  return <AnimatedHomePage categories={categories} featuredProducts={featuredProducts} heroSlides={heroSlides} />;
}
