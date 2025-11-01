// // import React, { useState, useRef } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { UploadStepProps } from "@/types/upload";
// // import {
// // 	FileSpreadsheet,
// // 	CheckCircle,
// // 	ChevronLeft,
// // 	ChevronRight,
// // 	Edit,
// // 	Save,
// // 	Plus,
// // 	Trash2,
// // 	X,
// // } from "lucide-react";
// // import toast from "react-hot-toast";
// // import Swal from "sweetalert2";
// // import * as XLSX from "xlsx";

// // const ExcelStep: React.FC<UploadStepProps> = ({
// // 	formData,
// // 	setFormData,
// // 	setStep,
// // }) => {
// // 	const [excelData, setExcelData] = useState<any[]>([]);
// // 	const [headers, setHeaders] = useState<string[]>([]);
// // 	const [showEditor, setShowEditor] = useState(false);
// // 	const [editingFile, setEditingFile] = useState<File | null>(null);
// // 	const [editingCell, setEditingCell] = useState<{
// // 		row: number;
// // 		column: string;
// // 	} | null>(null);
// // 	const inputRef = useRef<HTMLInputElement>(null);

// // 	// Required columns
// // 	const REQUIRED_COLUMNS = ["Style", "Price", "Size Range"];
// // 	const COLOR_COLUMN_PATTERN = /color|colour|shade|hue/i;

// // 	// Parse Excel file and prepare for editing
// // 	const parseExcelForEditing = async (file: File): Promise<boolean> => {
// // 		return new Promise((resolve) => {
// // 			const reader = new FileReader();

// // 			reader.onload = (e) => {
// // 				try {
// // 					const data = new Uint8Array(e.target?.result as ArrayBuffer);
// // 					const workbook = XLSX.read(data, { type: "array" });
// // 					const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
// // 					const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

// // 					if (jsonData.length === 0) {
// // 						toast.error("Excel file is empty");
// // 						resolve(false);
// // 						return;
// // 					}

// // 					const fileHeaders = (jsonData[0] as string[]).map((header, index) =>
// // 						header ? header.toString().trim() : `Column ${index + 1}`
// // 					);

// // 					// Convert data for editing (skip header row)
// // 					const rows = jsonData.slice(1).map((row: any, index) => {
// // 						const rowData: any = { id: index + 1 };
// // 						fileHeaders.forEach((header, colIndex) => {
// // 							rowData[header] = row[colIndex] || "";
// // 						});
// // 						return rowData;
// // 					});

// // 					setHeaders(fileHeaders);
// // 					setExcelData(rows);
// // 					setEditingFile(file);
// // 					setShowEditor(true);
// // 					resolve(true);
// // 				} catch (error) {
// // 					console.error("Error parsing Excel file:", error);
// // 					toast.error("Error reading Excel file");
// // 					resolve(false);
// // 				}
// // 			};
// // 			reader.readAsArrayBuffer(file);
// // 		});
// // 	};

// // 	// Validate data before saving
// // 	const validateData = (): { isValid: boolean; errors: string[] } => {
// // 		const errors: string[] = [];

// // 		// Check required columns
// // 		const missingColumns = REQUIRED_COLUMNS.filter(
// // 			(col) => !headers.includes(col)
// // 		);
// // 		if (missingColumns.length > 0) {
// // 			errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
// // 		}

// // 		// Check color columns
// // 		const colorColumns = headers.filter((header) =>
// // 			COLOR_COLUMN_PATTERN.test(header)
// // 		);
// // 		if (colorColumns.length === 0) {
// // 			errors.push(
// // 				"No color columns found. Add columns with names like 'Color', 'Colour', etc."
// // 			);
// // 		}

// // 		// Check data in rows
// // 		excelData.forEach((row, index) => {
// // 			REQUIRED_COLUMNS.forEach((column) => {
// // 				if (
// // 					headers.includes(column) &&
// // 					(!row[column] || row[column].toString().trim() === "")
// // 				) {
// // 					errors.push(`Row ${index + 1}: ${column} is required`);
// // 				}
// // 			});

// // 			// Validate price
// // 			if (headers.includes("Price") && row.Price) {
// // 				const priceStr = row.Price.toString().replace(/[$,]/g, "");
// // 				const price = Number(priceStr);
// // 				if (isNaN(price) || price <= 0) {
// // 					errors.push(`Row ${index + 1}: Price must be a positive number`);
// // 				}
// // 			}
// // 		});

// // 		return { isValid: errors.length === 0, errors };
// // 	};

// // 	// Save edited data back to Excel file
// // 	const saveEditedExcel = async (): Promise<File> => {
// // 		// Convert data back to sheet format
// // 		const sheetData = [headers]; // Headers row
// // 		excelData.forEach((row) => {
// // 			const rowData = headers.map((header) => row[header] || "");
// // 			sheetData.push(rowData);
// // 		});

// // 		const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
// // 		const workbook = XLSX.utils.book_new();
// // 		XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

// // 		// Generate Excel file
// // 		const excelBuffer = XLSX.write(workbook, {
// // 			bookType: "xlsx",
// // 			type: "array",
// // 		});
// // 		const blob = new Blob([excelBuffer], {
// // 			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// // 		});

// // 		return new File([blob], editingFile?.name || `edited_${Date.now()}.xlsx`, {
// // 			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// // 		});
// // 	};

// // 	// Handle cell editing
// // 	const handleCellEdit = (rowIndex: number, column: string, value: string) => {
// // 		const newData = [...excelData];
// // 		newData[rowIndex] = {
// // 			...newData[rowIndex],
// // 			[column]: value,
// // 		};
// // 		setExcelData(newData);
// // 	};

// // 	// Handle cell focus for better editing experience
// // 	const handleCellFocus = (rowIndex: number, column: string, value: string) => {
// // 		setEditingCell({ row: rowIndex, column });
// // 		// Use setTimeout to ensure the input is focused after state update
// // 		setTimeout(() => {
// // 			if (inputRef.current) {
// // 				inputRef.current.focus();
// // 				// Select all text when focusing for easier editing
// // 				inputRef.current.select();
// // 			}
// // 		}, 0);
// // 	};

// // 	// Add new row
// // 	const addNewRow = () => {
// // 		const newRow: any = { id: excelData.length + 1 };
// // 		headers.forEach((header) => {
// // 			newRow[header] = "";
// // 		});
// // 		setExcelData([...excelData, newRow]);
// // 	};

// // 	// Delete row
// // 	const deleteRow = (rowIndex: number) => {
// // 		const newData = excelData.filter((_, index) => index !== rowIndex);
// // 		setExcelData(newData);
// // 	};

// // 	// Add new column
// // 	const addNewColumn = () => {
// // 		const columnName = prompt("Enter column name:");
// // 		if (columnName && columnName.trim() && !headers.includes(columnName)) {
// // 			setHeaders([...headers, columnName]);
// // 			// Add empty values for new column in all rows
// // 			const newData = excelData.map((row) => ({
// // 				...row,
// // 				[columnName]: "",
// // 			}));
// // 			setExcelData(newData);
// // 		} else if (columnName && headers.includes(columnName)) {
// // 			toast.error("Column name already exists");
// // 		}
// // 	};

// // 	// Edit column name
// // 	const editColumnName = (oldName: string) => {
// // 		const newName = prompt("Enter new column name:", oldName);
// // 		if (newName && newName.trim() && newName !== oldName) {
// // 			if (headers.includes(newName)) {
// // 				toast.error("Column name already exists");
// // 				return;
// // 			}

// // 			const newHeaders = headers.map((header) =>
// // 				header === oldName ? newName : header
// // 			);
// // 			const newData = excelData.map((row) => {
// // 				const newRow = { ...row };
// // 				newRow[newName] = newRow[oldName];
// // 				delete newRow[oldName];
// // 				return newRow;
// // 			});

// // 			setHeaders(newHeaders);
// // 			setExcelData(newData);
// // 			toast.success(`Column renamed to "${newName}"`);
// // 		}
// // 	};

// // 	// Delete column
// // 	const deleteColumn = (columnName: string) => {
// // 		if (REQUIRED_COLUMNS.includes(columnName)) {
// // 			toast.error(`Cannot delete required column: ${columnName}`);
// // 			return;
// // 		}

// // 		Swal.fire({
// // 			title: "Delete Column?",
// // 			text: `Are you sure you want to delete column "${columnName}"?`,
// // 			icon: "warning",
// // 			showCancelButton: true,
// // 			confirmButtonColor: "#ef4444",
// // 			cancelButtonColor: "#6b7280",
// // 			confirmButtonText: "Delete",
// // 			cancelButtonText: "Cancel",
// // 		}).then((result) => {
// // 			if (result.isConfirmed) {
// // 				const newHeaders = headers.filter((header) => header !== columnName);
// // 				const newData = excelData.map((row) => {
// // 					const newRow = { ...row };
// // 					delete newRow[columnName];
// // 					return newRow;
// // 				});

// // 				setHeaders(newHeaders);
// // 				setExcelData(newData);
// // 				toast.success(`Column "${columnName}" deleted`);
// // 			}
// // 		});
// // 	};

// // 	// Handle file upload with validation
// // 	const handleExcelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // 		const file = e.target.files?.[0];
// // 		if (file) {
// // 			const fileExtension = file.name.split(".").pop()?.toLowerCase();
// // 			if (!["xlsx", "xls"].includes(fileExtension || "")) {
// // 				toast.error("Please select a valid Excel file (.xlsx or .xls)");
// // 				return;
// // 			}

// // 			const success = await parseExcelForEditing(file);

// // 			if (!success) {
// // 				e.target.value = "";
// // 			}
// // 		}
// // 	};

