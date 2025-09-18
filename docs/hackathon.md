# AI Jewelry Stylist Kiosk - Hackathon Implementation Plan

## 🎯 Project Overview
Build an AI-powered jewelry recommendation system that analyzes user photos and generates personalized jewelry suggestions using fal.ai models.

idea - eady to redefine jewelry shopping? Evol Jewels challenges you to build a 55-inch AI-powered kiosk that acts like your personal stylist — matching your vibe to celebrity styles and recommending the perfect jewelry in-store!

## ✨ Core Features

### 1. Image Input System
- **Camera Capture**: Click button → request camera permission → capture photo
- **File Upload**: Allow users to upload existing photos
- **Image Storage**: Store captured/uploaded images in database

### 2. Prompt Collection
- **CSS Modal**: Overlay with input fields after image capture/upload
- **Text Prompts**:
  - Jewelry style preferences
  - Occasion/event type
  - Color preferences
  - Additional requirements

### 3. AI Processing & Response
- **fal.ai Integration**: Send image + prompts to AI models
- **Image Generation**: Receive AI-generated jewelry recommendations
- **3D Visualization** (bonus): Convert to 3D models for better visualization

## 🔧 Tech Stack

### Frontend
```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ai-sdk": "@fal-ai/client",
  "camera": "react-webcam",
  "file-upload": "react-dropzone",
  "animations": "framer-motion"
}
```

### Backend & Database
```json
{
  "database": "Supabase",
  "storage": "Supabase Storage (for images)",
  "auth": "Supabase Auth (optional)"
}
```

### AI Models (fal.ai)
```json
{
  "primary": "FLUX Kontext [pro] - text + image input",
  "fallback": "FLUX Dev - free tier",
  "3d-generation": "Trellis - image to 3D",
  "alternative-3d": "TripoSR - backup 3D model"
}
```

## 📁 Project Structure

```
hackathon/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main landing page
│   │   ├── stylist/
│   │   │   └── page.tsx            # Main stylist interface
│   │   └── api/
│   │       ├── generate/
│   │       │   └── route.ts        # fal.ai API integration
│   │       └── upload/
│   │           └── route.ts        # Image upload handler
│   ├── components/
│   │   ├── ImageCapture.tsx        # Camera + upload component
│   │   ├── PromptModal.tsx         # Prompt collection modal
│   │   ├── ResultDisplay.tsx       # Show AI results
│   │   └── Layout3D.tsx            # 3D viewer (bonus)
│   ├── lib/
│   │   ├── fal-client.ts          # fal.ai configuration
│   │   ├── supabase.ts            # Database client
│   │   └── types.ts               # TypeScript definitions
│   └── utils/
│       ├── image-processing.ts     # Image utilities
│       └── prompt-builder.ts       # Construct AI prompts
├── docs/
│   └── hackathon.md               # This file
└── public/
    └── samples/                   # Sample jewelry images
```

## 🚀 Implementation Phases

### Phase 1: Core Setup (2 hours)
- [ ] Next.js project initialization
- [ ] Install dependencies (@fal-ai/client, react-webcam, etc.)
- [ ] Supabase setup (database + storage)
- [ ] Basic UI layout with Tailwind

### Phase 2: Image Input System (3 hours)
- [ ] Camera capture component with permission handling
- [ ] File upload with drag & drop
- [ ] Image preview functionality
- [ ] Upload to Supabase storage
- [ ] Error handling for camera/upload failures

### Phase 3: Prompt Collection (2 hours)
- [ ] Modal component with input fields
- [ ] Form validation
- [ ] Prompt combination logic
- [ ] UI/UX polish for modal

### Phase 4: AI Integration (4 hours)
- [ ] fal.ai client setup and API key configuration
- [ ] API route for image + prompt processing
- [ ] FLUX Kontext integration
- [ ] Response parsing and error handling
- [ ] Fallback to FLUX Dev if Pro fails

