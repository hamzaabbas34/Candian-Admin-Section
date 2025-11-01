import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UploadStepProps } from "@/types/upload";
import {
	Settings,
	Calendar,
	Tag,
	ChevronRight,
	Sparkles,
	Database,
} from "lucide-react";

const ConfigurationStep: React.FC<UploadStepProps> = ({
	formData,
	setFormData,
	setStep,
	manualVersion,
	setManualVersion,
	generatedVersionName,
}) => {
	// Define category options based on selected brand
	const getCategoryOptions = () => {
		const baseOptions = [
			{ value: "", label: "Select category", disabled: false },
		];

		switch (formData.brand) {
			case "Azure":
				return [
					...baseOptions,
					{
						value: `Prom ${formData.year}`,
						label: `Prom ${formData.year}`,
						disabled: false,
					},
					{
						value: `Enchanted Evening ${formData.year}`,
						label: `Enchanted Evening ${formData.year}`,
						disabled: true,
					},
					{
						value: `Enchanted Bridal ${formData.year}`,
						label: `Enchanted Bridal ${formData.year}`,
						disabled: true,
					},
					{ value: "Gowns", label: "Gowns", disabled: true },
					{ value: "custom", label: "+ Custom Category", disabled: false },
				];

			case "Monsini":
				return [
					...baseOptions,
					{
						value: `Prom ${formData.year}`,
						label: `Prom ${formData.year}`,
						disabled: false,
					},
					{
						value: `Enchanted Evening ${formData.year}`,
						label: `Enchanted Evening ${formData.year}`,
						disabled: false,
					},
					{
						value: `Enchanted Bridal ${formData.year}`,
						label: `Enchanted Bridal ${formData.year}`,
						disabled: false,
					},
					{ value: "Gowns", label: "Gowns", disabled: true },
					{ value: "custom", label: "+ Custom Category", disabled: false },
				];

			case "Risky":
				return [
					...baseOptions,
					{
						value: `Prom ${formData.year}`,
						label: `Prom ${formData.year}`,
						disabled: true,
					},
					{
						value: `Enchanted Evening ${formData.year}`,
						label: `Enchanted Evening ${formData.year}`,
						disabled: true,
					},
					{
						value: `Enchanted Bridal ${formData.year}`,
						label: `Enchanted Bridal ${formData.year}`,
						disabled: true,
					},
					{ value: "Gowns", label: "Gowns", disabled: false },
					{ value: "custom", label: "+ Custom Category", disabled: false },
				];

			default:
				return [
					...baseOptions,
					{
						value: `Prom ${formData.year}`,
						label: `Prom ${formData.year}`,
						disabled: false,
					},
					{
						value: `Enchanted Evening ${formData.year}`,
						label: `Enchanted Evening ${formData.year}`,
						disabled: false,
					},
					{
						value: `Enchanted Bridal ${formData.year}`,
						label: `Enchanted Bridal ${formData.year}`,
						disabled: false,
					},
					{ value: "Gowns", label: "Gowns", disabled: false },
					{ value: "custom", label: "+ Custom Category", disabled: false },
				];
		}
	};

	const categoryOptions = getCategoryOptions();

	// Reset category when brand changes
	const handleBrandChange = (brand: string) => {
		setFormData({
			...formData,
			brand: brand as any,
			category: "", // Reset category when brand changes
			isCustomCategory: false, // Reset custom category flag
		});
	};

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
							onChange={(e) => handleBrandChange(e.target.value)}>
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
							{categoryOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
									disabled={option.disabled}>
									{option.label}
								</option>
							))}
						</Select>

						{/* Brand-Category Relationship Info */}
						

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
								manualVersion ? formData.versionName : generatedVersionName
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
						<label htmlFor="manualVersion" className="text-sm text-gray-600">
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
};

export default ConfigurationStep;
