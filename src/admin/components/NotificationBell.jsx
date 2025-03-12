import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../components/ui/popover';
import { format } from 'date-fns';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

            const response = await axios.get(`${baseUrl}/notifications?limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();

        // Set up interval to check for new notifications
        const interval = setInterval(fetchNotifications, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

            await axios.put(
                `${baseUrl}/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state
            setNotifications(notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            ));

            setUnreadCount(prev => Math.max(prev - 1, 0));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

            await axios.put(
                `${baseUrl}/notifications/read-all`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state
            setNotifications(notifications.map(notification => ({
                ...notification,
                isRead: true
            })));

            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Format time
    const formatTime = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, h:mm a');
        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative p-2">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="max-h-64 overflow-y-auto py-2">
                    {isLoading && notifications.length === 0 ? (
                        <div className="flex justify-center py-4">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-4 text-center text-gray-500">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`cursor-pointer border-b py-2 last:border-b-0 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                onClick={() => !notification.isRead && markAsRead(notification.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                                        {notification.message}
                                    </p>
                                    {!notification.isRead && (
                                        <span className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {formatTime(notification.createdAt)}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t pt-2 text-center">
                    <Button variant="link" size="sm" className="text-xs" asChild>
                        <a href="/admin/notifications">View all notifications</a>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;