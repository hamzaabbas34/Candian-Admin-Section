import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Image,
	CheckCircle,
	ChevronLeft,
	FileSpreadsheet,
	Tag,
	FileCheck,
	Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { UploadStepProps } from "@/types/upload";

const ImagesStep: React.FC<UploadStepProps> = ({
	formData,
	setFormData,
	setStep,
	validateData,
	uploading,
}) => {
	const [showLoading, setShowLoading] = useState(false);

	// Keep loading visible for at least 2 seconds
	useEffect(() => {
		if (uploading) {
			setShowLoading(true);
		} else {
			const timer = setTimeout(() => setShowLoading(false), 10000);
			return () => clearTimeout(timer);
		}
	}, [uploading]);

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

	return (
		<div className="relative">
			{/* 🌀 Full Screen Loading Overlay */}
			{showLoading && (
				<div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50">
					<Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
					<p className="text-lg font-medium text-gray-800">
						Please wait — this may take a few moments...
					</p>
					<p className="text-sm text-gray-500 mt-2">
						We’re validating your images and preparing data.
					</p>
				</div>
			)}

			<div className="space-y-6">
				{/* Info Box */}
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

				{/* Image Upload Input */}
				<div className="space-y-4">
					<div>
						<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
							<Image className="w-4 h-4" />
							Upload Product Images
						</label>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center hover:border-primary transition-colors relative">
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

					{/* Preview selected images */}
					{formData.images.length > 0 && (
						<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-green-600" />
									<p className="font-medium text-green-900">
										{formData.images.length} images selected
									</p>
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

				{/* File Info */}
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

				{/* Buttons */}
				<div className="flex justify-between pt-4">
					<Button variant="outline" onClick={() => setStep(2)}>
						<ChevronLeft className="w-4 h-4 mr-2" />
						Back
					</Button>

					<Button
						onClick={validateData}
						disabled={formData.images.length === 0 || showLoading}
						className="px-6 bg-green-600 hover:bg-green-700">
						{showLoading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Validating (Please wait)...
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
		</div>
	);
};

export default ImagesStep;
