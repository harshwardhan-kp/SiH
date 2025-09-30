import React, { useState } from "react";
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    MapPin,
    Award,
    Search,
    FileText,
    Eye,
    Download,
} from "lucide-react";

interface StudentActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    date: string;
    duration?: number;
    location?: string;
    organizer?: string;
    certificates?: string[];
    images?: string[];
    status: "pending" | "approved" | "rejected";
    studentName: string;
    studentId: string;
    studentEmail: string;
    department: string;
    semester: number;
    submittedAt: string;
    points?: number;
}

// Mock faculty data - pending activities for approval
const mockPendingActivities: StudentActivity[] = [
    {
        id: "1",
        title: "National Science Congress 2024 Participation",
        description:
            'Participated in National Science Congress 2024 and presented research paper on "Sustainable Energy Solutions for Rural India". The research focused on implementing solar microgrids in remote villages.',
        category: "academic",
        type: "conference",
        date: "2024-01-15",
        duration: 8,
        location: "IIT Bombay, Mumbai",
        organizer: "Indian Science Congress Association",
        certificates: ["participation-cert.pdf", "paper-abstract.pdf"],
        images: ["presentation.jpg", "certificate.jpg"],
        status: "pending",
        studentName: "Priya Sharma",
        studentId: "DTU2021002",
        studentEmail: "priya.sharma@dtu.ac.in",
        department: "Electrical Engineering",
        semester: 6,
        submittedAt: "2024-01-20T10:30:00Z",
        points: 40,
    },
    {
        id: "2",
        title: "Google Summer of Code 2023 - React Native",
        description:
            "Successfully completed Google Summer of Code program working on React Native performance optimization. Contributed to open-source project with over 10k GitHub stars.",
        category: "internship",
        type: "internship",
        date: "2023-08-20",
        duration: 480, // 3 months in hours
        location: "Remote",
        organizer: "Google Open Source Programs",
        certificates: ["gsoc-completion.pdf"],
        status: "pending",
        studentName: "Arjun Patel",
        studentId: "DTU2020001",
        studentEmail: "arjun.patel@dtu.ac.in",
        department: "Computer Engineering",
        semester: 8,
        submittedAt: "2024-01-18T14:20:00Z",
        points: 60,
    },
    {
        id: "3",
        title: "Blood Donation Camp - Red Cross Society",
        description:
            "Organized and volunteered in blood donation camp in collaboration with Indian Red Cross Society. Successfully collected 100+ units of blood.",
        category: "community-service",
        type: "volunteer",
        date: "2024-01-12",
        duration: 6,
        location: "Delhi Technological University",
        organizer: "Indian Red Cross Society & NSS DTU",
        images: ["camp-setup.jpg", "donors.jpg"],
        status: "pending",
        studentName: "Kavya Singh",
        studentId: "DTU2021003",
        studentEmail: "kavya.singh@dtu.ac.in",
        department: "Mechanical Engineering",
        semester: 6,
        submittedAt: "2024-01-19T09:15:00Z",
        points: 25,
    },
    {
        id: "4",
        title: "IEEE International Conference on AI - Paper Presentation",
        description:
            'Presented research paper titled "Deep Learning Applications in Medical Imaging" at IEEE International Conference on Artificial Intelligence.',
        category: "research",
        type: "conference",
        date: "2024-01-08",
        duration: 4,
        location: "Singapore",
        organizer: "IEEE Computer Society",
        certificates: ["ieee-paper.pdf", "travel-grant.pdf"],
        status: "pending",
        studentName: "Rohit Kumar",
        studentId: "DTU2020005",
        studentEmail: "rohit.kumar@dtu.ac.in",
        department: "Computer Engineering",
        semester: 8,
        submittedAt: "2024-01-16T16:45:00Z",
        points: 50,
    },
    {
        id: "5",
        title: "Hackathon Winner - Smart City Challenge",
        description:
            "Won first prize in Smart City Challenge hackathon organized by Delhi Government. Developed IoT-based traffic management solution.",
        category: "competition",
        type: "hackathon",
        date: "2024-01-05",
        duration: 48,
        location: "Vigyan Bhawan, New Delhi",
        organizer: "Delhi Government & IIT Delhi",
        certificates: ["winner-cert.pdf"],
        images: ["team-photo.jpg", "demo-video.mp4"],
        status: "pending",
        studentName: "Anisha Gupta",
        studentId: "DTU2021004",
        studentEmail: "anisha.gupta@dtu.ac.in",
        department: "Electronics & Communication",
        semester: 6,
        submittedAt: "2024-01-17T11:30:00Z",
        points: 45,
    },
];

