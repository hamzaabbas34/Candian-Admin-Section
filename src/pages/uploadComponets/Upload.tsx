// // import React, { useState } from "react";
// // import {
// // 	Card,
// // 	CardContent,
// // 	CardDescription,
// // 	CardHeader,
// // 	CardTitle,
// // } from "@/components/ui/card";
// // import {
// // 	UploadCloud,
// // 	FileCheck,
// // 	Settings,
// // 	FileSpreadsheet,
// // 	Image,
// // } from "lucide-react";
// // import toast from "react-hot-toast";
// // import Swal from "sweetalert2";
// // import api from "@/lib/api";
// // import { ValidationResult } from "@/types";
// // import { ExtendedUploadFormData, SEASON_VERSIONS } from "@/types/upload";

// // // Import step components
// // import ConfigurationStep from "./ConfigurationStep";
// // import ExcelStep from "./ExcelStep";
// // import ImagesStep from "./ImagesStep";
// // import ValidationStep from "./ValidationStep";
// // import ProgressSteps from "./ProgressSteps";

// // const Upload: React.FC = () => {
// // 	const [step, setStep] = useState(1);
// // 	const [formData, setFormData] = useState<ExtendedUploadFormData>({
// // 		brand: "Azure",
// // 		year: new Date().getFullYear(),
// // 		season: "SPRING",
// // 		versionName: "",
// // 		excelFile: null,
// // 		images: [],
// // 		category: "",
// // 		isCustomCategory: false,
// // 	});
// // 	const [validation, setValidation] = useState<ValidationResult | null>(null);
// // 	const [uploading, setUploading] = useState(false);
// // 	const [uploadProgress, setUploadProgress] = useState(0);
// // 	const [manualVersion, setManualVersion] = useState(false);

// // 	// Generate version name based on selections
// // 	const generatedVersionName = `${
// // 		SEASON_VERSIONS[formData.season as keyof typeof SEASON_VERSIONS]?.code
// // 	}${formData.year.toString().slice(-2)}`;

// // 	const validateFormData = (): boolean => {
// // 		if (!formData.brand.trim()) {
// // 			toast.error("Please select a brand");
// // 			return false;
// // 		}

// // 		if (!formData.year || formData.year < 2020 || formData.year > 2030) {
// // 			toast.error("Please enter a valid year between 2020 and 2030");
// // 			return false;
// // 		}

// // 		if (!formData.season) {
// // 			toast.error("Please select a season");
// // 			return false;
// // 		}

// // 		if (!formData.category) {
// // 			toast.error("Please select a product category");
// // 			return false;
// // 		}

// // 		const finalVersionName = manualVersion
// // 			? formData.versionName
// // 			: generatedVersionName;
// // 		if (!finalVersionName.trim()) {
// // 			toast.error("Please enter a version name");
// // 			return false;
// // 		}

// // 		if (!formData.excelFile) {
// // 			toast.error("Please select an Excel file");
// // 			return false;
// // 		}

// // 		if (formData.images.length === 0) {
// // 			toast.error("Please select at least one product image");
// // 			return false;
// // 		}

// // 		return true;
// // 	};

// // 	const validateData = async () => {
// // 		if (!validateFormData()) {
// // 			return;
// // 		}

// // 		setUploading(true);

// // 		try {
// // 			const finalVersionName = manualVersion
// // 				? formData.versionName
// // 				: generatedVersionName;

// // 			const formDataToSend = new FormData();
// // 			if (formData.excelFile) {
// // 				formDataToSend.append("excel", formData.excelFile);
// // 			}
// // 			formData.images.forEach((image) => {
// // 				formDataToSend.append("images", image);
// // 			});
// // 			formDataToSend.append("brand", formData.brand);
// // 			formDataToSend.append("year", formData.year.toString());
// // 			formDataToSend.append("season", formData.season);
// // 			formDataToSend.append("versionName", finalVersionName);
// // 			formDataToSend.append("category", formData.category);

// // 			console.log("Sending validation request...");
// // 			const response = await api.post("/upload/validate", formDataToSend, {
// // 				headers: { "Content-Type": "multipart/form-data" },
// // 			});

// // 			console.log("Validation response:", response.data);

// // 			if (response.data.success) {
// // 				setValidation(response.data.data);
// // 				setStep(5);
// // 				console.log("Validation completed, showing detailed results");
// // 			} else {
// // 				if (response.data.data) {
// // 					setValidation(response.data.data);
// // 					setStep(5);
// // 				} else {
// // 					toast.error("Validation failed: " + response.data.message);
// // 				}
// // 			}
// // 		} catch (error: any) {
// // 			console.error("Validation error sdf:", error);

// // 			if (error.response?.data?.data) {
// // 				setValidation(error.response.data.data);
// // 				setStep(5);
// // 			} else if (error.response?.data?.errors) {
// // 				const errors = error.response.data.errors;
// // 				showValidationErrorPopup(errors);
// // 			} else {
// // 				toast.error(
// // 					"Validation failed. Please check your files and try again."
// // 				);
// // 			}
// // 		} finally {
// // 			setUploading(false);
// // 		}
// // 	};

