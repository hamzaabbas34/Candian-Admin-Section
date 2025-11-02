// import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Product } from "@/types";
// import { Trash2, X, Upload } from "lucide-react";
// import api from "@/lib/api";
// import toast from "react-hot-toast";

// // Define form data type
// export interface ProductFormData {
// 	price: string;
// 	size: string;
// 	colors: string;
// }

// // Define types for EditProductModal props
// export interface EditProductModalProps {
// 	product: Product | null;
// 	isOpen: boolean;
// 	onClose: () => void;
// 	onUpdate: () => void;
// }

// export const EditProductModal: React.FC<EditProductModalProps> = ({
// 	product,
// 	isOpen,
// 	onClose,
// 	onUpdate,
// }) => {
// 	const [formData, setFormData] = useState<ProductFormData>({
// 		price: "",
// 		size: "",
// 		colors: "",
// 	});
// 	const [images, setImages] = useState<File[]>([]);
// 	const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
// 	const [loading, setLoading] = useState(false);

// 	useEffect(() => {
// 		if (product && isOpen) {
// 			setFormData({
// 				price: product.price?.toString() || "",
// 				size: product.size || "",
// 				colors: product.colors?.join(", ") || "",
// 			});
// 			setImages([]);
// 			setImagesToDelete([]);
// 		}
// 	}, [product, isOpen]);

// 	const handleInputChange = (field: keyof ProductFormData, value: string) => {
// 		setFormData((prev) => ({
// 			...prev,
// 			[field]: value,
// 		}));
// 	};

// 	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
// 		if (e.target.files) {
// 			const files = Array.from(e.target.files);
// 			setImages(files);
// 		}
// 	};

// 	const handleDeleteImage = (imagePath: string) => {
// 		setImagesToDelete((prev) => [...prev, imagePath]);
// 	};

// 	const handleRestoreImage = (imagePath: string) => {
// 		setImagesToDelete((prev) => prev.filter((img) => img !== imagePath));
// 	};

// 	const handleSubmit = async (e: FormEvent) => {
// 		e.preventDefault();
// 		if (!product) return;

// 		setLoading(true);

// 		try {
// 			const submitData = new FormData();

// 			// Add form fields
// 			if (formData.price) submitData.append("price", formData.price);
// 			if (formData.size) submitData.append("size", formData.size);
// 			if (formData.colors) {
// 				const colorsArray = formData.colors
// 					.split(",")
// 					.map((color) => color.trim())
// 					.filter((color) => color);
// 				submitData.append("colors", JSON.stringify(colorsArray));
// 			}

// 			// Add images to delete
// 			if (imagesToDelete.length > 0) {
// 				submitData.append("imagesToDelete", JSON.stringify(imagesToDelete));
// 			}

// 			// Add new images
// 			images.forEach((image) => {
// 				submitData.append("images", image);
// 			});

// 			await api.patch(`/products/${product._id}`, submitData, {
// 				headers: {
// 					"Content-Type": "multipart/form-data",
// 				},
// 			});

// 			toast.success("Product updated successfully!");
// 			onUpdate();
// 			onClose();
// 		} catch (error) {
// 			console.error("Failed to update product:", error);
// 			toast.error("Failed to update product");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	if (!isOpen || !product) return null;

// 	return (
// 		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// 			<div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// 				<div className="flex items-center justify-between p-4 border-b">
// 					<h2 className="text-xl font-semibold">Edit Product</h2>
// 					<Button variant="ghost" size="sm" onClick={onClose}>
// 						<X className="w-4 h-4" />
// 					</Button>
// 				</div>

// 				<form onSubmit={handleSubmit} className="p-4 space-y-4">
// 					<div>
// 						<label className="text-sm font-medium mb-2 block">Style</label>
// 						<Input value={product.style} disabled className="bg-gray-50" />
// 					</div>

// 					<div>
// 						<label className="text-sm font-medium mb-2 block">Price ($)</label>
// 						<Input
// 							type="number"
// 							step="0.01"
// 							value={formData.price}
// 							onChange={(e) => handleInputChange("price", e.target.value)}
// 							placeholder="Enter price"
// 						/>
// 					</div>

// 					<div>
// 						<label className="text-sm font-medium mb-2 block">Size Range</label>
// 						<Input
// 							value={formData.size}
// 							onChange={(e) => handleInputChange("size", e.target.value)}
// 							placeholder="e.g., 0-16, S-XL"
// 						/>
// 					</div>

