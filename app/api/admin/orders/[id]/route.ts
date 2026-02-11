import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { status } = body;

        const order = await prisma.$transaction(async (tx: any) => {
            // 1. Fetch current order with items
            const currentOrder = await tx.order.findUnique({
                where: { id: params.id },
                include: { orderItems: true },
            });

            if (!currentOrder) {
                throw new Error('Order not found');
            }

            // 2. Check conditions for restocking
            const isCancelling = ['CANCELLED', 'REFUNDED'].includes(status);
            const wasCancelled = ['CANCELLED', 'REFUNDED'].includes(currentOrder.status);

            if (isCancelling && !wasCancelled) {
                // Restock items
                for (const item of currentOrder.orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }

            // 3. Update status
            const updatedOrder = await tx.order.update({
                where: { id: params.id },
                data: { status },
            });

            return updatedOrder;
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