// // 	const showValidationErrorPopup = (errors: any) => {
// // 		const errorList = Array.isArray(errors) ? errors : [String(errors)];

// // 		const structureErrors = errorList.filter(
// // 			(error) =>
// // 				error.includes("Missing required column") ||
// // 				error.includes("No color columns found")
// // 		);

// // 		const dataErrors = errorList.filter(
// // 			(error) =>
// // 				error.includes("Row") &&
// // 				(error.includes("Missing") || error.includes("Invalid"))
// // 		);

// // 		const duplicateErrors = errorList.filter((error) =>
// // 			error.includes("Duplicate Style")
// // 		);

// // 		const otherErrors = errorList.filter(
// // 			(error) =>
// // 				!structureErrors.includes(error) &&
// // 				!dataErrors.includes(error) &&
// // 				!duplicateErrors.includes(error)
// // 		);

// // 		Swal.fire({
// // 			icon: "error",
// // 			title: `
// //       <div style="text-align: center;">
// //         <div style="font-size: 48px; color: #ef4444; margin-bottom: 10px;">⚠️</div>
// //         <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 24px;">Excel Validation Failed</h2>
// //         <p style="color: #6b7280; font-size: 14px;">Please fix the following issues in your Excel file</p>
// //       </div>
// //     `,
// // 			html: `
// //       <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
// //         ${
// // 					structureErrors.length > 0
// // 						? `
// //           <div style="margin-bottom: 20px;">
// //             <div style="display: flex; align-items: center; margin-bottom: 12px;">
// //               <div style="width: 4px; height: 20px; background: #ef4444; border-radius: 2px; margin-right: 8px;"></div>
// //               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">File Structure Issues</h3>
// //             </div>
// //             <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px;">
// //               ${structureErrors
// // 								.map(
// // 									(error) => `
// //                 <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #ef4444;">
// //                   <span style="color: #ef4444; margin-right: 8px;">•</span>
// //                   <span style="color: #1f2937; font-size: 14px;">${error}</span>
// //                 </div>
// //               `
// // 								)
// // 								.join("")}
// //             </div>
// //           </div>
// //         `
// // 						: ""
// // 				}
        
// //         ${
// // 					dataErrors.length > 0
// // 						? `
// //           <div style="margin-bottom: 20px;">
// //             <div style="display: flex; align-items: center; margin-bottom: 12px;">
// //               <div style="width: 4px; height: 20px; background: #f59e0b; border-radius: 2px; margin-right: 8px;"></div>
// //               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Data Issues</h3>
// //             </div>
// //             <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px;">
// //               ${dataErrors
// // 								.map((error) => {
// // 									const rowMatch = error.match(/Row (\d+)/);
// // 									const styleMatch = error.match(/Style: ([^)]+)/);
// // 									const issues = error.split(":").slice(1).join(":").trim();

// // 									return `
// //                   <div style="margin-bottom: 8px; padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #f59e0b;">
// //                     <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 4px;">
// //                       <span style="font-weight: 600; color: #1f2937; font-size: 14px;">
// //                         Row ${rowMatch ? rowMatch[1] : "N/A"} 
// //                         ${styleMatch ? `• Style: ${styleMatch[1]}` : ""}
// //                       </span>
// //                     </div>
// //                     <div style="color: #6b7280; font-size: 13px;">${issues}</div>
// //                   </div>
// //                 `;
// // 								})
// // 								.join("")}
// //             </div>
// //           </div>
// //         `
// // 						: ""
// // 				}
        
// //         ${
// // 					duplicateErrors.length > 0
// // 						? `
// //           <div style="margin-bottom: 20px;">
// //             <div style="display: flex; align-items: center; margin-bottom: 12px;">
// //               <div style="width: 4px; height: 20px; background: #8b5cf6; border-radius: 2px; margin-right: 8px;"></div>
// //               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Duplicate Styles</h3>
// //             </div>
// //             <div style="background: #faf5ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 12px;">
// //               ${duplicateErrors
// // 								.map(
// // 									(error) => `
// //                 <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #8b5cf6;">
// //                   <span style="color: #8b5cf6; margin-right: 8px;">•</span>
// //                   <span style="color: #1f2937; font-size: 14px;">${error}</span>
// //                 </div>
// //               `
// // 								)
// // 								.join("")}
// //             </div>
// //           </div>
// //         `
// // 						: ""
// // 				}
        
// //         ${
// // 					otherErrors.length > 0
// // 						? `
// //           <div style="margin-bottom: 20px;">
// //             <div style="display: flex; align-items: center; margin-bottom: 12px;">
// //               <div style="width: 4px; height: 20px; background: #6b7280; border-radius: 2px; margin-right: 8px;"></div>
// //               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Other Issues</h3>
// //             </div>
// //             <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px;">
// //               ${otherErrors
// // 								.map(
// // 									(error) => `
// //                 <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #6b7280;">
// //                   <span style="color: #6b7280; margin-right: 8px;">•</span>
// //                   <span style="color: #1f2937; font-size: 14px;">${error}</span>
// //                 </div>
// //               `
// // 								)
// // 								.join("")}
// //             </div>
// //           </div>
// //         `
// // 						: ""
// // 				}
        
