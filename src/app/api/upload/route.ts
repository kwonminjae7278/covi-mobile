import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

fal.config({
    credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Upload using server-side credentials
        const url = await fal.storage.upload(file);

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
