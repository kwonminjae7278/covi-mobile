import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

fal.config({
    credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
    try {
        const { image_url: raw_image_url, emotion, intention, target } = await req.json();

        if (!raw_image_url) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const EMOTION_MAP: Record<string, string> = {
            '🙂': "with a gentle smile, conveying light satisfaction",
            '😉': "winking playfully with a positive and amused expression",
            '😍': "with eyes wide in excitement and attraction, looking lovely",
            '😐': "with a straight mouth, expressing boredom and indifference",
            '😮': "looking speechless and surprised with mouth slightly open in awe",
            '😵': "looking shocked and chaotic with eyes wide in disbelief",
            '😰': "looking nervous, anxious, and slightly embarrassed",
            '😢': "with corners of the mouth turned down, showing typical sadness",
            '😡': "with an intense aggressive scowl and raging face",
            '🥺': "with teary eyes, looking deeply touched and emotional",
            '🤤': "looking extremely tempted as if drooling with instinctive desire"
        };

        const INTENTION_MAP: Record<string, string> = {
            '👏': "clapping hands slightly to show praise",
            '📤': "sharing something exciting with an open-hand gesture",
            '👆': "pointing a finger upwards to highlight information",
            '📥': "performing a grabbing gesture to save something valuable",
            '👍': "giving a clear thumbs up to show support",
            '🙏': "pressing hands together politely in a requesting gesture",
            '🙅': "crossing hands in an 'X' sign to signal a stop or refusal",
            '👌': "making a clear OK sign with fingers",
            '✊': "clenching a fist tightly to show commitment"
        };

        const TARGET_MAP: Record<string, string> = {
            '🎧': "a pair of headphones",
            '📖': "an open book",
            '📷': "a professional camera",
            '🎁': "a wrapped gift box",
            '💡': "a glowing light bulb",
            '🎤': "a studio microphone",
            '🖱️': "a modern computer mouse"
        };

        const emotionDesc = EMOTION_MAP[emotion] || "with a neutral expression";
        const intentionDesc = INTENTION_MAP[intention] || "standing in a natural pose";
        const targetObj = TARGET_MAP[target] || "the user";

        // Step 1: Vision analysis (Restored - No Upload version)
        // [IMPORTANT] Use raw_image_url (Base64) directly to bypass validator errors
        console.log('--- Step 1: Starting Vision Analysis (llava-next) ---');

        const visionResult: any = await fal.run("fal-ai/llava-next", {
            input: {
                image_url: raw_image_url,
                prompt: "Identify the gender, clothing color, and hairstyle of the person in this image concisely."
            }
        });

        // 결과값 파싱 로직 정밀 교정
        const visionAnalysis = visionResult.output || visionResult.description || (visionResult.data && (visionResult.data.output || visionResult.data.description)) || "a person with their unique style";

        console.log(`🔍 AI의 눈으로 본 크리에이터 특징: [${visionAnalysis}]`);
        console.log('--- Step 1: Vision Analysis Completed ---');

        // Step 2: Main 3D Generation (Restored with synced results)
        const promptIntro = `Solo, a high-fidelity 3D render of ${visionAnalysis}.`;
        const identityConstraint = "Exact same person in the reference photo, perfectly matching the described gender and clothing.";
        const prompt = `${promptIntro} ${identityConstraint} A detailed 3D render of the creator avatar, ${emotionDesc}. The avatar is explicitly interacting with ${targetObj} and performing ${intentionDesc} with clear hand gestures. COVI style, 8k resolution.`;

        console.log('--- Step 2: Starting Main 3D Generation ---');
        console.log('Assembled Prompt:', prompt);

        const result = await fal.subscribe("fal-ai/flux-lora", {
            input: {
                prompt: prompt,
                negative_prompt: "multiple people, two people, twins, clone, extra characters, background people",
                image_url: raw_image_url, // Using raw Base64 directly
                adapter_scale: 0.85, // Balanced weight for high character fidelity
                instant_id_scale: 1.0,
                loras: [
                    {
                        path: "https://v3b.fal.media/files/b/0a8fa5e6/m5ZCGX4rucVUayk4CvadD_pytorch_lora_weights.safetensors",
                        scale: 0.65,
                    }
                ],
            },
            logs: true,
            onQueueUpdate: (update) => {
                console.log("Queue update:", update);
            },
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Generation Error:', error);
        console.error('🚨 상세 에러 사유:', error.body ? JSON.stringify(error.body.detail) : error.message);
        if (error.data) {
            console.error('Full Error Data (error.data):', JSON.stringify(error.data, null, 2));
        }
        return NextResponse.json({
            error: error.message || 'Failed to generate image',
            detail: error.data || null
        }, { status: 500 });
    }
}