// //         <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 20px;">
// //           <div style="display: flex; align-items: center; margin-bottom: 8px;">
// //             <span style="color: #3b82f6; font-size: 16px; margin-right: 8px;">💡</span>
// //             <h4 style="color: #1e40af; font-size: 14px; font-weight: 600;">Quick Tips</h4>
// //           </div>
// //           <ul style="color: #374151; font-size: 13px; margin: 0; padding-left: 20px;">
// //             <li>Ensure all required columns are present</li>
// //             <li>Check for empty cells in Style, Price, and Size Range columns</li>
// //             <li>Remove duplicate style numbers</li>
// //             <li>Verify price format (numbers only, no currency symbols)</li>
// //           </ul>
// //         </div>
// //       </div>
// //     `,
// // 			width: 600,
// // 			padding: "20px",
// // 			background: "#ffffff",
// // 			customClass: {
// // 				popup: "custom-swal-popup",
// // 				title: "custom-swal-title",
// // 				htmlContainer: "custom-swal-html",
// // 			},
// // 			showCloseButton: true,
// // 			showCancelButton: false,
// // 			confirmButtonText: "Understand, I'll Fix It",
// // 			confirmButtonColor: "#ef4444",
// // 			buttonsStyling: false,
// // 		});
// // 	};

// // 	const handleUpload = async (overwrite = false) => {
// // 		if (!validateFormData()) {
// // 			return;
// // 		}

// // 		if (
// // 			validation &&
// // 			(validation.missingImages.length > 0 || validation.invalidRows.length > 0)
// // 		) {
// // 			const result = await Swal.fire({
// // 				icon: "warning",
// // 				title: "Validation Issues Found",
// // 				html: `
// //           <div class="text-left">
// //             <p>There are validation issues that might cause problems:</p>
// //             <ul class="mt-2 space-y-1">
// //               ${
// // 								validation.missingImages.length > 0
// // 									? `<li>• ${validation.missingImages.length} missing images</li>`
// // 									: ""
// // 							}
// //               ${
// // 								validation.invalidRows.length > 0
// // 									? `<li>• ${validation.invalidRows.length} invalid rows in Excel</li>`
// // 									: ""
// // 							}
// //             </ul>
// //             <p class="mt-3 font-semibold">Do you want to continue with upload?</p>
// //           </div>
// //         `,
// // 				showCancelButton: true,
// // 				confirmButtonText: "Yes, Continue Anyway",
// // 				cancelButtonText: "No, Fix Issues First",
// // 				confirmButtonColor: "#d33",
// // 			});

// // 			if (!result.isConfirmed) {
// // 				return;
// // 			}
// // 		}

// // 		setUploading(true);
// // 		setUploadProgress(0);

// // 		try {
// // 			const finalVersionName = manualVersion
// // 				? formData.versionName
// // 				: generatedVersionName;

// // 			const formDataToSend = new FormData();
// // 			if (formData.excelFile) {
// // 				formDataToSend.append("excel", formData.excelFile);
// // 			}
// // 			formData.images.forEach((image) => {
// // 				formDataToSend.append("images", image);
// // 			});
// // 			formDataToSend.append("brand", formData.brand);
// // 			formDataToSend.append("year", formData.year.toString());
// // 			formDataToSend.append("season", formData.season);
// // 			formDataToSend.append("versionName", finalVersionName);
// // 			formDataToSend.append("category", formData.category);
// // 			formDataToSend.append("overwrite", overwrite.toString());

// // 			console.log("Starting upload...");

// // 			const response = await api.post("/upload/bulk", formDataToSend, {
// // 				headers: { "Content-Type": "multipart/form-data" },
// // 				onUploadProgress: (progressEvent) => {
// // 					const progress = progressEvent.total
// // 						? Math.round((progressEvent.loaded * 100) / progressEvent.total)
// // 						: 0;
// // 					setUploadProgress(progress);
// // 				},
// // 			});

// // 			await Swal.fire({
// // 				icon: "success",
// // 				title: "Upload Successful!",
// // 				text: `${response.data.data.productsUploaded} products uploaded successfully`,
// // 				confirmButtonText: "OK",
// // 			});

// // 			// Reset form
// // 			setFormData({
// // 				brand: "Azure",
// // 				year: new Date().getFullYear(),
// // 				season: "SPRING",
// // 				versionName: "",
// // 				excelFile: null,
// // 				images: [],
// // 				category: "",
// // 				isCustomCategory: false,
// // 			});
// // 			setManualVersion(false);
// // 			setValidation(null);
// // 			setStep(1);
// // 			setUploadProgress(0);
// // 		} catch (error: any) {
// // 			if (error.response?.status === 409) {
// // 				const result = await Swal.fire({
// // 					icon: "warning",
// // 					title: "Version Already Exists",
// // 					html: `
// //             <div class="text-left">
// //               <p><strong>${formData.brand} ${formData.year} ${
// // 						manualVersion ? formData.versionName : generatedVersionName
// // 					}</strong> already exists.</p>
// //               <p class="mt-2">You cannot upload the same version again.</p>
// //               <p class="mt-3 font-semibold">Would you like to go back and create a different version?</p>
// //             </div>
// //           `,
// // 					showCancelButton: true,
// // 					confirmButtonText: "Yes, Go Back",
// // 					cancelButtonText: "No, Stay Here",
// // 					confirmButtonColor: "#3b82f6",
// // 				});