// 					<div>
// 						<label className="text-sm font-medium mb-2 block">
// 							Colors (comma separated)
// 						</label>
// 						<Input
// 							value={formData.colors}
// 							onChange={(e) => handleInputChange("colors", e.target.value)}
// 							placeholder="e.g., RED, BLUE, GREEN"
// 						/>
// 					</div>

// 					{/* Current Images with Delete Option */}
// 					{product.images && product.images.length > 0 && (
// 						<div>
// 							<label className="text-sm font-medium mb-2 block">
// 								Current Images ({product.images.length - imagesToDelete.length}{" "}
// 								remaining)
// 							</label>
// 							<div className="grid grid-cols-4 gap-3">
// 								{product.images.map((img: string, index: number) => {
// 									const isMarkedForDelete = imagesToDelete.includes(img);
// 									return (
// 										<div key={index} className="relative group">
// 											<img
// 												src={`http://srv1051513.hstgr.cloud:3200/${img}`}
// 												alt=""
// 												className={`w-full h-24 object-cover rounded border-2 ${
// 													isMarkedForDelete
// 														? "border-red-500 opacity-50"
// 														: "border-gray-300"
// 												}`}
// 											/>
// 											<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
// 												{isMarkedForDelete ? (
// 													<Button
// 														type="button"
// 														size="sm"
// 														variant="secondary"
// 														onClick={() => handleRestoreImage(img)}
// 														className="bg-green-500 hover:bg-green-600 text-white">
// 														Restore
// 													</Button>
// 												) : (
// 													<Button
// 														type="button"
// 														size="sm"
// 														variant="destructive"
// 														onClick={() => handleDeleteImage(img)}>
// 														<Trash2 className="w-4 h-4" />
// 													</Button>
// 												)}
// 											</div>
// 											{isMarkedForDelete && (
// 												<div className="absolute top-1 right-1">
// 													<Badge variant="destructive" className="text-xs">
// 														Will Delete
// 													</Badge>
// 												</div>
// 											)}
// 										</div>
// 									);
// 								})}
// 							</div>
// 							{imagesToDelete.length > 0 && (
// 								<p className="text-sm text-red-600 mt-2">
// 									{imagesToDelete.length} image(s) marked for deletion
// 								</p>
// 							)}
// 						</div>
// 					)}

// 					{/* Add New Images */}
// 					<div>
// 						<label className="text-sm font-medium mb-2 block">
// 							Add More Images
// 						</label>
// 						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
// 							<Input
// 								type="file"
// 								multiple
// 								accept="image/*"
// 								onChange={handleImageChange}
// 								className="hidden"
// 								id="product-images"
// 							/>
// 							<label
// 								htmlFor="product-images"
// 								className="cursor-pointer flex flex-col items-center gap-2">
// 								<Upload className="w-8 h-8 text-gray-400" />
// 								<span className="text-sm text-gray-600">
// 									Click to upload images
// 								</span>
// 								<span className="text-xs text-gray-500">
// 									PNG, JPG, JPEG up to 10MB
// 								</span>
// 							</label>
// 						</div>
// 						{images.length > 0 && (
// 							<div className="mt-2">
// 								<p className="text-sm text-gray-600 mb-2">
// 									{images.length} new image(s) selected
// 								</p>
// 								<div className="flex flex-wrap gap-2">
// 									{images.map((image, index) => (
// 										<div
// 											key={index}
// 											className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
// 											{image.name}
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 						)}
// 					</div>

// 					<div className="flex gap-2 pt-4">
// 						<Button
// 							type="button"
// 							variant="outline"
// 							onClick={onClose}
// 							className="flex-1">
// 							Cancel
// 						</Button>
// 						<Button type="submit" disabled={loading} className="flex-1">
// 							{loading ? "Updating..." : "Update Product"}
// 						</Button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { Trash2, X, Upload } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

// Define form data type
export interface ProductFormData {
	price: string;
	size: string;
	colors: string;
	availability: string;
}

