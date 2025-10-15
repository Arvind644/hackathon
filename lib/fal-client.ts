import { fal } from "@fal-ai/client";
import { JewelryItem, VirtualTryOnResponse } from "./types";

// Configure fal.ai client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY || ''
});

export function buildImageCleaningPrompt(): string {
  return `Clean and enhance this portrait photo by:
1. Remove the background completely, making it transparent or solid white
2. Center the face in the image frame
3. Enhance facial features and skin tone naturally
4. Improve lighting and contrast for professional quality
5. Ensure the face is well-lit and clearly visible
6. Maintain natural facial expressions and features
7. Crop to optimal portrait aspect ratio (3:4)
8. Professional studio-quality lighting and clarity
CRITICAL: Do NOT change the person's appearance, facial features, or expression. Only enhance lighting and remove background.
The result should be a clean, centered portrait perfect for jewelry try-on applications.`;
}

export function buildVirtualTryOnPrompt(selectedJewelry: JewelryItem[]): string {
  const jewelryDescriptions = selectedJewelry.map(item => {
    const category = item.category;
    let placement = '';

    switch(category) {
      case 'earrings':
        placement = `wearing the exact ${item.name} earrings on both ears`;
        break;
      case 'necklace':
        placement = `wearing the exact ${item.name} necklace around the neck`;
        break;
      case 'bracelet':
        placement = `wearing the exact ${item.name} bracelet on the wrist`;
        break;
      case 'ring':
        placement = `wearing the exact ${item.name} ring on the finger`;
        break;
      default:
        placement = `wearing the exact ${item.name}`;
    }

    return `${placement}${item.description ? ` - ${item.description}` : ''}`;
  }).join(', ');

  return `Create a professional high-resolution portrait photograph of the same person ${jewelryDescriptions}.

CRITICAL REQUIREMENTS:
- Use ONLY the exact jewelry items specified: ${selectedJewelry.map(j => j.name).join(', ')}
- Reference the provided jewelry images to recreate the EXACT same pieces
- Do NOT change, modify, or substitute the jewelry items
- Do NOT add any additional jewelry not specified
- Do NOT remove or alter the specified jewelry pieces
- Match the exact colors, materials, and design patterns from the jewelry images
- Maintain the exact same face, skin tone, facial features, expression, hair style, and pose as the reference image
- Keep the jewelry pieces clearly visible, properly positioned, and realistically rendered
- Use natural metallic shine and reflections appropriate for luxury jewelry
- Professional studio lighting with sharp focus on both face and jewelry
- Do not change the background - maintain the same background as the reference image
- Fashion photography quality suitable for luxury jewelry catalog
- Natural and elegant presentation`;
}

export async function cleanImage(faceImageUrl: string): Promise<string> {
  try {
    // Validate input
    if (!faceImageUrl || (!faceImageUrl.startsWith('http') && !faceImageUrl.startsWith('data:'))) {
      throw new Error('Invalid face image URL provided for cleaning');
    }

    const prompt = buildImageCleaningPrompt();

    console.log('Cleaning image using Nano Banana...');
    console.log('Original Image URL:', faceImageUrl);
    console.log('Cleaning Prompt:', prompt);

    // Use Nano Banana for image cleaning and enhancement
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: prompt,
        image_urls: [faceImageUrl], // Input image for cleaning
        num_images: 1,
        output_format: "png", // Use PNG for better quality and transparency support
        aspect_ratio: "3:4" // Portrait aspect ratio
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Nano Banana image cleaning in progress...");
          if (update.logs) {
            update.logs.forEach(log => console.log(log.message));
          }
        }
      },
    });

    console.log('Nano Banana image cleaning response:', result);

    const cleanedImageUrl = result.data.images[0]?.url;
    if (!cleanedImageUrl) {
      throw new Error('No cleaned image returned from Nano Banana');
    }

    console.log('Image cleaned successfully:', cleanedImageUrl);
    return cleanedImageUrl;

  } catch (error) {
    console.error('Image cleaning error:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'body' in error) {
      errorMessage = `API Error: ${JSON.stringify(error.body)}`;
    }

    throw new Error(`Image cleaning failed: ${errorMessage}`);
  }
}