// // 				if (result.isConfirmed) {
// // 					setStep(1);
// // 				}
// // 			} else {
// // 				toast.error("Upload failed. Please try again.");
// // 			}
// // 		} finally {
// // 			setUploading(false);
// // 		}
// // 	};

// // 	const renderStepContent = () => {
// // 		const commonProps = {
// // 			formData,
// // 			setFormData,
// // 			setStep,
// // 			validation,
// // 			uploading,
// // 			manualVersion,
// // 			setManualVersion,
// // 			generatedVersionName,
// // 		};

// // 		switch (step) {
// // 			case 1:
// // 				return <ConfigurationStep {...commonProps} />;
// // 			case 2:
// // 				return <ExcelStep {...commonProps} />;
// // 			case 3:
// // 				return (
// // 					<ImagesStep
// // 						{...commonProps}
// // 						validateData={validateData}
// // 						uploading={uploading}
// // 					/>
// // 				);
// // 			case 5:
// // 				return (
// // 					<ValidationStep
// // 						{...commonProps}
// // 						handleUpload={handleUpload}
// // 						uploadProgress={uploadProgress}
// // 					/>
// // 				);
// // 			default:
// // 				return null;
// // 		}
// // 	};

// // 	const getStepTitle = () => {
// // 		if (step === 5) {
// // 			return {
// // 				title: "Validation Results",
// // 				icon: FileCheck,
// // 				description:
// // 					"Review validation results and complete the upload process",
// // 			};
// // 		}

// // 		const steps = [
// // 			{
// // 				number: 1,
// // 				title: "Configuration",
// // 				icon: Settings,
// // 				description: "Configure brand, season, and product category settings",
// // 			},
// // 			{
// // 				number: 2,
// // 				title: "Excel Data",
// // 				icon: FileSpreadsheet,
// // 				description: "Upload and validate your product data Excel file",
// // 			},
// // 			{
// // 				number: 3,
// // 				title: "Images",
// // 				icon: Image,
// // 				description: "Add product images and verify file matching",
// // 			},
// // 		];

// // 		const currentStep = steps.find((s) => s.number === step);
// // 		return currentStep || steps[0];
// // 	};

// // 	const stepInfo = getStepTitle();
// // 	const StepIcon = stepInfo.icon;

// // 	return (
// // 		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
// // 			<div className="container mx-auto px-4 max-w-4xl">
// // 				{/* Header */}
// // 				<div className="text-center mb-12">
// // 					<div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border mb-4">
// // 						<UploadCloud className="w-8 h-8 text-primary" />
// // 					</div>
// // 					<h1 className="text-4xl font-bold text-gray-900 mb-3">
// // 						Product Upload Manager
// // 						<span className="text-blue-600">
// // 							{step !== 1
// // 								? formData.brand?.trim()
// // 									? ` - ${formData.brand} ${formData.category} `
// // 									: " - Select Brand"
// // 								: ""}
// // 						</span>
// // 					</h1>

// // 					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // 						Streamline your product catalog management with our professional
// // 						upload system
// // 					</p>
// // 				</div>

// // 				<ProgressSteps step={step} />

// // 				{/* Main Card */}
// // 				<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
// // 					<CardHeader className="pb-4">
// // 						<CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
// // 							<StepIcon className="w-6 h-6 text-blue-600" />
// // 							{step === 5 ? (
// // 								<>Validation Results</>
// // 							) : (
// // 								<>
// // 									Step {step}: {stepInfo.title}
// // 								</>
// // 							)}
// // 						</CardTitle>
// // 						<CardDescription className="text-base">
// // 							{stepInfo.description}
// // 						</CardDescription>
// // 					</CardHeader>

// // 					<div className="border-t border-gray-200 mb-6"></div>

// // 					<CardContent className="pt-0">{renderStepContent()}</CardContent>
// // 				</Card>

// // 				{/* Footer */}
// // 				<div className="text-center mt-8">
// // 					<p className="text-sm text-gray-500">
// // 						Need help? Contact support or refer to our documentation
// // 					</p>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // };

// // export default Upload;
// import React, { useState } from "react";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import {
// 	UploadCloud,
// 	FileCheck,
// 	Settings,
// 	FileSpreadsheet,
// 	Image,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";
// import api from "@/lib/api";
// import { ValidationResult } from "@/types";
// import { ExtendedUploadFormData, SEASON_VERSIONS } from "@/types/upload";

// // Import step components
// import ConfigurationStep from "./ConfigurationStep";
// import ExcelStep from "./ExcelStep";
// import ImagesStep from "./ImagesStep";
// import ValidationStep from "./ValidationStep";
// import ProgressSteps from "./ProgressSteps";

// const Upload: React.FC = () => {
// 	const [step, setStep] = useState(1);
// 	const [formData, setFormData] = useState<ExtendedUploadFormData>({
// 		brand: "Azure",
// 		year: new Date().getFullYear(),
// 		season: "SPRING",
// 		versionName: "",
// 		excelFile: null,
// 		images: [],
// 		category: "",
// 		isCustomCategory: false,
// 	});
// 	const [validation, setValidation] = useState<ValidationResult | null>(null);
// 	const [uploading, setUploading] = useState(false);
// 	const [uploadProgress, setUploadProgress] = useState(0);
// 	const [manualVersion, setManualVersion] = useState(false);
	
