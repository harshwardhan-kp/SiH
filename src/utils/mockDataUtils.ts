import { User, Activity, Analytics, ActivityCategory } from "../types";
import mockData from "../../db.json";

// Keys for localStorage
export const STORAGE_KEYS = {
    USERS: "sih_mock_users",
    ACTIVITIES: "sih_mock_activities",
    PORTFOLIOS: "sih_mock_portfolios",
    NOTIFICATIONS: "sih_mock_notifications",
    ANALYTICS: "sih_mock_analytics",
    EVENTS: "sih_mock_events",
    LAST_SYNC: "sih_mock_last_sync",
} as const;

// Initialize mock data in localStorage
export const initializeMockData = (): void => {
    try {
        const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

        // Only re-sync if more than a day has passed or no data exists
        if (!lastSync || parseInt(lastSync) < oneDayAgo) {
            localStorage.setItem(
                STORAGE_KEYS.USERS,
                JSON.stringify(mockData.users),
            );
            localStorage.setItem(
                STORAGE_KEYS.ACTIVITIES,
                JSON.stringify(mockData.activities),
            );
            localStorage.setItem(
                STORAGE_KEYS.PORTFOLIOS,
                JSON.stringify(mockData.portfolios),
            );
            localStorage.setItem(
                STORAGE_KEYS.NOTIFICATIONS,
                JSON.stringify(mockData.notifications),
            );
            localStorage.setItem(
                STORAGE_KEYS.ANALYTICS,
                JSON.stringify(mockData.analytics),
            );
            localStorage.setItem(
                STORAGE_KEYS.EVENTS,
                JSON.stringify(mockData.events || []),
            );
            localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

            console.log("Mock data initialized in localStorage");
        }
    } catch (error) {
        console.error("Failed to initialize mock data:", error);
    }
};

// Get data from localStorage with fallback to original mock data
export const getMockData = <T>(key: keyof typeof STORAGE_KEYS): T[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS[key]);
        if (stored) {
            return JSON.parse(stored);
        }

        // Fallback to original mock data
        switch (key) {
            case "USERS":
                return mockData.users as T[];
            case "ACTIVITIES":
                return mockData.activities as T[];
            case "PORTFOLIOS":
                return mockData.portfolios as T[];
            case "NOTIFICATIONS":
                return mockData.notifications as T[];
            case "EVENTS":
                return (mockData.events || []) as T[];
            default:
                return [];
        }
    } catch (error) {
        console.error(`Failed to get mock data for ${key}:`, error);
        return [];
    }
};

