import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(async (config) => {
    const session = await getSession();

    if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
    }

    return config;
});

// Handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — redirect to login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;