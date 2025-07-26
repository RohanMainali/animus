// Upload an image to ImgBB and return the public URL
// Requires a free API key from https://api.imgbb.com/
export const uploadImageToImgBB = async (localUri, apiKey) => {
  const formData = new FormData();
  formData.append('image', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'skin-scan.jpg',
  });

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = await response.json();
  if (data && data.data && data.data.url) {
    return data.data.url;
  }
  throw new Error('Image upload failed');
};
