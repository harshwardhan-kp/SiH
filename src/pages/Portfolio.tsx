import React, { useState, useRef } from "react";
import {
    Download,
    Share,
    Eye,
    User,
    Award,
    Briefcase,
    BookOpen,
    Calendar,
    MapPin,
    ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PortfolioData {
    personalInfo: {
        name: string;
        studentId: string;
        email: string;
        department: string;
        semester: number;
        phone?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    activities: Array<{
        id: string;
        title: string;
        description: string;
        category: string;
        type: string;
        date: string;
        location?: string;
        organizer?: string;
        status: string;
        points?: number;
    }>;
    achievements: Array<{
        id: string;
        title: string;
        description: string;
        date: string;
        issuer: string;
        certificateUrl?: string;
        category: string;
    }>;
    skills: Array<{
        id: string;
        name: string;
        level: "beginner" | "intermediate" | "advanced" | "expert";
        category: string;
        verified: boolean;
    }>;
    projects: Array<{
        id: string;
        title: string;
        description: string;
        technologies: string[];
        startDate: string;
        endDate?: string;
        status: "ongoing" | "completed" | "paused";
        githubUrl?: string;
        demoUrl?: string;
    }>;
}

// Mock portfolio data
const mockPortfolioData: PortfolioData = {
    personalInfo: {
        name: "Raj Kumar Singh",
        studentId: "DTU2021001",
        email: "raj.kumar@dtu.ac.in",
        department: "Computer Engineering",
        semester: 6,
        phone: "+91-9876543210",
        linkedin: "https://linkedin.com/in/rajkumar-singh",
        github: "https://github.com/rajkumar",
        website: "https://rajkumar.dev",
    },
    activities: [
        {
            id: "1",
            title: "Smart India Hackathon 2024 - Healthcare Winner",
            description:
                "Won first place in Smart India Hackathon 2024 under Healthcare theme with AI-based rural healthcare solution for diabetic retinopathy detection.",
            category: "competition",
            type: "hackathon",
            date: "2024-01-10",
            location: "IIT Delhi, Hauz Khas",
            organizer: "AICTE & Ministry of Education",
            status: "approved",
            points: 50,
        },
        {
            id: "2",
            title: "NPTEL Machine Learning Certification - Elite",
            description:
                "Completed NPTEL ML course by Prof. Balaraman Ravindran from IIT Madras with Elite certification (Top 5% among 50,000+ participants).",
            category: "certification",
            type: "course",
            date: "2024-01-08",
            location: "Online - NPTEL Platform",
            organizer: "IIT Madras via NPTEL",
            status: "approved",
            points: 35,
        },
        {
            id: "3",
            title: "Digital India Internship at NASSCOM",
            description:
                "Completed 3-month internship working on Digital India initiatives, developing web app for tracking digital literacy programs.",
            category: "internship",
            type: "internship",
            date: "2023-12-15",
            location: "NASSCOM Office, Noida",
            organizer: "NASSCOM & Digital India Corporation",
            status: "approved",
            points: 40,
        },
    ],
    achievements: [
        {
            id: "1",
            title: "Dean's List Academic Excellence",
            description:
                "Achieved Dean's List recognition for maintaining CGPA above 9.0 for consecutive semesters",
            date: "2023-12-01",
            issuer: "Delhi Technological University",
            category: "Academic",
        },
        {
            id: "2",
            title: "Best Innovation Award - Techfest",
            description:
                "Awarded for developing an AI-powered solution for sustainable agriculture",
            date: "2023-10-15",
            issuer: "IIT Bombay Techfest",
            category: "Innovation",
        },
    ],
    skills: [
        {
            id: "1",
            name: "React.js",
            level: "advanced",
            category: "Frontend",
            verified: true,
        },
        {
            id: "2",
            name: "Node.js",
            level: "intermediate",
            category: "Backend",
            verified: true,
        },
        {
            id: "3",
            name: "Python",
            level: "advanced",
            category: "Programming",
            verified: true,
        },
        {
            id: "4",
            name: "Machine Learning",
            level: "intermediate",
            category: "AI/ML",
            verified: true,
        },
        {
            id: "5",
            name: "Leadership",
            level: "advanced",
            category: "Soft Skills",
            verified: false,
        },
        {
            id: "6",
            name: "Project Management",
            level: "intermediate",
            category: "Management",
            verified: false,
        },
    ],
    projects: [
        {
            id: "1",
            title: "Smart Healthcare Platform",
            description:
                "AI-powered platform for rural healthcare with diabetic retinopathy detection using deep learning",
            technologies: [
                "React",
                "Python",
                "TensorFlow",
                "Node.js",
                "MongoDB",
            ],
            startDate: "2023-09-01",
            endDate: "2024-01-15",
            status: "completed",
            githubUrl: "https://github.com/rajkumar/smart-healthcare",
            demoUrl: "https://smart-healthcare.vercel.app",
        },
        {
            id: "2",
            title: "Digital Literacy Tracker",
            description:
                "Web application to track and manage digital literacy programs across rural areas in India",
            technologies: ["Vue.js", "Express", "PostgreSQL", "Docker"],
            startDate: "2023-10-01",
            endDate: "2023-12-15",
            status: "completed",
            githubUrl: "https://github.com/rajkumar/digital-literacy-tracker",
        },
        {
            id: "3",
            title: "Campus Event Management System",
            description:
                "Comprehensive platform for managing college events, registrations, and feedback",
            technologies: ["React Native", "Firebase", "Node.js"],
            startDate: "2024-01-01",
            status: "ongoing",
            githubUrl: "https://github.com/rajkumar/campus-events",
        },
    ],
};

type PortfolioTemplate = "modern" | "classic" | "minimal";

export const Portfolio: React.FC = () => {
    const { user } = useAuth();
    const [selectedTemplate, setSelectedTemplate] =
        useState<PortfolioTemplate>("modern");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const portfolioRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!portfolioRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(portfolioRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(
                imgData,
                "PNG",
                imgX,
                imgY,
                imgWidth * ratio,
                imgHeight * ratio,
            );
            pdf.save(
                `${mockPortfolioData.personalInfo.name.replace(/\s+/g, "_")}_Portfolio.pdf`,
            );
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const sharePortfolio = () => {
        const shareUrl = `${window.location.origin}/portfolio/public/${user?.id}`;
        navigator.clipboard.writeText(shareUrl);
        alert("Portfolio link copied to clipboard!");
    };

    const getSkillLevelColor = (level: string) => {
        const colors = {
            beginner: "bg-red-100 text-red-800",
            intermediate: "bg-yellow-100 text-yellow-800",
            advanced: "bg-blue-100 text-blue-800",
            expert: "bg-green-100 text-green-800",
        };
        return (
            colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"
        );
    };

    const getStatusColor = (status: string) => {
        const colors = {
            ongoing: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            paused: "bg-gray-100 text-gray-800",
        };
        return (
            colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        );
    };

    const ModernTemplate = () => (
        <div className="bg-white">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">
                            {mockPortfolioData.personalInfo.name}
                        </h1>
                        <p className="text-xl text-primary-100 mb-2">
                            {mockPortfolioData.personalInfo.department}
                        </p>
                        <p className="text-primary-200 mb-4">
                            Student ID:{" "}
                            {mockPortfolioData.personalInfo.studentId} •
                            Semester {mockPortfolioData.personalInfo.semester}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span>
                                📧 {mockPortfolioData.personalInfo.email}
                            </span>
                            {mockPortfolioData.personalInfo.phone && (
                                <span>
                                    📱 {mockPortfolioData.personalInfo.phone}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3">
                            {mockPortfolioData.personalInfo.linkedin && (
                                <a
                                    href={
                                        mockPortfolioData.personalInfo.linkedin
                                    }
                                    className="text-primary-100 hover:text-white"
                                >
                                    LinkedIn{" "}
                                    <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                            )}
                            {mockPortfolioData.personalInfo.github && (
                                <a
                                    href={mockPortfolioData.personalInfo.github}
                                    className="text-primary-100 hover:text-white"
                                >
                                    GitHub{" "}
                                    <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                            )}
                            {mockPortfolioData.personalInfo.website && (
                                <a
                                    href={
                                        mockPortfolioData.personalInfo.website
                                    }
                                    className="text-primary-100 hover:text-white"
                                >
                                    Portfolio{" "}
                                    <ExternalLink className="w-3 h-3 inline ml-1" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {mockPortfolioData.activities.length}
                        </div>
                        <div className="text-sm text-gray-600">Activities</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {mockPortfolioData.activities.reduce(
                                (sum, activity) => sum + (activity.points || 0),
                                0,
                            )}
                        </div>
                        <div className="text-sm text-gray-600">
                            Points Earned
                        </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {mockPortfolioData.projects.length}
                        </div>
                        <div className="text-sm text-gray-600">Projects</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {mockPortfolioData.achievements.length}
                        </div>
                        <div className="text-sm text-gray-600">
                            Achievements
                        </div>
                    </div>
                </div>

                {/* Activities Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <Award className="w-6 h-6 text-primary-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Activities & Certifications
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {mockPortfolioData.activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {activity.title}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {activity.category}
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            +{activity.points} pts
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-3">
                                    {activity.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(
                                            activity.date,
                                        ).toLocaleDateString()}
                                    </div>
                                    {activity.location && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {activity.location}
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <span className="w-4 h-4 mr-1 flex items-center justify-center">
                                            🏢
                                        </span>
                                        {activity.organizer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Projects Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <Briefcase className="w-6 h-6 text-primary-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Projects
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockPortfolioData.projects.map((project) => (
                            <div
                                key={project.id}
                                className="border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {project.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {project.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>
                                        {project.startDate} -{" "}
                                        {project.endDate || "Present"}
                                    </span>
                                    <div className="flex space-x-2">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                GitHub{" "}
                                                <ExternalLink className="w-3 h-3 inline ml-1" />
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                Demo{" "}
                                                <ExternalLink className="w-3 h-3 inline ml-1" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <BookOpen className="w-6 h-6 text-primary-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Skills
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(
                            mockPortfolioData.skills.reduce(
                                (acc, skill) => {
                                    if (!acc[skill.category])
                                        acc[skill.category] = [];
                                    acc[skill.category].push(skill);
                                    return acc;
                                },
                                {} as Record<
                                    string,
                                    typeof mockPortfolioData.skills
                                >,
                            ),
                        ).map(([category, skills]) => (
                            <div
                                key={category}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    {category}
                                </h3>
                                <div className="space-y-2">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-sm text-gray-700">
                                                {skill.name}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${getSkillLevelColor(skill.level)}`}
                                                >
                                                    {skill.level}
                                                </span>
                                                {skill.verified && (
                                                    <span className="text-green-500 text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <Award className="w-6 h-6 text-primary-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Achievements
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {mockPortfolioData.achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {achievement.title}
                                    </h3>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                        {achievement.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">
                                    {achievement.description}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>
                                        {new Date(
                                            achievement.date,
                                        ).toLocaleDateString()}
                                    </span>
                                    <span>Issued by: {achievement.issuer}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Digital Portfolio
                    </h1>
                    <p className="text-gray-600">
                        Generate and manage your professional digital portfolio
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
                    <select
                        value={selectedTemplate}
                        onChange={(e) =>
                            setSelectedTemplate(
                                e.target.value as PortfolioTemplate,
                            )
                        }
                        className="input"
                    >
                        <option value="modern">Modern Template</option>
                        <option value="classic">Classic Template</option>
                        <option value="minimal">Minimal Template</option>
                    </select>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="btn btn-outline"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {showPreview ? "Hide" : "Show"} Preview
                    </button>
                    <button
                        onClick={sharePortfolio}
                        className="btn btn-outline"
                    >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                    </button>
                    <button
                        onClick={generatePDF}
                        disabled={isGenerating}
                        className="btn btn-primary"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </button>
                </div>
            </div>

            {/* Template Selection */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Portfolio Templates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["modern", "classic", "minimal"].map((template) => (
                        <div
                            key={template}
                            onClick={() =>
                                setSelectedTemplate(
                                    template as PortfolioTemplate,
                                )
                            }
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                selectedTemplate === template
                                    ? "border-primary-500 bg-primary-50"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3"></div>
                            <h4 className="font-medium text-gray-900 capitalize">
                                {template}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {template === "modern" &&
                                    "Clean and professional with gradient headers"}
                                {template === "classic" &&
                                    "Traditional academic resume style"}
                                {template === "minimal" &&
                                    "Simple and elegant design"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Portfolio Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Award className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Activities
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockPortfolioData.activities.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Points
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockPortfolioData.activities.reduce(
                                    (sum, activity) =>
                                        sum + (activity.points || 0),
                                    0,
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockPortfolioData.projects.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <User className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Skills
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockPortfolioData.skills.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Preview */}
            {showPreview && (
                <div className="card overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Portfolio Preview
                        </h3>
                    </div>
                    <div
                        ref={portfolioRef}
                        className="max-h-[800px] overflow-y-auto"
                        style={{ fontFamily: "Arial, sans-serif" }}
                    >
                        {selectedTemplate === "modern" && <ModernTemplate />}
                        {/* Add other templates here */}
                    </div>
                </div>
            )}

            {/* Generation Status */}
            {isGenerating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Generating PDF...
                            </h3>
                            <p className="text-gray-600">
                                Please wait while we create your portfolio PDF.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
