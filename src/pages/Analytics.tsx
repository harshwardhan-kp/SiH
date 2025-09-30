import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    TrendingUp,
    Award,
    Calendar,
    Users,
    Target,
    Download,
    Filter,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
);

interface AnalyticsData {
    totalActivities: number;
    approvedActivities: number;
    pendingActivities: number;
    rejectedActivities: number;
    totalPoints: number;
    categoryBreakdown: Record<string, number>;
    monthlyProgress: Array<{
        month: string;
        activities: number;
        points: number;
    }>;
    comparisonData: {
        departmentAverage: number;
        semesterAverage: number;
        rank: number;
    };
    trends: {
        activitiesChange: number;
        pointsChange: number;
        rankChange: number;
    };
}

// Mock analytics data - In real app, this would come from API
const mockAnalytics: AnalyticsData = {
    totalActivities: 15,
    approvedActivities: 12,
    pendingActivities: 2,
    rejectedActivities: 1,
    totalPoints: 485,
    categoryBreakdown: {
        Technical: 5,
        "Community Service": 3,
        Competition: 2,
        Certification: 3,
        Leadership: 1,
        Research: 1,
    },
    monthlyProgress: [
        { month: "Aug", activities: 2, points: 85 },
        { month: "Sep", activities: 3, points: 120 },
        { month: "Oct", activities: 4, points: 150 },
        { month: "Nov", activities: 3, points: 95 },
        { month: "Dec", activities: 2, points: 75 },
        { month: "Jan", activities: 1, points: 60 },
    ],
    comparisonData: {
        departmentAverage: 280,
        semesterAverage: 320,
        rank: 8,
    },
    trends: {
        activitiesChange: 12.5,
        pointsChange: 8.3,
        rankChange: -2,
    },
};