// 	// Add validating state here
// 	const [validating, setValidating] = useState(false);

// 	// Generate version name based on selections
// 	const generatedVersionName = `${
// 		SEASON_VERSIONS[formData.season as keyof typeof SEASON_VERSIONS]?.code
// 	}${formData.year.toString().slice(-2)}`;

// 	const validateFormData = (): boolean => {
// 		if (!formData.brand.trim()) {
// 			toast.error("Please select a brand");
// 			return false;
// 		}

// 		if (!formData.year || formData.year < 2020 || formData.year > 2030) {
// 			toast.error("Please enter a valid year between 2020 and 2030");
// 			return false;
// 		}

// 		if (!formData.season) {
// 			toast.error("Please select a season");
// 			return false;
// 		}

// 		if (!formData.category) {
// 			toast.error("Please select a product category");
// 			return false;
// 		}

// 		const finalVersionName = manualVersion
// 			? formData.versionName
// 			: generatedVersionName;
// 		if (!finalVersionName.trim()) {
// 			toast.error("Please enter a version name");
// 			return false;
// 		}

// 		if (!formData.excelFile) {
// 			toast.error("Please select an Excel file");
// 			return false;
// 		}

// 		if (formData.images.length === 0) {
// 			toast.error("Please select at least one product image");
// 			return false;
// 		}

// 		return true;
// 	};

// 	const validateData = async () => {
// 		if (!validateFormData()) {
// 			return;
// 		}

// 		// Set validating to true when starting validation
// 		setValidating(true);

// 		try {
// 			const finalVersionName = manualVersion
// 				? formData.versionName
// 				: generatedVersionName;

// 			const formDataToSend = new FormData();
// 			if (formData.excelFile) {
// 				formDataToSend.append("excel", formData.excelFile);
// 			}
// 			formData.images.forEach((image) => {
// 				formDataToSend.append("images", image);
// 			});
// 			formDataToSend.append("brand", formData.brand);
// 			formDataToSend.append("year", formData.year.toString());
// 			formDataToSend.append("season", formData.season);
// 			formDataToSend.append("versionName", finalVersionName);
// 			formDataToSend.append("category", formData.category);

// 			console.log("Sending validation request...");
// 			const response = await api.post("/upload/validate", formDataToSend, {
// 				headers: { "Content-Type": "multipart/form-data" },
// 			});

// 			console.log("Validation response:", response.data);

// 			if (response.data.success) {
// 				setValidation(response.data.data);
// 				setStep(5);
// 				console.log("Validation completed, showing detailed results");
// 			} else {
// 				if (response.data.data) {
// 					setValidation(response.data.data);
// 					setStep(5);
// 				} else {
// 					toast.error("Validation failed: " + response.data.message);
// 				}
// 			}
// 		} catch (error: any) {
// 			console.error("Validation error sdf:", error);

// 			if (error.response?.data?.data) {
// 				setValidation(error.response.data.data);
// 				setStep(5);
// 			} else if (error.response?.data?.errors) {
// 				const errors = error.response.data.errors;
// 				showValidationErrorPopup(errors);
// 			} else {
// 				toast.error(
// 					"Validation failed. Please check your files and try again."
// 				);
// 			}
// 		} finally {
// 			// Set validating to false when validation completes (success or error)
// 			setValidating(false);
// 			setUploading(false);
// 		}
// 	};

// 	const showValidationErrorPopup = (errors: any) => {
// 		const errorList = Array.isArray(errors) ? errors : [String(errors)];

// 		const structureErrors = errorList.filter(
// 			(error) =>
// 				error.includes("Missing required column") ||
// 				error.includes("No color columns found")
// 		);

// 		const dataErrors = errorList.filter(
// 			(error) =>
// 				error.includes("Row") &&
// 				(error.includes("Missing") || error.includes("Invalid"))
// 		);

// 		const duplicateErrors = errorList.filter((error) =>
// 			error.includes("Duplicate Style")
// 		);

// 		const otherErrors = errorList.filter(
// 			(error) =>
// 				!structureErrors.includes(error) &&
// 				!dataErrors.includes(error) &&
// 				!duplicateErrors.includes(error)
// 		);

// 		Swal.fire({
// 			icon: "error",
// 			title: `
//       <div style="text-align: center;">
//         <div style="font-size: 48px; color: #ef4444; margin-bottom: 10px;">⚠️</div>
//         <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 24px;">Excel Validation Failed</h2>
//         <p style="color: #6b7280; font-size: 14px;">Please fix the following issues in your Excel file</p>
//       </div>
//     `,
// 			html: `
//       <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
//         ${
// 					structureErrors.length > 0
// 						? `
//           <div style="margin-bottom: 20px;">
//             <div style="display: flex; align-items: center; margin-bottom: 12px;">
//               <div style="width: 4px; height: 20px; background: #ef4444; border-radius: 2px; margin-right: 8px;"></div>
//               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">File Structure Issues</h3>
//             </div>
//             <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px;">
//               ${structureErrors
// 								.map(
// 									(error) => `
//                 <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #ef4444;">
//                   <span style="color: #ef4444; margin-right: 8px;">•</span>
//                   <span style="color: #1f2937; font-size: 14px;">${error}</span>
//                 </div>
//               `
// 								)
// 								.join("")}
//             </div>
//           </div>
//         `
// 						: ""
// 				}
        
