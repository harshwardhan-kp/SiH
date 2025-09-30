import axios from "axios";
import { User, LoginCredentials, RegisterData } from "../types";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface LoginResponse {
    user: User;
    token: string;
}

interface RegisterResponse {
    user: User;
    token: string;
}

export const login = async (
    credentials: LoginCredentials,
): Promise<LoginResponse> => {
    try {
        // For demo purposes, we'll simulate authentication by checking against users in db.json
        const response = await api.get<User[]>("/users");
        const users = response.data;

        const user = users.find(
            (u) =>
                u.email === credentials.email &&
                u.password === credentials.password,
        );

        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Generate a mock token
        const token = `demo-token-${user.id}-${Date.now()}`;

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                studentId: user.studentId,
                department: user.department,
                semester: user.semester,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
            token,
        };
    } catch (error: any) {
        if (error.message === "Invalid email or password") {
            throw error;
        }
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

export const register = async (
    data: RegisterData,
): Promise<RegisterResponse> => {
    try {
        // For demo purposes, we'll simulate registration
        // In a real app, this would create a new user in the database
        const newUser: User = {
            id: String(Date.now()),
            email: data.email,
            name: data.name,
            role: data.role,
            studentId: data.studentId,
            department: data.department,
            semester: data.semester,
            createdAt: new Date().toISOString(),
        };

        const token = `demo-token-${newUser.id}-${Date.now()}`;

        return {
            user: newUser,
            token,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

export const getCurrentUser = async (): Promise<User> => {
    try {
        // For demo purposes, we'll get user data from token stored in localStorage
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        // Extract user ID from mock token (format: demo-token-{userId}-{timestamp})
        const userId = token.split("-")[2];

        const response = await api.get<User[]>("/users");
        const users = response.data;

        const user = users.find((u) => u.id === userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to get user data",
        );
    }
};

export const logout = async (): Promise<void> => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        // Even if logout fails on server, we should clear local storage
        console.error("Logout error:", error);
    }
};
