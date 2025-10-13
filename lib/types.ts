export interface JewelryItem {
  id: string;
  name: string;
  category: 'earrings' | 'necklace' | 'bracelet' | 'ring';
  imageUrl: string;
  description: string;
  price?: number;
  style?: 'classic' | 'modern' | 'vintage';
  occasion?: 'casual' | 'formal' | 'party' | 'wedding';
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
  id?: string;
  tryOnImage: string;
  threeDModel?: string;
  model_used: string;
  processing_time: number;
}

export interface Tripo3DFile {
  file_size: number;
  content_type: string;
  url: string;
}

export interface Tripo3DResponse {
  task_id: string;
  model_mesh?: Tripo3DFile;
  base_model?: Tripo3DFile;
  pbr_model?: Tripo3DFile;
  rendered_image?: Tripo3DFile;
}
