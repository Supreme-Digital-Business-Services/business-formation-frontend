import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '../../components/ui/dialog';
import { format } from 'date-fns';

const FollowUpsPage = () => {
    const [followUps, setFollowUps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFollowUp, setSelectedFollowUp] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [outcome, setOutcome] = useState('');
    const [nextSteps, setNextSteps] = useState('');

    // Get follow-ups from API
    useEffect(() => {
        const fetchFollowUps = async () => {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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

                setFollowUps(response.data.followUps);
            } catch (error) {
                console.error('Error fetching follow-ups:', error);
                setError('Failed to load follow-ups. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowUps();
    }, [activeTab]);

    // Complete a follow-up
    const completeFollowUp = async () => {
        if (!selectedFollowUp || !outcome) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

            await axios.put(
                `${baseUrl}/follow-ups/${selectedFollowUp.id}/complete`,
                {
                    outcome,
                    nextSteps
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state
            setFollowUps(followUps.filter(followUp => followUp.id !== selectedFollowUp.id));
            setSelectedFollowUp(null);
            setOutcome('');
            setNextSteps('');

        } catch (error) {
            console.error('Error completing follow-up:', error);
            setError('Failed to complete follow-up. Please try again.');
        }
    };

    // View follow-up details
    const viewFollowUpDetails = (followUp) => {
        setSelectedFollowUp(followUp);
        setOutcome('');
        setNextSteps('');
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
                <Button>Schedule New Follow-Up</Button>
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

            {/* Follow-Up Detail Modal */}
            {selectedFollowUp && (
                <Dialog open={!!selectedFollowUp} onOpenChange={(open) => !open && setSelectedFollowUp(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                Follow-Up Details
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4 py-4">
                            <div>
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Lead Information</h4>
                                <p className="font-medium text-gray-900">
                                    {selectedFollowUp.lead.firstName} {selectedFollowUp.lead.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{selectedFollowUp.lead.email}</p>
                                <p className="text-sm text-gray-600">{selectedFollowUp.lead.phone}</p>
                            </div>

                            <div>
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Schedule</h4>
                                <p className="text-sm">
                                    <strong>Scheduled for:</strong> {formatDate(selectedFollowUp.scheduledDate)}
                                </p>
                                {selectedFollowUp.completedDate && (
                                    <p className="text-sm">
                                        <strong>Completed on:</strong> {formatDate(selectedFollowUp.completedDate)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Notes</h4>
                                <p className="text-sm">{selectedFollowUp.notes || 'No notes provided'}</p>
                            </div>

                            {selectedFollowUp.completedDate ? (
                                <div>
                                    <h4 className="mb-1 text-sm font-medium text-gray-500">Outcome</h4>
                                    <p className="text-sm">{selectedFollowUp.outcome}</p>

                                    {selectedFollowUp.nextSteps && (
                                        <div className="mt-2">
                                            <h4 className="mb-1 text-sm font-medium text-gray-500">Next Steps</h4>
                                            <p className="text-sm">{selectedFollowUp.nextSteps}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h4 className="mb-1 text-sm font-medium text-gray-500">Complete Follow-Up</h4>

                                    <div className="mt-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Outcome
                                        </label>
                                        <Input
                                            placeholder="Describe the outcome of this follow-up"
                                            value={outcome}
                                            onChange={(e) => setOutcome(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mt-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Next Steps (optional)
                                        </label>
                                        <Input
                                            placeholder="What are the next steps?"
                                            value={nextSteps}
                                            onChange={(e) => setNextSteps(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setSelectedFollowUp(null)}>
                                {selectedFollowUp.completedDate ? 'Close' : 'Cancel'}
                            </Button>

                            {!selectedFollowUp.completedDate && (
                                <Button onClick={completeFollowUp} disabled={!outcome}>
                                    Mark as Completed
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
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
                                        {followUp.lead.firstName} {followUp.lead.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">{followUp.lead.email}</p>
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
                                <p className="mt-2 line-clamp-2">{followUp.notes || 'No notes provided'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default FollowUpsPage;