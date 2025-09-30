import { Activity, ActivityFormData, Analytics } from "../types";
import ApiService from "./apiService";

export const getActivities = async (filters?: any): Promise<Activity[]> => {
    try {
        const response = await ApiService.getActivities(filters?.studentId);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch activities");
    }
};

export const getActivity = async (id: string): Promise<Activity> => {
    try {
        const response = await ApiService.getActivityById(id);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch activity");
    }
};

export const createActivity = async (
    data: ActivityFormData,
): Promise<Activity> => {
    try {
        // Get current user ID from localStorage token
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        // Handle file uploads
        let certificateUrls: string[] = [];
        let imageUrls: string[] = [];

        if (data.certificates) {
            const certificatePromises = Array.from(data.certificates).map(
                (file) =>
                    ApiService.uploadFile(file).then(
                        (response) => response.data.url,
                    ),
            );
            certificateUrls = await Promise.all(certificatePromises);
        }

        if (data.images) {
            const imagePromises = Array.from(data.images).map((file) =>
                ApiService.uploadFile(file).then(
                    (response) => response.data.url,
                ),
            );
            imageUrls = await Promise.all(imagePromises);
        }

        // Create activity object
        const activityData = {
            title: data.title,
            description: data.description,
            category: data.category,
            type: data.type,
            date: data.date,
            duration: data.duration,
            location: data.location,
            organizer: data.organizer,
            certificates: certificateUrls,
            images: imageUrls,
            status: "pending" as const,
            studentId: userId,
        };

        const response = await ApiService.createActivity(activityData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to create activity");
    }
};

export const updateActivity = async (
    id: string,
    data: Partial<ActivityFormData>,
): Promise<Activity> => {
    try {
        // Handle file uploads if new files are provided
        const updates: any = { ...data };

        if (data.certificates) {
            const certificatePromises = Array.from(data.certificates).map(
                (file) =>
                    ApiService.uploadFile(file).then(
                        (response) => response.data.url,
                    ),
            );
            updates.certificates = await Promise.all(certificatePromises);
        }

        if (data.images) {
            const imagePromises = Array.from(data.images).map((file) =>
                ApiService.uploadFile(file).then(
                    (response) => response.data.url,
                ),
            );
            updates.images = await Promise.all(imagePromises);
        }

        // Remove FileList objects from updates
        delete updates.certificates;
        delete updates.images;

        const response = await ApiService.updateActivity(id, updates);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update activity");
    }
};

export const deleteActivity = async (id: string): Promise<void> => {
    try {
        await ApiService.deleteActivity(id);
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete activity");
    }
};

export const approveActivity = async (id: string): Promise<Activity> => {
    try {
        // Get current user info for approver
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        const response = await ApiService.approveActivity(id, {
            approvedBy: userId,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to approve activity");
    }
};

export const rejectActivity = async (
    id: string,
    reason: string,
): Promise<Activity> => {
    try {
        const response = await ApiService.rejectActivity(id, {
            rejectionReason: reason,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to reject activity");
    }
};

export const getAnalytics = async (studentId?: string): Promise<Analytics> => {
    try {
        const response = await ApiService.getAnalytics(studentId);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch analytics");
    }
};

export const searchActivities = async (
    query: string,
    filters?: any,
): Promise<Activity[]> => {
    try {
        const response = await ApiService.searchActivities(query, filters);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to search activities");
    }
};

export const bulkApproveActivities = async (
    activityIds: string[],
): Promise<Activity[]> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        const response = await ApiService.bulkApproveActivities(activityIds, {
            approvedBy: userId,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to bulk approve activities");
    }
};

export const bulkRejectActivities = async (
    activityIds: string[],
    reason: string,
): Promise<Activity[]> => {
    try {
        const response = await ApiService.bulkRejectActivities(activityIds, {
            rejectionReason: reason,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to bulk reject activities");
    }
};