//         ${
// 					dataErrors.length > 0
// 						? `
//           <div style="margin-bottom: 20px;">
//             <div style="display: flex; align-items: center; margin-bottom: 12px;">
//               <div style="width: 4px; height: 20px; background: #f59e0b; border-radius: 2px; margin-right: 8px;"></div>
//               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Data Issues</h3>
//             </div>
//             <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px;">
//               ${dataErrors
// 								.map((error) => {
// 									const rowMatch = error.match(/Row (\d+)/);
// 									const styleMatch = error.match(/Style: ([^)]+)/);
// 									const issues = error.split(":").slice(1).join(":").trim();

// 									return `
//                   <div style="margin-bottom: 8px; padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #f59e0b;">
//                     <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 4px;">
//                       <span style="font-weight: 600; color: #1f2937; font-size: 14px;">
//                         Row ${rowMatch ? rowMatch[1] : "N/A"} 
//                         ${styleMatch ? `• Style: ${styleMatch[1]}` : ""}
//                       </span>
//                     </div>
//                     <div style="color: #6b7280; font-size: 13px;">${issues}</div>
//                   </div>
//                 `;
// 								})
// 								.join("")}
//             </div>
//           </div>
//         `
// 						: ""
// 				}
        
//         ${
// 					duplicateErrors.length > 0
// 						? `
//           <div style="margin-bottom: 20px;">
//             <div style="display: flex; align-items: center; margin-bottom: 12px;">
//               <div style="width: 4px; height: 20px; background: #8b5cf6; border-radius: 2px; margin-right: 8px;"></div>
//               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Duplicate Styles</h3>
//             </div>
//             <div style="background: #faf5ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 12px;">
//               ${duplicateErrors
// 								.map(
// 									(error) => `
//                 <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #8b5cf6;">
//                   <span style="color: #8b5cf6; margin-right: 8px;">•</span>
//                   <span style="color: #1f2937; font-size: 14px;">${error}</span>
//                 </div>
//               `
// 								)
// 								.join("")}
//             </div>
//           </div>
//         `
// 						: ""
// 				}
        
//         ${
// 					otherErrors.length > 0
// 						? `
//           <div style="margin-bottom: 20px;">
//             <div style="display: flex; align-items: center; margin-bottom: 12px;">
//               <div style="width: 4px; height: 20px; background: #6b7280; border-radius: 2px; margin-right: 8px;"></div>
//               <h3 style="color: #1f2937; font-size: 16px; font-weight: 600;">Other Issues</h3>
//             </div>
//             <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px;">
//               ${otherErrors
// 								.map(
// 									(error) => `
//                 <div style="display: flex; align-items: start; margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 3px solid #6b7280;">
//                   <span style="color: #6b7280; margin-right: 8px;">•</span>
//                   <span style="color: #1f2937; font-size: 14px;">${error}</span>
//                 </div>
//               `
// 								)
// 								.join("")}
//             </div>
//           </div>
//         `
// 						: ""
// 				}
        
//         <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 20px;">
//           <div style="display: flex; align-items: center; margin-bottom: 8px;">
//             <span style="color: #3b82f6; font-size: 16px; margin-right: 8px;">💡</span>
//             <h4 style="color: #1e40af; font-size: 14px; font-weight: 600;">Quick Tips</h4>
//           </div>
//           <ul style="color: #374151; font-size: 13px; margin: 0; padding-left: 20px;">
//             <li>Ensure all required columns are present</li>
//             <li>Check for empty cells in Style, Price, and Size Range columns</li>
//             <li>Remove duplicate style numbers</li>
//             <li>Verify price format (numbers only, no currency symbols)</li>
//           </ul>
//         </div>
//       </div>
//     `,
// 			width: 600,
// 			padding: "20px",
// 			background: "#ffffff",
// 			customClass: {
// 				popup: "custom-swal-popup",
// 				title: "custom-swal-title",
// 				htmlContainer: "custom-swal-html",
// 			},
// 			showCloseButton: true,
// 			showCancelButton: false,
// 			confirmButtonText: "Understand, I'll Fix It",
// 			confirmButtonColor: "#ef4444",
// 			buttonsStyling: false,
// 		});
// 	};

// 	const handleUpload = async (overwrite = false) => {
// 		if (!validateFormData()) {
// 			return;
// 		}

