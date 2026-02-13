import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            db_order_id
        } = await request.json();

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment verified - update order
            await prisma.order.update({
                where: { id: db_order_id },
                data: {
                    paymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id,
                    paymentStatus: 'PAID',
                    status: 'PROCESSING' // Auto-move to processing as payment is confirmed
                }
            });

            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
