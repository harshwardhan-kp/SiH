import { Activity, Portfolio, Notification, Analytics, User, ApiResponse } from "../types";
import MockDataService from "./mockDataService";

// API service that uses mock data instead of making HTTP requests
export class ApiService {
    // Activities
    static async getActivities(studentId?: string): Promise<ApiResponse<Activity[]>> {
        try {
            const data = await MockDataService.getActivities(studentId);
            return {
                data,
                message: "Activities retrieved successfully",
                success: true,
                total: data.length
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch activities");
        }
    }

    static async getActivityById(id: string): Promise<ApiResponse<Activity>> {
        try {
            const data = await MockDataService.getActivityById(id);
            if (!data) {
                throw new Error("Activity not found");
            }
            return {
                data,
                message: "Activity retrieved successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch activity");
        }
    }

    static async createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Activity>> {
        try {
            const data = await MockDataService.createActivity(activity);
            return {
                data,
                message: "Activity created successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to create activity");
        }
    }

    static async updateActivity(id: string, updates: Partial<Activity>): Promise<ApiResponse<Activity>> {
        try {
            const data = await MockDataService.updateActivity(id, updates);
            return {
                data,
                message: "Activity updated successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to update activity");
        }
    }

    static async deleteActivity(id: string): Promise<ApiResponse<boolean>> {
        try {
            const data = await MockDataService.deleteActivity(id);
            return {
                data,
                message: "Activity deleted successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to delete activity");
        }
    }

    static async approveActivity(id: string, approverInfo: { approvedBy: string }): Promise<ApiResponse<Activity>> {
        try {
            const data = await MockDataService.updateActivity(id, {
                status: 'approved',
                approvedBy: approverInfo.approvedBy,
                approvedAt: new Date().toISOString()
            });
            return {
                data,
                message: "Activity approved successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to approve activity");
        }
    }

    static async rejectActivity(id: string, rejectionInfo: { rejectionReason: string }): Promise<ApiResponse<Activity>> {
        try {
            const data = await MockDataService.updateActivity(id, {
                status: 'rejected',
                rejectionReason: rejectionInfo.rejectionReason
            });
            return {
                data,
                message: "Activity rejected",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to reject activity");
        }
    }

    // Portfolio
    static async getPortfolio(studentId: string): Promise<ApiResponse<Portfolio>> {
        try {
            const data = await MockDataService.getPortfolio(studentId);
            if (!data) {
                throw new Error("Portfolio not found");
            }
            return {
                data,
                message: "Portfolio retrieved successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch portfolio");
        }
    }

    static async updatePortfolio(studentId: string, updates: Partial<Portfolio>): Promise<ApiResponse<Portfolio>> {
        try {
            const data = await MockDataService.updatePortfolio(studentId, updates);
            return {
                data,
                message: "Portfolio updated successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to update portfolio");
        }
    }

    static async generatePortfolio(studentId: string, template: string): Promise<ApiResponse<{ url: string }>> {
        try {
            // Simulate portfolio generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const portfolioUrl = `https://example.com/portfolio/${studentId}/${template}/${Date.now()}.pdf`;

            // Update portfolio with new generation info
            await MockDataService.updatePortfolio(studentId, {
                template: template as any,
                lastGenerated: new Date().toISOString(),
                downloadCount: (await MockDataService.getPortfolio(studentId))?.downloadCount || 0
            });

            return {
                data: { url: portfolioUrl },
                message: "Portfolio generated successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to generate portfolio");
        }
    }

    // Notifications
    static async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
        try {
            const data = await MockDataService.getNotifications(userId);
            return {
                data,
                message: "Notifications retrieved successfully",
                success: true,
                total: data.length
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch notifications");
        }
    }

    static async markNotificationAsRead(id: string): Promise<ApiResponse<boolean>> {
        try {
            const data = await MockDataService.markNotificationAsRead(id);
            return {
                data,
                message: "Notification marked as read",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to mark notification as read");
        }
    }

    static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<ApiResponse<Notification>> {
        try {
            const data = await MockDataService.createNotification(notification);
            return {
                data,
                message: "Notification created successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to create notification");
        }
    }

    // Analytics
    static async getAnalytics(studentId?: string): Promise<ApiResponse<Analytics>> {
        try {
            const data = await MockDataService.getAnalytics(studentId);
            return {
                data,
                message: "Analytics retrieved successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch analytics");
        }
    }

    // Users
    static async getAllUsers(): Promise<ApiResponse<User[]>> {
        try {
            const data = await MockDataService.getAllUsers();
            return {
                data,
                message: "Users retrieved successfully",
                success: true,
                total: data.length
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch users");
        }
    }

    static async getUserById(id: string): Promise<ApiResponse<User>> {
        try {
            const data = await MockDataService.getUserById(id);
            if (!data) {
                throw new Error("User not found");
            }
            return {
                data,
                message: "User retrieved successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch user");
        }
    }

    static async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const data = await MockDataService.updateUser(id, updates);
            return {
                data,
                message: "User updated successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to update user");
        }
    }

    // Events
    static async getEvents(): Promise<ApiResponse<any[]>> {
        try {
            const data = await MockDataService.getEvents();
            return {
                data,
                message: "Events retrieved successfully",
                success: true,
                total: data.length
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch events");
        }
    }

    static async registerForEvent(eventId: string, userId: string): Promise<ApiResponse<boolean>> {
        try {
            const data = await MockDataService.registerForEvent(eventId, userId);
            return {
                data,
                message: "Successfully registered for event",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to register for event");
        }
    }

    // Search
    static async searchActivities(query: string, filters?: any): Promise<ApiResponse<Activity[]>> {
        try {
            const data = await MockDataService.searchActivities(query, filters);
            return {
                data,
                message: "Search completed successfully",
                success: true,
                total: data.length
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to search activities");
        }
    }

    // File operations
    static async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
        try {
            const url = await MockDataService.uploadFile(file);
            return {
                data: { url },
                message: "File uploaded successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to upload file");
        }
    }

    static async deleteFile(fileUrl: string): Promise<ApiResponse<boolean>> {
        try {
            const data = await MockDataService.deleteFile(fileUrl);
            return {
                data,
                message: "File deleted successfully",
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to delete file");
        }
    }

    // Bulk operations
    static async bulkApproveActivities(activityIds: string[], approverInfo: { approvedBy: string }): Promise<ApiResponse<Activity[]>> {
        try {
            const results = await Promise.all(
                activityIds.map(id => MockDataService.updateActivity(id, {
                    status: 'approved',
                    approvedBy: approverInfo.approvedBy,
                    approvedAt: new Date().toISOString()
                }))
            );

            return {
                data: results,
                message: `${results.length} activities approved successfully`,
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to bulk approve activities");
        }
    }

    static async bulkRejectActivities(activityIds: string[], rejectionInfo: { rejectionReason: string }): Promise<ApiResponse<Activity[]>> {
        try {
            const results = await Promise.all(
                activityIds.map(id => MockDataService.updateActivity(id, {
                    status: 'rejected',
                    rejectionReason: rejectionInfo.rejectionReason
                }))
            );

            return {
                data: results,
                message: `${results.length} activities rejected`,
                success: true
            };
        } catch (error: any) {
            throw new Error(error.message || "Failed to bulk reject activities");
        }
    }
}

export default ApiService;
