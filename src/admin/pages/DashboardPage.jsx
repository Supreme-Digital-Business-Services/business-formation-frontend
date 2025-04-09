import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
    Users,
    ClipboardList,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle,
    ArrowUpRight,
    PhoneCall
} from 'lucide-react';

const DashboardPage = () => {
    const [dashboardStats, setDashboardStats] = useState({
        totalLeads: 0,
        leadsToday: 0,
        pendingFollowUps: 0,
        completedFollowUps: 0,
        recentLeads: [],
        upcomingFollowUps: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                // Making separate API calls for each piece of data
                const [leadsResponse, followUpsResponse] = await Promise.all([
                    // Get leads with limit to fetch only recent ones
                    axios.get(`${baseUrl}/leads?limit=5&sort=createdAt&order=desc`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    // Get follow-ups
                    axios.get(`${baseUrl}/follow-ups?today=true&limit=5`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                // Count today's leads
                const today = new Date().toISOString().split('T')[0];
                const leadsToday = leadsResponse.data.leads.filter(lead =>
                    new Date(lead.createdAt).toISOString().split('T')[0] === today
                ).length;

                // Count pending and completed follow-ups
                const pendingFollowUps = followUpsResponse.data.followUps ?
                    followUpsResponse.data.followUps.filter(f => !f.completedDate).length : 0;

                const completedFollowUps = followUpsResponse.data.followUps ?
                    followUpsResponse.data.followUps.filter(f => f.completedDate).length : 0;

                setDashboardStats({
                    totalLeads: leadsResponse.data.total || leadsResponse.data.leads.length,
                    leadsToday,
                    pendingFollowUps,
                    completedFollowUps,
                    recentLeads: leadsResponse.data.leads || [],
                    upcomingFollowUps: followUpsResponse.data.followUps
                        ? followUpsResponse.data.followUps.filter(f => !f.completedDate)
                        : []
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please refresh or try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Function to format date
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-300">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.totalLeads}</p>
                            </div>
                            <div className="rounded-full p-3 bg-blue-100">
                                <Users className="h-6 w-6 text-blue-900" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>12% increase</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">New Leads Today</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.leadsToday}</p>
                            </div>
                            <div className="rounded-full p-3 bg-green-100">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Updated 5 minutes ago</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Follow-ups</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.pendingFollowUps}</p>
                            </div>
                            <div className="rounded-full p-3 bg-yellow-100">
                                <ClipboardList className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <Link to="/admin/follow-ups" className="mt-4 flex items-center text-sm text-blue-600 hover:underline">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>View all follow-ups</span>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Completed Follow-ups</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.completedFollowUps}</p>
                            </div>
                            <div className="rounded-full p-3 bg-teal-100">
                                <CheckCircle className="h-6 w-6 text-teal-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-teal-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>3 completed today</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Leads and Upcoming Follow-ups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dashboardStats.recentLeads && dashboardStats.recentLeads.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardStats.recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg border-b">
                                        <div className="bg-blue-100 text-blue-900 rounded-full p-2 mr-3">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium">
                                                {lead.firstName} {lead.lastName}
                                            </h4>
                                            <p className="text-xs text-gray-500">{lead.email}</p>
                                        </div>
                                        <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          lead.status === 'NEW' ? 'bg-green-100 text-green-800' :
                              lead.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(lead.createdAt)}</p>
                                        </div>
                                        <Link to={`/admin/leads?id=${lead.id}`} className="ml-2 text-blue-600 hover:text-blue-800">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                ))}
                                <div className="pt-2">
                                    <Link to="/admin/leads" className="text-sm text-blue-600 hover:underline">
                                        View all leads
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No recent leads available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Follow-ups */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Today's Follow-ups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dashboardStats.upcomingFollowUps && dashboardStats.upcomingFollowUps.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardStats.upcomingFollowUps.map((followUp) => (
                                    <div key={followUp.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg border-b">
                                        <div className="bg-yellow-100 text-yellow-900 rounded-full p-2 mr-3">
                                            <PhoneCall className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium">
                                                {followUp.lead?.firstName} {followUp.lead?.lastName}
                                            </h4>
                                            <p className="text-xs text-gray-500">{followUp.lead?.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium">
                                                {new Date(followUp.scheduledDate).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(followUp.scheduledDate)}</p>
                                        </div>
                                        <Link to={`/admin/follow-ups?id=${followUp.id}`} className="ml-2 text-blue-600 hover:text-blue-800">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                ))}
                                <div className="pt-2">
                                    <Link to="/admin/follow-ups" className="text-sm text-blue-600 hover:underline">
                                        View all follow-ups
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No follow-ups scheduled for today
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;