// 		if (
// 			validation &&
// 			(validation.missingImages.length > 0 || validation.invalidRows.length > 0)
// 		) {
// 			const result = await Swal.fire({
// 				icon: "warning",
// 				title: "Validation Issues Found",
// 				html: `
//           <div class="text-left">
//             <p>There are validation issues that might cause problems:</p>
//             <ul class="mt-2 space-y-1">
//               ${
// 								validation.missingImages.length > 0
// 									? `<li>• ${validation.missingImages.length} missing images</li>`
// 									: ""
// 							}
//               ${
// 								validation.invalidRows.length > 0
// 									? `<li>• ${validation.invalidRows.length} invalid rows in Excel</li>`
// 									: ""
// 							}
//             </ul>
//             <p class="mt-3 font-semibold">Do you want to continue with upload?</p>
//           </div>
//         `,
// 				showCancelButton: true,
// 				confirmButtonText: "Yes, Continue Anyway",
// 				cancelButtonText: "No, Fix Issues First",
// 				confirmButtonColor: "#d33",
// 			});

// 			if (!result.isConfirmed) {
// 				return;
// 			}
// 		}

// 		setUploading(true);
// 		setUploadProgress(0);

// 		try {
// 			const finalVersionName = manualVersion
// 				? formData.versionName
// 				: generatedVersionName;

// 			const formDataToSend = new FormData();
// 			if (formData.excelFile) {
// 				formDataToSend.append("excel", formData.excelFile);
// 			}
// 			formData.images.forEach((image) => {
// 				formDataToSend.append("images", image);
// 			});
// 			formDataToSend.append("brand", formData.brand);
// 			formDataToSend.append("year", formData.year.toString());
// 			formDataToSend.append("season", formData.season);
// 			formDataToSend.append("versionName", finalVersionName);
// 			formDataToSend.append("category", formData.category);
// 			formDataToSend.append("overwrite", overwrite.toString());

// 			console.log("Starting upload...");

// 			const response = await api.post("/upload/bulk", formDataToSend, {
// 				headers: { "Content-Type": "multipart/form-data" },
// 				onUploadProgress: (progressEvent) => {
// 					const progress = progressEvent.total
// 						? Math.round((progressEvent.loaded * 100) / progressEvent.total)
// 						: 0;
// 					setUploadProgress(progress);
// 				},
// 			});

// 			await Swal.fire({
// 				icon: "success",
// 				title: "Upload Successful!",
// 				text: `${response.data.data.productsUploaded} products uploaded successfully`,
// 				confirmButtonText: "OK",
// 			});

// 			// Reset form
// 			setFormData({
// 				brand: "Azure",
// 				year: new Date().getFullYear(),
// 				season: "SPRING",
// 				versionName: "",
// 				excelFile: null,
// 				images: [],
// 				category: "",
// 				isCustomCategory: false,
// 			});
// 			setManualVersion(false);
// 			setValidation(null);
// 			setStep(1);
// 			setUploadProgress(0);
// 		} catch (error: any) {
// 			if (error.response?.status === 409) {
// 				const result = await Swal.fire({
// 					icon: "warning",
// 					title: "Version Already Exists",
// 					html: `
//             <div class="text-left">
//               <p><strong>${formData.brand} ${formData.year} ${
// 						manualVersion ? formData.versionName : generatedVersionName
// 					}</strong> already exists.</p>
//               <p class="mt-2">You cannot upload the same version again.</p>
//               <p class="mt-3 font-semibold">Would you like to go back and create a different version?</p>
//             </div>
//           `,
// 					showCancelButton: true,
// 					confirmButtonText: "Yes, Go Back",
// 					cancelButtonText: "No, Stay Here",
// 					confirmButtonColor: "#3b82f6",
// 				});

// 				if (result.isConfirmed) {
// 					setStep(1);
// 				}
// 			} else {
// 				toast.error("Upload failed. Please try again.");
// 			}
// 		} finally {
// 			setUploading(false);
// 		}
// 	};

// 	const renderStepContent = () => {
// 		const commonProps = {
// 			formData,
// 			setFormData,
// 			setStep,
// 			validation,
// 			uploading,
// 			manualVersion,
// 			setManualVersion,
// 			generatedVersionName,
// 			// Add validating prop to common props
// 			validating,
// 		};

// 		switch (step) {
// 			case 1:
// 				return <ConfigurationStep {...commonProps} />;
// 			case 2:
// 				return <ExcelStep {...commonProps} />;
// 			case 3:
// 				return (
// 					<ImagesStep
// 						{...commonProps}
// 						validateData={validateData}
// 						uploading={uploading}
// 					/>
// 				);
// 			case 5:
// 				return (
// 					<ValidationStep
// 						{...commonProps}
// 						handleUpload={handleUpload}
// 						uploadProgress={uploadProgress}
// 						// Pass validating prop to ValidationStep
// 						validating={validating}
// 					/>
// 				);
// 			default:
// 				return null;
// 		}
// 	};

// 	const getStepTitle = () => {
// 		if (step === 5) {
// 			return {
// 				title: "Validation Results",
// 				icon: FileCheck,
// 				description:
// 					"Review validation results and complete the upload process",
// 			};
// 		}

// 		const steps = [
// 			{
// 				number: 1,
// 				title: "Configuration",
// 				icon: Settings,
// 				description: "Configure brand, season, and product category settings",
// 			},
// 			{
// 				number: 2,
// 				title: "Excel Data",
// 				icon: FileSpreadsheet,
// 				description: "Upload and validate your product data Excel file",
// 			},
// 			{
// 				number: 3,
// 				title: "Images",
// 				icon: Image,
// 				description: "Add product images and verify file matching",
// 			},
// 		];

