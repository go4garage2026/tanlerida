import { NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { enforceRateLimit } from '@/lib/rate-limit'
import { getRequestIp } from '@/lib/utils/guards'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: Request) {
  try {
    enforceRateLimit(`tan-lerida-upload:${getRequestIp(request)}`, 20, 60_000)
    await getCurrentUserIdOrDemo()

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: 'Only JPEG, PNG, and WebP images are accepted.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: 'File must be under 10 MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { url } = await uploadToCloudinary(buffer, 'tangred/tan-lerida', {
      transformation: [{ width: 1200, height: 1600, crop: 'limit', quality: 'auto' }],
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 400 },
    )
  }
}
