import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Upload2 from "../src/pages/uploadComponets/Upload";
import Products from "@/pages/Products";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />

					<Route
						path="/*"
						element={
							<ProtectedRoute>
								<MainLayout />
							</ProtectedRoute>
						}
					/>
				</Routes>
				<Toaster position="top-right" />
			</BrowserRouter>
		</AuthProvider>
	);
}

function MainLayout() {
	return (
		<div className="min-h-screen bg-background">
			<Sidebar />
			<Topbar />

			<main className="ml-64 mt-16 p-0">
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/dashboard/:brand" element={<Products />} />
					{/* <Route path="/upload" element={<Upload />} /> */}

					<Route path="/upload" element={<Upload2 />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
