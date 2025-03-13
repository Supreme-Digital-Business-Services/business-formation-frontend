import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Calendar,
    Settings,
    X,
    MessageSquare,
    BarChart
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();

    // Check if the current path includes this route
    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    // Navigation items
    const navItems = [
        {
            title: 'Dashboard',
            icon: <LayoutDashboard className="h-5 w-5" />,
            path: '/admin/dashboard',
            active: location.pathname === '/admin' || location.pathname === '/admin/dashboard'
        },
        {
            title: 'Leads',
            icon: <Users className="h-5 w-5" />,
            path: '/admin/leads',
            active: isActive('/admin/leads')
        },
        {
            title: 'Follow-ups',
            icon: <ClipboardList className="h-5 w-5" />,
            path: '/admin/follow-ups',
            active: isActive('/admin/follow-ups')
        },
        {
            title: 'Calendar',
            icon: <Calendar className="h-5 w-5" />,
            path: '/admin/calendar',
            active: isActive('/admin/calendar')
        },
        {
            title: 'Messages',
            icon: <MessageSquare className="h-5 w-5" />,
            path: '/admin/messages',
            active: isActive('/admin/messages')
        },
        {
            title: 'Reports',
            icon: <BarChart className="h-5 w-5" />,
            path: '/admin/reports',
            active: isActive('/admin/reports')
        },
        {
            title: 'Settings',
            icon: <Settings className="h-5 w-5" />,
            path: '/admin/settings',
            active: isActive('/admin/settings')
        }
    ];

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-md transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                {/* Sidebar header */}
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <Link to="/admin" className="text-xl font-bold text-blue-900">
                            Supreme<span className="text-red-500">Business</span>
                        </Link>
                        <button
                            className="p-1 rounded-full text-gray-600 hover:bg-gray-100 md:hidden"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                item.active
                                    ? 'bg-blue-50 text-blue-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
              <span className={`${item.active ? 'text-blue-900' : 'text-gray-500'}`}>
                {item.icon}
              </span>
                            <span className="ml-3">{item.title}</span>
                        </Link>
                    ))}
                </nav>

                {/* Company info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                                S
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Supreme Business</p>
                            <p className="text-xs text-gray-500">Dubai, UAE</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;