# Construction Materials Quote System

A Next.js application for construction material quotation and project management, featuring real-time pricing from local and online stores, Firebase authentication, and intelligent material optimization.

## Project Overview

This is a construction industry web application that helps users:
- Generate Bills of Materials (BOM) for construction projects
- Find nearby hardware stores and suppliers
- Compare prices from local and online vendors (MercadoLivre integration)
- Calculate optimal material procurement strategies
- Manage projects with adaptive scheduling and sustainability tracking

## Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Analytics**: Vercel Analytics

## Project Structure

```
.
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── geo/nearby/           # Google Places / nearby stores
│   │   ├── online/meli/          # MercadoLivre integration
│   │   ├── open/local/overpass/  # OpenStreetMap Overpass API
│   │   ├── orcamento/cotacao/    # Quote generation system
│   │   └── preco/frete/          # Shipping cost calculations
│   ├── about/                    # About page
│   ├── blog/                     # Blog with dynamic routes
│   ├── contact/                  # Contact page
│   ├── projects/                 # Projects gallery
│   ├── services/                 # Services page
│   └── sistema/                  # System features (calculator, dashboard, etc.)
├── components/                   # Reusable React components
├── lib/                         # Core libraries
│   └── firebase.ts              # Firebase configuration
├── src/lib/cotacao/             # Quote system business logic
│   ├── bom.ts                   # Bill of Materials generation
│   ├── cache.ts                 # In-memory caching
│   ├── normalizers.ts           # Data normalization
│   ├── optimizer.ts             # Price optimization algorithms
│   ├── providers.ts             # External API integrations
│   ├── rateLimit.ts             # Rate limiting
│   └── types.ts                 # TypeScript definitions
├── public/                      # Static assets
└── styles/                      # Global styles
```

## Environment Variables

### Required (Firebase)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Optional (Enhanced Features)
- `GOOGLE_MAPS_KEY` - For Google Places API and Geocoding
- `MELI_TOKEN` - For MercadoLivre product search
- `CORREIOS_TOKEN` - For Brazilian postal service shipping rates
- `DEBUG_COTACAO` - Set to 'true' for debug logging
- `USE_PLACES` - Set to 'true' to use Google Places instead of OSM
- `OVERPASS_URL` - Custom Overpass API endpoint (defaults to public instance)

## Key Features

### Quote System (`/sistema/orcamento-quantico`)
- Generates construction material lists based on project area and type
- Searches nearby stores using Google Places or OpenStreetMap
- Fetches online prices from MercadoLivre
- Optimizes procurement to minimize cost and delivery time
- Includes shipping cost calculations

### Project Management (`/sistema`)
- Adaptive scheduling with Gantt charts
- Financial tracking and budget management
- Material inventory management
- Sustainability metrics
- AI-powered consulting

### External Integrations

1. **Local Stores**: Google Places API or OpenStreetMap Overpass
2. **Online Vendors**: MercadoLivre API
3. **Geocoding**: ViaCEP + Google Geocoding
4. **Shipping**: Correios API with mock fallback

## Development

### Running Locally
```bash
npm run dev
```
Runs on http://0.0.0.0:5000

### Building for Production
```bash
npm run build
npm run start
```

## Deployment on Replit

This project is configured for Replit deployment:
- Dev server binds to `0.0.0.0:5000` for Replit's proxy
- Deployment target: `autoscale` (stateless web app)
- Build command: `npm run build`
- Start command: `npm run start`

## Architecture Notes

### Client/Server Separation
- Firebase config uses `NEXT_PUBLIC_*` variables (safe for client)
- API keys for MercadoLivre, Google Maps, Correios are server-only
- API routes handle sensitive operations

### Performance Optimizations
- In-memory caching for API responses (15-60 min TTL)
- Rate limiting on API routes
- Image optimization disabled for compatibility
- Package imports optimized for lucide-react and framer-motion

### Fallback Strategy
The app gracefully degrades when API keys are missing:
- Uses OpenStreetMap when Google Maps key unavailable
- Returns mock data for MercadoLivre when token missing
- Estimates shipping costs when Correios API unavailable

## Recent Changes (Migration from Vercel)

- **2024-11-14**: Migrated from Vercel to Replit
  - Updated dev/start scripts to bind to 0.0.0.0:5000
  - Configured Next.js for Replit's iframe proxy
  - Removed duplicate code from API routes
  - Set up Replit deployment configuration
  - Added Firebase secrets to Replit environment

## Known Issues

- Minor Next.js config warnings (non-blocking)
- 1 moderate npm security vulnerability (run `npm audit` for details)
- Some TypeScript errors suppressed via ignoreBuildErrors for quick deployment

## User Preferences

None documented yet.

## Support

For issues or questions about this project, refer to the code documentation or contact the development team.