// Save data to localStorage
export const saveMockData = <T>(
    key: keyof typeof STORAGE_KEYS,
    data: T[],
): void => {
    try {
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save mock data for ${key}:`, error);
    }
};

// Add item to mock data
export const addToMockData = <T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    item: T,
): void => {
    try {
        const currentData = getMockData<T>(key);
        const updatedData = [...currentData, item];
        saveMockData(key, updatedData);
    } catch (error) {
        console.error(`Failed to add item to mock data for ${key}:`, error);
    }
};

// Update item in mock data
export const updateMockDataItem = <T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    id: string,
    updates: Partial<T>,
): T | null => {
    try {
        const currentData = getMockData<T>(key);
        const itemIndex = currentData.findIndex((item) => item.id === id);

        if (itemIndex === -1) {
            return null;
        }

        const updatedItem = { ...currentData[itemIndex], ...updates };
        const updatedData = [...currentData];
        updatedData[itemIndex] = updatedItem;

        saveMockData(key, updatedData);
        return updatedItem;
    } catch (error) {
        console.error(`Failed to update item in mock data for ${key}:`, error);
        return null;
    }
};

// Remove item from mock data
export const removeFromMockData = <T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    id: string,
): boolean => {
    try {
        const currentData = getMockData<T>(key);
        const filteredData = currentData.filter((item) => item.id !== id);

        if (filteredData.length === currentData.length) {
            return false; // Item not found
        }

        saveMockData(key, filteredData);
        return true;
    } catch (error) {
        console.error(
            `Failed to remove item from mock data for ${key}:`,
            error,
        );
        return false;
    }
};

// Find item in mock data
export const findInMockData = <T extends { id: string }>(
    key: keyof typeof STORAGE_KEYS,
    id: string,
): T | null => {
    try {
        const currentData = getMockData<T>(key);
        return currentData.find((item) => item.id === id) || null;
    } catch (error) {
        console.error(`Failed to find item in mock data for ${key}:`, error);
        return null;
    }
};

// Clear all mock data
export const clearAllMockData = (): void => {
    try {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
        console.log("All mock data cleared from localStorage");
    } catch (error) {
        console.error("Failed to clear mock data:", error);
    }
};

// Reset mock data to original state
export const resetMockData = (): void => {
    try {
        clearAllMockData();
        initializeMockData();
        console.log("Mock data reset to original state");
    } catch (error) {
        console.error("Failed to reset mock data:", error);
    }
};

// Get analytics for specific user
export const getUserAnalytics = (userId: string): Analytics => {
    try {
        const activities = getMockData<Activity>("ACTIVITIES").filter(
            (a) => a.studentId === userId,
        );

        const totalActivities = activities.length;
        const approvedActivities = activities.filter(
            (a) => a.status === "approved",
        ).length;
        const pendingActivities = activities.filter(
            (a) => a.status === "pending",
        ).length;
        const rejectedActivities = activities.filter(
            (a) => a.status === "rejected",
        ).length;

        const totalPoints = activities
            .filter((a) => a.status === "approved")
            .reduce((sum, a) => sum + (a.points || 0), 0);

        // Category breakdown
        const categoryBreakdown: Record<ActivityCategory, number> = {
            academic: 0,
            extracurricular: 0,
            research: 0,
            "community-service": 0,
            leadership: 0,
            internship: 0,
            competition: 0,
            certification: 0,
            conference: 0,
            workshop: 0,
        };
        activities.forEach((activity) => {
            if (activity.status === "approved") {
                categoryBreakdown[activity.category] =
                    (categoryBreakdown[activity.category] || 0) +
                    (activity.points || 0);
            }
        });

        // Monthly progress (last 6 months)
        const monthlyProgress = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toISOString().slice(0, 7); // YYYY-MM format

            const monthActivities = activities.filter(
                (a) => a.date.startsWith(month) && a.status === "approved",
            );

            return {
                month: date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                }),
                activities: monthActivities.length,
                points: monthActivities.reduce(
                    (sum, a) => sum + (a.points || 0),
                    0,
                ),
            };
        }).reverse();

        return {
            totalActivities,
            approvedActivities,
            pendingActivities,
            rejectedActivities,
            totalPoints,
            categoryBreakdown,
            monthlyProgress,
            comparisonData: {
                departmentAverage: 85,
                semesterAverage: 78,
                rank: Math.floor(Math.random() * 100) + 1,
            },
        } as Analytics;
    } catch (error) {
        console.error("Failed to get user analytics:", error);
        // Return default analytics with proper typing
        return {
            totalActivities: 0,
            approvedActivities: 0,
            pendingActivities: 0,
            rejectedActivities: 0,
            totalPoints: 0,
            categoryBreakdown: {
                academic: 0,
                extracurricular: 0,
                research: 0,
                "community-service": 0,
                leadership: 0,
                internship: 0,
                competition: 0,
                certification: 0,
                conference: 0,
                workshop: 0,
            },
            monthlyProgress: [],
            comparisonData: {
                departmentAverage: 0,
                semesterAverage: 0,
                rank: 0,
            },
        } as Analytics;
    }
};

// Generate unique ID
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate user permissions
export const hasPermission = (
    user: User | null,
    action: string,
    resource?: any,
): boolean => {
    if (!user) return false;

    switch (action) {
        case "approve_activity":
        case "reject_activity":
            return user.role === "faculty" || user.role === "admin";
        case "view_all_activities":
            return user.role === "faculty" || user.role === "admin";
        case "manage_users":
            return user.role === "admin";
        case "edit_activity":
            return (
                user.role === "admin" ||
                (user.role === "student" &&
                    resource?.studentId === user.id &&
                    resource?.status === "pending")
            );
        case "delete_activity":
            return (
                user.role === "admin" ||
                (user.role === "student" &&
                    resource?.studentId === user.id &&
                    resource?.status === "pending")
            );
        default:
            return true;
    }
};

// Mock file upload simulation
export const simulateFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Simulate upload delay
        setTimeout(
            () => {
                try {
                    // Create a blob URL for the file
                    const url = URL.createObjectURL(file);

                    // Store file info in localStorage for later retrieval
                    const fileInfo = {
                        id: generateId(),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        url: url,
                        uploadedAt: new Date().toISOString(),
                    };

                    const uploadedFiles = JSON.parse(
                        localStorage.getItem("sih_uploaded_files") || "[]",
                    );
                    uploadedFiles.push(fileInfo);
                    localStorage.setItem(
                        "sih_uploaded_files",
                        JSON.stringify(uploadedFiles),
                    );

                    resolve(url);
                } catch (error) {
                    reject(new Error("Failed to upload file"));
                }
            },
            Math.random() * 1000 + 500,
        ); // 500-1500ms delay
    });
};

// Clean up blob URLs
export const cleanupFileUploads = (): void => {
    try {
        const uploadedFiles = JSON.parse(
            localStorage.getItem("sih_uploaded_files") || "[]",
        );
        uploadedFiles.forEach((file: any) => {
            if (file.url.startsWith("blob:")) {
                URL.revokeObjectURL(file.url);
            }
        });
        localStorage.removeItem("sih_uploaded_files");
    } catch (error) {
        console.error("Failed to cleanup file uploads:", error);
    }
};

// Export utility object
export const MockDataUtils = {
    initialize: initializeMockData,
    get: getMockData,
    save: saveMockData,
    add: addToMockData,
    update: updateMockDataItem,
    remove: removeFromMockData,
    find: findInMockData,
    clear: clearAllMockData,
    reset: resetMockData,
    getUserAnalytics,
    generateId,
    hasPermission,
    simulateFileUpload,
    cleanupFileUploads,
};

export default MockDataUtils;
