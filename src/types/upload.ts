export interface ValidationResult {
	totalRows: number;
	validRows: number;
	invalidRows: any[];
	missingImages: string[];
	orphanImages: string[];
}

export interface UploadFormData {
	brand: string;
	year: number;
	season: string;
	versionName: string;
	excelFile: File | null;
	images: File[];
}

export interface ExtendedUploadFormData extends UploadFormData {
	category: string;
	isCustomCategory: boolean;
}

export interface UploadStepProps {
	formData: ExtendedUploadFormData;
	setFormData: (data: ExtendedUploadFormData) => void;
	setStep: (step: number) => void;
	validating?: boolean;
	validation?: ValidationResult | null;
	uploading?: boolean;
	manualVersion: boolean;
	setManualVersion: (manual: boolean) => void;
	generatedVersionName: string;
	validateData?: () => void;
	handleUpload?: (overwrite: boolean) => void;
	uploadProgress?: number;
}

export const SEASON_VERSIONS = {
	SPRING: { label: "Spring", code: "SP" },
	SUMMER: { label: "Summer", code: "SU" },
	FALL: { label: "Fall", code: "FA" },
	WINTER: { label: "Winter", code: "WI" },
};
