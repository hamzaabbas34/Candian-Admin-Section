/**
 * API Configuration
 *
 * Centralized configuration for API endpoints and base URLs
 */

// Backend API base URL from environment variable
// export const API_BASE_URL = "http://localhost:3200";
export const API_BASE_URL = 'http://srv1051513.hstgr.cloud:3200';

// API endpoints
export const API_ENDPOINTS = {
	// Auth
	LOGIN: "/api/auth/login",

	// Upload
	UPLOAD_VALIDATE: "/api/upload/validate",
	UPLOAD_BULK: "/api/upload/bulk",

	// Products
	PRODUCTS: "/api/products",
	PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,

	// Versions
	VERSIONS: "/api/versions",
	DELETE_VERSION: (brand: string, year: number, versionName: string) =>
		`/api/versions/${brand}/${year}/${versionName}`,
	DELETE_YEAR: (brand: string, year: number) =>
		`/api/versions/year/${brand}/${year}`,

	// Publish
	PUBLISH: "/api/publish",
	GET_PUBLISHED: (brand: string) => `/api/publish/${brand}`,
};

// Upload/Images base URL
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;

// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
	if (imagePath.startsWith("http")) {
		return imagePath;
	}
	return `${API_BASE_URL}/${imagePath}`;
};


