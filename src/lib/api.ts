import axios from "axios";
import toast from "react-hot-toast";

// Get API base URL from environment variable or fallback to default
//const API_BASE_URL = "http://srv1051513.hstgr.cloud:3200";
 const API_BASE_URL = "http://localhost:3200";

const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error);

		// Extract error message
		let message = "An error occurred";

		if (error.response?.data) {
			if (error.response.data.message) {
				message = error.response.data.message;
			} else if (error.response.data.errors) {
				if (Array.isArray(error.response.data.errors)) {
					message = error.response.data.errors[0];
				} else {
					message = error.response.data.errors;
				}
			}
		} else if (error.request) {
			message =
				"No response from server. Please check if the backend is running.";
		} else {
			message = error.message || "An error occurred";
		}

		toast.error(message, {
			duration: 4000,
			style: {
				background: "#ef4444",
				color: "#fff",
			},
		});

		return Promise.reject(error);
	}
);

export default api;
