

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ValidationGuide from "@/components/ValidationGuide";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { ValidationResult, UploadFormData } from "@/types";
import {
	FileSpreadsheet,
	Image,
	CheckCircle,
	AlertCircle,
	Calendar,
	Tag,
	UploadCloud,
	ChevronRight,
	ChevronLeft,
	Settings,
	Database,
	FileCheck,
	Sparkles,
} from "lucide-react";

// Season version options
const SEASON_VERSIONS = {
	SPRING: { label: "Spring", code: "SP" },
	SUMMER: { label: "Summer", code: "SU" },
	FALL: { label: "Fall", code: "FA" },
	WINTER: { label: "Winter", code: "WI" },
};

// Extended UploadFormData interface to include season AND category
interface ExtendedUploadFormData extends UploadFormData {
	season: string;
	category: string;
	isCustomCategory: boolean;
}

const Upload: React.FC = () => {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<ExtendedUploadFormData>({
		brand: "Azure",
		year: new Date().getFullYear(),
		season: "SPRING",
		versionName: "",
		excelFile: null,
		images: [],
		category: "",
		isCustomCategory: false,
	});
	const [validation, setValidation] = useState<ValidationResult | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [manualVersion, setManualVersion] = useState(false);

	// Generate version name based on selections
	const generatedVersionName = `${
		SEASON_VERSIONS[formData.season as keyof typeof SEASON_VERSIONS]?.code
	}${formData.year.toString().slice(-2)}`;

	const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const fileExtension = file.name.split(".").pop()?.toLowerCase();
			if (!["xlsx", "xls"].includes(fileExtension || "")) {
				toast.error("Please select a valid Excel file (.xlsx or .xls)");
				return;
			}

			setFormData({ ...formData, excelFile: file });
			toast.success("Excel file selected successfully");
		}
	};

	const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		const validFiles = files.filter((file) => {
			const isValidImage = file.type.startsWith("image/");
			if (!isValidImage) {
				toast.error(`Skipped invalid file: ${file.name}`);
				return false;
			}
			return true;
		});

		setFormData({ ...formData, images: validFiles });

		if (validFiles.length > 0) {
			toast.success(`${validFiles.length} images selected`);
		}
	};

	const validateFormData = (): boolean => {
		if (!formData.brand.trim()) {
			toast.error("Please select a brand");
			return false;
		}

		if (!formData.year || formData.year < 2020 || formData.year > 2030) {
			toast.error("Please enter a valid year between 2020 and 2030");
			return false;
		}

		if (!formData.season) {
			toast.error("Please select a season");
			return false;
		}

		if (!formData.category) {
			toast.error("Please select a product category");
			return false;
		}

		const finalVersionName = manualVersion
			? formData.versionName
			: generatedVersionName;
		if (!finalVersionName.trim()) {
			toast.error("Please enter a version name");
			return false;
		}

		if (!formData.excelFile) {
			toast.error("Please select an Excel file");
			return false;
		}

		if (formData.images.length === 0) {
			toast.error("Please select at least one product image");
			return false;
		}

		return true;
	};

	const validateData = async () => {
		if (!validateFormData()) {
			return;
		}

		setUploading(true);

		try {
			const finalVersionName = manualVersion
				? formData.versionName
				: generatedVersionName;

			const formDataToSend = new FormData();
			if (formData.excelFile) {
				formDataToSend.append("excel", formData.excelFile);
			}
			formData.images.forEach((image) => {
				formDataToSend.append("images", image);
			});
			formDataToSend.append("brand", formData.brand);
			formDataToSend.append("year", formData.year.toString());
			formDataToSend.append("season", formData.season);
			formDataToSend.append("versionName", finalVersionName);
			formDataToSend.append("category", formData.category);

			console.log("Sending validation request...");
			const response = await api.post("/upload/validate", formDataToSend, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			console.log("Validation response:", response.data);

			if (response.data.success) {
				setValidation(response.data.data);
				setStep(5);
				console.log("Validation completed, showing detailed results");
			} else {
				if (response.data.data) {
					setValidation(response.data.data);
					setStep(5);
				} else {
					toast.error("Validation failed: " + response.data.message);
				}
			}
		} catch (error: any) {
			console.error("Validation error sdf:", error);

			if (error.response?.data?.data) {
				setValidation(error.response.data.data);
				setStep(5);
			} else if (error.response?.data?.errors) {
				const errors = error.response.data.errors;
				showValidationErrorPopup(errors);
			} else {
				toast.error(
					"Validation failed. Please check your files and try again."
				);
			}
		} finally {
			setUploading(false);
		}
	};

	const showValidationErrorPopup = (errors: any) => {
		const errorList = Array.isArray(errors) ? errors : [String(errors)];

		const structureErrors = errorList.filter(
			(error) =>
				error.includes("Missing required column") ||
				error.includes("No color columns found")
		);

		const dataErrors = errorList.filter(
			(error) =>
				error.includes("Row") &&
				(error.includes("Missing") || error.includes("Invalid"))
		);

		const duplicateErrors = errorList.filter((error) =>
			error.includes("Duplicate Style")
		);

		const otherErrors = errorList.filter(
			(error) =>
				!structureErrors.includes(error) &&
				!dataErrors.includes(error) &&
				!duplicateErrors.includes(error)
		);

		Swal.fire({
			icon: "error",
			title: `
      <div style="text-align: center;">
        <div style="font-size: 48px; color: #ef4444; margin-bottom: 10px;">⚠️</div>
        <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 24px;">Excel Validation Failed</h2>
        <p style="color: #6b7280; font-size: 14px;">Please fix the following issues in your Excel file</p>
      </div>
    `,
			html: `
      <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
        ${
					structureErrors.length > 0
						? `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="width: 4px; height: 20px; background: #ef4444; border-radius: 2px; margin-right: 8px;"></div>
              <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">File Structure Issues</h3>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px;">
              ${structureErrors
								.map(
									(error) => `
                <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #ef4444;">
                  <span style="color: #ef4444; margin-right: 8px;">•</span>
                  <span style="color: #1f2937; font-size: 14px;">${error}</span>
                </div>
              `
								)
								.join("")}
            </div>
          </div>
        `
						: ""
				}
        
        ${
					dataErrors.length > 0
						? `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="width: 4px; height: 20px; background: #f59e0b; border-radius: 2px; margin-right: 8px;"></div>
              <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Data Issues</h3>
            </div>
            <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px;">
              ${dataErrors
								.map((error) => {
									const rowMatch = error.match(/Row (\d+)/);
									const styleMatch = error.match(/Style: ([^)]+)/);
									const issues = error.split(":").slice(1).join(":").trim();

									return `
                  <div style="margin-bottom: 8px; padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #f59e0b;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 4px;">
                      <span style="font-weight: 600; color: #1f2937; font-size: 14px;">
                        Row ${rowMatch ? rowMatch[1] : "N/A"} 
                        ${styleMatch ? `• Style: ${styleMatch[1]}` : ""}
                      </span>
                    </div>
                    <div style="color: #6b7280; font-size: 13px;">${issues}</div>
                  </div>
                `;
								})
								.join("")}
            </div>
          </div>
        `
						: ""
				}
        
        ${
					duplicateErrors.length > 0
						? `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="width: 4px; height: 20px; background: #8b5cf6; border-radius: 2px; margin-right: 8px;"></div>
              <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Duplicate Styles</h3>
            </div>
            <div style="background: #faf5ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 12px;">
              ${duplicateErrors
								.map(
									(error) => `
                <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #8b5cf6;">
                  <span style="color: #8b5cf6; margin-right: 8px;">•</span>
                  <span style="color: #1f2937; font-size: 14px;">${error}</span>
                </div>
              `
								)
								.join("")}
            </div>
          </div>
        `
						: ""
				}
        
        ${
					otherErrors.length > 0
						? `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="width: 4px; height: 20px; background: #6b7280; border-radius: 2px; margin-right: 8px;"></div>
              <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Other Issues</h3>
            </div>
            <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px;">
              ${otherErrors
								.map(
									(error) => `
                <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #6b7280;">
                  <span style="color: #6b7280; margin-right: 8px;">•</span>
                  <span style="color: #1f2937; font-size: 14px;">${error}</span>
                </div>
              `
								)
								.join("")}
            </div>
          </div>
        `
						: ""
				}
        
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #3b82f6; font-size: 16px; margin-right: 8px;">💡</span>
            <h4 style="color: #1e40af; font-size: 14px; font-weight: 600;">Quick Tips</h4>
          </div>
          <ul style="color: #374151; font-size: 13px; margin: 0; padding-left: 20px;">
            <li>Ensure all required columns are present</li>
            <li>Check for empty cells in Style, Price, and Size Range columns</li>
            <li>Remove duplicate style numbers</li>
            <li>Verify price format (numbers only, no currency symbols)</li>
          </ul>
        </div>
      </div>
    `,
			width: 600,
			padding: "20px",
			background: "#ffffff",
			customClass: {
				popup: "custom-swal-popup",
				title: "custom-swal-title",
				htmlContainer: "custom-swal-html",
			},
			showCloseButton: true,
			showCancelButton: false,
			confirmButtonText: "Understand, I'll Fix It",
			confirmButtonColor: "#ef4444",
			buttonsStyling: false,
		});
	};

	const handleUpload = async (overwrite = false) => {
		if (!validateFormData()) {
			return;
		}

		if (
			validation &&
			(validation.missingImages.length > 0 || validation.invalidRows.length > 0)
		) {
			const result = await Swal.fire({
				icon: "warning",
				title: "Validation Issues Found",
				html: `
          <div class="text-left">
            <p>There are validation issues that might cause problems:</p>
            <ul class="mt-2 space-y-1">
              ${
								validation.missingImages.length > 0
									? `<li>• ${validation.missingImages.length} missing images</li>`
									: ""
							}
              ${
								validation.invalidRows.length > 0
									? `<li>• ${validation.invalidRows.length} invalid rows in Excel</li>`
									: ""
							}
            </ul>
            <p class="mt-3 font-semibold">Do you want to continue with upload?</p>
          </div>
        `,
				showCancelButton: true,
				confirmButtonText: "Yes, Continue Anyway",
				cancelButtonText: "No, Fix Issues First",
				confirmButtonColor: "#d33",
			});

			if (!result.isConfirmed) {
				return;
			}
		}

		setUploading(true);
		setUploadProgress(0);

		try {
			const finalVersionName = manualVersion
				? formData.versionName
				: generatedVersionName;

			const formDataToSend = new FormData();
			if (formData.excelFile) {
				formDataToSend.append("excel", formData.excelFile);
			}
			formData.images.forEach((image) => {
				formDataToSend.append("images", image);
			});
			formDataToSend.append("brand", formData.brand);
			formDataToSend.append("year", formData.year.toString());
			formDataToSend.append("season", formData.season);
			formDataToSend.append("versionName", finalVersionName);
			formDataToSend.append("category", formData.category);
			formDataToSend.append("overwrite", overwrite.toString());

			console.log("Starting upload...");

			const response = await api.post("/upload/bulk", formDataToSend, {
				headers: { "Content-Type": "multipart/form-data" },
				onUploadProgress: (progressEvent) => {
					const progress = progressEvent.total
						? Math.round((progressEvent.loaded * 100) / progressEvent.total)
						: 0;
					setUploadProgress(progress);
				},
			});

			await Swal.fire({
				icon: "success",
				title: "Upload Successful!",
				text: `${response.data.data.productsUploaded} products uploaded successfully`,
				confirmButtonText: "OK",
			});

			// Reset form
			setFormData({
				brand: "Azure",
				year: new Date().getFullYear(),
				season: "SPRING",
				versionName: "",
				excelFile: null,
				images: [],
				category: "",
				isCustomCategory: false,
			});
			setManualVersion(false);
			setValidation(null);
			setStep(1);
			setUploadProgress(0);
		} catch (error: any) {
			if (error.response?.status === 409) {
				const result = await Swal.fire({
					icon: "warning",
					title: "Version Already Exists",
					html: `
						<div class="text-left">
							<p><strong>${formData.brand} ${formData.year} ${
						manualVersion ? formData.versionName : generatedVersionName
					}</strong> already exists.</p>
							<p class="mt-2">You cannot upload the same version again.</p>
							<p class="mt-3 font-semibold">Would you like to go back and create a different version?</p>
						</div>
					`,
					showCancelButton: true,
					confirmButtonText: "Yes, Go Back",
					cancelButtonText: "No, Stay Here",
					confirmButtonColor: "#3b82f6",
				});

				if (result.isConfirmed) {
					setStep(1);
				}
			} else {
				toast.error("Upload failed. Please try again.");
			}
		} finally {
			setUploading(false);
		}
	};

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return (
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
										<Settings className="w-4 h-4" />
										Brand Selection
									</label>
									<Select
										value={formData.brand}
										onChange={(e) =>
											setFormData({ ...formData, brand: e.target.value as any })
										}>
										<option value="Azure">Azure</option>
										<option value="Monsini">Monsini</option>
										<option value="Risky">Risky</option>
									</Select>
								</div>

								<div>
									<label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
										<Calendar className="w-4 h-4" />
										Collection Year
									</label>
									<Input
										type="number"
										value={formData.year}
										onChange={(e) =>
											setFormData({ ...formData, year: Number(e.target.value) })
										}
										min="2020"
										max="2030"
										className="w-full"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
										<Sparkles className="w-4 h-4" />
										Season
									</label>
									<Select
										value={formData.season}
										onChange={(e) =>
											setFormData({ ...formData, season: e.target.value })
										}>
										<option value="SPRING">Spring</option>
										<option value="SUMMER">Summer</option>
										<option value="FALL">Fall</option>
										<option value="WINTER">Winter</option>
									</Select>
								</div>

								<div>
									<label className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
										<Tag className="w-4 h-4" />
										Product Category
									</label>
									<Select
										value={formData.category || ""}
										onChange={(e) => {
											const value = e.target.value;
											if (value === "custom") {
												setFormData({
													...formData,
													category: "",
													isCustomCategory: true,
												});
											} else {
												setFormData({
													...formData,
													category: value,
													isCustomCategory: false,
												});
											}
										}}>
										<option value="">Select category</option>
										<option value={`Prom ${formData.year}`}>Prom</option>
										<option value={`Enchanted Evening ${formData.year}`}>
											Enchanted Evening
										</option>
										<option value={`Enchanted Bridal ${formData.year}`}>
											Enchanted Bridal
										</option>
										<option value="Gowns">Gowns</option>
										<option value="custom">+ Custom Category</option>
									</Select>

									{formData.isCustomCategory && (
										<div className="mt-2 space-y-2">
											<Input
												type="text"
												value={formData.category || ""}
												onChange={(e) =>
													setFormData({ ...formData, category: e.target.value })
												}
												placeholder="Enter custom category..."
												className="w-full"
											/>
											<p className="text-xs text-gray-500">
												Create a custom product category
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Simple separator using border instead of Separator component */}
						<div className="border-t border-gray-200 my-4"></div>

						<div>
							<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
								<Database className="w-4 h-4" />
								Version Configuration
							</label>
							<div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
								<div className="flex items-center space-x-3">
									<Input
										type="text"
										value={
											manualVersion
												? formData.versionName
												: generatedVersionName
										}
										onChange={(e) => {
											if (manualVersion) {
												setFormData({
													...formData,
													versionName: e.target.value,
												});
											}
										}}
										placeholder={generatedVersionName}
										className="flex-1"
									/>
									<Badge variant="secondary" className="whitespace-nowrap">
										Auto: {generatedVersionName}
									</Badge>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="manualVersion"
										checked={manualVersion}
										onChange={(e) => setManualVersion(e.target.checked)}
										className="rounded border-gray-300 text-primary focus:ring-primary"
									/>
									<label
										htmlFor="manualVersion"
										className="text-sm text-gray-600">
										Use custom version name
									</label>
								</div>
							</div>
						</div>

						<div className="flex justify-end pt-4">
							<Button
								onClick={() => setStep(2)}
								className="px-6"
								disabled={!formData.category}>
								Continue <ChevronRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
								<div>
									<h4 className="font-semibold text-blue-900">
										Excel File Requirements
									</h4>
									<p className="text-sm text-blue-700 mt-1">
										Ensure your Excel file includes required columns: Style,
										Price, Size Range, and color columns.
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
									<FileSpreadsheet className="w-4 h-4" />
									Upload Excel File
								</label>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors relative">
									<FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
									<Input
										type="file"
										accept=".xlsx,.xls"
										onChange={handleExcelChange}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
									/>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Drop your Excel file here or click to browse
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Supported formats: .xlsx, .xls
										</p>
									</div>
								</div>
							</div>

							{formData.excelFile && (
								<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<CheckCircle className="w-5 h-5 text-green-600" />
											<div>
												<p className="font-medium text-green-900">
													{formData.excelFile.name}
												</p>
												<p className="text-sm text-green-700">
													{(formData.excelFile.size / 1024 / 1024).toFixed(2)}{" "}
													MB
												</p>
											</div>
										</div>
										<Badge variant="outline" className="bg-white">
											Ready
										</Badge>
									</div>
								</div>
							)}
						</div>

						<div className="flex justify-between pt-4">
							<Button variant="outline" onClick={() => setStep(1)}>
								<ChevronLeft className="w-4 h-4 mr-2" />
								Back
							</Button>
							<Button
								onClick={() => setStep(3)}
								disabled={!formData.excelFile}
								className="px-6">
								Continue <ChevronRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<Image className="w-5 h-5 text-purple-600 mt-0.5" />
								<div>
									<h4 className="font-semibold text-purple-900">
										Image Requirements
									</h4>
									<p className="text-sm text-purple-700 mt-1">
										Upload all product images. File names should match the style
										numbers in your Excel file.
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
									<Image className="w-4 h-4" />
									Upload Product Images
								</label>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors relative">
									<Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
									<Input
										type="file"
										accept="image/*"
										multiple
										onChange={handleImagesChange}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
									/>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Drop your product images here or click to browse
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Supported formats: JPEG, PNG, WebP, etc.
										</p>
									</div>
								</div>
							</div>

							{formData.images.length > 0 && (
								<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<CheckCircle className="w-5 h-5 text-green-600" />
											<div>
												<p className="font-medium text-green-900">
													{formData.images.length} images selected
												</p>
											</div>
										</div>
										<Badge variant="outline" className="bg-white">
											Ready
										</Badge>
									</div>
									<div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
										{formData.images.slice(0, 8).map((image, index) => (
											<div key={index} className="relative group">
												<img
													src={URL.createObjectURL(image)}
													alt={image.name}
													className="w-full h-16 object-cover rounded border"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded" />
											</div>
										))}
										{formData.images.length > 8 && (
											<div className="flex items-center justify-center bg-gray-100 rounded border">
												<span className="text-xs text-gray-600">
													+{formData.images.length - 8} more
												</span>
											</div>
										)}
									</div>
								</div>
							)}
						</div>

						{/* File Summary */}
						<div className="grid grid-cols-2 gap-4 pt-4">
							<div className="p-3 bg-blue-50 rounded-lg border">
								<div className="flex items-center gap-2">
									<FileSpreadsheet className="w-4 h-4 text-blue-600" />
									<span className="text-sm font-medium text-blue-900">
										Excel File
									</span>
								</div>
								<p className="text-xs text-blue-700 truncate mt-1">
									{formData.excelFile?.name || "No file selected"}
								</p>
							</div>
							<div className="p-3 bg-purple-50 rounded-lg border">
								<div className="flex items-center gap-2">
									<Tag className="w-4 h-4 text-purple-600" />
									<span className="text-sm font-medium text-purple-900">
										Category
									</span>
								</div>
								<p className="text-xs text-purple-700 truncate mt-1">
									{formData.category || "Not set"}
								</p>
							</div>
						</div>

						<div className="flex justify-between pt-4">
							<Button variant="outline" onClick={() => setStep(2)}>
								<ChevronLeft className="w-4 h-4 mr-2" />
								Back
							</Button>
							<Button
								onClick={validateData}
								disabled={formData.images.length === 0 || uploading}
								className="px-6 bg-green-600 hover:bg-green-700">
								{uploading ? (
									<>
										<FileCheck className="w-4 h-4 mr-2" />
										Validating...
									</>
								) : (
									<>
										<FileCheck className="w-4 h-4 mr-2" />
										Validate & Preview
									</>
								)}
							</Button>
						</div>
					</div>
				);

			case 5:
				const hasErrors =
					(validation?.invalidRows?.length || 0) > 0 ||
					(validation?.missingImages?.length || 0) > 0;

				return (
					<div className="space-y-6">
						{/* Validation Header */}
						<div
							className={`p-6 rounded-lg text-center ${
								hasErrors
									? "bg-orange-50 border border-orange-200"
									: "bg-green-50 border border-green-200"
							}`}>
							<div
								className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
									hasErrors ? "bg-orange-100" : "bg-green-100"
								}`}>
								{hasErrors ? (
									<AlertCircle className="w-8 h-8 text-orange-600" />
								) : (
									<CheckCircle className="w-8 h-8 text-green-600" />
								)}
							</div>
							<h2
								className={`text-2xl font-bold mb-2 ${
									hasErrors ? "text-orange-900" : "text-green-900"
								}`}>
								{hasErrors
									? "Validation Complete with Issues"
									: "Validation Passed!"}
							</h2>
							<p
								className={`text-lg ${
									hasErrors ? "text-orange-700" : "text-green-700"
								}`}>
								{hasErrors
									? "Please review the issues below before proceeding"
									: "Your products are ready to upload"}
							</p>
						</div>

						{/* Summary Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
											Category
										</p>
										<p className="text-sm font-bold text-blue-900 truncate">
											{formData.category}
										</p>
									</div>
									<Tag className="w-8 h-8 text-blue-500 opacity-60" />
								</div>
							</div>

							<div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
											Total Rows
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{validation?.totalRows || 0}
										</p>
									</div>
									<Database className="w-8 h-8 text-gray-500 opacity-60" />
								</div>
							</div>

							<div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
											Valid Products
										</p>
										<p className="text-2xl font-bold text-green-900">
											{validation?.validRows || 0}
										</p>
									</div>
									<CheckCircle className="w-8 h-8 text-green-500 opacity-60" />
								</div>
							</div>

							<div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
											Version
										</p>
										<p className="text-sm font-bold text-purple-900">
											{manualVersion
												? formData.versionName
												: generatedVersionName}
										</p>
									</div>
									<Settings className="w-8 h-8 text-purple-500 opacity-60" />
								</div>
							</div>
						</div>

						{/* Validation Guide */}
						{validation && (
							<ValidationGuide
								invalidRows={validation.invalidRows || []}
								missingImages={validation.missingImages || []}
								orphanImages={validation.orphanImages || []}
							/>
						)}

						{/* Upload Progress */}
						{uploading && (
							<div className="p-4 bg-gray-50 rounded-lg border">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-gray-700">
										Uploading Products
									</span>
									<span className="text-sm text-gray-600">
										{uploadProgress}%
									</span>
								</div>
								<Progress value={uploadProgress} className="h-2" />
							</div>
						)}

						{/* Action Section */}
						<div className="space-y-4">
							{/* Status Alert */}
							<div
								className={`p-4 rounded-lg border ${
									hasErrors
										? "bg-orange-50 border-orange-200"
										: "bg-green-50 border-green-200"
								}`}>
								<div className="flex items-start gap-3">
									{hasErrors ? (
										<AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
									) : (
										<CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
									)}
									<div className="flex-1">
										<h4
											className={`font-semibold ${
												hasErrors ? "text-orange-900" : "text-green-900"
											}`}>
											{hasErrors
												? "Validation Issues Found"
												: "Ready to Upload"}
										</h4>
										<p
											className={`text-sm mt-1 ${
												hasErrors ? "text-orange-700" : "text-green-700"
											}`}>
											{hasErrors
												? `Found ${
														validation?.invalidRows?.length || 0
												  } Excel errors and ${
														validation?.missingImages?.length || 0
												  } missing images`
												: `All validations passed. Ready to upload ${
														validation?.validRows || 0
												  } products to ${formData.category}`}
										</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-2">
								<Button
									variant="outline"
									onClick={() => setStep(3)}
									disabled={uploading}
									className="flex-1">
									<ChevronLeft className="w-4 h-4 mr-2" />
									Back to Files
								</Button>
								<Button
									onClick={() => handleUpload(false)}
									disabled={uploading}
									className={`flex-1 py-3 text-base ${
										hasErrors
											? "bg-orange-600 hover:bg-orange-700"
											: "bg-green-600 hover:bg-green-700"
									}`}
									size="lg">
									{uploading ? (
										<>
											<span className="mr-2">Uploading...</span>
											<span className="animate-pulse">⏳</span>
										</>
									) : hasErrors ? (
										<>
											<span className="mr-2">Continue Anyway</span>
											<AlertCircle className="w-4 h-4" />
										</>
									) : (
										<>
											<span className="mr-2">
												Upload {validation?.validRows || 0} Products
											</span>
											<UploadCloud className="w-4 h-4" />
										</>
									)}
								</Button>
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	const steps = [
		{ number: 1, title: "Configuration", icon: Settings },
		{ number: 2, title: "Excel Data", icon: FileSpreadsheet },
		{ number: 3, title: "Images", icon: Image },
		{ number: 4, title: "Validation", icon: FileCheck },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border mb-4">
						<UploadCloud className="w-8 h-8 text-primary" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-3">
						Product Upload Manager
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Streamline your product catalog management with our professional
						upload system
					</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex justify-between items-start relative">
						{steps.map((stepItem, index) => {
							const Icon = stepItem.icon;
							const isActive = step >= stepItem.number;
							const isCompleted = step > stepItem.number;

							return (
								<div
									key={stepItem.number}
									className="flex flex-col items-center flex-1 relative z-10">
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
											isCompleted
												? "bg-green-500 border-green-500 text-white shadow-lg"
												: isActive
												? "bg-primary border-primary text-white shadow-lg"
												: "bg-white border-gray-300 text-gray-400"
										}`}>
										{isCompleted ? (
											<CheckCircle className="w-6 h-6" />
										) : (
											<Icon className="w-5 h-5" />
										)}
									</div>
									<div
										className={`text-xs font-medium mt-3 text-center transition-colors ${
											isActive || isCompleted
												? "text-gray-900"
												: "text-gray-500"
										}`}>
										{stepItem.title}
									</div>
									{index < steps.length - 1 && (
										<div
											className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 transition-colors ${
												step > stepItem.number ? "bg-green-500" : "bg-gray-200"
											}`}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Main Card */}
				<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
							{step === 5 ? (
								<>
									<FileCheck className="w-6 h-6 text-green-600" />
									Validation Results
								</>
							) : (
								<>
									{step === 1 && <Settings className="w-6 h-6 text-blue-600" />}
									{step === 2 && (
										<FileSpreadsheet className="w-6 h-6 text-blue-600" />
									)}
									{step === 3 && <Image className="w-6 h-6 text-blue-600" />}
									Step {step}: {steps.find((s) => s.number === step)?.title}
								</>
							)}
						</CardTitle>
						<CardDescription className="text-base">
							{step === 1 &&
								"Configure brand, season, and product category settings"}
							{step === 2 && "Upload and validate your product data Excel file"}
							{step === 3 && "Add product images and verify file matching"}
							{step === 5 &&
								"Review validation results and complete the upload process"}
						</CardDescription>
					</CardHeader>

					{/* Replace Separator with simple border */}
					<div className="border-t border-gray-200 mb-6"></div>

					<CardContent className="pt-0">{renderStepContent()}</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-sm text-gray-500">
						Need help? Contact support or refer to our documentation
					</p>
				</div>
			</div>
		</div>
	);
};

export default Upload;