export async function generateVirtualTryOn(faceImageUrl: string, selectedJewelry: JewelryItem[], generate3D: boolean = false, skipCleaning: boolean = false) {
  try {
    // Validate inputs
    if (!faceImageUrl || (!faceImageUrl.startsWith('http') && !faceImageUrl.startsWith('data:'))) {
      throw new Error('Invalid face image URL provided');
    }

    if (!selectedJewelry || selectedJewelry.length === 0) {
      throw new Error('No jewelry items selected');
    }

    let processedImageUrl = faceImageUrl;

    // Step 1: Clean the image if not skipped
    if (!skipCleaning) {
      console.log('Step 1: Cleaning uploaded image...');
      try {
        processedImageUrl = await cleanImage(faceImageUrl);
        console.log('Image cleaning completed successfully');
      } catch (error) {
        console.warn('Image cleaning failed, proceeding with original image:', error);
        // Continue with original image if cleaning fails
        processedImageUrl = faceImageUrl;
      }
    }

    // Step 2: Generate virtual try-on with cleaned image
    console.log('Step 2: Generating virtual try-on...');
    const prompt = buildVirtualTryOnPrompt(selectedJewelry);

    // Include jewelry image URLs for AI reference
    const jewelryImageUrls = selectedJewelry.map(j => j.imageUrl).filter(url => url.startsWith('http'));

    console.log('Sending virtual try-on request to fal.ai using Nano Banana...');
    console.log('Processed Image URL:', processedImageUrl);
    console.log('Selected Jewelry Items:', selectedJewelry.map(j => `${j.name} (${j.category})`).join(', '));
    console.log('Jewelry Image URLs:', jewelryImageUrls);
    console.log('Prompt:', prompt);

    // Use Nano Banana for image-to-image editing with face preservation
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: prompt,
        image_urls: [processedImageUrl, ...jewelryImageUrls], // Include face image + jewelry images
        num_images: 1,
        output_format: "jpeg",
        aspect_ratio: "3:4" // Portrait aspect ratio suitable for jewelry try-on
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Nano Banana virtual try-on in progress...");
          if (update.logs) {
            update.logs.forEach(log => console.log(log.message));
          }
        }
      },
    });

    let threeDModel = undefined;
    if (generate3D) {
      try {
        console.log('Generating 3D model using Tripo3D...');
        // Generate 3D model using Tripo3D
        const threeDResult = await fal.subscribe("tripo3d/tripo/v2.5/image-to-3d", {
          input: {
            image_url: result.data.images[0].url,
            texture: "standard",
            texture_alignment: "original_image",
            orientation: "default",
            pbr: false
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              console.log("Tripo3D generation in progress...");
              if (update.logs) {
                update.logs.forEach(log => console.log(log.message));
              }
            }
          }
        });

        if (threeDResult.data.model_mesh?.url) {
          threeDModel = threeDResult.data.model_mesh.url;
          console.log('3D model generated successfully:', threeDModel);
        }
      } catch (error) {
        console.log('3D generation failed:', error);
        console.log('Continuing with 2D result only');
      }
    }

    console.log('fal.ai virtual try-on response:', result);

    return {
      tryOnImage: result.data.images[0]?.url || '',
      threeDModel,
      model_used: 'nano-banana',
      processing_time: 0,
      cleanedImage: skipCleaning ? undefined : processedImageUrl,
      originalImage: faceImageUrl
    };
  } catch (error) {
    console.error('fal.ai virtual try-on error:', error);

    // Log detailed error information
    if (error && typeof error === 'object' && 'body' in error) {
      console.error('Error body:', error.body);
    }

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'body' in error) {
      errorMessage = `API Error: ${JSON.stringify(error.body)}`;
    }

    throw new Error(`Virtual try-on failed: ${errorMessage}`);
  }
}

// Fallback function for testing without API key
export function generateMockVirtualTryOn(selectedJewelry: JewelryItem[], generate3D: boolean = false): Promise<VirtualTryOnResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock result showing person with jewelry
      const mockImages = [
        'https://images.unsplash.com/photo-1494790108755-2616c6e7b77a?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'
      ];

      resolve({
        tryOnImage: mockImages[Math.floor(Math.random() * mockImages.length)],
        threeDModel: generate3D ? 'https://example.com/3d-model.glb' : undefined,
        model_used: 'mock',
        processing_time: 3000
      });
    }, 3000);
  });
}