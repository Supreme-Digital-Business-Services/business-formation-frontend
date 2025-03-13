import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            setIsLoading(true);

            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                // Verify token with the backend
                await axios.get(`${baseUrl}/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token verification failed:', error);
                // Clear invalid tokens
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to the login page with the return URL
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;