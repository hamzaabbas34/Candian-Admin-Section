# API Calls Verification

## ✅ All API Calls Using Configured

### Summary

All API calls in the application now use the configured axios instance (`@/lib/api`) which includes the baseURL from environment variables.

---

## API Calls by File

### 1. ✅ AuthContext.tsx

**Location:** `/frontend/src/context/AuthContext.tsx`

```typescript
import api from "@/lib/api";

// Login API call
const login = async (username: string, password: string) => {
	const response = await api.post("/auth/login", {
		username,
		password,
	});
	// ...
};
```

**Endpoint:** `POST /auth/login`  
**Full URL:** `${VITE_API_BASE_URL}/api/auth/login`

---

### 2. ✅ Upload.tsx

**Location:** `/frontend/src/pages/Upload.tsx`

```typescript
import api from "@/lib/api";

// Validation API call
const response = await api.post("/upload/validate", formDataToSend, {
	headers: { "Content-Type": "multipart/form-data" },
});

// Bulk upload API call
const response = await api.post("/upload/bulk", formDataToSend, {
	headers: { "Content-Type": "multipart/form-data" },
	onUploadProgress: (progressEvent) => {
		// Progress tracking
	},
});
```

**Endpoints:**

- `POST /upload/validate` → `${VITE_API_BASE_URL}/api/upload/validate`
- `POST /upload/bulk` → `${VITE_API_BASE_URL}/api/upload/bulk`

---

### 3. ✅ Dashboard.tsx

**Location:** `/frontend/src/pages/Dashboard.tsx`

```typescript
import api from "@/lib/api";

// Fetch releases/versions
const fetchReleases = async () => {
	const response = await api.get("/versions");
	setReleases(response.data.data);
};
```

**Endpoint:** `GET /versions` → `${VITE_API_BASE_URL}/api/versions`

---

### 4. ✅ Products.tsx

**Location:** `/frontend/src/pages/Products.tsx`

```typescript
import api from "@/lib/api";

// Fetch releases
const response = await api.get("/versions", {
	params: { brand: selectedBrand },
});

// Fetch products
const response = await api.get("/products", {
	params: {
		brand: selectedBrand,
		...filters,
	},
});

// Publish version
await api.post("/publish", {
	brand: release.brand,
	year: release.year,
	versionName: release.versionName,
});

// Delete version
await api.delete(
	`/versions/${release.brand}/${release.year}/${release.versionName}`
);

// Delete product
await api.delete(`/products/${productId}`);
```

**Endpoints:**

- `GET /versions?brand=...` → `${VITE_API_BASE_URL}/api/versions?brand=...`
- `GET /products?brand=...&year=...` → `${VITE_API_BASE_URL}/api/products?brand=...&year=...`
- `POST /publish` → `${VITE_API_BASE_URL}/api/publish`
- `DELETE /versions/:brand/:year/:versionName` → `${VITE_API_BASE_URL}/api/versions/:brand/:year/:versionName`
- `DELETE /products/:id` → `${VITE_API_BASE_URL}/api/products/:id`

---

## Configuration Source

### Axios Instance (`/frontend/src/lib/api.ts`)

```typescript
import axios from "axios";
import toast from "react-hot-toast";

// Get API base URL from environment variable or fallback to default
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
});

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const message =
			error.response?.data?.message || error.message || "An error occurred";
		toast.error(message);
		return Promise.reject(error);
	}
);

export default api;
```

### Environment Variable (`.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## URL Resolution Examples

### Development (Local)

**`.env`:**

```env
VITE_API_BASE_URL=http://localhost:5000
```

**API Calls:**

- Login: `http://localhost:5000/api/auth/login`
- Upload: `http://localhost:5000/api/upload/bulk`
- Products: `http://localhost:5000/api/products`

### Production

**`.env.production`:**

```env
VITE_API_BASE_URL=https://api.yourproductiondomain.com
```

**API Calls:**

- Login: `https://api.yourproductiondomain.com/api/auth/login`
- Upload: `https://api.yourproductiondomain.com/api/upload/bulk`
- Products: `https://api.yourproductiondomain.com/api/products`

### Docker

**`.env`:**

```env
VITE_API_BASE_URL=http://backend:5000
```

**API Calls:**

- Login: `http://backend:5000/api/auth/login`
- Upload: `http://backend:5000/api/upload/bulk`
- Products: `http://backend:5000/api/products`

---

## Complete API Endpoint List

All endpoints automatically use the configured baseURL:

| Method | Endpoint                            | Full URL Pattern                                              |
| ------ | ----------------------------------- | ------------------------------------------------------------- |
| POST   | /auth/login                         | `${VITE_API_BASE_URL}/api/auth/login`                         |
| POST   | /upload/validate                    | `${VITE_API_BASE_URL}/api/upload/validate`                    |
| POST   | /upload/bulk                        | `${VITE_API_BASE_URL}/api/upload/bulk`                        |
| GET    | /versions                           | `${VITE_API_BASE_URL}/api/versions`                           |
| GET    | /products                           | `${VITE_API_BASE_URL}/api/products`                           |
| DELETE | /products/:id                       | `${VITE_API_BASE_URL}/api/products/:id`                       |
| POST   | /publish                            | `${VITE_API_BASE_URL}/api/publish`                            |
| DELETE | /versions/:brand/:year/:versionName | `${VITE_API_BASE_URL}/api/versions/:brand/:year/:versionName` |

---

## Benefits of This Setup

1. ✅ **Single Configuration Point** - Change backend URL in one place (`.env`)
2. ✅ **Environment Flexibility** - Different URLs for dev, staging, production
3. ✅ **No Hardcoded URLs** - All API calls use configured instance
4. ✅ **Global Error Handling** - Axios interceptor handles all errors
5. ✅ **Type Safety** - TypeScript support throughout
6. ✅ **Easy Testing** - Mock the axios instance for tests

---

## Testing API Configuration

### 1. Check Current Configuration

```typescript
import { API_BASE_URL } from "@/config/api.config";
console.log("API Base URL:", API_BASE_URL);
// Output: http://localhost:5000 (or your configured URL)
```

### 2. Test API Call

```typescript
import api from "@/lib/api";

// This will call: ${VITE_API_BASE_URL}/api/products
const response = await api.get("/products");
console.log(response.data);
```

### 3. Change Backend URL

Simply update `.env`:

```env
VITE_API_BASE_URL=http://different-backend:8080
```

Restart dev server - all API calls now go to new URL!

---

## Migration Checklist

- [x] Created centralized API configuration (`src/config/api.config.ts`)
- [x] Updated axios instance with environment-based baseURL (`src/lib/api.ts`)
- [x] Migrated AuthContext.tsx from fetch to axios ✅
- [x] Verified Upload.tsx uses axios ✅
- [x] Verified Dashboard.tsx uses axios ✅
- [x] Verified Products.tsx uses axios ✅
- [x] Created environment variable template (`.env.example`)
- [x] Updated documentation (README, SETUP.md)
- [x] Created API usage examples

---

## Status: ✅ COMPLETE

All API calls in the application now properly use the configured baseURL from environment variables. No hardcoded URLs remain in the codebase.
