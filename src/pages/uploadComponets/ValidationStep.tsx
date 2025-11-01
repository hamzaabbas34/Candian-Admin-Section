// import React from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
//  // Remove this line if Badge is not used
// import ValidationGuide from "@/components/ValidationGuide";
// import { UploadStepProps } from "../../types/upload"; // Remove the unused import warning
// import {
// 	CheckCircle,
// 	AlertCircle,
// 	Tag,
// 	Database,
// 	Settings,
// 	ChevronLeft,
// 	UploadCloud,
// } from "lucide-react";

// const ValidationStep: React.FC<UploadStepProps> = ({
// 	formData,
// 	setStep,
// 	validation,
// 	handleUpload,
// 	uploading,
// 	uploadProgress,
// 	manualVersion,
// 	generatedVersionName,
// }) => {
// 	const hasErrors =
// 		(validation?.invalidRows?.length || 0) > 0 ||
// 		(validation?.missingImages?.length || 0) > 0;

// 	return (
// 		<div className="space-y-6">
// 			{/* Validation Header */}
// 			<div
// 				className={`p-6 rounded-lg text-center ${
// 					hasErrors
// 						? "bg-orange-50 border border-orange-200"
// 						: "bg-green-50 border border-green-200"
// 				}`}>
// 				<div
// 					className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
// 						hasErrors ? "bg-orange-100" : "bg-green-100"
// 					}`}>
// 					{hasErrors ? (
// 						<AlertCircle className="w-8 h-8 text-orange-600" />
// 					) : (
// 						<CheckCircle className="w-8 h-8 text-green-600" />
// 					)}
// 				</div>
// 				<h2
// 					className={`text-2xl font-bold mb-2 ${
// 						hasErrors ? "text-orange-900" : "text-green-900"
// 					}`}>
// 					{hasErrors ? "Validation Complete with Issues" : "Validation Passed!"}
// 				</h2>
// 				<p
// 					className={`text-lg ${
// 						hasErrors ? "text-orange-700" : "text-green-700"
// 					}`}>
// 					{hasErrors
// 						? "Please review the issues below before proceeding"
// 						: "Your products are ready to upload"}
// 				</p>
// 			</div>

// 			{/* Summary Cards */}
// 			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// 				<div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
// 					<div className="flex items-center justify-between">
// 						<div>
// 							<p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
// 								Category
// 							</p>
// 							<p className="text-sm font-bold text-blue-900 truncate">
// 								{formData.category}
// 							</p>
// 						</div>
// 						<Tag className="w-8 h-8 text-blue-500 opacity-60" />
// 					</div>
// 				</div>

// 				<div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
// 					<div className="flex items-center justify-between">
// 						<div>
// 							<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
// 								Total Rows
// 							</p>
// 							<p className="text-2xl font-bold text-gray-900">
// 								{validation?.totalRows || 0}
// 							</p>
// 						</div>
// 						<Database className="w-8 h-8 text-gray-500 opacity-60" />
// 					</div>
// 				</div>

// 				<div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
// 					<div className="flex items-center justify-between">
// 						<div>
// 							<p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
// 								Valid Products
// 							</p>
// 							<p className="text-2xl font-bold text-green-900">
// 								{validation?.validRows || 0}
// 							</p>
// 						</div>
// 						<CheckCircle className="w-8 h-8 text-green-500 opacity-60" />
// 					</div>
// 				</div>

// 				<div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
// 					<div className="flex items-center justify-between">
// 						<div>
// 							<p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
// 								Version
// 							</p>
// 							<p className="text-sm font-bold text-purple-900">
// 								{manualVersion ? formData.versionName : generatedVersionName}
// 							</p>
// 						</div>
// 						<Settings className="w-8 h-8 text-purple-500 opacity-60" />
// 					</div>
// 				</div>
// 			</div>

// 			{/* Validation Guide */}
// 			{validation && (
// 				<ValidationGuide
// 					invalidRows={validation.invalidRows || []}
// 					missingImages={validation.missingImages || []}
// 					orphanImages={validation.orphanImages || []}
// 				/>
// 			)}

// 			{/* Upload Progress */}
// 			{uploading && (
// 				<div className="p-4 bg-gray-50 rounded-lg border">
// 					<div className="flex items-center justify-between mb-2">
// 						<span className="text-sm font-medium text-gray-700">
// 							Uploading Products
// 						</span>
// 						<span className="text-sm text-gray-600">{uploadProgress}%</span>
// 					</div>
// 					<Progress value={uploadProgress} className="h-2" />
// 				</div>
// 			)}