export const FacultyPanel: React.FC = () => {
    const [activities, setActivities] = useState<StudentActivity[]>(
        mockPendingActivities,
    );
    const [selectedTab, setSelectedTab] = useState<
        "pending" | "approved" | "rejected"
    >("pending");
    const [selectedActivity, setSelectedActivity] =
        useState<StudentActivity | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const departments = [
        "Computer Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Electronics & Communication",
    ];
    const categories = [
        "academic",
        "research",
        "competition",
        "certification",
        "internship",
        "community-service",
    ];

    // Filter activities based on current tab and filters
    const filteredActivities = activities.filter((activity) => {
        const matchesTab = activity.status === selectedTab;
        const matchesSearch =
            activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesDepartment =
            !selectedDepartment || activity.department === selectedDepartment;
        const matchesCategory =
            !selectedCategory || activity.category === selectedCategory;

        return (
            matchesTab && matchesSearch && matchesDepartment && matchesCategory
        );
    });

    const approveActivity = async (activityId: string) => {
        setActivities((prev) =>
            prev.map((activity) =>
                activity.id === activityId
                    ? { ...activity, status: "approved" as const }
                    : activity,
            ),
        );
        setShowModal(false);
        alert("Activity approved successfully!");
    };

    const rejectActivity = async (activityId: string, reason: string) => {
        if (!reason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        setActivities((prev) =>
            prev.map((activity) =>
                activity.id === activityId
                    ? { ...activity, status: "rejected" as const }
                    : activity,
            ),
        );
        setRejectionReason("");
        setShowModal(false);
        alert("Activity rejected successfully!");
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            academic: "bg-blue-100 text-blue-800",
            research: "bg-purple-100 text-purple-800",
            competition: "bg-green-100 text-green-800",
            certification: "bg-orange-100 text-orange-800",
            internship: "bg-pink-100 text-pink-800",
            "community-service": "bg-teal-100 text-teal-800",
        };
        return (
            colors[category as keyof typeof colors] ||
            "bg-gray-100 text-gray-800"
        );
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return (
            colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        );
    };

    const getTabCount = (status: string) => {
        return activities.filter((activity) => activity.status === status)
            .length;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Faculty Approval Panel
                    </h1>
                    <p className="text-gray-600">
                        Review and manage student activity submissions
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button className="btn btn-outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Pending Review
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {getTabCount("pending")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Approved
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {getTabCount("approved")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Rejected
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {getTabCount("rejected")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Award className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Points
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {activities.reduce(
                                    (sum, activity) =>
                                        sum + (activity.points || 0),
                                    0,
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {["pending", "approved", "rejected"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab as any)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    selectedTab === tab
                                        ? "bg-primary-100 text-primary-700 border-2 border-primary-200"
                                        : "text-gray-500 hover:text-gray-700 border-2 border-transparent hover:bg-gray-50"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <span className="ml-1 text-xs">
                                    ({getTabCount(tab)})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search activities or students..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <select
                            value={selectedDepartment}
                            onChange={(e) =>
                                setSelectedDepartment(e.target.value)
                            }
                            className="input text-sm"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="input text-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.replace("-", " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
                {filteredActivities.map((activity) => (
                    <div
                        key={activity.id}
                        className="card p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {activity.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}
                                    >
                                        {activity.status}
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(activity.category)}`}
                                    >
                                        {activity.category.replace("-", " ")}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center text-sm text-gray-600 mb-1">
                                            <User className="w-4 h-4 mr-2" />
                                            <span className="font-medium">
                                                {activity.studentName}
                                            </span>
                                            <span className="ml-2 text-gray-500">
                                                ({activity.studentId})
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-4 h-4 mr-2 flex items-center justify-center">
                                                🎓
                                            </span>
                                            {activity.department} - Semester{" "}
                                            {activity.semester}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center text-sm text-gray-500 mb-1">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(
                                                activity.date,
                                            ).toLocaleDateString()}
                                        </div>
                                        {activity.location && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {activity.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {activity.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div>Organizer: {activity.organizer}</div>
                                    {activity.duration && (
                                        <div>
                                            Duration: {activity.duration} hours
                                        </div>
                                    )}
                                    <div className="flex items-center font-medium text-green-600">
                                        <Award className="w-4 h-4 mr-1" />
                                        {activity.points} points
                                    </div>
                                </div>

                                {(activity.certificates || activity.images) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {activity.certificates?.map(
                                            (cert, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                                                >
                                                    📄 {cert}
                                                </span>
                                            ),
                                        )}
                                        {activity.images?.map((img, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md"
                                            >
                                                🖼️ {img}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-3 text-xs text-gray-400">
                                    Submitted:{" "}
                                    {new Date(
                                        activity.submittedAt,
                                    ).toLocaleString()}
                                </div>
                            </div>

                            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                                <button
                                    onClick={() => {
                                        setSelectedActivity(activity);
                                        setShowModal(true);
                                    }}
                                    className="btn btn-outline text-sm"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Review
                                </button>

                                {selectedTab === "pending" && (
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() =>
                                                approveActivity(activity.id)
                                            }
                                            className="btn bg-green-600 hover:bg-green-700 text-white text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedActivity(activity);
                                                setShowModal(true);
                                            }}
                                            className="btn bg-red-600 hover:bg-red-700 text-white text-sm"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No activities found
                    </h3>
                    <p className="text-gray-500">
                        {searchQuery || selectedDepartment || selectedCategory
                            ? "No activities match your current filters."
                            : `No ${selectedTab} activities at the moment.`}
                    </p>
                </div>
            )}

            {/* Review Modal */}
            {showModal && selectedActivity && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Review Activity
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Activity Details */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {selectedActivity.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedActivity.status)}`}
                                    >
                                        {selectedActivity.status}
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedActivity.category)}`}
                                    >
                                        {selectedActivity.category.replace(
                                            "-",
                                            " ",
                                        )}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            Student Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Name:</strong>{" "}
                                                {selectedActivity.studentName}
                                            </div>
                                            <div>
                                                <strong>ID:</strong>{" "}
                                                {selectedActivity.studentId}
                                            </div>
                                            <div>
                                                <strong>Email:</strong>{" "}
                                                {selectedActivity.studentEmail}
                                            </div>
                                            <div>
                                                <strong>Department:</strong>{" "}
                                                {selectedActivity.department}
                                            </div>
                                            <div>
                                                <strong>Semester:</strong>{" "}
                                                {selectedActivity.semester}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            Activity Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Date:</strong>{" "}
                                                {new Date(
                                                    selectedActivity.date,
                                                ).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <strong>Duration:</strong>{" "}
                                                {selectedActivity.duration ||
                                                    "N/A"}{" "}
                                                hours
                                            </div>
                                            <div>
                                                <strong>Location:</strong>{" "}
                                                {selectedActivity.location ||
                                                    "N/A"}
                                            </div>
                                            <div>
                                                <strong>Organizer:</strong>{" "}
                                                {selectedActivity.organizer}
                                            </div>
                                            <div>
                                                <strong>Points:</strong>{" "}
                                                {selectedActivity.points}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        Description
                                    </h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {selectedActivity.description}
                                    </p>
                                </div>

                                {(selectedActivity.certificates ||
                                    selectedActivity.images) && (
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            Supporting Documents
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedActivity.certificates && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                        Certificates
                                                    </h5>
                                                    <div className="space-y-1">
                                                        {selectedActivity.certificates.map(
                                                            (cert, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between p-2 bg-blue-50 rounded"
                                                                >
                                                                    <span className="text-sm text-blue-800">
                                                                        📄{" "}
                                                                        {cert}
                                                                    </span>
                                                                    <button className="text-xs text-blue-600 hover:text-blue-800">
                                                                        <Download className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedActivity.images && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                        Images
                                                    </h5>
                                                    <div className="space-y-1">
                                                        {selectedActivity.images.map(
                                                            (img, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between p-2 bg-green-50 rounded"
                                                                >
                                                                    <span className="text-sm text-green-800">
                                                                        🖼️ {img}
                                                                    </span>
                                                                    <button className="text-xs text-green-600 hover:text-green-800">
                                                                        <Eye className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {selectedTab === "pending" && (
                                <div className="border-t pt-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() =>
                                                approveActivity(
                                                    selectedActivity.id,
                                                )
                                            }
                                            className="flex-1 btn bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve Activity
                                        </button>
                                        <div className="flex-1">
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) =>
                                                    setRejectionReason(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Reason for rejection (required)..."
                                                className="w-full p-3 border border-gray-300 rounded-md text-sm mb-2 resize-none"
                                                rows={2}
                                            />
                                            <button
                                                onClick={() =>
                                                    rejectActivity(
                                                        selectedActivity.id,
                                                        rejectionReason,
                                                    )
                                                }
                                                className="w-full btn bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject Activity
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
