# Frontend Environment Variables Setup

## Creating .env File

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
touch .env
```

## Environment Variables

Add the following to your `.env` file:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000
```

## Different Environments

### Development (Local)

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Docker/Container

```env
VITE_API_BASE_URL=http://backend:5000
```

## How It Works

The API configuration in `src/lib/api.ts` uses this environment variable:

```typescript
const API_BASE_URL = import.meta.env. || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  // ...
});
```

## Centralized API Endpoints

All API endpoints are defined in `src/config/api.config.ts`:

```typescript
export const API_ENDPOINTS = {
	LOGIN: "/api/auth/login",
	UPLOAD_VALIDATE: "/api/upload/validate",
	UPLOAD_BULK: "/api/upload/bulk",
	PRODUCTS: "/api/products",
	// ... etc
};
```

## Image URL Helper

For displaying product images, use the `getImageUrl` helper:

```typescript
import { getImageUrl } from "@/config/api.config";

const imageUrl = getImageUrl(product.images[0]);
// Returns: http://localhost:5000/uploads/Azure/2025/Fall/main/A00012/A00012.jpg
```

Or use the `ProductImage` component:

```tsx
import ProductImage from "@/components/ProductImage";

<ProductImage
	src={product.images[0]}
	alt={product.style}
	className="w-20 h-20 object-cover"
/>;
```

## Important Notes

1. **Vite Prefix**: All environment variables must start with `VITE_` to be exposed to the client
2. **Rebuild Required**: After changing .env, restart the dev server
3. **Not in Git**: `.env` is gitignored; `.env.example` is the template
4. **Build Time**: Environment variables are embedded at build time
5. **Security**: Never expose sensitive keys in frontend .env (only backend URLs, feature flags, etc.)

## Troubleshooting

### API calls failing with CORS error

- Check `VITE_API_BASE_URL` matches your backend URL
- Ensure backend CORS is configured for your frontend URL

### Environment variable is undefined

- Ensure variable name starts with `VITE_`
- Restart dev server after creating .env
- Check .env file is in `frontend/` directory (not root)

### Images not loading

- Verify `VITE_API_BASE_URL` is correct
- Check backend is serving static files at `/uploads`
- Use browser DevTools to inspect image URLs
