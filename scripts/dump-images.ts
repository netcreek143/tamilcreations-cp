import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const output: string[] = [];
    output.push('--- Categories ---');
    const categories = await prisma.category.findMany();
    categories.forEach(c => output.push(`${c.name}: '${c.image}'`));

    output.push('\n--- Products ---');
    const products = await prisma.product.findMany();
    products.forEach(p => output.push(`${p.title}: '${p.images}'`));

    fs.writeFileSync('all_images.txt', output.join('\n'));
    console.log('Dumped to all_images.txt');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