// // 	// Save and continue
// // 	const handleSaveAndContinue = async () => {
// // 		const validation = validateData();

// // 		if (!validation.isValid) {
// // 			Swal.fire({
// // 				icon: "error",
// // 				title: "Validation Errors",
// // 				html: `
// // 					<div style="text-align: left; max-height: 300px; overflow-y: auto;">
// // 						<p>Please fix the following issues:</p>
// // 						<ul style="color: #ef4444; margin: 16px 0; padding-left: 20px;">
// // 							${validation.errors.map((error) => `<li>• ${error}</li>`).join("")}
// // 						</ul>
// // 					</div>
// // 				`,
// // 				confirmButtonText: "OK",
// // 				confirmButtonColor: "#ef4444",
// // 			});
// // 			return;
// // 		}

// // 		try {
// // 			const newFile = await saveEditedExcel();
// // 			setFormData({ ...formData, excelFile: newFile });
// // 			toast.loading("");
// // 			setShowEditor(false);
// // 			toast.success("File saved successfully!");
// // 		} catch (error) {
// // 			toast.error("Error saving file");
// // 		}
// // 	};

// // 	// Inline Excel Editor Component
// // 	const ExcelEditor = () => (
// // 		<div className="space-y-4">
// // 			<div className="flex justify-between items-center">
// // 				<h3 className="text-lg font-semibold">Excel File Editor</h3>
// // 				<div className="flex gap-2">
// // 					<Button onClick={addNewColumn} variant="outline" size="sm">
// // 						<Plus className="w-4 h-4 mr-1" />
// // 						Add Column
// // 					</Button>
// // 					<Button onClick={addNewRow} variant="outline" size="sm">
// // 						<Plus className="w-4 h-4 mr-1" />
// // 						Add Row
// // 					</Button>
// // 					<Button
// // 						onClick={handleSaveAndContinue}
// // 						className="bg-green-600 hover:bg-green-700">
// // 						<Save className="w-4 h-4 mr-1" />
// // 						Save & Continue
// // 					</Button>
// // 				</div>
// // 			</div>

// // 			{/* Excel-like Table */}
// // 			<div className="border rounded-lg overflow-hidden">
// // 				<div className="overflow-x-auto max-h-96">
// // 					<table className="w-full text-sm">
// // 						<thead className="bg-gray-50 sticky top-0">
// // 							<tr>
// // 								<th className="p-2 border-r bg-gray-100 sticky left-0 z-10 min-w-12">
// // 									#
// // 								</th>
// // 								{headers.map((header, index) => (
// // 									<th
// // 										key={index}
// // 										className="p-2 border-r font-semibold text-left min-w-40 group relative">
// // 										<div className="flex items-center justify-between">
// // 											<button
// // 												onClick={() => editColumnName(header)}
// // 												className={`text-left flex-1 hover:bg-gray-200 px-1 py-1 rounded ${
// // 													REQUIRED_COLUMNS.includes(header)
// // 														? "text-red-600"
// // 														: COLOR_COLUMN_PATTERN.test(header)
// // 														? "text-blue-600"
// // 														: ""
// // 												}`}
// // 												title="Click to edit column name">
// // 												{header}
// // 												{REQUIRED_COLUMNS.includes(header) && " *"}
// // 											</button>
// // 											{!REQUIRED_COLUMNS.includes(header) && (
// // 												<button
// // 													onClick={() => deleteColumn(header)}
// // 													className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-2"
// // 													title="Delete column">
// // 													<X className="w-3 h-3" />
// // 												</button>
// // 											)}
// // 										</div>
// // 									</th>
// // 								))}
// // 								<th className="p-2 bg-gray-100 sticky right-0 z-10 min-w-16">
// // 									Actions
// // 								</th>
// // 							</tr>
// // 						</thead>
// // 						<tbody>
// // 							{excelData.map((row, rowIndex) => (
// // 								<tr key={row.id} className="hover:bg-gray-50">
// // 									<td className="p-2 border-r bg-gray-50 sticky left-0 z-10 text-center">
// // 										{rowIndex + 1}
// // 									</td>
// // 									{headers.map((header, colIndex) => (
// // 										<td
// // 											key={colIndex}
// // 											className="p-0 border-r relative"
// // 											onClick={() =>
// // 												handleCellFocus(rowIndex, header, row[header] || "")
// // 											}>
// // 											{editingCell?.row === rowIndex &&
// // 											editingCell?.column === header ? (
// // 												<input
// // 													ref={inputRef}
// // 													type="text"
// // 													value={row[header] || ""}
// // 													onChange={(e) =>
// // 														handleCellEdit(rowIndex, header, e.target.value)
// // 													}
// // 													onBlur={() => setEditingCell(null)}
// // 													onKeyDown={(e) => {
// // 														if (e.key === "Enter") {
// // 															setEditingCell(null);
// // 														}
// // 													}}
// // 													className="w-full p-2 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
// // 													placeholder={`Enter ${header}`}
// // 													autoFocus
// // 												/>
// // 											) : (
// // 												<div className="p-2 cursor-pointer hover:bg-blue-50 min-h-10 flex items-center">
// // 													{row[header] || (
// // 														<span className="text-gray-400 italic">
// // 															Click to edit
// // 														</span>
// // 													)}
// // 												</div>
// // 											)}
// // 										</td>
// // 									))}
// // 									<td className="p-2 bg-gray-50 sticky right-0 z-10">
// // 										<Button
// // 											variant="ghost"
// // 											size="sm"
// // 											onClick={() => deleteRow(rowIndex)}
// // 											className="text-red-600 hover:text-red-800 hover:bg-red-50">
// // 											<Trash2 className="w-4 h-4" />
// // 										</Button>
// // 									</td>
// // 								</tr>
// // 							))}
// // 						</tbody>
// // 					</table>
// // 				</div>
// // 			</div>

// // 			{/* Legend */}
// // 			<div className="flex gap-4 text-xs text-gray-600">
// // 				<div className="flex items-center gap-1">
// // 					<span className="text-red-600">*</span>
// // 					<span>Required column (click to rename)</span>
// // 				</div>
// // 				<div className="flex items-center gap-1">
// // 					<span className="text-blue-600">Color</span>
// // 					<span>Color column (click to rename)</span>
// // 				</div>
// // 				<div className="flex items-center gap-1">
// // 					<X className="w-3 h-3 text-red-500" />
// // 					<span>Delete optional column</span>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);

// // 	if (showEditor) {
// // 		return (
// // 			<div className="space-y-6">
// // 				<ExcelEditor />
// // 				<div className="flex justify-between pt-4">
// // 					<Button variant="outline" onClick={() => setShowEditor(false)}>
// // 						<ChevronLeft className="w-4 h-4 mr-2" />
// // 						Back to Upload
// // 					</Button>
// // 					<Button
// // 						onClick={handleSaveAndContinue}
// // 						className="px-6 bg-green-600 hover:bg-green-700">
// // 						<Save className="w-4 h-4 mr-2" />
// // 						Save & Continue
// // 					</Button>
// // 				</div>
// // 			</div>
// // 		);
// // 	}

// // 	return (
// // 		<div className="space-y-6">
// // 			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
// // 				<div className="flex items-start gap-3">
// // 					<FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
// // 					<div>
// // 						<h4 className="font-semibold text-blue-900">
// // 							Upload & Edit Excel File
// // 						</h4>
// // 						<p className="text-sm text-blue-700 mt-1">
// // 							Upload your Excel file. You can edit it directly in the browser if
// // 							needed.
// // 						</p>
// // 					</div>
// // 				</div>
// // 			</div>

// // 			<div className="space-y-4">
// // 				<div>
// // 					<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
// // 						<FileSpreadsheet className="w-4 h-4" />
// // 						Select Excel File
// // 					</label>
// // 					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors relative">
// // 						<FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
// // 						<Input
// // 							type="file"
// // 							accept=".xlsx,.xls"
// // 							onChange={handleExcelChange}
// // 							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// // 						/>
// // 						<div>
// // 							<p className="text-sm font-medium text-gray-700">
// // 								Drop your Excel file here or click to browse
// // 							</p>
// // 							<p className="text-xs text-gray-500 mt-1">
// // 								Supported formats: .xlsx, .xls • Edit directly in browser
// // 							</p>
// // 						</div>
// // 					</div>
// // 				</div>

// // 				{formData.excelFile && !showEditor && (
// // 					<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
// // 						<div className="flex items-center justify-between">
// // 							<div className="flex items-center gap-3">
// // 								<CheckCircle className="w-5 h-5 text-green-600" />
// // 								<div>
// // 									<p className="font-medium text-green-900">
// // 										{formData.excelFile.name}
// // 									</p>
// // 									<p className="text-sm text-green-700">Ready for upload</p>
// // 								</div>
// // 							</div>
// // 							<Button
// // 								variant="outline"
// // 								onClick={() => parseExcelForEditing(formData.excelFile!)}
// // 								className="text-blue-600 border-blue-200">
// // 								<Edit className="w-4 h-4 mr-2" />
// // 								Edit File
// // 							</Button>
// // 						</div>
// // 					</div>
// // 				)}
// // 			</div>

// // 			<div className="flex justify-between pt-4">
// // 				<Button variant="outline" onClick={() => setStep(1)}>
// // 					<ChevronLeft className="w-4 h-4 mr-2" />
// // 					Back
// // 				</Button>
// // 				<Button
// // 					onClick={() => setStep(3)}
// // 					disabled={!formData.excelFile}
// // 					className="px-6">
// // 					Continue <ChevronRight className="w-4 h-4 ml-2" />
// // 				</Button>
// // 			</div>
// // 		</div>
// // 	);
// // };

// // export default ExcelStep;

