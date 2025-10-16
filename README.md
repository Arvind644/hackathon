
# AI Jewelry Stylist Kiosk 🎭💎

> **Live Demo**: [https://hackathon-beryl-iota.vercel.app/](https://hackathon-beryl-iota.vercel.app/)

An AI-powered jewelry recommendation system that analyzes user photos and generates personalized jewelry suggestions using advanced computer vision and celebrity style matching.
## Goal 
Create a responsive virtual try-on web app for Evol Jewels that lets users try jewelry using only sliders and clicks. The app matches the brand’s colors, uses LLMs for background removal and image generation, and includes an easy lead capture step through QR or email for later marketing.

## Tech StackTech Stack & Frameworks Used:
1. Frontend Stack: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 for modern, responsive UI with smooth animations
2. AI Integration: fal.ai client with Nanobanana for face-preserving try-on 
3. Database: Prisma ORM + PostgreSQL for reliable data storage (try-on results, jewelry catalog, user sessions)
4. Image Processing: React Webcam + Dropzone for seamless photo capture and upload
5. Kiosk Optimization: Progressive Web App architecture ensures smooth performance on large touchscreens whether 55 inches, or a projector screen 
This flexible deployment (kiosk + mobile) maximizes reach across retail locations, trade shows, and online channels.

## 🚀 5-Step User Journey

1. **Approach**: Akhil approaches the kiosk and sees his reflection in the display
2. **Capture**: He taps to start, uploads a selfie using the camera, then browses Evol's jewelry collection
3. **Try-On**: He selects a diamond necklace and gold earrings - within 8 seconds, he sees himself wearing both pieces with perfect facial preservation
4. **Match**: On the side, it shows [Ranveer Singh] in a similar look, displays his vibe & recommends a few more jewelry pieces from Evol's collection & takes him back to step 2
5. **Share**: Once he finds an impressive design, he saves the look to his gallery, and scans the QR code to continue shopping on his phone with his personalized recommendations. He can also email/message it to himself

## 📊 Database Schema

![Database Schema](public/database-diagram.drawio.png)

The system uses a PostgreSQL database with two main entities:
- **VirtualTryOn**: Stores try-on session results with AI processing metadata
- **JewelryCollection**: Manages the jewelry catalog with usage analytics

## Dev Instructions:
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

First, you'll need to set up your Fal AI API key:

1. Create a `.env` file in the root directory of the project
2. Add your Fal AI API key:

```bash
NEXT_PUBLIC_FAL_KEY=your_fal_ai_api_key_here
```

To get your Fal AI API key:
1. Visit [Fal AI](https://fal.ai/)
2. Sign up or log in to your account
3. Navigate to your dashboard to generate an API key
4. Copy the API key and paste it in your `.env` file

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
