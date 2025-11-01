import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "../../types";
import { X, CheckSquare, Square } from "lucide-react";
import api from "../../lib/api";
import toast from "react-hot-toast";

// Define form data type
export interface ProductFormData {
	price: string;
	size: string;
	colors: string;
}

// Define types for BulkEditModal props
export interface BulkEditModalProps {
	products: Product[];
	isOpen: boolean;
	onClose: () => void;
	onUpdate: () => void;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
	products,
	isOpen,
	onClose,
	onUpdate,
}) => {
	const [formData, setFormData] = useState<ProductFormData>({
		price: "",
		size: "",
		colors: "",
	});
	const [loading, setLoading] = useState(false);
	const [selectedFields, setSelectedFields] = useState({
		price: false,
		size: false,
		colors: false,
	});

	const handleInputChange = (field: keyof ProductFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleFieldToggle = (field: keyof typeof selectedFields) => {
		setSelectedFields((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!products.length) return;

		// Check if at least one field is selected
		if (
			!selectedFields.price &&
			!selectedFields.size &&
			!selectedFields.colors
		) {
			toast.error("Please select at least one field to update");
			return;
		}

		setLoading(true);

		try {
			const updateData: any = {};

			if (selectedFields.price && formData.price) {
				updateData.price = parseFloat(formData.price);
			}
			if (selectedFields.size && formData.size) {
				updateData.size = formData.size;
			}
			if (selectedFields.colors && formData.colors) {
				updateData.colors = formData.colors
					.split(",")
					.map((color) => color.trim())
					.filter((color) => color);
			}

			// Update all selected products
			const updatePromises = products.map((product) =>
				api.patch(`/products/${product._id}`, updateData)
			);

			await Promise.all(updatePromises);

			toast.success(`Updated ${products.length} products successfully!`);
			onUpdate();
			onClose();
		} catch (error) {
			console.error("Failed to update products:", error);
			toast.error("Failed to update products");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">
						Bulk Edit ({products.length} Products)
					</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div className="text-sm text-gray-600 mb-4">
						Update the following fields for all selected products:
					</div>

					{/* Price Field */}
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => handleFieldToggle("price")}
								className="flex items-center gap-2 text-sm font-medium">
								{selectedFields.price ? (
									<CheckSquare className="w-4 h-4 text-blue-600" />
								) : (
									<Square className="w-4 h-4 text-gray-400" />
								)}
								Price
							</button>
						</div>
						{selectedFields.price && (
							<Input
								type="number"
								step="0.01"
								value={formData.price}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("price", e.target.value)}
								placeholder="Enter new price for all products"
							/>
						)}
					</div>

					{/* Size Field */}
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => handleFieldToggle("size")}
								className="flex items-center gap-2 text-sm font-medium">
								{selectedFields.size ? (
									<CheckSquare className="w-4 h-4 text-blue-600" />
								) : (
									<Square className="w-4 h-4 text-gray-400" />
								)}
								Size Range
							</button>
						</div>
						{selectedFields.size && (
							<Input
								value={formData.size}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("size", e.target.value)}
								placeholder="Enter new size range for all products"
							/>
						)}
					</div>

					{/* Colors Field */}
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => handleFieldToggle("colors")}
								className="flex items-center gap-2 text-sm font-medium">
								{selectedFields.colors ? (
									<CheckSquare className="w-4 h-4 text-blue-600" />
								) : (
									<Square className="w-4 h-4 text-gray-400" />
								)}
								Colors
							</button>
						</div>
						{selectedFields.colors && (
							<Input
								value={formData.colors}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("colors", e.target.value)}
								placeholder="Enter new colors (comma separated) for all products"
							/>
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
							{loading ? "Updating..." : `Update ${products.length} Products`}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};