import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { Product, Release } from "@/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	Search,
	Trash2,
	CheckCircle,
	Edit,
	Download,
	Filter,
	Plus,
	CheckSquare,
	Square,
} from "lucide-react";

// Import modal components
import { EditProductModal } from "./modals/EditProductModal";
import { BulkEditModal } from "./modals/BulkEditModal";
import { DownloadModal } from "./modals/DownloadModal";
import { CreateProductModal } from "./modals/CreateProductModal";

const Products: React.FC = () => {
	const { brand } = useParams<{ brand: string }>();
	const selectedBrand =
		(brand || "Unknown").charAt(0).toUpperCase() +
		(brand || "").slice(1).toLowerCase();

	const [products, setProducts] = useState<Product[]>([]);
	const [allProducts, setAllProducts] = useState<Product[]>([]);
	const [releases, setReleases] = useState<Release[]>([]);
	const [loading, setLoading] = useState(true);

	// Filters without sorting
	const [filters, setFilters] = useState({
		year: "",
		versionName: "",
		category: "",
		style: "",
		page: 1,
		limit: 20,
	});

	const [pagination, setPagination] = useState({
		total: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	// Selection state
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [isAllSelected, setIsAllSelected] = useState(false);

	// Modal states
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
	const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Natural sort function for alphanumeric strings
	const naturalSort = (a: any, b: any, direction: "asc" | "desc" = "asc") => {
		if (a == null) return 1;
		if (b == null) return -1;

		const aString = String(a);
		const bString = String(b);

		// Natural sort for alphanumeric strings
		const comparison = aString.localeCompare(bString, undefined, {
			numeric: true,
			sensitivity: "base",
		});

		return comparison * (direction === "asc" ? 1 : -1);
	};

	// Sort products by style (B40350, B40351, etc.) automatically
	const sortProducts = (productsToSort: Product[]): Product[] => {
		return [...productsToSort].sort((a, b) => {
			return naturalSort(a.style, b.style, "asc");
		});
	};

	useEffect(() => {
		fetchReleases();
		fetchProducts();
	}, [selectedBrand, filters]);

	useEffect(() => {
		fetchAllProductsForFilters();
	}, [selectedBrand]);

	// Reset selection when products change
	useEffect(() => {
		setSelectedProducts([]);
		setIsAllSelected(false);
	}, [products]);

	const fetchReleases = async () => {
		try {
			const response = await api.get("/versions", {
				params: { brand: selectedBrand },
			});
			setReleases(response.data.data);
		} catch (error) {
			console.error("Failed to fetch releases:", error);
		}
	};

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const params: any = {
				brand: selectedBrand,
				...filters,
			};

			const response = await api.get("/products", { params });

			// Automatically sort products by style when fetched
			const sortedProducts = sortProducts(response.data.data.products);

			setProducts(sortedProducts);
			setPagination(response.data.data.pagination);
		} catch (error) {
			console.error("Failed to fetch products:", error);
			toast.error("Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	const fetchAllProductsForFilters = async () => {
		try {
			const response = await api.get("/products", {
				params: {
					brand: selectedBrand,
					limit: 1000,
				},
			});
			// Also sort the all products for consistency
			const sortedProducts = sortProducts(response.data.data.products);
			setAllProducts(sortedProducts);
		} catch (error) {
			console.error("Failed to fetch all products for filters:", error);
		}
	};

	// Fetch products for download (with specific filters)
	const fetchProductsForDownload = async (year: string, category: string) => {
		try {
			const params: any = {
				brand: selectedBrand,
				year: year,
				limit: 10000, // Get all products for the selected year
			};

			if (category) {
				params.category = category;
			}

			const response = await api.get("/products", { params });
			// Sort downloaded products as well
			return sortProducts(response.data.data.products);
		} catch (error) {
			console.error("Failed to fetch products for download:", error);
			throw error;
		}
	};

	// Selection handlers
	const handleSelectProduct = (productId: string) => {
		setSelectedProducts((prev) =>
			prev.includes(productId)
				? prev.filter((id) => id !== productId)
				: [...prev, productId]
		);
	};

	const handleSelectAll = () => {
		if (isAllSelected) {
			setSelectedProducts([]);
		} else {
			setSelectedProducts(products.map((product) => product._id));
		}
		setIsAllSelected(!isAllSelected);
	};

	// Excel download function for current view
	const downloadExcel = () => {
		// Create CSV content
		const headers = [
			"Style",
			"Division",
			"Year",
			"Version",
			"Price",
			"Colors",
			"Size",
			"Image URLs",
			"Availability",
			"Brand",
		];

		const data = products.map((product: Product) => [
			product.style,
			product.category || "",
			product.year,
			product.versionName,
			product.price,
			product.colors.join(", "),
			product.size,
			product.images
				.map((img: string) => `http://srv1051513.hstgr.cloud:3200/${img}`)
				.join(" | "),
			product.availability || "",
			product.brand,
		]);

		const csvContent = [
			headers.join(","),
			...data.map((row: any[]) =>
				row.map((field: any) => `"${field}"`).join(",")
			),
		].join("\n");

		// Create and download file
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`${selectedBrand}_products_${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Download by year and category
	const downloadByYearAndCategory = async (year: string, category: string) => {
		try {
			setLoading(true);
			toast.loading(
				`Fetching ${year}${category ? ` ${category}` : ""} products...`
			);

			const productsToDownload = await fetchProductsForDownload(year, category);

			if (productsToDownload.length === 0) {
				toast.dismiss();
				toast.error(
					`No products found for ${year}${category ? ` in ${category}` : ""}`
				);
				return;
			}

			// Create CSV content
			const headers = [
				"Style",
				"Division",
				"Year",
				"Version",
				"Price",
				"Colors",
				"Size",
				"Image URLs",
				"Availability",
				"Brand",
			];

			const data = productsToDownload.map((product: Product) => [
				product.style,
				product.category || "",
				product.year,
				product.versionName,
				product.price,
				product.colors.join(", "),
				product.size,
				product.images
					.map((img: string) => `http://srv1051513.hstgr.cloud:3200/${img}`)
					.join(" | "),
				product.availability || "",
				product.brand,
			]);

			const csvContent = [
				headers.join(","),
				...data.map((row: any[]) =>
					row.map((field: any) => `"${field}"`).join(",")
				),
			].join("\n");

			// Create and download file
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);

			const fileName = category
				? `${selectedBrand}_${year}_${category}_products_${
						new Date().toISOString().split("T")[0]
				  }.csv`
				: `${selectedBrand}_${year}_all_products_${
						new Date().toISOString().split("T")[0]
				  }.csv`;

			link.setAttribute("download", fileName);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.dismiss();
			toast.success(
				`Downloaded ${productsToDownload.length} products successfully!`
			);
		} catch (error) {
			console.error("Failed to download products:", error);
			toast.dismiss();
			toast.error("Failed to download products");
		} finally {
			setLoading(false);
		}
	};

	// Bulk operations
	const handleBulkDelete = async () => {
		if (selectedProducts.length === 0) {
			toast.error("Please select at least one product to delete");
			return;
		}

		const result = await Swal.fire({
			icon: "warning",
			title: "Delete Products",
			text: `Are you sure you want to delete ${selectedProducts.length} selected products?`,
			showCancelButton: true,
			confirmButtonText: `Yes, Delete ${selectedProducts.length} Products`,
			cancelButtonText: "Cancel",
			confirmButtonColor: "#ef4444",
		});

		if (result.isConfirmed) {
			try {
				const deletePromises = selectedProducts.map((productId) =>
					api.delete(`/products/${productId}`)
				);
				await Promise.all(deletePromises);

				toast.success(
					`Deleted ${selectedProducts.length} products successfully!`
				);
				setSelectedProducts([]);
				setIsAllSelected(false);
				fetchProducts();
				fetchAllProductsForFilters();
			} catch (error) {
				console.error("Failed to delete products:", error);
				toast.error("Failed to delete products");
			}
		}
	};

	const handleBulkEdit = () => {
		if (selectedProducts.length === 0) {
			toast.error("Please select at least one product to edit");
			return;
		}
		setIsBulkEditModalOpen(true);
	};

	const handleEditProduct = (product: Product) => {
		setEditingProduct(product);
		setIsEditModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
		setEditingProduct(null);
	};

	const handleCloseBulkEditModal = () => {
		setIsBulkEditModalOpen(false);
	};

	const handleCloseDownloadModal = () => {
		setIsDownloadModalOpen(false);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	const handleProductUpdate = () => {
		fetchProducts();
		fetchAllProductsForFilters();
		setSelectedProducts([]);
		setIsAllSelected(false);
	};

	const handlePublish = async (release: Release) => {
		const result = await Swal.fire({
			icon: "warning",
			title: "Publish Version",
			text: `This will publish "${release.year} ${release.versionName}" and unpublish any currently published version. Continue?`,
			showCancelButton: true,
			confirmButtonText: "Yes, Publish",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#10b981",
		});

		if (result.isConfirmed) {
			try {
				await api.post("/publish", {
					brand: release.brand,
					year: release.year,
					versionName: release.versionName,
				});
				toast.success("Version published successfully!");
				fetchReleases();
			} catch (error) {
				console.error("Failed to publish:", error);
				toast.error("Failed to publish version");
			}
		}
	};

	const handleDeleteVersion = async (release: Release) => {
		const result = await Swal.fire({
			icon: "warning",
			title: "Delete Version",
			text: `This will permanently delete "${release.year} ${
				release.versionName
			}" and all ${
				release.productCount || 0
			} products. This action cannot be undone!`,
			showCancelButton: true,
			confirmButtonText: "Yes, Delete",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#ef4444",
		});

		if (result.isConfirmed) {
			try {
				await api.delete(
					`/versions/${release.brand}/${release.year}/${release.versionName}`
				);
				toast.success("Version deleted successfully!");
				fetchReleases();
				fetchProducts();
				fetchAllProductsForFilters();
			} catch (error) {
				console.error("Failed to delete version:", error);
				toast.error("Failed to delete version");
			}
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		const result = await Swal.fire({
			icon: "warning",
			title: "Delete Product",
			text: "Are you sure you want to delete this product?",
			showCancelButton: true,
			confirmButtonText: "Yes, Delete",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#ef4444",
		});

		if (result.isConfirmed) {
			try {
				await api.delete(`/products/${productId}`);
				toast.success("Product deleted successfully!");
				fetchProducts();
				fetchAllProductsForFilters();
			} catch (error) {
				console.error("Failed to delete product:", error);
				toast.error("Failed to delete product");
			}
		}
	};

	const handleClearFilters = () => {
		setFilters({
			year: "",
			versionName: "",
			category: "",
			style: "",
			page: 1,
			limit: 20,
		});
	};

	const uniqueYears = [...new Set(releases.map((r) => r.year))].sort(
		(a, b) => b - a
	);
	const uniqueDivisions = [
		...new Set(allProducts.map((p) => p.category).filter(Boolean)),
	].filter((category): category is string => category !== undefined);
	const uniqueVersions = [...new Set(releases.map((r) => r.versionName))];

	const hasActiveFilters =
		filters.year || filters.versionName || filters.category || filters.style;

	const selectedProductsData = products.filter((product) =>
		selectedProducts.includes(product._id)
	);

	return (
		<div>
			<div className="mb-8">
				<h1 className="text-3xl font-bold">{selectedBrand} Products</h1>
				<p className="text-muted-foreground mt-2">
					Manage products and versions (Automatically sorted by Style)
				</p>
			</div>

			{/* Versions Management */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Versions</CardTitle>
				</CardHeader>
				<CardContent>
					{releases.length === 0 ? (
						<p className="text-center text-muted-foreground py-4">
							No versions found
						</p>
					) : (
						<div className="space-y-2">
							{releases.map((release) => (
								<div
									key={release._id}
									className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
									<div>
										<div className="font-medium">
											{release.brand} {release.category} {release.versionName}
										</div>
										<div className="text-sm text-muted-foreground">
											{pagination.total} products
										</div>
									</div>
									<div className="flex items-center gap-2">
										{release.isPublished ? (
											<Badge className="bg-green-600">Published</Badge>
										) : (
											<>
												<Button
													size="sm"
													onClick={() => handlePublish(release)}
													className="gap-1">
													<CheckCircle className="w-4 h-4" />
													Publish
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => handleDeleteVersion(release)}
													className="gap-1">
													<Trash2 className="w-4 h-4" />
													Delete
												</Button>
											</>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Bulk Actions Bar */}
			{selectedProducts.length > 0 && (
				<Card className="mb-6 bg-blue-50 border-blue-200">
					<CardContent className="py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Badge variant="secondary" className="text-sm">
									{selectedProducts.length} products selected
								</Badge>
								<div className="text-sm text-blue-700">
									Select actions to perform on all selected products
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={handleBulkEdit}
									className="gap-1">
									<Edit className="w-4 h-4" />
									Bulk Edit
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={handleBulkDelete}
									className="gap-1">
									<Trash2 className="w-4 h-4" />
									Delete Selected
								</Button>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										setSelectedProducts([]);
										setIsAllSelected(false);
									}}
									className="text-gray-600">
									Clear Selection
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Filters and Export */}
			<Card className="mb-6">
				<CardContent className="pt-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-semibold">Filters</h3>
						<div className="flex gap-2">
							{hasActiveFilters && (
								<Button
									variant="outline"
									size="sm"
									onClick={handleClearFilters}>
									Clear Filters
								</Button>
							)}
							<Button
								variant="default"
								size="sm"
								onClick={() => setIsCreateModalOpen(true)}
								className="gap-1">
								<Plus className="w-4 h-4" />
								Add Product
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsDownloadModalOpen(true)}
								className="gap-1">
								<Filter className="w-4 h-4" />
								Download by Year/Category
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={downloadExcel}
								className="gap-1">
								<Download className="w-4 h-4" />
								Export Current View
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Search Style
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search by style..."
									value={filters.style}
									onChange={(e) =>
										setFilters({ ...filters, style: e.target.value, page: 1 })
									}
									className="pl-9"
								/>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Year</label>
							<Select
								value={filters.year}
								onChange={(e) =>
									setFilters({
										...filters,
										year: e.target.value,
										versionName: "",
										page: 1,
									})
								}>
								<option value="">All Years</option>
								{uniqueYears.map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Version</label>
							<Select
								value={filters.versionName}
								onChange={(e) =>
									setFilters({
										...filters,
										versionName: e.target.value,
										page: 1,
									})
								}>
								<option value="">All Versions</option>
								{uniqueVersions.map((version) => (
									<option key={version} value={version}>
										{version}
									</option>
								))}
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Division</label>
							<Select
								value={filters.category}
								onChange={(e) =>
									setFilters({ ...filters, category: e.target.value, page: 1 })
								}>
								<option value="">All Divisions</option>
								{uniqueDivisions.map((division) => (
									<option key={division} value={division}>
										{division}
									</option>
								))}
							</Select>
						</div>
					</div>
					{hasActiveFilters && (
						<div className="mt-4 flex flex-wrap gap-2">
							{filters.year && (
								<Badge variant="secondary" className="flex items-center gap-1">
									Year: {filters.year}
									<button
										onClick={() => setFilters({ ...filters, year: "" })}
										className="ml-1 hover:text-destructive">
										×
									</button>
								</Badge>
							)}
							{filters.versionName && (
								<Badge variant="secondary" className="flex items-center gap-1">
									Version: {filters.versionName}
									<button
										onClick={() => setFilters({ ...filters, versionName: "" })}
										className="ml-1 hover:text-destructive">
										×
									</button>
								</Badge>
							)}
							{filters.category && (
								<Badge variant="secondary" className="flex items-center gap-1">
									Division: {filters.category}
									<button
										onClick={() => setFilters({ ...filters, category: "" })}
										className="ml-1 hover:text-destructive">
										×
									</button>
								</Badge>
							)}
							{filters.style && (
								<Badge variant="secondary" className="flex items-center gap-1">
									Style: {filters.style}
									<button
										onClick={() => setFilters({ ...filters, style: "" })}
										className="ml-1 hover:text-destructive">
										×
									</button>
								</Badge>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Products Table */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>
							Products ({pagination.total}){hasActiveFilters && " (Filtered)"}
							<span className="text-sm font-normal text-muted-foreground ml-2">
								(Sorted by Style)
							</span>
						</CardTitle>
						{products.length > 0 && (
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<button
									onClick={handleSelectAll}
									className="flex items-center gap-2 hover:text-gray-800">
									{isAllSelected ? (
										<CheckSquare className="w-4 h-4 text-blue-600" />
									) : (
										<Square className="w-4 h-4 text-gray-400" />
									)}
									Select All
								</button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center text-muted-foreground py-8">Loading...</p>
					) : products.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground mb-4">No products found</p>
							{hasActiveFilters && (
								<Button variant="outline" onClick={handleClearFilters}>
									Clear Filters
								</Button>
							)}
						</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12">
											{/* Checkbox column header */}
										</TableHead>
										<TableHead>Style</TableHead>
										<TableHead>Division</TableHead>
										<TableHead>Year/Version</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Colors</TableHead>
										<TableHead>Size</TableHead>
										<TableHead>Images</TableHead>
										<TableHead>Availability</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map((product) => (
										<TableRow key={product._id}>
											<TableCell>
												<input
													type="checkbox"
													checked={selectedProducts.includes(product._id)}
													onChange={() => handleSelectProduct(product._id)}
													className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
											</TableCell>
											<TableCell className="font-medium">
												{product.style}
											</TableCell>
											<TableCell>{product?.category}</TableCell>
											<TableCell>
												{product.year} {product.versionName}
											</TableCell>
											<TableCell>{formatCurrency(product.price)}</TableCell>
											<TableCell>
												<div className="flex gap-1 flex-wrap max-w-xs">
													{product.colors.slice(0, 3).map((color, idx) => (
														<Badge
															key={idx}
															variant="secondary"
															className="text-xs">
															{color}
														</Badge>
													))}
													{product.colors.length > 3 && (
														<Badge variant="outline" className="text-xs">
															+{product.colors.length - 3}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>{product.size}</TableCell>
											<TableCell>
												<div className="flex flex-wrap w-56 gap-2">
													{product.images.map((img: string, index: number) => (
														<img
															src={`http://srv1051513.hstgr.cloud:3200/${img}`}
															key={index}
															alt=""
															className="w-14 h-14 object-cover"
														/>
													))}
												</div>
											</TableCell>
											<TableCell>{product?.availability}</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleEditProduct(product)}
														className="gap-1">
														<Edit className="w-4 h-4" />
														Edit
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleDeleteProduct(product._id)}
														className="gap-1">
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{/* Pagination */}
							{pagination.totalPages > 1 && (
								<div className="flex items-center justify-between mt-4">
									<Button
										variant="outline"
										onClick={() =>
											setFilters({ ...filters, page: filters.page - 1 })
										}
										disabled={!pagination.hasPrevPage || filters.page === 1}>
										Previous
									</Button>
									<span className="text-sm text-muted-foreground">
										Page {filters.page} of {pagination.totalPages}
									</span>
									<Button
										variant="outline"
										onClick={() =>
											setFilters({ ...filters, page: filters.page + 1 })
										}
										disabled={!pagination.hasNextPage}>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Edit Product Modal */}
			<EditProductModal
				product={editingProduct}
				isOpen={isEditModalOpen}
				onClose={handleCloseEditModal}
				onUpdate={handleProductUpdate}
			/>

			{/* Bulk Edit Modal */}
			<BulkEditModal
				products={selectedProductsData}
				isOpen={isBulkEditModalOpen}
				onClose={handleCloseBulkEditModal}
				onUpdate={handleProductUpdate}
			/>

			{/* Download Modal */}
			<DownloadModal
				isOpen={isDownloadModalOpen}
				onClose={handleCloseDownloadModal}
				years={uniqueYears}
				categories={uniqueDivisions}
				onDownload={downloadByYearAndCategory}
			/>

			{/* Create Product Modal */}
			<CreateProductModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseCreateModal}
				onSuccess={() => {
					fetchProducts();
					fetchAllProductsForFilters();
				}}
				brand={selectedBrand}
				availableYears={uniqueYears}
				availableCategories={uniqueDivisions}
				availableVersions={uniqueVersions}
			/>
		</div>
	);
};

export default Products;
