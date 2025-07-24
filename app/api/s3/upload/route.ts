import { fileUploadSchema } from "@/lib/zodSchema";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { env } from "@/lib/env";
import { v4 as uuidv4 } from "uuid";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/S3Client";

export async function POST(request:Request) {
    try{
        const body = await request.json();

        const validation = fileUploadSchema.safeParse(body);

        if(!validation.success){
            return NextResponse.json(
                {error: 'Invalid Request Body'},
                {status: 400}
            )
        }

        const {fileName, contentType, size} = validation.data
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const uniqueKey = `${uuidv4()}-${sanitizedFileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        })

        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 300 //Expires in 5 minutes
        })

        return NextResponse.json({
            presignedUrl,
            key: uniqueKey
        })
    } catch {
        return NextResponse.json(
            {error: 'Failed to generate presigned URL'},
            { status: 500},
        )
    }
}