// import React, { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { UploadStepProps } from "@/types/upload";
// import {
// 	FileSpreadsheet,
// 	CheckCircle,
// 	ChevronLeft,
// 	ChevronRight,
// 	Edit,
// 	Save,
// 	Plus,
// 	Trash2,
// 	X,
// 	AlertTriangle,
// 	AlertCircle,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";

// const ExcelStep: React.FC<UploadStepProps> = ({
// 	formData,
// 	setFormData,
// 	setStep,
// }) => {
// 	const [excelData, setExcelData] = useState<any[]>([]);
// 	const [headers, setHeaders] = useState<string[]>([]);
// 	const [showEditor, setShowEditor] = useState(false);
// 	const [editingFile, setEditingFile] = useState<File | null>(null);
// 	const [editingCell, setEditingCell] = useState<{
// 		row: number;
// 		column: string;
// 	} | null>(null);
// 	const [hasMissingValues, setHasMissingValues] = useState(false);
// 	const [missingCells, setMissingCells] = useState<
// 		Array<{ row: number; column: string; value: string }>
// 	>([]);
// 	const [showBottomBar, setShowBottomBar] = useState(false);
// 	const inputRef = useRef<HTMLInputElement>(null);

// 	// Required columns
// 	const REQUIRED_COLUMNS = ["Style", "Price", "Size Range"];
// 	const COLOR_COLUMN_PATTERN = /color|colour|shade|hue/i;

// 	// Check for missing values in important columns
// 	const checkMissingValues = (
// 		data: any[]
// 	): {
// 		hasMissing: boolean;
// 		missingCells: Array<{ row: number; column: string; value: string }>;
// 	} => {
// 		const missingCells: Array<{ row: number; column: string; value: string }> =
// 			[];
// 		let hasMissing = false;

// 		data.forEach((row, rowIndex) => {
// 			headers.forEach((header) => {
// 				const value = row[header];
// 				// Check if value is empty, null, undefined, or just whitespace
// 				if (!value || value.toString().trim() === "") {
// 					// Only flag important columns (required columns and color columns)
// 					if (
// 						REQUIRED_COLUMNS.includes(header) ||
// 						COLOR_COLUMN_PATTERN.test(header)
// 					) {
// 						missingCells.push({
// 							row: rowIndex + 1, // +1 because we skip header row in display
// 							column: header,
// 							value: value || "empty",
// 						});
// 						hasMissing = true;
// 					}
// 				}
// 			});
// 		});

// 		return { hasMissing, missingCells };
// 	};

// 	// Update missing values check whenever data changes
// 	useEffect(() => {
// 		if (excelData.length > 0 && headers.length > 0) {
// 			const { hasMissing, missingCells } = checkMissingValues(excelData);
// 			setHasMissingValues(hasMissing);
// 			setMissingCells(missingCells);
// 			setShowBottomBar(hasMissing);
// 		}
// 	}, [excelData, headers]);

// 	// Auto-fill missing values with "N/A"
// 	const autoFillMissingValues = () => {
// 		const newData = excelData.map((row) => {
// 			const newRow = { ...row };
// 			headers.forEach((header) => {
// 				// Check if value is missing and it's an important column
// 				if (
// 					(!newRow[header] || newRow[header].toString().trim() === "") &&
// 					(REQUIRED_COLUMNS.includes(header) ||
// 						COLOR_COLUMN_PATTERN.test(header))
// 				) {
// 					newRow[header] = "N/A";
// 				}
// 			});
// 			return newRow;
// 		});
// 		setExcelData(newData);
// 		setHasMissingValues(false);
// 		setShowBottomBar(false);
// 		toast.success("Missing values filled with 'N/A'");
// 	};

// 	// Show missing values alert and ask user what to do
// 	const showMissingValuesAlert = (
// 		missingCells: Array<{ row: number; column: string; value: string }>
// 	) => {
// 		const missingCount = missingCells.length;

// 		Swal.fire({
// 			icon: "warning",
// 			title: "Missing Values Found",
// 			html: `
// 				<div style="text-align: left;">
// 					<p>Found <strong>${missingCount}</strong> missing values in important columns:</p>
// 					<div style="max-height: 200px; overflow-y: auto; margin: 16px 0; background: #f8f9fa; padding: 12px; border-radius: 8px;">
// 						${missingCells
// 							.slice(0, 10)
// 							.map(
// 								(cell) =>
// 									`<div style="font-size: 13px; margin-bottom: 4px;">
// 								• Row ${cell.row}, Column "<strong>${cell.column}</strong>": <span style="color: #ef4444;">Empty</span>
// 							</div>`
// 							)
// 							.join("")}
// 						${
// 							missingCount > 10
// 								? `<div style="font-size: 13px; color: #6b7280;">... and ${
// 										missingCount - 10
// 								  } more</div>`
// 								: ""
// 						}
// 					</div>
// 					<p>How would you like to proceed?</p>
// 				</div>
// 			`,
// 			showCancelButton: true,
// 			showDenyButton: true,
// 			confirmButtonText: "Edit in Table",
// 			denyButtonText: "Auto-fill with N/A",
// 			cancelButtonText: "Cancel",
// 			confirmButtonColor: "#3b82f6",
// 			denyButtonColor: "#10b981",
// 			cancelButtonColor: "#6b7280",
// 			reverseButtons: true,
// 		}).then((result) => {
// 			if (result.isConfirmed) {
// 				// User wants to edit manually - just continue to editor
// 				setHasMissingValues(true);
// 				setShowEditor(true);
// 			} else if (result.isDenied) {
// 				// User wants to auto-fill with N/A
// 				autoFillMissingValues();
// 				setShowEditor(true);
// 			} else {
// 				// User cancelled - reset file selection
// 				setEditingFile(null);
// 				setShowEditor(false);
// 				if (inputRef.current) {
// 					inputRef.current.value = "";
// 				}
// 			}
// 		});
// 	};

// 	// Parse Excel file and prepare for editing
// 	const parseExcelForEditing = async (file: File): Promise<boolean> => {
// 		return new Promise((resolve) => {
// 			const reader = new FileReader();

// 			reader.onload = (e) => {
// 				try {
// 					const data = new Uint8Array(e.target?.result as ArrayBuffer);
// 					const workbook = XLSX.read(data, { type: "array" });
// 					const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
// 					const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

// 					if (jsonData.length === 0) {
// 						toast.error("Excel file is empty");
// 						resolve(false);
// 						return;
// 					}

// 					const fileHeaders = (jsonData[0] as string[]).map((header, index) =>
// 						header ? header.toString().trim() : `Column ${index + 1}`
// 					);

// 					// Convert data for editing (skip header row)
// 					const rows = jsonData.slice(1).map((row: any, index) => {
// 						const rowData: any = { id: index + 1 };
// 						fileHeaders.forEach((header, colIndex) => {
// 							rowData[header] = row[colIndex] || "";
// 						});
// 						return rowData;
// 					});

// 					setHeaders(fileHeaders);
// 					setExcelData(rows);
// 					setEditingFile(file);

// 					// Check for missing values
// 					const { hasMissing, missingCells } = checkMissingValues(rows);
// 					setHasMissingValues(hasMissing);
// 					setMissingCells(missingCells);

// 					if (hasMissing) {
// 						// Show alert about missing values
// 						showMissingValuesAlert(missingCells);
// 					} else {
// 						// No missing values, proceed directly to editor
// 						setShowEditor(true);
// 					}

// 					resolve(true);
// 				} catch (error) {
// 					console.error("Error parsing Excel file:", error);
// 					toast.error("Error reading Excel file");
// 					resolve(false);
// 				}
// 			};
// 			reader.readAsArrayBuffer(file);
// 		});
// 	};

// 	// Validate data before saving - STRICT validation
// 	const validateDataStrict = (): { isValid: boolean; errors: string[] } => {
// 		const errors: string[] = [];

// 		// Check required columns
// 		const missingColumns = REQUIRED_COLUMNS.filter(
// 			(col) => !headers.includes(col)
// 		);
// 		if (missingColumns.length > 0) {
// 			errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
// 		}

// 		// Check color columns
// 		const colorColumns = headers.filter((header) =>
// 			COLOR_COLUMN_PATTERN.test(header)
// 		);
// 		if (colorColumns.length === 0) {
// 			errors.push(
// 				"No color columns found. Add columns with names like 'Color', 'Colour', etc."
// 			);
// 		}

// 		// Check data in rows - STRICT: all required columns must have values
// 		excelData.forEach((row, index) => {
// 			REQUIRED_COLUMNS.forEach((column) => {
// 				if (
// 					headers.includes(column) &&
// 					(!row[column] || row[column].toString().trim() === "")
// 				) {
// 					errors.push(`Row ${index + 1}: ${column} is required`);
// 				}
// 			});

// 			// Validate price format if present
// 			if (
// 				headers.includes("Price") &&
// 				row.Price &&
// 				row.Price.toString().trim() !== ""
// 			) {
// 				const priceStr = row.Price.toString().replace(/[$,]/g, "");
// 				const price = Number(priceStr);
// 				if (isNaN(price) || price <= 0) {
// 					errors.push(`Row ${index + 1}: Price must be a positive number`);
// 				}
// 			}
// 		});

// 		return { isValid: errors.length === 0, errors };
// 	};

// 	// Validate data before saving - LENIENT validation (for Continue Anyway)
// 	const validateDataLenient = (): { isValid: boolean; errors: string[] } => {
// 		const errors: string[] = [];

// 		// Check required columns
// 		const missingColumns = REQUIRED_COLUMNS.filter(
// 			(col) => !headers.includes(col)
// 		);
// 		if (missingColumns.length > 0) {
// 			errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
// 		}

