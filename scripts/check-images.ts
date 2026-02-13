import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking for missing/empty/invalid images ---');
    let missingCount = 0;

    const categories = await prisma.category.findMany();
    for (const c of categories) {
        if (!c.image || c.image.trim() === '') {
            console.log(`[CATEGORY MISSING] ${c.name} (ID: ${c.id})`);
            missingCount++;
        }
    }

    const products = await prisma.product.findMany();
    for (const p of products) {
        let isMissing = false;
        try {
            const images = JSON.parse(p.images);
            if (!Array.isArray(images) || images.length === 0 || (images.length === 1 && images[0] === '')) {
                isMissing = true;
            }
        } catch (e) {
            isMissing = true;
        }

        if (isMissing) {
            console.log(`[PRODUCT MISSING] ${p.title} (ID: ${p.id})`);
            missingCount++;
        }
    }

    console.log(`--- Scan Complete. Found ${missingCount} items with issues. ---`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