### Phase 5: Results Display (2 hours)
- [ ] Image gallery for AI results
- [ ] Loading states and progress indicators
- [ ] Download/share functionality
- [ ] Responsive design

### Phase 6: 3D Enhancement (3 hours) - BONUS
- [ ] Trellis API integration
- [ ] 3D model viewer component
- [ ] Toggle between 2D/3D views
- [ ] 3D model caching

### Phase 7: Polish & Demo (2 hours)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Demo preparation
- [ ] Bug fixes and testing

## 🎨 User Flow

```mermaid
graph TD
    A[Landing Page] --> B[Click 'Start Styling']
    B --> C[Choose Input Method]
    C --> D[Camera Capture]
    C --> E[Upload File]
    D --> F[Take Photo]
    E --> F[Select File]
    F --> G[Image Preview]
    G --> H[Open Prompt Modal]
    H --> I[Fill Style Preferences]
    I --> J[Submit to AI]
    J --> K[Loading Screen]
    K --> L[Display Results]
    L --> M[View 3D Model (Bonus)]
    L --> N[Try Again]
    N --> C
```

## 🔑 Key Components

### ImageCapture Component
```typescript
interface ImageCaptureProps {
  onImageCapture: (imageData: string, file?: File) => void;
  onError: (error: string) => void;
}
```

### PromptModal Component
```typescript
interface PromptData {
  style: string;          // "elegant", "modern", "vintage"
  occasion: string;       // "wedding", "casual", "formal"
  colors: string[];       // ["gold", "silver", "rose-gold"]
  additional: string;     // Free text input
}
```

### AI Integration
```typescript
interface AIRequest {
  imageUrl: string;
  prompt: string;
  model: "flux-kontext" | "flux-dev";
}

interface AIResponse {
  images: string[];
  model_used: string;
  processing_time: number;
}
```

## 🎯 Success Metrics

### Must-Have (MVP)
- [ ] Camera capture working
- [ ] Image upload working
- [ ] Prompt collection functional
- [ ] AI image generation working
- [ ] Results display properly

### Nice-to-Have
- [ ] 3D model generation
- [ ] Multiple style options
- [ ] Image gallery/history
- [ ] Social sharing
- [ ] Performance optimization

## 🐛 Potential Challenges & Solutions

### Challenge 1: Camera Permissions
**Problem**: Browser camera access can be tricky
**Solution**: Proper error handling + fallback to file upload

### Challenge 2: fal.ai Rate Limits
**Problem**: API limits during demo
**Solution**: Implement caching + use FLUX Dev as fallback

### Challenge 3: Large Image Files
**Problem**: Slow uploads/processing
**Solution**: Client-side image compression before upload

### Challenge 4: 3D Rendering Performance
**Problem**: 3D models might be slow to load
**Solution**: Progressive loading + fallback to 2D view

## 💰 Cost Estimation (fal.ai)

```
FLUX Dev: FREE
FLUX Kontext Pro: ~$0.01-0.05 per image
Trellis 3D: ~$0.10-0.50 per model
Estimated demo cost: $5-10
```

## 🎪 Demo Script

1. **Introduction** (30s): "AI-powered jewelry stylist"
2. **Capture Photo** (30s): Show camera in action
3. **Input Preferences** (30s): Fill out style modal
4. **AI Generation** (45s): Show loading → results
5. **3D Visualization** (30s): Toggle to 3D view
6. **Wrap-up** (15s): Benefits and next steps

## 📚 Resources

- [fal.ai Documentation](https://fal.ai/docs)
- [FLUX Model Details](https://fal.ai/flux)
- [Trellis 3D API](https://fal.ai/models/fal-ai/trellis)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Setup Guide](https://supabase.com/docs)

---

**Estimated Total Time**: 18 hours (perfect for a 24-hour hackathon with buffer time)
**Difficulty Level**: Intermediate
**Team Size**: 2-3 developers recommended