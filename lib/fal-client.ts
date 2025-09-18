import { fal } from "@fal-ai/client";
import { JewelryItem, VirtualTryOnResponse } from "./types";

// Configure fal.ai client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY || ''
});

export function buildVirtualTryOnPrompt(selectedJewelry: JewelryItem[]): string {
  const jewelryDescriptions = selectedJewelry.map(item => {
    const category = item.category;
    let placement = '';

    switch(category) {
      case 'earrings':
        placement = 'wearing elegant earrings';
        break;
      case 'necklace':
        placement = 'wearing a beautiful necklace';
        break;
      case 'bracelet':
        placement = 'wearing a stylish bracelet';
        break;
      case 'ring':
        placement = 'wearing an elegant ring';
        break;
      default:
        placement = `wearing ${item.name}`;
    }

    return `${placement} (${item.description})`;
  }).join(' and ');

  return `Professional portrait photograph of the same person ${jewelryDescriptions}.
    High-end jewelry photography with studio lighting, photorealistic quality, elegant pose.
    The jewelry should appear naturally worn with proper fit and realistic reflections.
    Maintain the same facial features, expression, and pose from the reference image.
    Luxury jewelry styling, professional fashion photography.`;
}

export async function generateVirtualTryOn(faceImageUrl: string, selectedJewelry: JewelryItem[], generate3D: boolean = false) {
  try {
    // Validate inputs
    if (!faceImageUrl || (!faceImageUrl.startsWith('http') && !faceImageUrl.startsWith('data:'))) {
      throw new Error('Invalid face image URL provided');
    }

    if (!selectedJewelry || selectedJewelry.length === 0) {
      throw new Error('No jewelry items selected');
    }

    const prompt = buildVirtualTryOnPrompt(selectedJewelry);

    console.log('Sending virtual try-on request to fal.ai using Ideogram Character Remix...');
    console.log('Face Image URL:', faceImageUrl);
    console.log('Prompt:', prompt);

    // Use Ideogram V3 Character Remix for face-preserving virtual try-on
    const result = await fal.subscribe("fal-ai/ideogram/character/remix", {
      input: {
        prompt: prompt,
        image_url: faceImageUrl, // Base image for the setting/background
        reference_image_urls: [faceImageUrl], // Character reference to preserve the face
        strength: 0.7, // Reduced strength to be more conservative
        style: "REALISTIC", // Use realistic style for jewelry
        rendering_speed: "BALANCED",
        expand_prompt: false, // Disable expand_prompt to avoid prompt modification
        num_images: 1,
        image_size: "portrait_4_3"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Ideogram character remix in progress...");
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
      model_used: 'ideogram-character-remix',
      processing_time: 0
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