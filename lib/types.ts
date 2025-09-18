export interface JewelryItem {
  id: string;
  name: string;
  category: 'earrings' | 'necklace' | 'bracelet' | 'ring';
  imageUrl: string;
  description: string;
  price?: number;
}

export interface ImageData {
  dataUrl: string;
  file?: File;
}

export interface VirtualTryOnRequest {
  faceImageUrl: string;
  selectedJewelry: JewelryItem[];
  generate3D: boolean;
}

export interface VirtualTryOnResponse {
  tryOnImage: string;
  threeDModel?: string;
  model_used: string;
  processing_time: number;
}