// 		// Check color columns
// 		const colorColumns = headers.filter((header) =>
// 			COLOR_COLUMN_PATTERN.test(header)
// 		);
// 		if (colorColumns.length === 0) {
// 			errors.push(
// 				"No color columns found. Add columns with names like 'Color', 'Colour', etc."
// 			);
// 		}

// 		// Check data in rows - LENIENT: only validate format, not presence
// 		excelData.forEach((row, index) => {
// 			// Validate price format only if present and not empty
// 			if (
// 				headers.includes("Price") &&
// 				row.Price &&
// 				row.Price.toString().trim() !== ""
// 			) {
// 				const priceStr = row.Price.toString().replace(/[$,]/g, "");
// 				const price = Number(priceStr);
// 				if (isNaN(price) || price <= 0) {
// 					errors.push(`Row ${index + 1}: Price must be a positive number`);
// 				}
// 			}
// 		});

// 		return { isValid: errors.length === 0, errors };
// 	};

// 	// Save edited data back to Excel file
// 	const saveEditedExcel = async (): Promise<File> => {
// 		// Convert data back to sheet format
// 		const sheetData = [headers]; // Headers row
// 		excelData.forEach((row) => {
// 			const rowData = headers.map((header) => row[header] || "");
// 			sheetData.push(rowData);
// 		});

// 		const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
// 		const workbook = XLSX.utils.book_new();
// 		XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

// 		// Generate Excel file
// 		const excelBuffer = XLSX.write(workbook, {
// 			bookType: "xlsx",
// 			type: "array",
// 		});
// 		const blob = new Blob([excelBuffer], {
// 			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// 		});

// 		return new File([blob], editingFile?.name || `edited_${Date.now()}.xlsx`, {
// 			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// 		});
// 	};

// 	// Handle cell editing
// 	const handleCellEdit = (rowIndex: number, column: string, value: string) => {
// 		const newData = [...excelData];
// 		newData[rowIndex] = {
// 			...newData[rowIndex],
// 			[column]: value,
// 		};
// 		setExcelData(newData);
// 	};

// 	// Handle cell focus for better editing experience
// 	const handleCellFocus = (rowIndex: number, column: string, value: string) => {
// 		setEditingCell({ row: rowIndex, column });
// 		// Use setTimeout to ensure the input is focused after state update
// 		setTimeout(() => {
// 			if (inputRef.current) {
// 				inputRef.current.focus();
// 				// Select all text when focusing for easier editing
// 				inputRef.current.select();
// 			}
// 		}, 0);
// 	};

// 	// Add new row
// 	const addNewRow = () => {
// 		const newRow: any = { id: excelData.length + 1 };
// 		headers.forEach((header) => {
// 			newRow[header] = "";
// 		});
// 		setExcelData([...excelData, newRow]);
// 	};

// 	// Delete row
// 	const deleteRow = (rowIndex: number) => {
// 		const newData = excelData.filter((_, index) => index !== rowIndex);
// 		setExcelData(newData);
// 	};

// 	// Add new column
// 	const addNewColumn = () => {
// 		const columnName = prompt("Enter column name:");
// 		if (columnName && columnName.trim() && !headers.includes(columnName)) {
// 			setHeaders([...headers, columnName]);
// 			// Add empty values for new column in all rows
// 			const newData = excelData.map((row) => ({
// 				...row,
// 				[columnName]: "",
// 			}));
// 			setExcelData(newData);
// 		} else if (columnName && headers.includes(columnName)) {
// 			toast.error("Column name already exists");
// 		}
// 	};

// 	// Edit column name
// 	const editColumnName = (oldName: string) => {
// 		const newName = prompt("Enter new column name:", oldName);
// 		if (newName && newName.trim() && newName !== oldName) {
// 			if (headers.includes(newName)) {
// 				toast.error("Column name already exists");
// 				return;
// 			}

// 			const newHeaders = headers.map((header) =>
// 				header === oldName ? newName : header
// 			);
// 			const newData = excelData.map((row) => {
// 				const newRow = { ...row };
// 				newRow[newName] = newRow[oldName];
// 				delete newRow[oldName];
// 				return newRow;
// 			});

// 			setHeaders(newHeaders);
// 			setExcelData(newData);
// 			toast.success(`Column renamed to "${newName}"`);
// 		}
// 	};

// 	// Delete column
// 	const deleteColumn = (columnName: string) => {
// 		if (REQUIRED_COLUMNS.includes(columnName)) {
// 			toast.error(`Cannot delete required column: ${columnName}`);
// 			return;
// 		}

// 		Swal.fire({
// 			title: "Delete Column?",
// 			text: `Are you sure you want to delete column "${columnName}"?`,
// 			icon: "warning",
// 			showCancelButton: true,
// 			confirmButtonColor: "#ef4444",
// 			cancelButtonColor: "#6b7280",
// 			confirmButtonText: "Delete",
// 			cancelButtonText: "Cancel",
// 		}).then((result) => {
// 			if (result.isConfirmed) {
// 				const newHeaders = headers.filter((header) => header !== columnName);
// 				const newData = excelData.map((row) => {
// 					const newRow = { ...row };
// 					delete newRow[columnName];
// 					return newRow;
// 				});

// 				setHeaders(newHeaders);
// 				setExcelData(newData);
// 				toast.success(`Column "${columnName}" deleted`);
// 			}
// 		});
// 	};

// 	// Handle file upload with validation
// 	const handleExcelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (file) {
// 			const fileExtension = file.name.split(".").pop()?.toLowerCase();
// 			if (!["xlsx", "xls"].includes(fileExtension || "")) {
// 				toast.error("Please select a valid Excel file (.xlsx or .xls)");
// 				return;
// 			}

// 			const success = await parseExcelForEditing(file);

// 			if (!success) {
// 				e.target.value = "";
// 			}
// 		}
// 	};

// 	// Save and continue - STRICT validation
// 	const handleSaveAndContinue = async () => {
// 		const validation = validateDataStrict();

// 		if (!validation.isValid) {
// 			Swal.fire({
// 				icon: "error",
// 				title: "Validation Errors",
// 				html: `
// 					<div style="text-align: left; max-height: 300px; overflow-y: auto;">
// 						<p>Please fix the following issues:</p>
// 						<ul style="color: #ef4444; margin: 16px 0; padding-left: 20px;">
// 							${validation.errors.map((error) => `<li>• ${error}</li>`).join("")}
// 						</ul>
// 					</div>
// 				`,
// 				confirmButtonText: "OK",
// 				confirmButtonColor: "#ef4444",
// 			});
// 			return;
// 		}

// 		try {
// 			const newFile = await saveEditedExcel();
// 			setFormData({ ...formData, excelFile: newFile });

// 			setShowEditor(false);
// 			setShowBottomBar(false);
// 			toast.success("File saved successfully!");
// 		} catch (error) {
// 			toast.error("Error saving file");
// 		}
// 	};

// 	// Continue without fixing missing values - LENIENT validation
// 	const handleContinueAnyway = async () => {
// 		const validation = validateDataLenient();

// 		if (!validation.isValid) {
// 			Swal.fire({
// 				icon: "error",
// 				title: "Validation Errors",
// 				html: `
// 					<div style="text-align: left; max-height: 300px; overflow-y: auto;">
// 						<p>Please fix the following critical issues:</p>
// 						<ul style="color: #ef4444; margin: 16px 0; padding-left: 20px;">
// 							${validation.errors.map((error) => `<li>• ${error}</li>`).join("")}
// 						</ul>
// 						<p style="margin-top: 16px; color: #6b7280;">
// 							Note: Missing values in rows will be accepted, but column structure and data format must be valid.
// 						</p>
// 					</div>
// 				`,
// 				confirmButtonText: "OK",
// 				confirmButtonColor: "#ef4444",
// 			});
// 			return;
// 		}

// 		try {
// 			const newFile = await saveEditedExcel();
// 			setFormData({ ...formData, excelFile: newFile });
// 			setShowEditor(false);
// 			setShowBottomBar(false);
// 			toast.success(
// 				"File saved successfully! Some rows may have missing data."
// 			);
// 		} catch (error) {
// 			toast.error("Error saving file");
// 		}
// 	};

// 	// Bottom Bar Component for Missing Values Warning
// 	const BottomWarningBar = () => (
// 		<div className="fixed bottom-0 left-0 right-0 bg-orange-50 border-t border-orange-200 p-4 shadow-lg z-50">
// 			<div className="max-w-7xl mx-auto">
// 				<div className="flex items-center justify-between">
// 					<div className="flex items-center gap-3">
// 						<AlertCircle className="w-6 h-6 text-orange-600" />
// 						<div>
// 							<h4 className="font-semibold text-orange-900">
// 								Missing Values Detected
// 							</h4>
// 							<p className="text-sm text-orange-700">
// 								Found {missingCells.length} missing values in important columns.
// 								Some data may be incomplete.
// 							</p>
// 						</div>
// 					</div>
// 					<div className="flex gap-3">
// 						<Button
// 							onClick={autoFillMissingValues}
// 							variant="outline"
// 							className="text-orange-600 border-orange-300 hover:bg-orange-100">
// 							<AlertTriangle className="w-4 h-4 mr-2" />
// 							Auto-fill with N/A
// 						</Button>
// 						<Button
// 							onClick={handleContinueAnyway}
// 							className="bg-orange-600 hover:bg-orange-700">
// 							Continue Anyway
// 						</Button>
// 						<Button
// 							onClick={handleSaveAndContinue}
// 							className="bg-green-600 hover:bg-green-700">
// 							<Save className="w-4 h-4 mr-2" />
// 							Save & Continue
// 						</Button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);

