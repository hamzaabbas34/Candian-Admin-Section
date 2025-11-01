import React from "react";
import { ExtendedUploadFormData } from "@/types/upload";
import toast from "react-hot-toast";

interface ProductDetailsStepProps {
	formData: ExtendedUploadFormData;
	setFormData: React.Dispatch<React.SetStateAction<ExtendedUploadFormData>>;
	setStep: (step: number) => void;
}

const ProductDetailsStep: React.FC<ProductDetailsStepProps> = ({
	formData,
	setFormData,
	setStep,
}) => {
	const handleInputChange = (
		field: keyof ExtendedUploadFormData,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleNext = () => {
		// Validate required fields
		if (!formData.brand.trim()) {
			toast.error("Please select a brand");
			return;
		}

		if (!formData.year || formData.year < 2020 || formData.year > 2030) {
			toast.error("Please enter a valid year between 2020 and 2030");
			return;
		}

		if (!formData.category.trim()) {
			toast.error("Please select a product category");
			return;
		}

		setStep(3); // Move to Excel step
	};

	const handleBack = () => {
		setStep(1); // Back to first step
	};

	const brands = [
		"Azure",
		"Nike",
		"Adidas",
		"Puma",
		"Reebok",
		"Under Armour",
		"New Balance",
	];

	const categories = [
		"T-Shirts",
		"Shirts",
		"Pants",
		"Shorts",
		"Jackets",
		"Hoodies",
		"Shoes",
		"Accessories",
		"Equipment",
	];

	return (
		<div className="space-y-6">
			{/* Main Content Card */}
			<div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
				<div className="mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
					<p className="text-gray-600 mt-2">
						Select brand, year, and product category for your upload
					</p>
				</div>

				<div className="space-y-6">
					{/* Brand Selection */}
					<div className="space-y-3">
						<label
							htmlFor="brand"
							className="block text-sm font-medium text-gray-700">
							Brand *
						</label>
						<select
							id="brand"
							value={formData.brand}
							onChange={(e) => handleInputChange("brand", e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							<option value="">Select brand</option>
							{brands.map((brand) => (
								<option key={brand} value={brand}>
									{brand}
								</option>
							))}
						</select>
						<p className="text-xs text-gray-500">
							Select the brand for the products you're uploading
						</p>
					</div>

					{/* Year Selection */}
					<div className="space-y-3">
						<label
							htmlFor="year"
							className="block text-sm font-medium text-gray-700">
							Year *
						</label>
						<input
							type="number"
							id="year"
							value={formData.year}
							onChange={(e) =>
								handleInputChange("year", parseInt(e.target.value) || 2024)
							}
							min="2020"
							max="2030"
							placeholder="Enter year (2020-2030)"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<p className="text-xs text-gray-500">
							Enter the product year between 2020 and 2030
						</p>
					</div>

					{/* Category Selection */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700">
								Product Category *
							</label>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="customCategory"
									checked={formData.isCustomCategory}
									onChange={(e) =>
										handleInputChange("isCustomCategory", e.target.checked)
									}
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<label
									htmlFor="customCategory"
									className="text-sm font-normal text-gray-700 cursor-pointer">
									Custom category
								</label>
							</div>
						</div>

						{!formData.isCustomCategory ? (
							<select
								id="category"
								value={formData.category}
								onChange={(e) => handleInputChange("category", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Select category</option>
								{categories.map((category) => (
									<option key={category} value={category.toLowerCase()}>
										{category}
									</option>
								))}
							</select>
						) : (
							<input
								type="text"
								value={formData.category}
								onChange={(e) => handleInputChange("category", e.target.value)}
								placeholder="Enter custom category name"
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						)}
						<p className="text-xs text-gray-500">
							{formData.isCustomCategory
								? "Enter a custom category name for your products"
								: "Select the product category from the list"}
						</p>
					</div>

					{/* Summary Card */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h4 className="font-medium text-blue-900 mb-2">Upload Summary</h4>
						<div className="space-y-1 text-sm text-blue-800">
							<div className="flex justify-between">
								<span>Brand:</span>
								<span className="font-medium">{formData.brand}</span>
							</div>
							<div className="flex justify-between">
								<span>Year:</span>
								<span className="font-medium">{formData.year}</span>
							</div>
							<div className="flex justify-between">
								<span>Category:</span>
								<span className="font-medium capitalize">
									{formData.category}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="flex justify-between pt-4">
				<button
					onClick={handleBack}
					className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
					Back
				</button>
				<button
					onClick={handleNext}
					className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
					Next: Excel Data
				</button>
			</div>
		</div>
	);
};

export default ProductDetailsStep;