export const Analytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<
        "6months" | "1year" | "all"
    >("6months");

    useEffect(() => {
        // In a real app, fetch analytics data from API
        setLoading(true);
        setTimeout(() => {
            setAnalytics(mockAnalytics);
            setLoading(false);
        }, 1000);
    }, [selectedPeriod]);

    // Chart configurations
    const categoryChartData = {
        labels: Object.keys(analytics.categoryBreakdown),
        datasets: [
            {
                data: Object.values(analytics.categoryBreakdown),
                backgroundColor: [
                    "#3B82F6",
                    "#10B981",
                    "#8B5CF6",
                    "#F59E0B",
                    "#EF4444",
                    "#06B6D4",
                    "#84CC16",
                    "#F97316",
                ],
                borderWidth: 2,
                borderColor: "#ffffff",
            },
        ],
    };

    const monthlyProgressData = {
        labels: analytics.monthlyProgress.map((m) => m.month),
        datasets: [
            {
                label: "Activities",
                data: analytics.monthlyProgress.map((m) => m.activities),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
                yAxisID: "y",
            },
        ],
    };

    const monthlyPointsData = {
        labels: analytics.monthlyProgress.map((m) => m.month),
        datasets: [
            {
                label: "Points",
                data: analytics.monthlyProgress.map((m) => m.points),
                borderColor: "rgb(16, 185, 129)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const getTrendIcon = (change: number) => {
        return change > 0 ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
        ) : (
            <ArrowDown className="w-4 h-4 text-red-500" />
        );
    };

    const getTrendColor = (change: number) => {
        return change > 0 ? "text-green-600" : "text-red-600";
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="card p-6">
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Comprehensive insights into your academic journey
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) =>
                            setSelectedPeriod(e.target.value as any)
                        }
                        className="input"
                    >
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last Year</option>
                        <option value="all">All Time</option>
                    </select>
                    <button className="btn btn-outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                    <button className="btn btn-primary">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Activities
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.totalActivities}
                            </p>
                            <div className="flex items-center mt-2">
                                {getTrendIcon(
                                    analytics.trends.activitiesChange,
                                )}
                                <span
                                    className={`text-sm ml-1 ${getTrendColor(analytics.trends.activitiesChange)}`}
                                >
                                    {Math.abs(
                                        analytics.trends.activitiesChange,
                                    )}
                                    % from last period
                                </span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Points
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.totalPoints}
                            </p>
                            <div className="flex items-center mt-2">
                                {getTrendIcon(analytics.trends.pointsChange)}
                                <span
                                    className={`text-sm ml-1 ${getTrendColor(analytics.trends.pointsChange)}`}
                                >
                                    {Math.abs(analytics.trends.pointsChange)}%
                                    from last period
                                </span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Award className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Department Rank
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                #{analytics.comparisonData.rank}
                            </p>
                            <div className="flex items-center mt-2">
                                {getTrendIcon(-analytics.trends.rankChange)}{" "}
                                {/* Negative because lower rank is better */}
                                <span
                                    className={`text-sm ml-1 ${getTrendColor(-analytics.trends.rankChange)}`}
                                >
                                    {Math.abs(analytics.trends.rankChange)}{" "}
                                    positions
                                </span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Approval Rate
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(
                                    (analytics.approvedActivities /
                                        analytics.totalActivities) *
                                        100,
                                )}
                                %
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {analytics.approvedActivities} of{" "}
                                {analytics.totalActivities} approved
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <Target className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Activity Categories
                        </h3>
                        <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="h-80">
                        <Doughnut
                            data={categoryChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Progress Comparison */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Performance Comparison
                        </h3>
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Your Points
                                </span>
                                <span className="text-lg font-bold text-primary-600">
                                    {analytics.totalPoints}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-primary-600 h-3 rounded-full"
                                    style={{ width: "100%" }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Department Average
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                    {analytics.comparisonData.departmentAverage}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full"
                                    style={{
                                        width: `${(analytics.comparisonData.departmentAverage / analytics.totalPoints) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Semester Average
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                    {analytics.comparisonData.semesterAverage}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-green-500 h-3 rounded-full"
                                    style={{
                                        width: `${(analytics.comparisonData.semesterAverage / analytics.totalPoints) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            🎉 You're performing{" "}
                            <strong>
                                {analytics.totalPoints >
                                analytics.comparisonData.departmentAverage
                                    ? "above"
                                    : "below"}
                            </strong>{" "}
                            the department average! Keep up the great work!
                        </p>
                    </div>
                </div>
            </div>

            {/* Monthly Progress Chart */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Monthly Progress Trend
                    </h3>
                    <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-80">
                        <Bar
                            data={monthlyProgressData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Monthly Activities",
                                    },
                                    legend: {
                                        position: "top" as const,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Activities",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="h-80">
                        <Bar
                            data={monthlyPointsData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Monthly Points",
                                    },
                                    legend: {
                                        position: "top" as const,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Points Earned",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Activity Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                {analytics.approvedActivities}
                            </p>
                            <p className="text-sm text-gray-600">
                                Approved Activities
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full">
                            <Award className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                        width: `${(analytics.approvedActivities / analytics.totalActivities) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                                {Math.round(
                                    (analytics.approvedActivities /
                                        analytics.totalActivities) *
                                        100,
                                )}
                                %
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                {analytics.pendingActivities}
                            </p>
                            <p className="text-sm text-gray-600">
                                Pending Review
                            </p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    style={{
                                        width: `${(analytics.pendingActivities / analytics.totalActivities) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                                {Math.round(
                                    (analytics.pendingActivities /
                                        analytics.totalActivities) *
                                        100,
                                )}
                                %
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                {analytics.rejectedActivities}
                            </p>
                            <p className="text-sm text-gray-600">Rejected</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-full">
                            <Users className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{
                                        width: `${(analytics.rejectedActivities / analytics.totalActivities) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                                {Math.round(
                                    (analytics.rejectedActivities /
                                        analytics.totalActivities) *
                                        100,
                                )}
                                %
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personalized Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">
                            🎯 Focus Areas
                        </h4>
                        <p className="text-sm text-gray-600">
                            Consider adding more research activities to improve
                            your academic profile. Research projects can earn up
                            to 60 points each.
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">
                            📈 Growth Opportunity
                        </h4>
                        <p className="text-sm text-gray-600">
                            You're{" "}
                            {analytics.totalPoints >
                            analytics.comparisonData.departmentAverage
                                ? `${analytics.totalPoints - analytics.comparisonData.departmentAverage} points ahead`
                                : `${analytics.comparisonData.departmentAverage - analytics.totalPoints} points behind`}{" "}
                            the department average. Keep up the momentum!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
