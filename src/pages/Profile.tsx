import React, { useState, useRef } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    Shield,
    Bell,
    Eye,
    EyeOff,
    Key,
    Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProfileData {
    personalInfo: {
        name: string;
        studentId: string;
        email: string;
        phone: string;
        department: string;
        semester: number;
        dateOfBirth: string;
        address: string;
        linkedin: string;
        github: string;
        website: string;
        bio: string;
    };
    preferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        publicProfile: boolean;
        showContactInfo: boolean;
    };
    stats: {
        totalActivities: number;
        approvedActivities: number;
        totalPoints: number;
        rank: number;
    };
}

// Mock profile data
const mockProfileData: ProfileData = {
    personalInfo: {
        name: "Harshwardhan",
        studentId: "RG250452",
        email: "harshwardhan_250452@aitpune.edu.in",
        phone: "+91-9096453940",
        department: "Information Technology",
        semester: 6,
        dateOfBirth: "2003-05-15",
        address: "H-123, Hostel Block A, AIT Pune, Dighi, Pune",
        linkedin: "https://linkedin.com/in/harshwardhan",
        github: "https://github.com/harshwardhan-kp",
        website: "https://harshwardhan.dev",
        bio: "Passionate Information Technology student with interests in AI/ML, web development, and open-source contributions. Winner of multiple hackathons and active contributor to the tech community.",
    },
    preferences: {
        emailNotifications: true,
        pushNotifications: false,
        publicProfile: true,
        showContactInfo: false,
    },
    stats: {
        totalActivities: 15,
        approvedActivities: 12,
        totalPoints: 485,
        rank: 8,
    },
};

