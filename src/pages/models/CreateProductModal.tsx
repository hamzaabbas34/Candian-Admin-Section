import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { X, Upload } from "lucide-react";
import api from "../../lib/api";
import toast from "react-hot-toast";

// Define types for CreateProductModal props
export interface CreateProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	brand: string;
	availableYears: number[];
	availableCategories: string[];
	availableVersions: string[];
}

// API function for creating product
const createProduct = async (
	productData: {
		brand: string;
		year: number;
		versionName: string;
		category: string;
		style: string;
		price: number;
		size: string;
		colors: string[] | string;
		availability?: string;
		description?: string;
	},
	images?: File[]
): Promise<any> => {
	const formData = new FormData();

	// Append product data
	Object.keys(productData).forEach((key) => {
		const value = productData[key as keyof typeof productData];
		if (Array.isArray(value)) {
			formData.append(key, JSON.stringify(value));
		} else {
			formData.append(key, value?.toString() || "");
		}
	});

	// Append images if provided
	if (images && images.length > 0) {
		images.forEach((image) => {
			formData.append("images", image);
		});
	}

	try {
		const response = await api.post("/products", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
	brand,
	availableYears,
	availableCategories,
	availableVersions,
}) => {
	const [formData, setFormData] = useState({
		year: "",
		versionName: "",
		category: "",
		style: "",
		price: "",
		size: "",
		colors: "",
		availability: "In Stock",
		description: "",
	});
	const [images, setImages] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setFormData({
				year: "",
				versionName: "",
				category: "",
				style: "",
				price: "",
				size: "",
				colors: "",
				availability: "In Stock",
				description: "",
			});
			setImages([]);
		}
	}, [isOpen]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setImages(files);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate required fields
		if (
			!formData.year ||
			!formData.versionName ||
			!formData.category ||
			!formData.style ||
			!formData.price ||
			!formData.size ||
			!formData.colors
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		setLoading(true);

		try {
			const productData = {
				brand,
				year: parseInt(formData.year),
				versionName: formData.versionName,
				category: formData.category,
				style: formData.style,
				price: parseFloat(formData.price),
				size: formData.size,
				colors: formData.colors
					.split(",")
					.map((color) => color.trim())
					.filter((color) => color),
				availability: formData.availability,
				description: formData.description,
			};

			await createProduct(productData, images);

			toast.success("Product created successfully!");
			onSuccess();
			onClose();
		} catch (error: any) {
			console.error("Failed to create product:", error);
			toast.error(error.response?.data?.message || "Failed to create product");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">Create New Product</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium mb-2 block">Year *</label>
							<Select
								value={formData.year}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
									handleInputChange("year", e.target.value)
								}>
								<option value="">Select Year</option>
								{availableYears.map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								Version *
							</label>
							<Select
								value={formData.versionName}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									handleInputChange("versionName", e.target.value)
								}>
								<option value="">Select Version</option>
								{availableVersions.map((version) => (
									<option key={version} value={version}>
										{version}
									</option>
								))}
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								Category *
							</label>
							<Select
								value={formData.category}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
									handleInputChange("category", e.target.value)
								}>
								<option value="">Select Category</option>
								{availableCategories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Style *</label>
							<Input
								value={formData.style}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
									handleInputChange("style", e.target.value)
								}
								placeholder="Enter product style"
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								Price ($) *
							</label>
							<Input
								type="number"
								step="0.01"
								value={formData.price}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
									handleInputChange("price", e.target.value)
								}
								placeholder="Enter price"
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">
								Size Range *
							</label>
							<Input
								value={formData.size}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
									handleInputChange("size", e.target.value)
								}
								placeholder="e.g., 0-16, S-XL"
							/>
						</div>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">
							Colors (comma separated) *
						</label>
						<Input
							value={formData.colors}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
								handleInputChange("colors", e.target.value)
							}
							placeholder="e.g., RED, BLUE, GREEN"
						/>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">
							Description
						</label>
						<Input
							value={formData.description}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
								handleInputChange("description", e.target.value)
							}
							placeholder="Enter product description"
						/>
					</div>

					{/* Image Upload */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Product Images
						</label>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
							<Input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
								id="create-product-images"
							/>
							<label
								htmlFor="create-product-images"
								className="cursor-pointer flex flex-col items-center gap-2">
								<Upload className="w-8 h-8 text-gray-400" />
								<span className="text-sm text-gray-600">
									Click to upload images
								</span>
								<span className="text-xs text-gray-500">
									PNG, JPG, JPEG up to 10MB
								</span>
							</label>
						</div>
						{images.length > 0 && (
							<div className="mt-2">
								<p className="text-sm text-gray-600 mb-2">
									{images.length} image(s) selected
								</p>
								<div className="flex flex-wrap gap-2">
									{images.map((image, index) => (
										<div
											key={index}
											className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
											{image.name}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1">
							Cancel
						</Button>
						<Button type="submit" disabled={loading} className="flex-1">
							{loading ? "Creating..." : "Create Product"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};