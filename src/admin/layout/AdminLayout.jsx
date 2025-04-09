import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className={`flex flex-col md:ml-64 transition-all duration-300 ease-in-out`}>
                {/* Top Navigation Bar */}
                <Navbar
                    setSidebarOpen={setSidebarOpen}
                    user={user}
                    onLogout={handleLogout}
                />

                {/* Page Content */}
                <main className="flex-1 p-4">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Supreme Business. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;