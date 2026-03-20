import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'tangred',
  options: Record<string, unknown> = {}
) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          ...options,
        },
        (error, result) => {
          if (error) reject(error)
          else if (result)
            resolve({ url: result.secure_url, publicId: result.public_id })
        }
      )
      .end(fileBuffer)
  })
}

export { cloudinary }
