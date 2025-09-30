import { type Notification } from "../types";
import ApiService from "./apiService";

export const getNotifications = async (filters?: {
    read?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
}): Promise<{ notifications: Notification[]; total: number }> => {
    try {
        // Get current user ID from token
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const response = await ApiService.getNotifications(userId);
        let notifications = response.data;

        // Apply filters
        if (filters?.read !== undefined) {
            notifications = notifications.filter(
                (n) => n.read === filters.read,
            );
        }

        if (filters?.type) {
            notifications = notifications.filter(
                (n) => n.type === filters.type,
            );
        }

        // Apply pagination
        const total = notifications.length;
        const start = filters?.offset || 0;
        const limit = filters?.limit || total;
        notifications = notifications.slice(start, start + limit);

        return { notifications, total };
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch notifications");
    }
};

export const markNotificationAsRead = async (
    notificationId: string,
): Promise<Notification> => {
    try {
        await ApiService.markNotificationAsRead(notificationId);

        // Return updated notification (mock implementation)
        const token = localStorage.getItem("auth_token");
        const userId = token?.split("-")[2] || "";
        const response = await ApiService.getNotifications(userId);
        const notification = response.data.find((n) => n.id === notificationId);

        if (!notification) {
            throw new Error("Notification not found");
        }

        return { ...notification, read: true };
    } catch (error: any) {
        throw new Error(error.message || "Failed to mark notification as read");
    }
};

export const markAllNotificationsAsRead = async (): Promise<{
    count: number;
}> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const response = await ApiService.getNotifications(userId);
        const unreadNotifications = response.data.filter((n) => !n.read);

        // Mark all as read (mock implementation)
        await Promise.all(
            unreadNotifications.map((n) =>
                ApiService.markNotificationAsRead(n.id),
            ),
        );

        return { count: unreadNotifications.length };
    } catch (error: any) {
        throw new Error(
            error.message || "Failed to mark all notifications as read",
        );
    }
};

export const deleteNotification = async (
    notificationId: string,
): Promise<void> => {
    try {
        // In mock implementation, we don't actually delete from the data
        // Just simulate the operation
        await new Promise((resolve) => setTimeout(resolve, 200));
        console.log(`Notification ${notificationId} deleted (mock)`);
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete notification");
    }
};

export const deleteAllNotifications = async (): Promise<{ count: number }> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const response = await ApiService.getNotifications(userId);
        const count = response.data.length;

        // Simulate deletion
        await new Promise((resolve) => setTimeout(resolve, 300));
        console.log(`${count} notifications deleted (mock)`);

        return { count };
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete all notifications");
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
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const currentUserId = token.split("-")[2];
        const targetUserId = notification.userId || currentUserId;

        const notificationData = {
            userId: targetUserId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            read: false,
            actionUrl: notification.actionUrl,
        };

        const response = await ApiService.createNotification(notificationData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to create notification");
    }
};

export const getUnreadCount = async (): Promise<number> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const response = await ApiService.getNotifications(userId);
        const unreadCount = response.data.filter((n) => !n.read).length;

        return unreadCount;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch unread count");
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

    // Mock real-time notifications - simulate random notifications for demo
    const interval = setInterval(() => {
        // Uncomment below for testing real-time notifications
        // if (Math.random() > 0.98) {
        //     const mockNotification: Notification = {
        //         id: Date.now().toString(),
        //         userId,
        //         title: 'New Update Available',
        //         message: 'You have a new activity update.',
        //         type: 'info',
        //         read: false,
        //         createdAt: new Date().toISOString(),
        //     };
        //     callback(mockNotification);
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

// Utility function to create system notifications
export const createSystemNotification = async (
    userId: string,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    actionUrl?: string,
): Promise<Notification> => {
    return createNotification({
        title,
        message,
        type,
        actionUrl,
        userId,
    });
};

// Utility function to notify activity status changes
export const notifyActivityStatusChange = async (
    studentId: string,
    activityTitle: string,
    status: "approved" | "rejected",
    rejectionReason?: string,
): Promise<Notification> => {
    const isApproved = status === "approved";
    const title = isApproved ? "Activity Approved!" : "Activity Rejected";
    const message = isApproved
        ? `Your activity "${activityTitle}" has been approved.`
        : `Your activity "${activityTitle}" has been rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : ""}`;

    return createSystemNotification(
        studentId,
        title,
        message,
        isApproved ? "success" : "error",
        "/dashboard/activities",
    );
};