// 			{/* Action Section */}
// 			<div className="space-y-4">
// 				{/* Status Alert */}
// 				<div
// 					className={`p-4 rounded-lg border ${
// 						hasErrors
// 							? "bg-orange-50 border-orange-200"
// 							: "bg-green-50 border-green-200"
// 					}`}>
// 					<div className="flex items-start gap-3">
// 						{hasErrors ? (
// 							<AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
// 						) : (
// 							<CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
// 						)}
// 						<div className="flex-1">
// 							<h4
// 								className={`font-semibold ${
// 									hasErrors ? "text-orange-900" : "text-green-900"
// 								}`}>
// 								{hasErrors ? "Validation Issues Found" : "Ready to Upload"}
// 							</h4>
// 							<p
// 								className={`text-sm mt-1 ${
// 									hasErrors ? "text-orange-700" : "text-green-700"
// 								}`}>
// 								{hasErrors
// 									? `Found ${
// 											validation?.invalidRows?.length || 0
// 									  } Excel errors and ${
// 											validation?.missingImages?.length || 0
// 									  } missing images`
// 									: `All validations passed. Ready to upload ${
// 											validation?.validRows || 0
// 									  } products to ${formData.category}`}
// 							</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Action Buttons */}
// 				<div className="flex gap-3 pt-2">
// 					<Button
// 						variant="outline"
// 						onClick={() => setStep(3)}
// 						disabled={uploading}
// 						className="flex-1">
// 						<ChevronLeft className="w-4 h-4 mr-2" />
// 						Back to Files
// 					</Button>
// 					<Button
// 						onClick={() => handleUpload?.(false)}
// 						disabled={uploading}
// 						className={`flex-1 py-3 text-base ${
// 							hasErrors
// 								? "bg-orange-600 hover:bg-orange-700"
// 								: "bg-green-600 hover:bg-green-700"
// 						}`}
// 						size="lg">
// 						{uploading ? (
// 							<>
// 								<span className="mr-2">Uploading...</span>
// 								<span className="animate-pulse">⏳</span>
// 							</>
// 						) : hasErrors ? (
// 							<>
// 								<span className="mr-2">Continue Anyway</span>
// 								<AlertCircle className="w-4 h-4" />
// 							</>
// 						) : (
// 							<>
// 								<span className="mr-2">
// 									Upload {validation?.validRows || 0} Products
// 								</span>
// 								<UploadCloud className="w-4 h-4" />
// 							</>
// 						)}
// 					</Button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default ValidationStep;

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ValidationGuide from "@/components/ValidationGuide";
import { UploadStepProps } from "../../types/upload";
import {
	CheckCircle,
	AlertCircle,
	Tag,
	Database,
	Settings,
	ChevronLeft,
	UploadCloud,
	Loader2,
} from "lucide-react";

const ValidationStep: React.FC<UploadStepProps> = ({
	formData,
	setStep,
	validation,
	handleUpload,
	uploading,
	uploadProgress,
	manualVersion,
	generatedVersionName,
	validating, // Add this prop to track validation loading state
}) => {
	const hasErrors =
		(validation?.invalidRows?.length || 0) > 0 ||
		(validation?.missingImages?.length || 0) > 0;

	// Show loading state while validating
	if (validating) {
		return (
			<div className="space-y-6">
				{/* Validation Loading Header */}
				<div className="p-6 rounded-lg text-center bg-blue-50 border border-blue-200">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100">
						<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
					</div>
					<h2 className="text-2xl font-bold mb-2 text-blue-900">
						Validating Your Data
					</h2>
					<p className="text-lg text-blue-700">
						Please wait while we validate your products and images...
					</p>
				</div>

				{/* Loading Progress */}
				<div className="p-4 bg-gray-50 rounded-lg border">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">
							Validating Products
						</span>
						<span className="text-sm text-gray-600">Processing...</span>
					</div>
					<Progress value={0} className="h-2 bg-gray-200" />
					<div className="mt-2 text-xs text-gray-500 text-center">
						This may take a few moments depending on the file size
					</div>
				</div>

				{/* Loading Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-60">
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
									{validation?.totalRows || "..."}
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
									{validation?.validRows || "..."}
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
									{manualVersion ? formData.versionName : generatedVersionName}
								</p>
							</div>
							<Settings className="w-8 h-8 text-purple-500 opacity-60" />
						</div>
					</div>
				</div>

				{/* Disabled Action Buttons */}
				<div className="space-y-4">
					<div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
						<div className="flex items-start gap-3">
							<Loader2 className="w-5 h-5 text-gray-600 mt-0.5 animate-spin" />
							<div className="flex-1">
								<h4 className="font-semibold text-gray-900">
									Validation in Progress
								</h4>
								<p className="text-sm mt-1 text-gray-700">
									Please wait while we validate your data. This ensures all
									products meet the required standards.
								</p>
							</div>
						</div>
					</div>

					<div className="flex gap-3 pt-2">
						<Button variant="outline" disabled className="flex-1 opacity-50">
							<ChevronLeft className="w-4 h-4 mr-2" />
							Back to Files
						</Button>
						<Button
							disabled
							className="flex-1 py-3 text-base bg-gray-400 cursor-not-allowed"
							size="lg">
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							Validating...
						</Button>
					</div>
				</div>
			</div>
		);
	}

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
					{hasErrors ? "Validation Complete with Issues" : "Validation Passed!"}
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
								{manualVersion ? formData.versionName : generatedVersionName}
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
						<span className="text-sm text-gray-600">{uploadProgress}%</span>
					</div>
					<Progress value={uploadProgress} className="h-2" />
					<div className="mt-2 text-xs text-gray-500 text-center">
						Please don't close this page until upload is complete
					</div>
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
								{hasErrors ? "Validation Issues Found" : "Ready to Upload"}
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
						onClick={() => handleUpload?.(false)}
						disabled={uploading}
						className={`flex-1 py-3 text-base ${
							hasErrors
								? "bg-orange-600 hover:bg-orange-700"
								: "bg-green-600 hover:bg-green-700"
						}`}
						size="lg">
						{uploading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Uploading... {uploadProgress}%
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
};

export default ValidationStep;
