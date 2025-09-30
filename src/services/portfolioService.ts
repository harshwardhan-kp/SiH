import { Portfolio, Skill, Project, Achievement } from "../types";
import ApiService from "./apiService";

export interface PortfolioGenerationOptions {
    template: "modern" | "classic" | "minimal";
    includeActivities: boolean;
    includeProjects: boolean;
    includeSkills: boolean;
    includeAchievements: boolean;
    isPublic: boolean;
}

export const getPortfolio = async (studentId?: string): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const currentUserId = token.split("-")[2];
        const targetStudentId = studentId || currentUserId;

        const response = await ApiService.getPortfolio(targetStudentId);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch portfolio");
    }
};

export const updatePortfolio = async (
    portfolioData: Partial<Portfolio>,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const response = await ApiService.updatePortfolio(
            userId,
            portfolioData,
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update portfolio");
    }
};

export const generatePortfolioPDF = async (
    options: PortfolioGenerationOptions,
): Promise<Blob> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        // Simulate PDF generation
        await ApiService.generatePortfolio(userId, options.template);

        // Create a mock PDF blob
        const pdfContent = `Portfolio PDF for user ${userId} with template ${options.template}`;
        const blob = new Blob([pdfContent], { type: "application/pdf" });

        return blob;
    } catch (error: any) {
        throw new Error(error.message || "Failed to generate portfolio PDF");
    }
};

export const sharePortfolio = async (
    isPublic: boolean,
): Promise<{ shareUrl: string }> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        await ApiService.updatePortfolio(userId, { isPublic });

        const shareUrl = isPublic
            ? `${window.location.origin}/portfolio/public/${userId}`
            : "";

        return { shareUrl };
    } catch (error: any) {
        throw new Error(
            error.message || "Failed to update portfolio sharing settings",
        );
    }
};

export const getPublicPortfolio = async (
    studentId: string,
): Promise<Portfolio> => {
    try {
        const response = await ApiService.getPortfolio(studentId);

        // Check if portfolio is public
        if (!response.data.isPublic) {
            throw new Error("Portfolio is not public");
        }

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch public portfolio");
    }
};

export const addSkillToPortfolio = async (skill: {
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
    category: string;
}): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const newSkill: Skill = {
            id: String(Date.now()),
            name: skill.name,
            level: skill.level,
            category: skill.category,
            verified: false,
        };

        const updatedSkills = [
            ...(currentPortfolio.data.skills || []),
            newSkill,
        ];

        const response = await ApiService.updatePortfolio(userId, {
            skills: updatedSkills,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to add skill");
    }
};

export const updateSkillInPortfolio = async (
    skillId: string,
    updates: Partial<Skill>,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const updatedSkills =
            currentPortfolio.data.skills?.map((skill) =>
                skill.id === skillId ? { ...skill, ...updates } : skill,
            ) || [];

        const response = await ApiService.updatePortfolio(userId, {
            skills: updatedSkills,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update skill");
    }
};

export const removeSkillFromPortfolio = async (
    skillId: string,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const updatedSkills =
            currentPortfolio.data.skills?.filter(
                (skill) => skill.id !== skillId,
            ) || [];

        const response = await ApiService.updatePortfolio(userId, {
            skills: updatedSkills,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to remove skill");
    }
};

export const addProjectToPortfolio = async (project: {
    title: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate?: string;
    status: "ongoing" | "completed" | "paused";
    githubUrl?: string;
    demoUrl?: string;
}): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const newProject: Project = {
            id: String(Date.now()),
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            images: [],
        };

        const updatedProjects = [
            ...(currentPortfolio.data.projects || []),
            newProject,
        ];

        const response = await ApiService.updatePortfolio(userId, {
            projects: updatedProjects,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to add project");
    }
};

export const updateProjectInPortfolio = async (
    projectId: string,
    updates: Partial<Project>,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const updatedProjects =
            currentPortfolio.data.projects?.map((project) =>
                project.id === projectId ? { ...project, ...updates } : project,
            ) || [];

        const response = await ApiService.updatePortfolio(userId, {
            projects: updatedProjects,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update project");
    }
};

export const removeProjectFromPortfolio = async (
    projectId: string,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const updatedProjects =
            currentPortfolio.data.projects?.filter(
                (project) => project.id !== projectId,
            ) || [];

        const response = await ApiService.updatePortfolio(userId, {
            projects: updatedProjects,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to remove project");
    }
};

export const addAchievementToPortfolio = async (achievement: {
    title: string;
    description: string;
    date: string;
    issuer: string;
    certificateUrl?: string;
    category: string;
}): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const newAchievement: Achievement = {
            id: String(Date.now()),
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            issuer: achievement.issuer,
            certificateUrl: achievement.certificateUrl,
            category: achievement.category,
        };

        const updatedAchievements = [
            ...(currentPortfolio.data.achievements || []),
            newAchievement,
        ];

        const response = await ApiService.updatePortfolio(userId, {
            achievements: updatedAchievements,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to add achievement");
    }
};

export const updateAchievementInPortfolio = async (
    achievementId: string,
    updates: Partial<Achievement>,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const updatedAchievements =
            currentPortfolio.data.achievements?.map((achievement) =>
                achievement.id === achievementId
                    ? { ...achievement, ...updates }
                    : achievement,
            ) || [];

        const response = await ApiService.updatePortfolio(userId, {
            achievements: updatedAchievements,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update achievement");
    }
};

export const removeAchievementFromPortfolio = async (
    achievementId: string,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];
        const currentPortfolio = await ApiService.getPortfolio(userId);

        const updatedAchievements =
            currentPortfolio.data.achievements?.filter(
                (achievement) => achievement.id !== achievementId,
            ) || [];

        const response = await ApiService.updatePortfolio(userId, {
            achievements: updatedAchievements,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to remove achievement");
    }
};

export const uploadProjectImage = async (
    projectId: string,
    file: File,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        // Upload file and get URL
        const uploadResponse = await ApiService.uploadFile(file);
        const imageUrl = uploadResponse.data.url;

        // Get current portfolio
        const currentPortfolio = await ApiService.getPortfolio(userId);

        // Update project with new image
        const updatedProjects =
            currentPortfolio.data.projects?.map((project) => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        images: [...(project.images || []), imageUrl],
                    };
                }
                return project;
            }) || [];

        const response = await ApiService.updatePortfolio(userId, {
            projects: updatedProjects,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to upload project image");
    }
};

export const removeProjectImage = async (
    projectId: string,
    imageUrl: string,
): Promise<Portfolio> => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const userId = token.split("-")[2];

        // Delete file
        await ApiService.deleteFile(imageUrl);

        // Get current portfolio
        const currentPortfolio = await ApiService.getPortfolio(userId);

        // Update project by removing image
        const updatedProjects =
            currentPortfolio.data.projects?.map((project) => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        images:
                            project.images?.filter((url) => url !== imageUrl) ||
                            [],
                    };
                }
                return project;
            }) || [];

        const response = await ApiService.updatePortfolio(userId, {
            projects: updatedProjects,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to remove project image");
    }
};
