import sharp from 'sharp';
import Jimp from 'jimp';

import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async (event) => {
 
  // Extract the imageURL from the request query
  const imageURL = await event.request.json();

  if (!imageURL) {
    return new Response("No Image is Available");
  }

  // Fetch the image and convert to buffer
  const response = await fetch(imageURL.url);
  const inputBuffer = await response.arrayBuffer();

  const resizedBuffer = await sharp(inputBuffer)
      .resize({ height: 1080})
      .toBuffer();
    
  return new Response(resizedBuffer);
}) satisfies RequestHandler;


// export const POST = (async (event) => {
 
//   // Extract the imageURL from the request query
//   const imageURL = await event.request.json();

//   if (!imageURL) {
//     return new Response("No Image is Available");
//   }

//   // Fetch the image and convert to buffer
//   const response = await fetch(imageURL.url);
//   const inputBuffer = await response.arrayBuffer();

//   // Use Jimp to resize the image
//   const image = await Jimp.read(Buffer.from(inputBuffer));
//   image.resize(1920, 650);

//   //@ts-ignore
//   const resizedBuffer = await image.getBufferAsync(Jimp.AUTO);
    
//   return new Response(resizedBuffer);
// }) satisfies RequestHandler;
