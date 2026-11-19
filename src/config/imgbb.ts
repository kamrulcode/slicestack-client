type ImgbbResponse = {
  success: boolean;
  data?: { url?: string };
  error?: { message?: string };
};

export async function uploadImage(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = (await response.json()) as ImgbbResponse;

  if (data.success && data.data?.url) {
    return data.data.url;
  }

  throw new Error(data.error?.message || "Image upload failed");
}
