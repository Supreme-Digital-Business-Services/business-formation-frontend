import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '@/components/theme/ThemeToggle';

const Navbar = ({ setSidebarOpen, user, onLogout }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <header className="bg-white dark:bg-gray-800 shadow">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Mobile menu button */}
                <button
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Page title - can be dynamic based on current route */}
                <h1 className="hidden text-xl font-semibold text-gray-800 dark:text-white md:block">Dashboard</h1>

                {/* Right side elements - notifications and user menu */}
                <div className="flex items-center">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notification bell */}
                    <NotificationBell />

                    {/* User menu */}
                    <div className="relative ml-4">
                        <button
                            className="flex items-center rounded-full border border-transparent focus:border-gray-300 focus:outline-none"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="ml-2 hidden md:block text-gray-800 dark:text-white">{user?.name || 'User'}</span>
                            <svg
                                className="ml-1 h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                <Link
                                    to="/admin/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    Your Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        onLogout();
                                    }}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;