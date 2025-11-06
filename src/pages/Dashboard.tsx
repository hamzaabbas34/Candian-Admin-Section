import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { Release } from "@/types";
import { CheckCircle, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
	const [releases, setReleases] = useState<Release[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchReleases();
	}, []);

	const fetchReleases = async () => {
		try {
			const response = await api.get("/versions");
			setReleases(response.data.data);
		} catch (error) {
			console.error("Failed to fetch releases:", error);
		} finally {
			setLoading(false);
		}
	};

	const brandColors = {
		Azure: "bg-blue-500",
		Monsini: "bg-purple-500",
		Risky: "bg-orange-500",
	};

	console.log(releases);

	return (
		<div>
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground mt-2">
					Overview of all product versions across websites
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{["Azure", "Monsini", "Risky"].map((brand) => {
					const brandReleases = releases.filter((r) => r.brand === brand);
					const published = brandReleases.find((r) => r.isPublished);
					const totalproduct = brandReleases.reduce((total, release) => total + release.totalProduct, 0);
					
					const totalCategory = [
						...new Set(brandReleases.map((r) => r.category)),
					].length;

					return (
						<Card key={brand}>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											brandColors[brand as keyof typeof brandColors]
										}`}
									/>
									{brand}
								</CardTitle>
								<CardDescription>
									{published
										? `Published: ${published.year} ${published.versionName}`
										: "No published version"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Total Versions
										</span>
										<span className="font-medium">{brandReleases.length}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Total category
										</span>
										<span className="font-medium">{totalCategory}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Total Products
										</span>
										<span className="font-medium">{totalproduct}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Versions</CardTitle>
					<CardDescription>Complete list of product versions</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-center text-muted-foreground py-8">Loading...</p>
					) : releases.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No versions found
						</p>
					) : (
						<div className="space-y-3">
							{releases.map((release) => (
								<div
									key={release._id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
									<div className="flex items-center gap-4">
										<div
											className={`w-2 h-2 rounded-full ${
												brandColors[release.brand as keyof typeof brandColors]
											}`}
										/>
										<div>
											<div className="font-medium">
												{release.brand} -{" "}
												{release.category ? `${release.category} - ` : ""}{" "}
												{release.versionName}
											</div>
											<div className="text-sm text-muted-foreground">
												products {release.productCount}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{release.isPublished ? (
											<span className="flex items-center gap-1 text-sm text-green-600">
												<CheckCircle className="w-4 h-4" />
												Published
											</span>
										) : (
											<span className="flex items-center gap-1 text-sm text-muted-foreground">
												<Clock className="w-4 h-4" />
												Draft
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;