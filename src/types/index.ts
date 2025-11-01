export interface Product {
	_id: string;
	brand: "Azure" | "Monsini" | "Risky";
	year: number;
	versionName: string;
	style: string;
	division: string;
	availability: string;
	price: number;
	colors: string[];
	size: string;
	images: string[];
	createdAt: string;
	category?: string;
}

export interface Release {
	_id: string;
	brand: "Azure" | "Monsini" | "Risky";
	year: number;
	totalProduct: number;
	versionName: string;
	isPublished: boolean;
	category?: string;

	createdAt: string;
	updatedAt: string;
	productCount?: number;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface ValidationResult {
	totalProducts: number;
	validRows: number;
	totalRows: number;
	invalidRows: Array<{
		row: number;
		style: string;
		issues: string[];
	}>;
	missingImages: string[];
	orphanImages: string[];
	warnings: string[];
	errors: string[];
	versionExists: boolean;
	productPreview: Array<{
		style: string;
		division: string;
		price: number;
		colors: string[];
		size: string;
		hasImages: boolean;
		imageCount: number;
	}>;
}

export interface UploadFormData {
	brand: "Azure" | "Monsini" | "Risky";
	year: number;
	versionName: string;
	excelFile: File | null;
	images: File[];
}

export interface User {
	username: string;
	role: string;
}
