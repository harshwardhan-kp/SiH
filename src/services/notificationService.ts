import axios from "axios";
import { type Notification, ApiResponse } from "../types";

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

export const getNotifications = async (filters?: {
    read?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
}): Promise<{ notifications: Notification[]; total: number }> => {
    try {
        const response = await api.get<
            ApiResponse<{ notifications: Notification[]; total: number }>
        >("/notifications", {
            params: filters,
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch notifications",
        );
    }
};

export const markNotificationAsRead = async (
    notificationId: string,
): Promise<Notification> => {
    try {
        const response = await api.patch<ApiResponse<Notification>>(
            `/notifications/${notificationId}/read`,
        );
        return response.data.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to mark notification as read",
        );
    }
};

export const markAllNotificationsAsRead = async (): Promise<{
    count: number;
}> => {
    try {
        const response = await api.patch<ApiResponse<{ count: number }>>(
            "/notifications/mark-all-read",
        );
        return response.data.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to mark all notifications as read",
        );
    }
};

export const deleteNotification = async (
    notificationId: string,
): Promise<void> => {
    try {
        await api.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to delete notification",
        );
    }
};

export const deleteAllNotifications = async (): Promise<{ count: number }> => {
    try {
        const response =
            await api.delete<ApiResponse<{ count: number }>>("/notifications");
        return response.data.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to delete all notifications",
        );
    }
};

export const createNotification = async (notification: {
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    actionUrl?: string;
    userId?: string; // For admin/faculty creating notifications for specific users
}): Promise<Notification> => {
    try {
        const response = await api.post<ApiResponse<Notification>>(
            "/notifications",
            notification,
        );
        return response.data.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to create notification",
        );
    }
};

export const getUnreadCount = async (): Promise<number> => {
    try {
        const response = await api.get<ApiResponse<{ count: number }>>(
            "/notifications/unread-count",
        );
        return response.data.data.count;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch unread count",
        );
    }
};

// Real-time notification subscription (for WebSocket integration)
export const subscribeToNotifications = (
    userId: string,
    _callback: (notification: Notification) => void,
) => {
    // In a real app, this would establish a WebSocket connection
    // For now, we'll use a mock implementation
    console.log(`Subscribing to notifications for user ${userId}`);

    // Mock real-time notifications
    const interval = setInterval(() => {
        // Simulate random notifications (uncomment for testing)
        // const mockNotification: Notification = {
        //   id: Date.now().toString(),
        //   userId,
        //   title: 'New Update Available',
        //   message: 'You have a new activity update.',
        //   type: 'info',
        //   read: false,
        //   createdAt: new Date().toISOString(),
        // };
        // if (Math.random() > 0.95) {
        //   callback(mockNotification);
        // }
    }, 5000);

    return () => clearInterval(interval);
};

// Push notification utilities
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

export const showBrowserNotification = (notification: Notification) => {
    if (Notification.permission === "granted") {
        const browserNotification = new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
            tag: notification.id,
        });

        browserNotification.onclick = () => {
            window.focus();
            if (notification.actionUrl) {
                window.location.href = notification.actionUrl;
            }
            browserNotification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => {
            browserNotification.close();
        }, 5000);
    }
};