// 		const currentStep = steps.find((s) => s.number === step);
// 		return currentStep || steps[0];
// 	};

// 	const stepInfo = getStepTitle();
// 	const StepIcon = stepInfo.icon;

// 	return (
// 		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
// 			<div className="container mx-auto px-4 max-w-4xl">
// 				{/* Header */}
// 				<div className="text-center mb-12">
// 					<div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border mb-4">
// 						<UploadCloud className="w-8 h-8 text-primary" />
// 					</div>
// 					<h1 className="text-4xl font-bold text-gray-900 mb-3">
// 						Product Upload Manager
// 						<span className="text-blue-600">
// 							{step !== 1
// 								? formData.brand?.trim()
// 									? ` - ${formData.brand} ${formData.category} `
// 									: " - Select Brand"
// 								: ""}
// 						</span>
// 					</h1>

// 					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
// 						Streamline your product catalog management with our professional
// 						upload system
// 					</p>
// 				</div>

// 				<ProgressSteps step={step} />

// 				{/* Main Card */}
// 				<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
// 					<CardHeader className="pb-4">
// 						<CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
// 							<StepIcon className="w-6 h-6 text-blue-600" />
// 							{step === 5 ? (
// 								<>Validation Results</>
// 							) : (
// 								<>
// 									Step {step}: {stepInfo.title}
// 								</>
// 							)}
// 						</CardTitle>
// 						<CardDescription className="text-base">
// 							{stepInfo.description}
// 						</CardDescription>
// 					</CardHeader>

// 					<div className="border-t border-gray-200 mb-6"></div>

// 					<CardContent className="pt-0">{renderStepContent()}</CardContent>
// 				</Card>

// 				{/* Footer */}
// 				<div className="text-center mt-8">
// 					<p className="text-sm text-gray-500">
// 						Need help? Contact support or refer to our documentation
// 					</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Upload;



import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	UploadCloud,
	FileCheck,
	Settings,
	FileSpreadsheet,
	Image,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { ValidationResult } from "@/types";
import { ExtendedUploadFormData, SEASON_VERSIONS } from "@/types/upload";

// Import step components
import ConfigurationStep from "./ConfigurationStep";
import ExcelStep from "./ExcelStep";
import ImagesStep from "./ImagesStep";
import ValidationStep from "./ValidationStep";
import ProgressSteps from "./ProgressSteps";

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
	// Add validating state
	const [validating, setValidating] = useState(false);

	// Generate version name based on selections
	const generatedVersionName = `${
		SEASON_VERSIONS[formData.season as keyof typeof SEASON_VERSIONS]?.code
	}${formData.year.toString().slice(-2)}`;

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

		// Set validating to true when starting validation
		setValidating(true);
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
			console.error("Validation error:", error);

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
			// Set validating to false when validation completes
			setValidating(false);
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
		const commonProps = {
			formData,
			setFormData,
			setStep,
			validation,
			uploading,
			manualVersion,
			setManualVersion,
			generatedVersionName,
			// Add validating prop
			validating,
		};

		switch (step) {
			case 1:
				return <ConfigurationStep {...commonProps} />;
			case 2:
				return <ExcelStep {...commonProps} />;
			case 3:
				return (
					<ImagesStep
						{...commonProps}
						validateData={validateData}
						uploading={uploading || validating} // Show loading when validating
					/>
				);
			case 5:
				return (
					<ValidationStep
						{...commonProps}
						handleUpload={handleUpload}
						uploadProgress={uploadProgress}
						validating={validating} // Pass validating prop
					/>
				);
			default:
				return null;
		}
	};

	const getStepTitle = () => {
		if (step === 5) {
			return {
				title: "Validation Results",
				icon: FileCheck,
				description:
					"Review validation results and complete the upload process",
			};
		}

		const steps = [
			{
				number: 1,
				title: "Configuration",
				icon: Settings,
				description: "Configure brand, season, and product category settings",
			},
			{
				number: 2,
				title: "Excel Data",
				icon: FileSpreadsheet,
				description: "Upload and validate your product data Excel file",
			},
			{
				number: 3,
				title: "Images",
				icon: Image,
				description: "Add product images and verify file matching",
			},
		];

		const currentStep = steps.find((s) => s.number === step);
		return currentStep || steps[0];
	};

	const stepInfo = getStepTitle();
	const StepIcon = stepInfo.icon;

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
						<span className="text-blue-600">
							{step !== 1
								? formData.brand?.trim()
									? ` - ${formData.brand} ${formData.category} `
									: " - Select Brand"
								: ""}
						</span>
					</h1>

					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Streamline your product catalog management with our professional
						upload system
					</p>
				</div>

				<ProgressSteps step={step} />

				{/* Main Card */}
				<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
							<StepIcon className="w-6 h-6 text-blue-600" />
							{step === 5 ? (
								<>Validation Results</>
							) : (
								<>
									Step {step}: {stepInfo.title}
								</>
							)}
						</CardTitle>
						<CardDescription className="text-base">
							{stepInfo.description}
						</CardDescription>
					</CardHeader>

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