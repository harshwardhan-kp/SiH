import {
    Activity,
    Portfolio,
    Notification,
    Analytics,
    User,
    ActivityCategory,
} from "../types";
import MockDataUtils from "../utils/mockDataUtils";

// Simulate API delay for more realistic behavior
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data service for handling all data operations client-side
export class MockDataService {
    // Activities
    static async getActivities(studentId?: string): Promise<Activity[]> {
        await delay(300);

        let activities = MockDataUtils.get<Activity>("ACTIVITIES");

        if (studentId) {
            activities = activities.filter(
                (activity) => activity.studentId === studentId,
            );
        }

        return activities;
    }

    static async getActivityById(id: string): Promise<Activity | null> {
        await delay(200);

        const activity = MockDataUtils.find<Activity>("ACTIVITIES", id);
        return activity;
    }

    static async createActivity(
        activity: Omit<Activity, "id" | "createdAt" | "updatedAt">,
    ): Promise<Activity> {
        await delay(400);

        const newActivity: Activity = {
            ...activity,
            id: MockDataUtils.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        MockDataUtils.add("ACTIVITIES", newActivity);
        return newActivity;
    }

    static async updateActivity(
        id: string,
        updates: Partial<Activity>,
    ): Promise<Activity> {
        await delay(400);

        const updatedActivity = MockDataUtils.update<Activity>(
            "ACTIVITIES",
            id,
            {
                ...updates,
                updatedAt: new Date().toISOString(),
            },
        );

        if (!updatedActivity) {
            throw new Error("Activity not found");
        }

        return updatedActivity;
    }

    static async deleteActivity(id: string): Promise<boolean> {
        await delay(300);

        const deleted = MockDataUtils.remove<Activity>("ACTIVITIES", id);
        if (!deleted) {
            throw new Error("Activity not found");
        }

        return true;
    }

    // Portfolio
    static async getPortfolio(studentId: string): Promise<Portfolio | null> {
        await delay(400);

        const portfolios = MockDataUtils.get<Portfolio>("PORTFOLIOS");
        const portfolio = portfolios.find((p) => p.studentId === studentId);
        return portfolio || null;
    }

    static async updatePortfolio(
        studentId: string,
        updates: Partial<Portfolio>,
    ): Promise<Portfolio> {
        await delay(500);

        const portfolios = MockDataUtils.get<Portfolio>("PORTFOLIOS");
        let portfolio = portfolios.find((p) => p.studentId === studentId);

        if (!portfolio) {
            // Create new portfolio if it doesn't exist
            portfolio = {
                id: MockDataUtils.generateId(),
                studentId,
                achievements: [],
                skills: [],
                projects: [],
                template: "modern",
                isPublic: false,
                lastGenerated: new Date().toISOString(),
                downloadCount: 0,
                ...updates,
            } as Portfolio;
            MockDataUtils.add("PORTFOLIOS", portfolio);
        } else {
            const updatedPortfolio = MockDataUtils.update<Portfolio>(
                "PORTFOLIOS",
                portfolio.id,
                {
                    ...updates,
                    lastGenerated: new Date().toISOString(),
                },
            );
            portfolio = updatedPortfolio!;
        }

        return portfolio;
    }

    // Notifications
    static async getNotifications(userId: string): Promise<Notification[]> {
        await delay(250);

        const notifications = MockDataUtils.get<Notification>("NOTIFICATIONS");
        return notifications.filter((n) => n.userId === userId);
    }

    static async markNotificationAsRead(id: string): Promise<boolean> {
        await delay(200);

        const updated = MockDataUtils.update<Notification>(
            "NOTIFICATIONS",
            id,
            { read: true },
        );
        if (!updated) {
            throw new Error("Notification not found");
        }

        return true;
    }

    static async createNotification(
        notification: Omit<Notification, "id" | "createdAt">,
    ): Promise<Notification> {
        await delay(300);

        const newNotification: Notification = {
            ...notification,
            id: MockDataUtils.generateId(),
            createdAt: new Date().toISOString(),
        };

        MockDataUtils.add("NOTIFICATIONS", newNotification);
        return newNotification;
    }

    // Analytics
    static async getAnalytics(studentId?: string): Promise<Analytics> {
        await delay(500);

        if (studentId) {
            return MockDataUtils.getUserAnalytics(studentId);
        }

        // Return general analytics - could be calculated from all data
        const allActivities = MockDataUtils.get<Activity>("ACTIVITIES");
        const totalActivities = allActivities.length;
        const approvedActivities = allActivities.filter(
            (a) => a.status === "approved",
        ).length;
        const pendingActivities = allActivities.filter(
            (a) => a.status === "pending",
        ).length;
        const rejectedActivities = allActivities.filter(
            (a) => a.status === "rejected",
        ).length;

        // Initialize category breakdown with all categories
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

        return {
            totalActivities,
            approvedActivities,
            pendingActivities,
            rejectedActivities,
            totalPoints: approvedActivities * 10, // Mock calculation
            categoryBreakdown,
            monthlyProgress: [],
            comparisonData: {
                departmentAverage: 85,
                semesterAverage: 78,
                rank: 1,
            },
        } as Analytics;
    }

    // Users (for admin/faculty)
    static async getAllUsers(): Promise<User[]> {
        await delay(400);

        const users = MockDataUtils.get<User>("USERS");
        return users.map(({ password, ...user }) => user as User);
    }

    static async getUserById(id: string): Promise<User | null> {
        await delay(200);

        const user = MockDataUtils.find<User>("USERS", id);
        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    static async updateUser(id: string, updates: Partial<User>): Promise<User> {
        await delay(400);

        const updatedUser = MockDataUtils.update<User>("USERS", id, updates);
        if (!updatedUser) {
            throw new Error("User not found");
        }

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword as User;
    }

    // Events
    static async getEvents(): Promise<any[]> {
        await delay(300);

        return MockDataUtils.get<any>("EVENTS");
    }

    static async registerForEvent(
        eventId: string,
        _userId: string,
    ): Promise<boolean> {
        await delay(400);

        const events = MockDataUtils.get<any>("EVENTS");
        const event = events.find((e) => e.id === eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        // In a real app, this would create a registration record
        return true;
    }

    // Search functionality
    static async searchActivities(
        query: string,
        filters?: any,
    ): Promise<Activity[]> {
        await delay(300);

        let activities = MockDataUtils.get<Activity>("ACTIVITIES");

        if (query) {
            activities = activities.filter(
                (activity) =>
                    activity.title
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    activity.description
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    activity.category
                        .toLowerCase()
                        .includes(query.toLowerCase()),
            );
        }

        if (filters?.category) {
            activities = activities.filter(
                (activity) => activity.category === filters.category,
            );
        }

        if (filters?.status) {
            activities = activities.filter(
                (activity) => activity.status === filters.status,
            );
        }

        if (filters?.studentId) {
            activities = activities.filter(
                (activity) => activity.studentId === filters.studentId,
            );
        }

        return activities;
    }

    // Utility functions
    static async uploadFile(file: File): Promise<string> {
        await delay(1000);

        // Use the mock data utils for file upload simulation
        return MockDataUtils.simulateFileUpload(file);
    }

    static async deleteFile(fileUrl: string): Promise<boolean> {
        await delay(300);

        // Revoke blob URL
        URL.revokeObjectURL(fileUrl);
        return true;
    }
}

export default MockDataService;
