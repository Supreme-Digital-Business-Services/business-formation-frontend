import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { format } from 'date-fns';
import FollowUpManagement from '../components/FollowUpManagement';
import ScheduleFollowUpForm from '../components/ScheduleFollowUpForm';

const FollowUpsPage = () => {
    const [followUps, setFollowUps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFollowUp, setSelectedFollowUp] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-renders

    // Get follow-ups from API
    useEffect(() => {
        const fetchFollowUps = async () => {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                let url = `${baseUrl}/follow-ups?sort=scheduledDate&order=asc&assignedTo=me`;

                // Add filter based on active tab
                if (activeTab === 'upcoming') {
                    url += '&upcoming=true';
                } else if (activeTab === 'today') {
                    url += '&today=true';
                } else if (activeTab === 'overdue') {
                    url += '&overdue=true';
                } else if (activeTab === 'completed') {
                    url += '&completed=true';
                }

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Add defensive check for empty or malformed response
                if (response.data && Array.isArray(response.data.followUps)) {
                    setFollowUps(response.data.followUps);
                } else {
                    console.error('Invalid followUps data format:', response.data);
                    setFollowUps([]);
                }
            } catch (error) {
                console.error('Error fetching follow-ups:', error);
                setError('Failed to load follow-ups. Please try again.');
                setFollowUps([]); // Reset to empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowUps();
    }, [activeTab, refreshKey]); // Add refreshKey to dependencies

    // View follow-up details
    const viewFollowUpDetails = (followUp) => {
        setSelectedFollowUp(followUp);
        setIsManagementModalOpen(true);
    };

    // Handle follow-up update
    const handleFollowUpUpdate = (updatedFollowUp) => {
        // Update the follow-up in the local state
        setFollowUps(prevFollowUps =>
            prevFollowUps.map(followUp =>
                followUp.id === updatedFollowUp.id
                    ? updatedFollowUp
                    : followUp
            )
        );

        // If the follow-up is now complete and we're not in the completed tab, remove it from the list
        if (updatedFollowUp.completedDate && activeTab !== 'completed') {
            setFollowUps(prevFollowUps =>
                prevFollowUps.filter(followUp => followUp.id !== updatedFollowUp.id)
            );
        }

        // Force refresh data on next render cycle
        setRefreshKey(prevKey => prevKey + 1);
    };

    // Open the schedule follow-up modal
    const openScheduleModal = () => {
        setSelectedLead(null); // Reset selected lead
        setIsScheduleModalOpen(true);
    };

    // Handle new follow-up scheduled
    const handleFollowUpScheduled = (newFollowUp) => {
        // Add the new follow-up to the list if it matches the current filter
        if (activeTab === 'upcoming' ||
            (activeTab === 'today' && isToday(new Date(newFollowUp.scheduledDate)))) {
            setFollowUps(prevFollowUps => [newFollowUp, ...prevFollowUps]);
        }

        // Force refresh data to get complete lead information
        setRefreshKey(prevKey => prevKey + 1);
    };

    // Helper function to check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Format date for display
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy - h:mm a');
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Determine if a follow-up is overdue
    const isOverdue = (scheduledDate) => {
        return new Date(scheduledDate) < new Date() && activeTab !== 'completed';
    };

    // Show loading state only on initial load
    if (isLoading && followUps.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Follow-Up Management</h1>
                <Button onClick={openScheduleModal}>Schedule New Follow-Up</Button>
            </div>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <Tabs
                defaultValue="upcoming"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
            >
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-4">
                    <h3 className="mb-4 text-lg font-medium">Upcoming Follow-Ups</h3>
                    {renderFollowUpList()}
                </TabsContent>

                <TabsContent value="today" className="mt-4">
                    <h3 className="mb-4 text-lg font-medium">Today's Follow-Ups</h3>
                    {renderFollowUpList()}
                </TabsContent>

                <TabsContent value="overdue" className="mt-4">
                    <h3 className="mb-4 text-lg font-medium">Overdue Follow-Ups</h3>
                    {renderFollowUpList()}
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                    <h3 className="mb-4 text-lg font-medium">Completed Follow-Ups</h3>
                    {renderFollowUpList()}
                </TabsContent>
            </Tabs>

            {/* Follow-Up Management Modal */}
            {selectedFollowUp && (
                <FollowUpManagement
                    isOpen={isManagementModalOpen}
                    onClose={() => {
                        setIsManagementModalOpen(false);
                        // Force refresh after modal closes to ensure data is current
                        setTimeout(() => setRefreshKey(prevKey => prevKey + 1), 100);
                    }}
                    followUp={selectedFollowUp}
                    onUpdate={handleFollowUpUpdate}
                />
            )}

            {/* Schedule Follow-Up Modal */}
            <ScheduleFollowUpForm
                isOpen={isScheduleModalOpen}
                onClose={() => {
                    setIsScheduleModalOpen(false);
                    // Force refresh after modal closes to ensure data is current
                    setTimeout(() => setRefreshKey(prevKey => prevKey + 1), 100);
                }}
                lead={selectedLead}
                onScheduled={handleFollowUpScheduled}
            />
        </div>
    );

    // Helper function to render the follow-up list
    function renderFollowUpList() {
        if (followUps.length === 0) {
            return (
                <div className="rounded-md bg-gray-50 p-8 text-center text-gray-500">
                    No follow-ups found for this period.
                </div>
            );
        }

        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {followUps.map((followUp) => (
                    <div
                        key={followUp.id}
                        className={`cursor-pointer overflow-hidden rounded-lg border ${
                            isOverdue(followUp.scheduledDate) ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                        } shadow transition-all hover:shadow-md`}
                        onClick={() => viewFollowUpDetails(followUp)}
                    >
                        <div className="p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {followUp.lead?.firstName || 'No Name'} {followUp.lead?.lastName || ''}
                                    </h3>
                                    <p className="text-sm text-gray-600">{followUp.lead?.email || 'No email'}</p>
                                </div>
                                {followUp.completedDate ? (
                                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                ) : isOverdue(followUp.scheduledDate) ? (
                                    <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                                ) : (
                                    <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                                )}
                            </div>

                            <div className="text-sm text-gray-600">
                                <p><strong>Scheduled:</strong> {formatDate(followUp.scheduledDate)}</p>
                                {followUp.completedDate && (
                                    <p><strong>Completed:</strong> {formatDate(followUp.completedDate)}</p>
                                )}
                                <p className="mt-2 line-clamp-2">{followUp.notes || 'No notes provided'}</p>
                                {followUp.outcome && (
                                    <p className="mt-2"><strong>Outcome:</strong> <span className="line-clamp-2">{followUp.outcome}</span></p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default FollowUpsPage;