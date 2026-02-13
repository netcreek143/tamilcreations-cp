import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageMap = {
    saree: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    silk: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    blouse: 'https://images.unsplash.com/photo-1583391733958-e02652a7732a?q=80&w=800&auto=format&fit=crop',
    jewel: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'
};

function getImageForTitle(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('saree') || lower.includes('pattu')) return imageMap.saree;
    if (lower.includes('silk')) return imageMap.silk;
    if (lower.includes('blouse') || lower.includes('top')) return imageMap.blouse;
    if (lower.includes('jewel') || lower.includes('chain') || lower.includes('necklace') || lower.includes('bangle')) return imageMap.jewel;
    if (lower.includes('access')) return imageMap.accessories;
    return imageMap.default;
}

async function main() {
    console.log('🔄 Checking for missing images...');

    // 1. Update Categories
    const categories = await prisma.category.findMany();
    for (const cat of categories) {
        if (!cat.image || cat.image.trim() === '' || cat.image.startsWith('/images/')) {
            const newImage = getImageForTitle(cat.name);
            console.log(`Updating category '${cat.name}' with image.`);
            await prisma.category.update({
                where: { id: cat.id },
                data: { image: newImage }
            });
        }
    }

    // 2. Update Products
    const products = await prisma.product.findMany();
    for (const prod of products) {
        let needsUpdate = false;
        try {
            const images = JSON.parse(prod.images);
            // Check if array is empty, contains empty string, or first image is a local placeholder path
            if (!Array.isArray(images) || images.length === 0 || (images.length === 1 && images[0] === '') || (images.length > 0 && images[0].startsWith('/images/'))) {
                needsUpdate = true;
            }
        } catch (e) {
            // If JSON parse fails, it's definitely invalid
            needsUpdate = true;
        }

        if (needsUpdate) {
            const newImage = getImageForTitle(prod.title);
            console.log(`Updating product '${prod.title}' with image.`);
            await prisma.product.update({
                where: { id: prod.id },
                data: {
                    images: JSON.stringify([newImage])
                }
            });
        }
    }

    console.log('✅ Image update completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