// Define types for EditProductModal props
export interface EditProductModalProps {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
	product,
	isOpen,
	onClose,
	onUpdate,
}) => {
	const [formData, setFormData] = useState<ProductFormData>({
		price: "",
		size: "",
		colors: "",
		availability: "yes",
	});
	const [images, setImages] = useState<File[]>([]);
	const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (product && isOpen) {
			setFormData({
				price: product.price?.toString() || "",
				size: product.size || "",
				colors: product.colors?.join(", ") || "",
				availability: product.availability || "yes",
			});
			setImages([]);
			setImagesToDelete([]);
		}
	}, [product, isOpen]);

	const handleInputChange = (field: keyof ProductFormData, value: string) => {
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

	const handleDeleteImage = (imagePath: string) => {
		setImagesToDelete((prev) => [...prev, imagePath]);
	};

	const handleRestoreImage = (imagePath: string) => {
		setImagesToDelete((prev) => prev.filter((img) => img !== imagePath));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!product) return;

		setLoading(true);

		try {
			const submitData = new FormData();

			// Add form fields
			if (formData.price) submitData.append("price", formData.price);
			if (formData.size) submitData.append("size", formData.size);
			if (formData.availability)
				submitData.append("availability", formData.availability);
			if (formData.colors) {
				const colorsArray = formData.colors
					.split(",")
					.map((color) => color.trim())
					.filter((color) => color);
				submitData.append("colors", JSON.stringify(colorsArray));
			}

			// Add images to delete
			if (imagesToDelete.length > 0) {
				submitData.append("imagesToDelete", JSON.stringify(imagesToDelete));
			}

			// Add new images
			images.forEach((image) => {
				submitData.append("images", image);
			});

			await api.patch(`/products/${product._id}`, submitData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			toast.success("Product updated successfully!");
			onUpdate();
			onClose();
		} catch (error) {
			console.error("Failed to update product:", error);
			toast.error("Failed to update product");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen || !product) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">Edit Product</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div>
						<label className="text-sm font-medium mb-2 block">Style</label>
						<Input value={product.style} disabled className="bg-gray-50" />
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Price ($)</label>
						<Input
							type="number"
							step="0.01"
							value={formData.price}
							onChange={(e) => handleInputChange("price", e.target.value)}
							placeholder="Enter price"
						/>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Size Range</label>
						<Input
							value={formData.size}
							onChange={(e) => handleInputChange("size", e.target.value)}
							placeholder="e.g., 0-16, S-XL"
						/>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">
							Colors (comma separated)
						</label>
						<Input
							value={formData.colors}
							onChange={(e) => handleInputChange("colors", e.target.value)}
							placeholder="e.g., RED, BLUE, GREEN"
						/>
					</div>

					{/* Availability Field */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Availability
						</label>
						<div className="flex gap-4">
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="availability"
									value="yes"
									checked={formData.availability === "yes"}
									onChange={(e) =>
										handleInputChange("availability", e.target.value)
									}
									className="w-4 h-4"
								/>
								<span>Yes</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="availability"
									value="no"
									checked={formData.availability === "no"}
									onChange={(e) =>
										handleInputChange("availability", e.target.value)
									}
									className="w-4 h-4"
								/>
								<span>No</span>
							</label>
						</div>
					</div>

					{/* Current Images with Delete Option */}
					{product.images && product.images.length > 0 && (
						<div>
							<label className="text-sm font-medium mb-2 block">
								Current Images ({product.images.length - imagesToDelete.length}{" "}
								remaining)
							</label>
							<div className="grid grid-cols-4 gap-3">
								{product.images.map((img: string, index: number) => {
									const isMarkedForDelete = imagesToDelete.includes(img);
									return (
										<div key={index} className="relative group">
											<img
												src={`http://srv1051513.hstgr.cloud:3200/${img}`}
												alt=""
												className={`w-full h-24 object-cover rounded border-2 ${
													isMarkedForDelete
														? "border-red-500 opacity-50"
														: "border-gray-300"
												}`}
											/>
											<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												{isMarkedForDelete ? (
													<Button
														type="button"
														size="sm"
														variant="secondary"
														onClick={() => handleRestoreImage(img)}
														className="bg-green-500 hover:bg-green-600 text-white">
														Restore
													</Button>
												) : (
													<Button
														type="button"
														size="sm"
														variant="destructive"
														onClick={() => handleDeleteImage(img)}>
														<Trash2 className="w-4 h-4" />
													</Button>
												)}
											</div>
											{isMarkedForDelete && (
												<div className="absolute top-1 right-1">
													<Badge variant="destructive" className="text-xs">
														Will Delete
													</Badge>
												</div>
											)}
										</div>
									);
								})}
							</div>
							{imagesToDelete.length > 0 && (
								<p className="text-sm text-red-600 mt-2">
									{imagesToDelete.length} image(s) marked for deletion
								</p>
							)}
						</div>
					)}

					{/* Add New Images */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Add More Images
						</label>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
							<Input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
								id="product-images"
							/>
							<label
								htmlFor="product-images"
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
									{images.length} new image(s) selected
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
							{loading ? "Updating..." : "Update Product"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
