import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginCredentials } from "../types";
import DemoGuide from "../components/DemoGuide";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDemoGuide, setShowDemoGuide] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(formData);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-2xl font-bold">S</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            Smart Student Hub
                        </h1>
                        <p className="text-xl opacity-90">
                            Centralized Digital Platform for Comprehensive
                            Student Activity Records
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-sm">✓</span>
                            </div>
                            <span>
                                Track all academic and extracurricular
                                activities
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-sm">✓</span>
                            </div>
                            <span>Generate verified digital portfolios</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-sm">✓</span>
                            </div>
                            <span>Faculty approval and validation system</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-sm">✓</span>
                            </div>
                            <span>Analytics and institutional reporting</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="lg:hidden w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-xl font-bold">
                                S
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to your Smart Student Hub account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link
                                    to="/forgot-password"
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-4">
                        <button
                            type="button"
                            onClick={() => setShowDemoGuide(true)}
                            className="w-full py-2 px-4 border border-primary-300 rounded-md text-primary-600 hover:bg-primary-50 transition-colors text-sm font-medium"
                        >
                            📖 View Demo Guide & All Credentials
                        </button>

                        <p className="text-sm text-gray-600">
                            Quick access: <br />
                            Student: harsh@demo.com / password
                            <br />
                            Faculty: faculty@demo.com / password
                        </p>
                    </div>
                </div>
            </div>

            <DemoGuide
                isOpen={showDemoGuide}
                onClose={() => setShowDemoGuide(false)}
            />
        </div>
    );
};
