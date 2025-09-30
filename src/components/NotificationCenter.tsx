import React, { useState, useEffect } from "react";
import {
    Bell,
    X,
    CheckCircle,
    AlertCircle,
    Info,
    XCircle,
    Trash2,
} from "lucide-react";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    createdAt: string;
    actionUrl?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: "1",
        userId: "user1",
        title: "Activity Approved! 🎉",
        message:
            'Your submission "Smart India Hackathon 2024 Winner" has been approved and you\'ve earned 50 points!',
        type: "success",
        read: false,
        createdAt: "2024-01-22T10:30:00Z",
        actionUrl: "/activities",
    },
    {
        id: "2",
        userId: "user1",
        title: "New Event Available",
        message:
            "IEEE International Conference on AI is now open for registration. Don't miss this opportunity!",
        type: "info",
        read: false,
        createdAt: "2024-01-22T09:15:00Z",
        actionUrl: "/activities",
    },
    {
        id: "3",
        userId: "user1",
        title: "Activity Needs Attention",
        message:
            'Your submission "Blood Donation Camp" requires additional documentation. Please resubmit.',
        type: "warning",
        read: true,
        createdAt: "2024-01-21T14:20:00Z",
        actionUrl: "/activities",
    },
    {
        id: "4",
        userId: "user1",
        title: "Congratulations! 🏆",
        message:
            "You've reached the Top 10 ranking in your department. Keep up the excellent work!",
        type: "success",
        read: true,
        createdAt: "2024-01-21T11:45:00Z",
        actionUrl: "/analytics",
    },
    {
        id: "5",
        userId: "user1",
        title: "Profile Update Required",
        message:
            "Please update your profile information to ensure accurate records.",
        type: "warning",
        read: false,
        createdAt: "2024-01-20T16:30:00Z",
        actionUrl: "/profile",
    },
];

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    isOpen,
    onClose,
}) => {
    const [notifications, setNotifications] =
        useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    useEffect(() => {
        // In a real app, fetch notifications from API
        setNotifications(mockNotifications);
    }, []);

    const markAsRead = (notificationId: string) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, read: true })),
        );
    };

    const deleteNotification = (notificationId: string) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== notificationId),
        );
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case "error":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            return "Just now";
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const filteredNotifications =
        filter === "all" ? notifications : notifications.filter((n) => !n.read);

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black bg-opacity-25"
                onClick={onClose}
            />

            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Notifications
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {unreadCount > 0
                                        ? `${unreadCount} unread`
                                        : "All caught up!"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Buttons */}
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1 text-sm rounded-md ${
                                    filter === "all"
                                        ? "bg-primary-100 text-primary-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter("unread")}
                                className={`px-3 py-1 text-sm rounded-md ${
                                    filter === "unread"
                                        ? "bg-primary-100 text-primary-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Unread ({unreadCount})
                            </button>
                        </div>

                        {/* Action Buttons */}
                        {notifications.length > 0 && (
                            <div className="mt-3 flex space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary-600 hover:text-primary-700"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={clearAllNotifications}
                                    className="text-xs text-red-600 hover:text-red-700"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full px-6">
                                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                                <h3 className="text-sm font-medium text-gray-700 mb-1">
                                    {filter === "unread"
                                        ? "No unread notifications"
                                        : "No notifications"}
                                </h3>
                                <p className="text-xs text-gray-500 text-center">
                                    {filter === "unread"
                                        ? "You're all caught up! Check back later for updates."
                                        : "When you have notifications, they'll appear here."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                                            !notification.read
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(
                                                    notification.type,
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4
                                                        className={`text-sm font-medium ${
                                                            !notification.read
                                                                ? "text-gray-900"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">
                                                        {formatTimeAgo(
                                                            notification.createdAt,
                                                        )}
                                                    </span>

                                                    <div className="flex space-x-1">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.id,
                                                                    )
                                                                }
                                                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                                                title="Mark as read"
                                                            >
                                                                <CheckCircle className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                deleteNotification(
                                                                    notification.id,
                                                                )
                                                            }
                                                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {notification.actionUrl && (
                                                    <button
                                                        onClick={() => {
                                                            // Navigate to the action URL
                                                            window.location.href =
                                                                notification.actionUrl!;
                                                            markAsRead(
                                                                notification.id,
                                                            );
                                                        }}
                                                        className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                                                    >
                                                        View Details →
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Notification Bell Component
interface NotificationBellProps {
    onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
    onClick,
}) => {
    const [notifications] = useState<Notification[]>(mockNotifications);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <button
            onClick={onClick}
            className="relative p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </button>
    );
};

// Toast Notification Component
interface ToastNotificationProps {
    notification: Omit<Notification, "id" | "userId" | "createdAt" | "read">;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
    notification,
    onClose,
    autoClose = true,
    duration = 5000,
}) => {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const getToastStyles = () => {
        switch (notification.type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            default:
                return "bg-blue-50 border-blue-200 text-blue-800";
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5" />;
            case "warning":
                return <AlertCircle className="w-5 h-5" />;
            case "error":
                return <XCircle className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 max-w-sm w-full border rounded-lg shadow-lg z-50 ${getToastStyles()}`}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium">
                            {notification.title}
                        </h3>
                        <p className="text-sm mt-1 opacity-90">
                            {notification.message}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 flex-shrink-0 text-current opacity-60 hover:opacity-80"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Hook for managing notifications
export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toastNotification, setToastNotification] = useState<Omit<
        Notification,
        "id" | "userId" | "createdAt" | "read"
    > | null>(null);

    const showToast = (
        notification: Omit<
            Notification,
            "id" | "userId" | "createdAt" | "read"
        >,
    ) => {
        setToastNotification(notification);
    };

    const hideToast = () => {
        setToastNotification(null);
    };

    const addNotification = (
        notification: Omit<Notification, "id" | "createdAt">,
    ) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    return {
        notifications,
        toastNotification,
        showToast,
        hideToast,
        addNotification,
        setNotifications,
    };
};
