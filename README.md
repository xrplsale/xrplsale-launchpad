# XRPL.Sale Launchpad

A modern Next.js 15 frontend for the XRPL.Sale token launchpad platform, featuring server-side rendering, real-time XRPL integration, and a professional dark theme with glassmorphism design.

## 🚀 Features

- **Next.js 15** with App Router for modern React development
- **Server-Side Rendering** for optimal SEO and performance
- **TypeScript** for type-safe development
- **Tailwind CSS v4** with custom XRPL-themed design system
- **Real-time XRPL Integration** for live statistics and presale data
- **Responsive Design** with mobile-first approach
- **Professional UI** with glassmorphism effects and dark theme

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API Integration**: RESTful API client
- **Build Tool**: Turbopack for fast development
- **Deployment**: Vercel-ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/xrplsale/xrpl-sale-frontend.git
cd xrpl-sale-frontend

# Install dependencies
npm install

# Set up environment variables (see Environment section)
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com

# For local development with Flask backend:
# NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler check
```

## 🏗 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── projects/           # Project pages
│   ├── blog/               # Blog system
│   └── changelog/          # Changelog pages
├── components/             # React components
│   ├── features/           # Feature-specific components
│   │   ├── auth/          # Authentication components
│   │   ├── investment/    # Investment flow components
│   │   ├── projects/      # Project-related components
│   │   └── analytics/     # Analytics components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── shared/            # Shared components
├── lib/                   # Utilities and configurations
│   ├── api-simple.ts      # API client
│   ├── utils.ts           # Utility functions
│   └── theme.ts           # Theme configuration
└── types/                 # TypeScript type definitions
    ├── index.ts           # Main types
    └── blog.ts            # Blog-specific types
```

## 🎨 Design System

The application features a custom XRPL-themed design with:

- **Dark Theme**: Professional dark color scheme
- **Purple/Cyan Gradients**: XRPL-inspired color palette
- **Glassmorphism**: Modern frosted glass effects
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 compliant components

## 🔌 API Integration

The frontend integrates with a Flask backend API for:

- Project management and listings
- User authentication and KYC
- XRPL network statistics
- Presale analytics and investments
- Blog and changelog content

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Using Vercel CLI
npm run build && npx vercel --prod

# Or connect your GitHub repository to Vercel Dashboard
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🧪 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (for full functionality)

### Development Workflow

1. Start the development server: `npm run dev`
2. Make your changes
3. Verify in browser and check console for errors
4. Run type checking: `npm run type-check`
5. Build and test: `npm run build`
6. Lint code: `npm run lint`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please contact the development team or create an issue in this repository.
