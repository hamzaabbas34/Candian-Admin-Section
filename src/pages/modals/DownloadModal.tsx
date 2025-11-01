import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { X, Download } from "lucide-react";
import toast from "react-hot-toast";

// Define types for DownloadModal props
export interface DownloadModalProps {
	isOpen: boolean;
	onClose: () => void;
	years: number[];
	categories: string[];
	onDownload: (year: string, category: string) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
	isOpen,
	onClose,
	years,
	categories,
	onDownload,
}) => {
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string>("");

	const handleDownload = () => {
		if (!selectedYear) {
			toast.error("Please select a year");
			return;
		}
		onDownload(selectedYear, selectedCategory);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">Download Products Data</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<div className="p-4 space-y-4">
					<div>
						<label className="text-sm font-medium mb-2 block">
							Select Year *
						</label>
						<Select
							value={selectedYear}
							onChange={(e) => setSelectedYear(e.target.value)}>
							<option value="">Choose Year</option>
							{years.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</Select>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">
							Select Category (Optional)
						</label>
						<Select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}>
							<option value="">All Categories</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</Select>
					</div>

					<div className="bg-blue-50 p-3 rounded-lg">
						<p className="text-sm text-blue-700">
							{selectedYear && selectedCategory
								? `Downloading ${selectedYear} ${selectedCategory} products data`
								: selectedYear
								? `Downloading all ${selectedYear} products data`
								: "Select year and category to download specific data"}
						</p>
					</div>

					<div className="flex gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1">
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleDownload}
							disabled={!selectedYear}
							className="flex-1 gap-1">
							<Download className="w-4 h-4" />
							Download Data
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
