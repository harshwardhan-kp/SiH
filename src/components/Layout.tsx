import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    LayoutDashboard,
    Activity,
    FileText,
    Users,
    BarChart3,
    User,
    LogOut,
    Search,
    Menu,
    X,
    Settings,
    HelpCircle,
} from "lucide-react";
import {
    NotificationBell,
    NotificationCenter,
    ToastNotification,
    useNotifications,
} from "./NotificationCenter";

const navigationItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Activities", href: "/activities", icon: Activity },
    { name: "Portfolio", href: "/portfolio", icon: FileText },
    {
        name: "Faculty Panel",
        href: "/faculty",
        icon: Users,
        roles: ["faculty", "admin"],
    },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: User },
];

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { toastNotification, hideToast } = useNotifications();

    const filteredNavigation = navigationItems.filter(
        (item) => !item.roles || item.roles.includes(user?.role || "student"),
    );

    const handleLogout = () => {
        logout();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // In a real app, implement search functionality
            console.log("Searching for:", searchQuery);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                SSH
                            </span>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">
                                Smart Student Hub
                            </div>
                            <div className="text-xs text-gray-500">
                                DTU Portal
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {filteredNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`${
                                    isActive
                                        ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon
                                    className={`${
                                        isActive
                                            ? "text-primary-600"
                                            : "text-gray-400 group-hover:text-gray-600"
                                    } mr-3 h-5 w-5 flex-shrink-0`}
                                />
                                {item.name}
                                {item.name === "Faculty Panel" &&
                                    user?.role !== "faculty" &&
                                    user?.role !== "admin" && (
                                        <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                            Faculty
                                        </span>
                                    )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="border-t p-4 space-y-2">
                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                        <button className="flex-1 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <Settings className="w-4 h-4 mx-auto" />
                        </button>
                        <button className="flex-1 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <HelpCircle className="w-4 h-4 mx-auto" />
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-medium">
                                {user?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase() || "U"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name}
                            </p>
                            <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500 truncate capitalize">
                                    {user?.role}
                                </p>
                                {user?.semester && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <p className="text-xs text-gray-500">
                                            Sem {user.semester}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:pl-0 min-w-0">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-30 flex h-16 shrink-0 bg-white shadow-sm border-b">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-between px-4 lg:px-6">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-lg">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search activities, students, events..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Current User Role Badge */}
                            <div className="hidden sm:block">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        user?.role === "faculty" ||
                                        user?.role === "admin"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {user?.role
                                        ? user.role.charAt(0).toUpperCase() +
                                          user.role.slice(1)
                                        : "User"}
                                </span>
                            </div>

                            {/* Notification Bell */}
                            <NotificationBell
                                onClick={() => setNotificationCenterOpen(true)}
                            />

                            {/* User Avatar */}
                            <Link
                                to="/profile"
                                className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase() || "U"}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Breadcrumb */}
                <div className="bg-white border-b px-4 lg:px-6 py-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-gray-900">
                            Home
                        </Link>
                        {location.pathname !== "/" && (
                            <>
                                <span>/</span>
                                <span className="font-medium text-gray-900 capitalize">
                                    {location.pathname.split("/")[1] ||
                                        "Dashboard"}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                            © 2024 Smart Student Hub. Built for Delhi
                            Technological University.
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="hover:text-gray-900">
                                Help
                            </a>
                            <a href="#" className="hover:text-gray-900">
                                Privacy
                            </a>
                            <a href="#" className="hover:text-gray-900">
                                Terms
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Notification Center */}
            <NotificationCenter
                isOpen={notificationCenterOpen}
                onClose={() => setNotificationCenterOpen(false)}
            />

            {/* Toast Notifications */}
            {toastNotification && (
                <ToastNotification
                    notification={toastNotification}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};
