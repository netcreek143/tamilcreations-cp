import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // 4MB limit to allow for Base64 overhead within MongoDB 16MB limit
        if (file.size > 4 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Max size is 4MB.' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = file.type || 'application/octet-stream';

        // Convert to Base64 Data URI
        const base64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;

        return NextResponse.json({
            success: true,
            url: base64Url
        });

    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json(
            { error: 'Error processing file' },
            { status: 500 }
        );
    }
}
