import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const oldEmails = ['admin@saiagalyas.com', 'info@saiagalyas.com'];

    for (const email of oldEmails) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            console.log(`Found user: ${user.email} (ID: ${user.id})`);

            // Delete associated orders first to avoid foreign key constraint errors
            const deleteOrders = await prisma.order.deleteMany({
                where: { userId: user.id },
            });
            console.log(`Deleted ${deleteOrders.count} orders for user.`);

            // Address and Wishlist have Cascade delete in schema, but good to be safe/aware.
            // Deleting user.
            await prisma.user.delete({
                where: { id: user.id },
            });
            console.log(`Deleted user: ${email}`);
        } else {
            console.log(`User ${email} not found.`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
