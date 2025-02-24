import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (
  file: File,
  bolRef: string,
  docType: string
) => {
  if (!file) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "raw",
          public_id: `${bolRef}/${docType}`,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({ url: result?.secure_url, publicId: result?.public_id });
        }
      )
      .end(buffer);
  });
};
