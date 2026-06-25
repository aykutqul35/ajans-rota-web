import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
  const body = request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authenticate the user here (e.g. check if Admin is logged in)
        // For simplicity in this implementation, we will allow it.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'],
          tokenPayload: JSON.stringify({
            // Any custom metadata you want
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // You could update your database here if needed, 
        // but our frontend will update the JSON blob with the new URL anyway.
        console.log("Blob uploaded completed:", blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