export const Profile: React.FC = () => {
    const {} = useAuth();
    const [profileData, setProfileData] =
        useState<ProfileData>(mockProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<
        "profile" | "security" | "preferences"
    >("profile");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // In real app, make API call to update profile
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        setIsSaving(true);
        try {
            // In real app, make API call to change password
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            alert("Password changed successfully!");
        } catch (error) {
            alert("Failed to change password. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // In real app, upload to server
            console.log("Uploading avatar:", file);
            alert("Avatar upload functionality would be implemented here.");
        }
    };

    const handleInputChange = (
        field: keyof ProfileData["personalInfo"],
        value: string,
    ) => {
        setProfileData((prev) => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value,
            },
        }));
    };

    const handlePreferenceChange = (
        field: keyof ProfileData["preferences"],
        value: boolean,
    ) => {
        setProfileData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value,
            },
        }));
    };

    const ProfileTab = () => (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="card p-6">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {profileData.personalInfo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {profileData.personalInfo.name}
                                </h2>
                                <p className="text-gray-600">
                                    {profileData.personalInfo.studentId}
                                </p>
                                <p className="text-primary-600 font-medium">
                                    {profileData.personalInfo.department}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="btn btn-outline"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {profileData.stats.totalActivities}
                        </div>
                        <div className="text-sm text-gray-600">
                            Total Activities
                        </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {profileData.stats.approvedActivities}
                        </div>
                        <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {profileData.stats.totalPoints}
                        </div>
                        <div className="text-sm text-gray-600">
                            Points Earned
                        </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            #{profileData.stats.rank}
                        </div>
                        <div className="text-sm text-gray-600">
                            Department Rank
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Personal Information
                    </h3>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn btn-primary"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={profileData.personalInfo.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profileData.personalInfo.email}
                            onChange={(e) =>
                                handleInputChange("email", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={profileData.personalInfo.phone}
                            onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={profileData.personalInfo.dateOfBirth}
                            onChange={(e) =>
                                handleInputChange("dateOfBirth", e.target.value)
                            }
                            disabled={!isEditing}
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Address
                        </label>
                        <textarea
                            value={profileData.personalInfo.address}
                            onChange={(e) =>
                                handleInputChange("address", e.target.value)
                            }
                            disabled={!isEditing}
                            rows={2}
                            className={`input w-full resize-none ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={profileData.personalInfo.bio}
                            onChange={(e) =>
                                handleInputChange("bio", e.target.value)
                            }
                            disabled={!isEditing}
                            rows={3}
                            placeholder="Tell us about yourself..."
                            className={`input w-full resize-none ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>
                </div>
            </div>

            {/* Academic Information */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student ID
                        </label>
                        <input
                            type="text"
                            value={profileData.personalInfo.studentId}
                            disabled
                            className="input w-full bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <input
                            type="text"
                            value={profileData.personalInfo.department}
                            disabled
                            className="input w-full bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Semester
                        </label>
                        <input
                            type="number"
                            value={profileData.personalInfo.semester}
                            disabled
                            className="input w-full bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Social Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn Profile
                        </label>
                        <input
                            type="url"
                            value={profileData.personalInfo.linkedin}
                            onChange={(e) =>
                                handleInputChange("linkedin", e.target.value)
                            }
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/username"
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Profile
                        </label>
                        <input
                            type="url"
                            value={profileData.personalInfo.github}
                            onChange={(e) =>
                                handleInputChange("github", e.target.value)
                            }
                            disabled={!isEditing}
                            placeholder="https://github.com/username"
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Personal Website
                        </label>
                        <input
                            type="url"
                            value={profileData.personalInfo.website}
                            onChange={(e) =>
                                handleInputChange("website", e.target.value)
                            }
                            disabled={!isEditing}
                            placeholder="https://yourwebsite.com"
                            className={`input w-full ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const SecurityTab = () => (
        <div className="space-y-6">
            {/* Change Password */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Change Password
                </h3>
                <div className="max-w-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="input w-full pr-10"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input w-full"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input w-full"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        onClick={handlePasswordChange}
                        disabled={
                            isSaving ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword
                        }
                        className="btn btn-primary"
                    >
                        <Key className="w-4 h-4 mr-2" />
                        {isSaving ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 mb-2">
                            Add an extra layer of security to your account
                        </p>
                        <p className="text-sm text-gray-500">Not enabled</p>
                    </div>
                    <button className="btn btn-outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Enable 2FA
                    </button>
                </div>
            </div>

            {/* Login Sessions */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Active Sessions
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">
                                Current Session
                            </div>
                            <div className="text-sm text-gray-500">
                                Chrome on MacOS • India • Active now
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Current
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const PreferencesTab = () => (
        <div className="space-y-6">
            {/* Notification Preferences */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Notification Preferences
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Email Notifications
                            </h4>
                            <p className="text-sm text-gray-500">
                                Receive updates about activity approvals and
                                announcements
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={
                                    profileData.preferences.emailNotifications
                                }
                                onChange={(e) =>
                                    handlePreferenceChange(
                                        "emailNotifications",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Push Notifications
                            </h4>
                            <p className="text-sm text-gray-500">
                                Receive instant notifications on your device
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={
                                    profileData.preferences.pushNotifications
                                }
                                onChange={(e) =>
                                    handlePreferenceChange(
                                        "pushNotifications",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Privacy Preferences */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Privacy Preferences
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Public Profile
                            </h4>
                            <p className="text-sm text-gray-500">
                                Make your profile visible to other students and
                                faculty
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={profileData.preferences.publicProfile}
                                onChange={(e) =>
                                    handlePreferenceChange(
                                        "publicProfile",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Show Contact Information
                            </h4>
                            <p className="text-sm text-gray-500">
                                Display your email and phone number on your
                                public profile
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={
                                    profileData.preferences.showContactInfo
                                }
                                onChange={(e) =>
                                    handlePreferenceChange(
                                        "showContactInfo",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Data Export */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Data Export
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 mb-2">
                            Download a copy of your data
                        </p>
                        <p className="text-sm text-gray-500">
                            Export all your activities, achievements, and
                            profile information
                        </p>
                    </div>
                    <button className="btn btn-outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Profile Settings
                </h1>
                <p className="text-gray-600">
                    Manage your personal information and account preferences
                </p>
            </div>

            {/* Tabs */}
            <div className="card p-0 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            { id: "security", label: "Security", icon: Shield },
                            {
                                id: "preferences",
                                label: "Preferences",
                                icon: Bell,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? "border-primary-500 text-primary-600 bg-primary-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <tab.icon className="w-4 h-4 inline mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "profile" && <ProfileTab />}
                    {activeTab === "security" && <SecurityTab />}
                    {activeTab === "preferences" && <PreferencesTab />}
                </div>
            </div>
        </div>
    );
};
