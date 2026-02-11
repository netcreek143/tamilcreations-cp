import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Categories
    const categories = [
        {
            name: 'Bridal Wear',
            slug: 'bridal-wear',
            description: 'Exquisite bridal collections for your special day.',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'
        },
        {
            name: 'Silk Sarees',
            slug: 'silk-sarees',
            description: 'Traditional Kanjivaram and soft silk sarees.',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
        },
        {
            name: 'Designer Blouses',
            slug: 'designer-blouses',
            description: 'Hand-embroidered and custom-fit blouses.',
            image: 'https://images.unsplash.com/photo-1583391733958-e02652a7732a?q=80&w=800&auto=format&fit=crop'
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Jewelry and accessories to complete your look.',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'
        }
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
    }

    console.log('✅ Categories seeded');

    // 2. Create Products
    // Fetch category IDs to link products
    const bridalCat = await prisma.category.findUnique({ where: { slug: 'bridal-wear' } });
    const silkCat = await prisma.category.findUnique({ where: { slug: 'silk-sarees' } });
    const blouseCat = await prisma.category.findUnique({ where: { slug: 'designer-blouses' } });
    const accCat = await prisma.category.findUnique({ where: { slug: 'accessories' } });

    const products = [
        {
            title: 'Royal Red Kanjivaram Bridal Saree',
            description: 'Authentic pure zari Kanjivaram silk saree with intricate temple borders. Perfect for the traditional bride.',
            price: 45000,
            stock: 5,
            images: JSON.stringify(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop']),
            categoryId: bridalCat?.id,
            featured: true
        },
        {
            title: 'Gold Tissue Silk Saree',
            description: 'Lightweight tissue silk saree with golden sheen and floral motifs.',
            price: 18500,
            stock: 10,
            images: JSON.stringify(['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop']),
            categoryId: silkCat?.id,
            featured: true
        },
        {
            title: 'Embroidered Peacock Blue Blouse',
            description: 'Hand-embroidery work with maggam details on raw silk fabric.',
            price: 6500,
            stock: 15,
            images: JSON.stringify(['https://images.unsplash.com/photo-1583391733958-e02652a7732a?q=80&w=800&auto=format&fit=crop']),
            categoryId: blouseCat?.id,
            featured: true
        },
        {
            title: 'Antique Temple Jewellery Set',
            description: 'Matte finish gold-plated necklace set with ruby and emerald stones.',
            price: 12000,
            stock: 8,
            images: JSON.stringify(['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop']),
            categoryId: accCat?.id,
            featured: true
        },
        {
            title: 'Pastel Pink Soft Silk Saree',
            description: 'Contemporary soft silk saree suitable for receptions and parties.',
            price: 15000,
            stock: 12,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop']),
            categoryId: silkCat?.id,
            featured: false
        },
        {
            title: 'Velvet Bridal Blouse - Maroon',
            description: 'Rich velvet blouse with zardosi work.',
            price: 4500,
            stock: 20,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop']), // Placeholder image reuse
            categoryId: blouseCat?.id,
            featured: false
        }
    ];

    for (const product of products) {
        if (product.categoryId) {
            // Simple check to avoid duplicates based on title for this seed script
            const existing = await prisma.product.findFirst({ where: { title: product.title } });
            if (!existing) {
                await prisma.product.create({
                    data: {
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        images: product.images,
                        featured: product.featured,
                        categoryId: product.categoryId
                    }
                });
            }
        }
    }

    console.log('✅ Products seeded');

    // 3. Create Admin User (if not exists)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tamilcreations.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('✅ Admin user created');
    }

    console.log('🌱 Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