// 	// Inline Excel Editor Component
// 	const ExcelEditor = () => (
// 		<div className="space-y-4">
// 			<div className="flex justify-between items-center">
// 				<h3 className="text-lg font-semibold">Excel File Editor</h3>
// 				<div className="flex gap-2">
// 					{hasMissingValues && (
// 						<Button
// 							onClick={autoFillMissingValues}
// 							variant="outline"
// 							size="sm"
// 							className="text-orange-600 border-orange-200 hover:bg-orange-50">
// 							<AlertTriangle className="w-4 h-4 mr-1" />
// 							Fill Missing with N/A
// 						</Button>
// 					)}
// 					<Button onClick={addNewColumn} variant="outline" size="sm">
// 						<Plus className="w-4 h-4 mr-1" />
// 						Add Column
// 					</Button>
// 					<Button onClick={addNewRow} variant="outline" size="sm">
// 						<Plus className="w-4 h-4 mr-1" />
// 						Add Row
// 					</Button>
// 					<Button
// 						onClick={handleSaveAndContinue}
// 						className="bg-green-600 hover:bg-green-700">
// 						<Save className="w-4 h-4 mr-1" />
// 						Save & Continue
// 					</Button>
// 				</div>
// 			</div>

// 			{/* Missing Values Warning */}
// 			{hasMissingValues && (
// 				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
// 					<div className="flex items-center gap-3">
// 						<AlertTriangle className="w-5 h-5 text-orange-600" />
// 						<div>
// 							<p className="font-medium text-orange-900">
// 								Missing Values Detected
// 							</p>
// 							<p className="text-sm text-orange-700">
// 								Some important columns have empty cells. You can edit them
// 								manually or use the "Fill Missing with N/A" button.
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{/* Excel-like Table */}
// 			<div className="border rounded-lg overflow-hidden">
// 				<div className="overflow-x-auto max-h-96">
// 					<table className="w-full text-sm">
// 						<thead className="bg-gray-50 sticky top-0">
// 							<tr>
// 								<th className="p-2 border-r bg-gray-100 sticky left-0 z-10 min-w-12">
// 									#
// 								</th>
// 								{headers.map((header, index) => (
// 									<th
// 										key={index}
// 										className="p-2 border-r font-semibold text-left min-w-40 group relative">
// 										<div className="flex items-center justify-between">
// 											<button
// 												onClick={() => editColumnName(header)}
// 												className={`text-left flex-1 hover:bg-gray-200 px-1 py-1 rounded ${
// 													REQUIRED_COLUMNS.includes(header)
// 														? "text-red-600"
// 														: COLOR_COLUMN_PATTERN.test(header)
// 														? "text-blue-600"
// 														: ""
// 												}`}
// 												title="Click to edit column name">
// 												{header}
// 												{REQUIRED_COLUMNS.includes(header) && " *"}
// 											</button>
// 											{!REQUIRED_COLUMNS.includes(header) && (
// 												<button
// 													onClick={() => deleteColumn(header)}
// 													className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-2"
// 													title="Delete column">
// 													<X className="w-3 h-3" />
// 												</button>
// 											)}
// 										</div>
// 									</th>
// 								))}
// 								<th className="p-2 bg-gray-100 sticky right-0 z-10 min-w-16">
// 									Actions
// 								</th>
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{excelData.map((row, rowIndex) => (
// 								<tr key={row.id} className="hover:bg-gray-50">
// 									<td className="p-2 border-r bg-gray-50 sticky left-0 z-10 text-center">
// 										{rowIndex + 1}
// 									</td>
// 									{headers.map((header, colIndex) => {
// 										const value = row[header] || "";
// 										const isEmpty = !value || value.toString().trim() === "";
// 										const isImportantColumn =
// 											REQUIRED_COLUMNS.includes(header) ||
// 											COLOR_COLUMN_PATTERN.test(header);

// 										return (
// 											<td
// 												key={colIndex}
// 												className="p-0 border-r relative"
// 												onClick={() =>
// 													handleCellFocus(rowIndex, header, value)
// 												}>
// 												{editingCell?.row === rowIndex &&
// 												editingCell?.column === header ? (
// 													<input
// 														ref={inputRef}
// 														type="text"
// 														value={value}
// 														onChange={(e) =>
// 															handleCellEdit(rowIndex, header, e.target.value)
// 														}
// 														onBlur={() => setEditingCell(null)}
// 														onKeyDown={(e) => {
// 															if (e.key === "Enter") {
// 																setEditingCell(null);
// 															}
// 														}}
// 														className="w-full p-2 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
// 														placeholder={`Enter ${header}`}
// 														autoFocus
// 													/>
// 												) : (
// 													<div
// 														className={`p-2 cursor-pointer hover:bg-blue-50 min-h-10 flex items-center ${
// 															isEmpty && isImportantColumn
// 																? "bg-red-50 border-l-4 border-l-red-400"
// 																: ""
// 														}`}>
// 														{value || (
// 															<span className="text-gray-400 italic">
// 																Click to edit
// 															</span>
// 														)}
// 														{isEmpty && isImportantColumn && (
// 															<AlertTriangle className="w-3 h-3 text-red-500 ml-1" />
// 														)}
// 													</div>
// 												)}
// 											</td>
// 										);
// 									})}
// 									<td className="p-2 bg-gray-50 sticky right-0 z-10">
// 										<Button
// 											variant="ghost"
// 											size="sm"
// 											onClick={() => deleteRow(rowIndex)}
// 											className="text-red-600 hover:text-red-800 hover:bg-red-50">
// 											<Trash2 className="w-4 h-4" />
// 										</Button>
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</table>
// 				</div>
// 			</div>

// 			{/* Legend */}
// 			<div className="flex flex-wrap gap-4 text-xs text-gray-600">
// 				<div className="flex items-center gap-1">
// 					<span className="text-red-600">*</span>
// 					<span>Required column</span>
// 				</div>
// 				<div className="flex items-center gap-1">
// 					<span className="text-blue-600">Color</span>
// 					<span>Color column</span>
// 				</div>
// 				<div className="flex items-center gap-1">
// 					<div className="w-3 h-3 bg-red-50 border-l-4 border-l-red-400"></div>
// 					<span>Missing value in important column</span>
// 				</div>
// 				<div className="flex items-center gap-1">
// 					<X className="w-3 h-3 text-red-500" />
// 					<span>Delete optional column</span>
// 				</div>
// 			</div>
// 		</div>
// 	);

// 	if (showEditor) {
// 		return (
// 			<>
// 				<div className="space-y-6 pb-24">
// 					{" "}
// 					{/* Added padding bottom for bottom bar */}
// 					<ExcelEditor />
// 					<div className="flex justify-between pt-4">
// 						<Button variant="outline" onClick={() => setShowEditor(false)}>
// 							<ChevronLeft className="w-4 h-4 mr-2" />
// 							Back to Upload
// 						</Button>
// 						<Button
// 							onClick={handleSaveAndContinue}
// 							className="px-6 bg-green-600 hover:bg-green-700">
// 							<Save className="w-4 h-4 mr-2" />
// 							Save & Continue
// 						</Button>
// 					</div>
// 				</div>

// 				{/* Bottom Warning Bar */}
// 				{showBottomBar && <BottomWarningBar />}
// 			</>
// 		);
// 	}

// 	return (
// 		<div className="space-y-6">
// 			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
// 				<div className="flex items-start gap-3">
// 					<FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
// 					<div>
// 						<h4 className="font-semibold text-blue-900">
// 							Upload & Edit Excel File
// 						</h4>
// 						<p className="text-sm text-blue-700 mt-1">
// 							Upload your Excel file. We'll check for missing values and let you
// 							edit before uploading.
// 						</p>
// 					</div>
// 				</div>
// 			</div>

// 			<div className="space-y-4">
// 				<div>
// 					<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
// 						<FileSpreadsheet className="w-4 h-4" />
// 						Select Excel File
// 					</label>
// 					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors relative">
// 						<FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
// 						<Input
// 							type="file"
// 							accept=".xlsx,.xls"
// 							onChange={handleExcelChange}
// 							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// 						/>
// 						<div>
// 							<p className="text-sm font-medium text-gray-700">
// 								Drop your Excel file here or click to browse
// 							</p>
// 							<p className="text-xs text-gray-500 mt-1">
// 								Supported formats: .xlsx, .xls • We'll check for missing values
// 								automatically
// 							</p>
// 						</div>
// 					</div>
// 				</div>

// 				{formData.excelFile && !showEditor && (
// 					<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
// 						<div className="flex items-center justify-between">
// 							<div className="flex items-center gap-3">
// 								<CheckCircle className="w-5 h-5 text-green-600" />
// 								<div>
// 									<p className="font-medium text-green-900">
// 										{formData.excelFile.name}
// 									</p>
// 									<p className="text-sm text-green-700">Ready for upload</p>
// 								</div>
// 							</div>
// 							<Button
// 								variant="outline"
// 								onClick={() => parseExcelForEditing(formData.excelFile!)}
// 								className="text-blue-600 border-blue-200">
// 								<Edit className="w-4 h-4 mr-2" />
// 								Edit File
// 							</Button>
// 						</div>
// 					</div>
// 				)}
// 			</div>

// 			<div className="flex justify-between pt-4">
// 				<Button variant="outline" onClick={() => setStep(1)}>
// 					<ChevronLeft className="w-4 h-4 mr-2" />
// 					Back
// 				</Button>
// 				<Button
// 					onClick={() => setStep(3)}
// 					disabled={!formData.excelFile}
// 					className="px-6">
// 					Continue <ChevronRight className="w-4 h-4 ml-2" />
// 				</Button>
// 			</div>
// 		</div>
// 	);
// };

// export default ExcelStep;
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadStepProps } from "@/types/upload";
import {
	FileSpreadsheet,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Edit,
	Save,
	Plus,
	Trash2,
	X,
	AlertTriangle,
	AlertCircle,
	Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const ExcelStep: React.FC<UploadStepProps> = ({
	formData,
	setFormData,
	setStep,
}) => {
	const [excelData, setExcelData] = useState<any[]>([]);
	const [headers, setHeaders] = useState<string[]>([]);
	const [showEditor, setShowEditor] = useState(false);
	const [editingFile, setEditingFile] = useState<File | null>(null);
	const [editingCell, setEditingCell] = useState<{
		row: number;
		column: string;
	} | null>(null);
	const [hasMissingValues, setHasMissingValues] = useState(false);
	const [hasDuplicates, setHasDuplicates] = useState(false);
	const [missingCells, setMissingCells] = useState<
		Array<{ row: number; column: string; value: string }>
	>([]);
	const [duplicateRows, setDuplicateRows] = useState<number[]>([]);
	const [showBottomBar, setShowBottomBar] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Required columns
	const REQUIRED_COLUMNS = ["Style", "Price", "Size Range"];
	const COLOR_COLUMN_PATTERN = /color|colour|shade|hue/i;

	// Check for duplicate rows based on Style column only
	const checkDuplicates = (data: any[]): number[] => {
		const duplicates: number[] = [];
		const seen = new Map<string, number>(); // Map to track unique Style values

		data.forEach((row, index) => {
			// Use only the Style column for duplicate detection
			const styleValue = row["Style"]?.toString().toLowerCase().trim() || "";

			if (styleValue && seen.has(styleValue)) {
				duplicates.push(index);
				// Also mark the original duplicate row if not already marked
				const originalIndex = seen.get(styleValue)!;
				if (!duplicates.includes(originalIndex)) {
					duplicates.push(originalIndex);
				}
			} else if (styleValue) {
				seen.set(styleValue, index);
			}
		});

		return duplicates;
	};

	// Check for missing values in important columns
	const checkMissingValues = (
		data: any[]
	): {
		hasMissing: boolean;
		missingCells: Array<{ row: number; column: string; value: string }>;
	} => {
		const missingCells: Array<{ row: number; column: string; value: string }> =
			[];
		let hasMissing = false;

		data.forEach((row, rowIndex) => {
			headers.forEach((header) => {
				const value = row[header];
				// Check if value is empty, null, undefined, or just whitespace
				if (!value || value.toString().trim() === "") {
					// Only flag important columns (required columns and color columns)
					if (
						REQUIRED_COLUMNS.includes(header) ||
						COLOR_COLUMN_PATTERN.test(header)
					) {
						missingCells.push({
							row: rowIndex + 1, // +1 because we skip header row in display
							column: header,
							value: value || "empty",
						});
						hasMissing = true;
					}
				}
			});
		});

		return { hasMissing, missingCells };
	};

	// Update missing values and duplicates check whenever data changes
	useEffect(() => {
		if (excelData.length > 0 && headers.length > 0) {
			const { hasMissing, missingCells } = checkMissingValues(excelData);
			const duplicates = checkDuplicates(excelData);

			setHasMissingValues(hasMissing);
			setHasDuplicates(duplicates.length > 0);
			setMissingCells(missingCells);
			setDuplicateRows(duplicates);
			setShowBottomBar(hasMissing || duplicates.length > 0);
		}
	}, [excelData, headers]);

	// Auto-fill missing values with "N/A"
	const autoFillMissingValues = () => {
		const newData = excelData.map((row) => {
			const newRow = { ...row };
			headers.forEach((header) => {
				// Check if value is missing and it's an important column
				if (
					(!newRow[header] || newRow[header].toString().trim() === "") &&
					(REQUIRED_COLUMNS.includes(header) ||
						COLOR_COLUMN_PATTERN.test(header))
				) {
					newRow[header] = "N/A";
				}
			});
			return newRow;
		});
		setExcelData(newData);
		setHasMissingValues(false);
		// Re-check duplicates after auto-fill
		const newDuplicates = checkDuplicates(newData);
		setHasDuplicates(newDuplicates.length > 0);
		setDuplicateRows(newDuplicates);
		setShowBottomBar(newDuplicates.length > 0);
		toast.success("Missing values filled with 'N/A'");
	};

	// Remove all duplicate rows
	const removeAllDuplicates = () => {
		Swal.fire({
			title: "Remove All Duplicates?",
			text: `This will remove ${duplicateRows.length} duplicate rows based on Style values. This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Remove All Duplicates",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				const newData = excelData.filter(
					(_, index) => !duplicateRows.includes(index)
				);
				setExcelData(newData);
				setHasDuplicates(false);
				setDuplicateRows([]);
				setShowBottomBar(hasMissingValues); // Only show bottom bar if there are still missing values
				toast.success(`Removed ${duplicateRows.length} duplicate rows`);
			}
		});
	};

	// Remove specific duplicate row
	const removeDuplicateRow = (rowIndex: number) => {
		const styleValue = excelData[rowIndex]?.["Style"] || "this row";

		Swal.fire({
			title: "Remove Duplicate Row?",
			text: `This will remove the row with Style: "${styleValue}". This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Remove Row",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				const newData = excelData.filter((_, index) => index !== rowIndex);
				setExcelData(newData);
				// Re-check duplicates after removal
				const newDuplicates = checkDuplicates(newData);
				setHasDuplicates(newDuplicates.length > 0);
				setDuplicateRows(newDuplicates);
				setShowBottomBar(hasMissingValues || newDuplicates.length > 0);
				toast.success("Duplicate row removed");
			}
		});
	};

	// Show missing values and duplicates alert and ask user what to do
	const showValidationAlert = (
		missingCells: Array<{ row: number; column: string; value: string }>,
		duplicateRows: number[]
	) => {
		const missingCount = missingCells.length;
		const duplicateCount = duplicateRows.length;

		let alertHtml = `
			<div style="text-align: left;">
			<p>Found the following issues in your data:</p>
			<div style="max-height: 200px; overflow-y: auto; margin: 16px 0; background: #f8f9fa; padding: 12px; border-radius: 8px;">
		`;

		if (missingCount > 0) {
			alertHtml += `
				<div style="margin-bottom: 12px;">
					<strong style="color: #f59e0b;">Missing Values (${missingCount}):</strong>
					${missingCells
						.slice(0, 5)
						.map(
							(cell) =>
								`<div style="font-size: 13px; margin-bottom: 4px;">
							• Row ${cell.row}, Column "<strong>${cell.column}</strong>": <span style="color: #ef4444;">Empty</span>
						</div>`
						)
						.join("")}
					${
						missingCount > 5
							? `<div style="font-size: 13px; color: #6b7280;">... and ${
									missingCount - 5
							  } more</div>`
							: ""
					}
				</div>
			`;
		}

		if (duplicateCount > 0) {
			// Get unique duplicate style values for display
			const duplicateStyles = [
				...new Set(
					duplicateRows.map(
						(index) => excelData[index]?.["Style"] || "Unknown Style"
					)
				),
			].slice(0, 5);

			alertHtml += `
				<div>
					<strong style="color: #ef4444;">Duplicate Styles (${duplicateCount} rows):</strong>
					<div style="font-size: 13px; margin-top: 4px;">
						Found ${duplicateCount} rows with duplicate Style values:
						${duplicateStyles
							.map(
								(style) =>
									`<div style="font-size: 13px; margin-bottom: 2px;">
									• Style: "<strong>${style}</strong>"
								</div>`
							)
							.join("")}
						${
							duplicateStyles.length > 5
								? `<div style="font-size: 13px; color: #6b7280;">... and more</div>`
								: ""
						}
					</div>
				</div>
			`;
		}

		alertHtml += `
			</div>
			<p>How would you like to proceed?</p>
			</div>
		`;

		Swal.fire({
			icon: "warning",
			title: "Data Issues Found",
			html: alertHtml,
			showCancelButton: true,
			showDenyButton: true,
			confirmButtonText: "Edit in Table",
			denyButtonText:
				missingCount > 0 ? "Auto-fill Missing & Continue" : "Continue Anyway",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#3b82f6",
			denyButtonColor: "#10b981",
			cancelButtonColor: "#6b7280",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				// User wants to edit manually - just continue to editor
				setHasMissingValues(missingCount > 0);
				setHasDuplicates(duplicateCount > 0);
				setShowEditor(true);
			} else if (result.isDenied) {
				// User wants to auto-fill with N/A or continue with duplicates
				if (missingCount > 0) {
					autoFillMissingValues();
				}
				setShowEditor(true);
			} else {
				// User cancelled - reset file selection
				setEditingFile(null);
				setShowEditor(false);
				if (inputRef.current) {
					inputRef.current.value = "";
				}
			}
		});
	};

	// Parse Excel file and prepare for editing
	const parseExcelForEditing = async (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const data = new Uint8Array(e.target?.result as ArrayBuffer);
					const workbook = XLSX.read(data, { type: "array" });
					const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
					const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

					if (jsonData.length === 0) {
						toast.error("Excel file is empty");
						resolve(false);
						return;
					}

					const fileHeaders = (jsonData[0] as string[]).map((header, index) =>
						header ? header.toString().trim() : `Column ${index + 1}`
					);

					// Convert data for editing (skip header row)
					const rows = jsonData.slice(1).map((row: any, index) => {
						const rowData: any = { id: index + 1 };
						fileHeaders.forEach((header, colIndex) => {
							rowData[header] = row[colIndex] || "";
						});
						return rowData;
					});

					setHeaders(fileHeaders);
					setExcelData(rows);
					setEditingFile(file);

					// Check for missing values and duplicates
					const { hasMissing, missingCells } = checkMissingValues(rows);
					const duplicates = checkDuplicates(rows);

					setHasMissingValues(hasMissing);
					setHasDuplicates(duplicates.length > 0);
					setMissingCells(missingCells);
					setDuplicateRows(duplicates);

					if (hasMissing || duplicates.length > 0) {
						// Show alert about validation issues
						showValidationAlert(missingCells, duplicates);
					} else {
						// No issues, proceed directly to editor
						setShowEditor(true);
					}

					resolve(true);
				} catch (error) {
					console.error("Error parsing Excel file:", error);
					toast.error("Error reading Excel file");
					resolve(false);
				}
			};
			reader.readAsArrayBuffer(file);
		});
	};

	// Validate data before saving - STRICT validation
	const validateDataStrict = (): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];

		// Check required columns
		const missingColumns = REQUIRED_COLUMNS.filter(
			(col) => !headers.includes(col)
		);
		if (missingColumns.length > 0) {
			errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
		}

		// Check color columns
		const colorColumns = headers.filter((header) =>
			COLOR_COLUMN_PATTERN.test(header)
		);
		if (colorColumns.length === 0) {
			errors.push(
				"No color columns found. Add columns with names like 'Color', 'Colour', etc."
			);
		}

		// Check data in rows - STRICT: all required columns must have values
		excelData.forEach((row, index) => {
			REQUIRED_COLUMNS.forEach((column) => {
				if (
					headers.includes(column) &&
					(!row[column] || row[column].toString().trim() === "")
				) {
					errors.push(`Row ${index + 1}: ${column} is required`);
				}
			});

			// Validate price format if present
			if (
				headers.includes("Price") &&
				row.Price &&
				row.Price.toString().trim() !== ""
			) {
				const priceStr = row.Price.toString().replace(/[$,]/g, "");
				const price = Number(priceStr);
				if (isNaN(price) || price <= 0) {
					errors.push(`Row ${index + 1}: Price must be a positive number`);
				}
			}
		});

		// Check for duplicates based on Style only
		const duplicates = checkDuplicates(excelData);
		if (duplicates.length > 0) {
			errors.push(
				`Found ${duplicates.length} duplicate rows with the same Style values`
			);
		}

		return { isValid: errors.length === 0, errors };
	};

	// Validate data before saving - LENIENT validation (for Continue Anyway)
	const validateDataLenient = (): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];

		// Check required columns
		const missingColumns = REQUIRED_COLUMNS.filter(
			(col) => !headers.includes(col)
		);
		if (missingColumns.length > 0) {
			errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
		}

		// Check color columns
		const colorColumns = headers.filter((header) =>
			COLOR_COLUMN_PATTERN.test(header)
		);
		if (colorColumns.length === 0) {
			errors.push(
				"No color columns found. Add columns with names like 'Color', 'Colour', etc."
			);
		}

		// Check data in rows - LENIENT: only validate format, not presence
		excelData.forEach((row, index) => {
			// Validate price format only if present and not empty
			if (
				headers.includes("Price") &&
				row.Price &&
				row.Price.toString().trim() !== ""
			) {
				const priceStr = row.Price.toString().replace(/[$,]/g, "");
				const price = Number(priceStr);
				if (isNaN(price) || price <= 0) {
					errors.push(`Row ${index + 1}: Price must be a positive number`);
				}
			}
		});

		return { isValid: errors.length === 0, errors };
	};

	// Save edited data back to Excel file
	const saveEditedExcel = async (): Promise<File> => {
		// Convert data back to sheet format
		const sheetData = [headers]; // Headers row
		excelData.forEach((row) => {
			const rowData = headers.map((header) => row[header] || "");
			sheetData.push(rowData);
		});

		const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

		// Generate Excel file
		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const blob = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});

		return new File([blob], editingFile?.name || `edited_${Date.now()}.xlsx`, {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
	};

	// Handle cell editing
	const handleCellEdit = (rowIndex: number, column: string, value: string) => {
		const newData = [...excelData];
		newData[rowIndex] = {
			...newData[rowIndex],
			[column]: value,
		};
		setExcelData(newData);
	};

	// Handle cell focus for better editing experience
	const handleCellFocus = (rowIndex: number, column: string, value: string) => {
		setEditingCell({ row: rowIndex, column });
		// Use setTimeout to ensure the input is focused after state update
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
				// Select all text when focusing for easier editing
				inputRef.current.select();
			}
		}, 0);
	};

	// Add new row
	const addNewRow = () => {
		const newRow: any = { id: excelData.length + 1 };
		headers.forEach((header) => {
			newRow[header] = "";
		});
		setExcelData([...excelData, newRow]);
	};

	// Delete row
	const deleteRow = (rowIndex: number) => {
		const newData = excelData.filter((_, index) => index !== rowIndex);
		setExcelData(newData);
	};

	// Add new column
	const addNewColumn = () => {
		const columnName = prompt("Enter column name:");
		if (columnName && columnName.trim() && !headers.includes(columnName)) {
			setHeaders([...headers, columnName]);
			// Add empty values for new column in all rows
			const newData = excelData.map((row) => ({
				...row,
				[columnName]: "",
			}));
			setExcelData(newData);
		} else if (columnName && headers.includes(columnName)) {
			toast.error("Column name already exists");
		}
	};

	// Edit column name
	const editColumnName = (oldName: string) => {
		const newName = prompt("Enter new column name:", oldName);
		if (newName && newName.trim() && newName !== oldName) {
			if (headers.includes(newName)) {
				toast.error("Column name already exists");
				return;
			}

			const newHeaders = headers.map((header) =>
				header === oldName ? newName : header
			);
			const newData = excelData.map((row) => {
				const newRow = { ...row };
				newRow[newName] = newRow[oldName];
				delete newRow[oldName];
				return newRow;
			});

			setHeaders(newHeaders);
			setExcelData(newData);
			toast.success(`Column renamed to "${newName}"`);
		}
	};

	// Delete column
	const deleteColumn = (columnName: string) => {
		if (REQUIRED_COLUMNS.includes(columnName)) {
			toast.error(`Cannot delete required column: ${columnName}`);
			return;
		}

		Swal.fire({
			title: "Delete Column?",
			text: `Are you sure you want to delete column "${columnName}"?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				const newHeaders = headers.filter((header) => header !== columnName);
				const newData = excelData.map((row) => {
					const newRow = { ...row };
					delete newRow[columnName];
					return newRow;
				});

				setHeaders(newHeaders);
				setExcelData(newData);
				toast.success(`Column "${columnName}" deleted`);
			}
		});
	};

	// Handle file upload with validation
	const handleExcelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const fileExtension = file.name.split(".").pop()?.toLowerCase();
			if (!["xlsx", "xls"].includes(fileExtension || "")) {
				toast.error("Please select a valid Excel file (.xlsx or .xls)");
				return;
			}

			const success = await parseExcelForEditing(file);

			if (!success) {
				e.target.value = "";
			}
		}
	};

	// Save and continue - STRICT validation
	const handleSaveAndContinue = async () => {
		const validation = validateDataStrict();

		if (!validation.isValid) {
			Swal.fire({
				icon: "error",
				title: "Validation Errors",
				html: `
					<div style="text-align: left; max-height: 300px; overflow-y: auto;">
						<p>Please fix the following issues:</p>
						<ul style="color: #ef4444; margin: 16px 0; padding-left: 20px;">
							${validation.errors.map((error) => `<li>• ${error}</li>`).join("")}
						</ul>
					</div>
				`,
				confirmButtonText: "OK",
				confirmButtonColor: "#ef4444",
			});
			return;
		}

		try {
			const newFile = await saveEditedExcel();
			setFormData({ ...formData, excelFile: newFile });
			setShowEditor(false);
			setShowBottomBar(false);
			toast.success("File saved successfully!");
		} catch (error) {
			toast.error("Error saving file");
		}
	};

	// Continue without fixing missing values and duplicates - LENIENT validation
	const handleContinueAnyway = async () => {
		const validation = validateDataLenient();

		if (!validation.isValid) {
			Swal.fire({
				icon: "error",
				title: "Validation Errors",
				html: `
					<div style="text-align: left; max-height: 300px; overflow-y: auto;">
						<p>Please fix the following critical issues:</p>
						<ul style="color: #ef4444; margin: 16px 0; padding-left: 20px;">
							${validation.errors.map((error) => `<li>• ${error}</li>`).join("")}
						</ul>
						<p style="margin-top: 16px; color: #6b7280;">
							Note: Missing values and duplicate Styles will be accepted, but column structure and data format must be valid.
						</p>
					</div>
				`,
				confirmButtonText: "OK",
				confirmButtonColor: "#ef4444",
			});
			return;
		}

		try {
			const newFile = await saveEditedExcel();
			setFormData({ ...formData, excelFile: newFile });
			setShowEditor(false);
			setShowBottomBar(false);
			toast.success(
				"File saved successfully! Some rows may have missing data or duplicate Styles."
			);
		} catch (error) {
			toast.error("Error saving file");
		}
	};

	// Bottom Bar Component for Missing Values and Duplicates Warning
	const BottomWarningBar = () => (
		<div className="fixed bottom-0 left-0 right-0 bg-orange-50 border-t border-orange-200 p-4 shadow-lg z-50">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<AlertCircle className="w-6 h-6 text-orange-600" />
						<div>
							<h4 className="font-semibold text-orange-900">
								Data Issues Detected
							</h4>
							<p className="text-sm text-orange-700">
								{hasMissingValues && hasDuplicates
									? `Found ${missingCells.length} missing values and ${duplicateRows.length} duplicate Style rows.`
									: hasMissingValues
									? `Found ${missingCells.length} missing values in important columns.`
									: `Found ${duplicateRows.length} rows with duplicate Style values.`}
							</p>
						</div>
					</div>
					<div className="flex gap-3">
						{hasMissingValues && (
							<Button
								onClick={autoFillMissingValues}
								variant="outline"
								className="text-orange-600 border-orange-300 hover:bg-orange-100">
								<AlertTriangle className="w-4 h-4 mr-2" />
								Auto-fill Missing
							</Button>
						)}
						{hasDuplicates && (
							<Button
								onClick={removeAllDuplicates}
								variant="outline"
								className="text-red-600 border-red-300 hover:bg-red-100">
								<Trash2 className="w-4 h-4 mr-2" />
								Remove All Duplicates
							</Button>
						)}
						<Button
							onClick={handleContinueAnyway}
							className="bg-orange-600 hover:bg-orange-700">
							Continue Anyway
						</Button>
						<Button
							onClick={handleSaveAndContinue}
							className="bg-green-600 hover:bg-green-700">
							<Save className="w-4 h-4 mr-2" />
							Save & Continue
						</Button>
					</div>
				</div>
			</div>
		</div>
	);

	// Inline Excel Editor Component
	const ExcelEditor = () => (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Excel File Editor</h3>
				<div className="flex gap-2">
					{hasMissingValues && (
						<Button
							onClick={autoFillMissingValues}
							variant="outline"
							size="sm"
							className="text-orange-600 border-orange-200 hover:bg-orange-50">
							<AlertTriangle className="w-4 h-4 mr-1" />
							Fill Missing with N/A
						</Button>
					)}
					{hasDuplicates && (
						<Button
							onClick={removeAllDuplicates}
							variant="outline"
							size="sm"
							className="text-red-600 border-red-200 hover:bg-red-50">
							<Trash2 className="w-4 h-4 mr-1" />
							Remove All Duplicates
						</Button>
					)}
					<Button onClick={addNewColumn} variant="outline" size="sm">
						<Plus className="w-4 h-4 mr-1" />
						Add Column
					</Button>
					<Button onClick={addNewRow} variant="outline" size="sm">
						<Plus className="w-4 h-4 mr-1" />
						Add Row
					</Button>
					<Button
						onClick={handleSaveAndContinue}
						className="bg-green-600 hover:bg-green-700">
						<Save className="w-4 h-4 mr-1" />
						Save & Continue
					</Button>
				</div>
			</div>

			{/* Validation Warnings */}
			{(hasMissingValues || hasDuplicates) && (
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
					<div className="flex items-center gap-3">
						<AlertTriangle className="w-5 h-5 text-orange-600" />
						<div>
							<p className="font-medium text-orange-900">
								Data Issues Detected
							</p>
							<p className="text-sm text-orange-700">
								{hasMissingValues && hasDuplicates
									? `Found ${missingCells.length} missing values and ${duplicateRows.length} rows with duplicate Style values. You can fix them manually or use the buttons above.`
									: hasMissingValues
									? `Found ${missingCells.length} missing values in important columns. You can fill them with N/A or edit manually.`
									: `Found ${duplicateRows.length} rows with duplicate Style values. You can remove them or edit manually.`}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Excel-like Table */}
			<div className="border rounded-lg overflow-hidden">
				<div className="overflow-x-auto max-h-96">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 sticky top-0">
							<tr>
								<th className="p-2 border-r bg-gray-100 sticky left-0 z-10 min-w-12">
									#
								</th>
								{headers.map((header, index) => (
									<th
										key={index}
										className="p-2 border-r font-semibold text-left min-w-40 group relative">
										<div className="flex items-center justify-between">
											<button
												onClick={() => editColumnName(header)}
												className={`text-left flex-1 hover:bg-gray-200 px-1 py-1 rounded ${
													REQUIRED_COLUMNS.includes(header)
														? "text-red-600"
														: COLOR_COLUMN_PATTERN.test(header)
														? "text-blue-600"
														: ""
												}`}
												title="Click to edit column name">
												{header}
												{REQUIRED_COLUMNS.includes(header) && " *"}
											</button>
											{!REQUIRED_COLUMNS.includes(header) && (
												<button
													onClick={() => deleteColumn(header)}
													className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-2"
													title="Delete column">
													<X className="w-3 h-3" />
												</button>
											)}
										</div>
									</th>
								))}
								<th className="p-2 bg-gray-100 sticky right-0 z-10 min-w-16">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{excelData.map((row, rowIndex) => {
								const isDuplicate = duplicateRows.includes(rowIndex);
								const styleValue = row["Style"] || "";

								return (
									<tr
										key={row.id}
										className={`hover:bg-gray-50 ${
											isDuplicate ? "bg-red-50" : ""
										}`}>
										<td
											className={`p-2 border-r sticky left-0 z-10 text-center ${
												isDuplicate ? "bg-red-100" : "bg-gray-50"
											}`}>
											{rowIndex + 1}
											{isDuplicate && (
												<Copy className="w-3 h-3 text-red-500 inline ml-1" />
											)}
										</td>
										{headers.map((header, colIndex) => {
											const value = row[header] || "";
											const isEmpty = !value || value.toString().trim() === "";
											const isImportantColumn =
												REQUIRED_COLUMNS.includes(header) ||
												COLOR_COLUMN_PATTERN.test(header);

											return (
												<td
													key={colIndex}
													className="p-0 border-r relative"
													onClick={() =>
														handleCellFocus(rowIndex, header, value)
													}>
													{editingCell?.row === rowIndex &&
													editingCell?.column === header ? (
														<input
															ref={inputRef}
															type="text"
															value={value}
															onChange={(e) =>
																handleCellEdit(rowIndex, header, e.target.value)
															}
															onBlur={() => setEditingCell(null)}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	setEditingCell(null);
																}
															}}
															className="w-full p-2 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
															placeholder={`Enter ${header}`}
															autoFocus
														/>
													) : (
														<div
															className={`p-2 cursor-pointer hover:bg-blue-50 min-h-10 flex items-center ${
																isEmpty && isImportantColumn
																	? "bg-red-50 border-l-4 border-l-red-400"
																	: ""
															} ${
																isDuplicate ? "border-r-4 border-r-red-400" : ""
															}`}>
															{value || (
																<span className="text-gray-400 italic">
																	Click to edit
																</span>
															)}
															{isEmpty && isImportantColumn && (
																<AlertTriangle className="w-3 h-3 text-red-500 ml-1" />
															)}
															{isDuplicate && header === "Style" && (
																<span className="ml-2 text-xs text-red-500 font-medium">
																	(Duplicate)
																</span>
															)}
														</div>
													)}
												</td>
											);
										})}
										<td
											className={`p-2 sticky right-0 z-10 ${
												isDuplicate ? "bg-red-100" : "bg-gray-50"
											}`}>
											<div className="flex gap-1">
												{isDuplicate && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() => removeDuplicateRow(rowIndex)}
														className="text-red-600 hover:text-red-800 hover:bg-red-200"
														title={`Remove duplicate Style: ${styleValue}`}>
														<Trash2 className="w-4 h-4" />
													</Button>
												)}
												<Button
													variant="ghost"
													size="sm"
													onClick={() => deleteRow(rowIndex)}
													className="text-gray-600 hover:text-gray-800 hover:bg-gray-200">
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-4 text-xs text-gray-600">
				<div className="flex items-center gap-1">
					<span className="text-red-600">*</span>
					<span>Required column</span>
				</div>
				<div className="flex items-center gap-1">
					<span className="text-blue-600">Color</span>
					<span>Color column</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-red-50 border-l-4 border-l-red-400"></div>
					<span>Missing value in important column</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-red-50 border-2 border-red-400"></div>
					<span>Duplicate Style row</span>
				</div>
				<div className="flex items-center gap-1">
					<X className="w-3 h-3 text-red-500" />
					<span>Delete optional column</span>
				</div>
			</div>
		</div>
	);

	if (showEditor) {
		return (
			<>
				<div className="space-y-6 pb-24">
					{" "}
					{/* Added padding bottom for bottom bar */}
					<ExcelEditor />
					<div className="flex justify-between pt-4">
						<Button variant="outline" onClick={() => setShowEditor(false)}>
							<ChevronLeft className="w-4 h-4 mr-2" />
							Back to Upload
						</Button>
						<Button
							onClick={handleSaveAndContinue}
							className="px-6 bg-green-600 hover:bg-green-700">
							<Save className="w-4 h-4 mr-2" />
							Save & Continue
						</Button>
					</div>
				</div>

				{/* Bottom Warning Bar */}
				{showBottomBar && <BottomWarningBar />}
			</>
		);
	}

	return (
		<div className="space-y-6">
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
					<div>
						<h4 className="font-semibold text-blue-900">
							Upload & Edit Excel File
						</h4>
						<p className="text-sm text-blue-700 mt-1">
							Upload your Excel file. We'll check for missing values, duplicate
							Styles, and let you edit before uploading.
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div>
					<label className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
						<FileSpreadsheet className="w-4 h-4" />
						Select Excel File
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
								Supported formats: .xlsx, .xls • We'll check for missing values
								and duplicate Styles automatically
							</p>
						</div>
					</div>
				</div>

				{formData.excelFile && !showEditor && (
					<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<CheckCircle className="w-5 h-5 text-green-600" />
								<div>
									<p className="font-medium text-green-900">
										{formData.excelFile.name}
									</p>
									<p className="text-sm text-green-700">Ready for upload</p>
								</div>
							</div>
							<Button
								variant="outline"
								onClick={() => parseExcelForEditing(formData.excelFile!)}
								className="text-blue-600 border-blue-200">
								<Edit className="w-4 h-4 mr-2" />
								Edit File
							</Button>
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
};

export default ExcelStep;
