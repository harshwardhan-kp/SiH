import { User, LoginCredentials, RegisterData } from "../types";
import mockData from "../../db.json";

interface LoginResponse {
    user: User;
    token: string;
}

interface RegisterResponse {
    user: User;
    token: string;
}

// Simulate API delay for more realistic behavior
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (
    credentials: LoginCredentials,
): Promise<LoginResponse> => {
    await delay(500); // Simulate network delay

    try {
        // Check against users in db.json
        const users = mockData.users;

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
                role: user.role as "student" | "faculty" | "admin",
                studentId: user.studentId,
                department: user.department,
                semester: user.semester,
                avatar: user.avatar || undefined,
                createdAt: user.createdAt,
            },
            token,
        };
    } catch (error: any) {
        if (error.message === "Invalid email or password") {
            throw error;
        }
        throw new Error("Login failed");
    }
};

export const register = async (
    data: RegisterData,
): Promise<RegisterResponse> => {
    await delay(500); // Simulate network delay

    try {
        // Check if user already exists
        const users = mockData.users;
        const existingUser = users.find((u) => u.email === data.email);

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // For demo purposes, simulate registration by creating a new user object
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
        throw new Error(error.message || "Registration failed");
    }
};

export const getCurrentUser = async (): Promise<User> => {
    await delay(200); // Simulate network delay

    try {
        // Get user data from token stored in localStorage
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        // Extract user ID from mock token (format: demo-token-{userId}-{timestamp})
        const tokenParts = token.split("-");
        if (
            tokenParts.length < 3 ||
            tokenParts[0] !== "demo" ||
            tokenParts[1] !== "token"
        ) {
            throw new Error("Invalid authentication token");
        }

        const userId = tokenParts[2];

        const users = mockData.users;
        const user = users.find((u) => u.id === userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            role: userWithoutPassword.role as "student" | "faculty" | "admin",
            avatar: userWithoutPassword.avatar || undefined,
        } as User;
    } catch (error: any) {
        throw new Error(error.message || "Failed to get user data");
    }
};

export const logout = async (): Promise<void> => {
    await delay(100); // Simulate network delay

    // Clear local storage
    localStorage.removeItem("auth_token");
};

// Helper function to get all users (for admin purposes)
export const getAllUsers = async (): Promise<User[]> => {
    await delay(300);

    // Return users without passwords
    return mockData.users.map(
        ({ password, ...user }) =>
            ({
                ...user,
                role: user.role as "student" | "faculty" | "admin",
                avatar: user.avatar || undefined,
            }) as User,
    );
};

// Helper function to check if user has specific role
export const hasRole = (user: User | null, roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("auth_token");
    return !!token;
};
