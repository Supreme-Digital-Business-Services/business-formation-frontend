import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';

const LeadDetailsDialog = ({ lead, isOpen, onClose, onStatusUpdate, onScheduleFollowUp }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [followUps, setFollowUps] = useState([]);
    const [statusHistory, setStatusHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch lead follow-ups and status history when lead changes
    useEffect(() => {
        if (lead && isOpen) {
            fetchLeadData();
        }
    }, [lead, isOpen]);

    const fetchLeadData = async () => {
        if (!lead) return;

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            // Fetch the full lead data with related information
            const response = await axios.get(`${baseUrl}/leads/${lead.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Extract follow-ups and notes (status history)
            if (response.data) {
                setFollowUps(response.data.followUps || []);

                // Filter notes that are status changes
                const statusNotes = (response.data.notes || []).filter(note =>
                    note.content.startsWith('Status changed to')
                );
                setStatusHistory(statusNotes);
            }
        } catch (error) {
            console.error('Error fetching lead data:', error);
            setError('Failed to load lead details');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle status update with required note
    const handleStatusUpdate = async (newStatus) => {
        if (!statusNote.trim()) {
            setError('Please add a note explaining the status change');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            // First update the status
            const statusResponse = await axios.put(
                `${baseUrl}/leads/${lead.id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Then add the note
            await axios.post(
                `${baseUrl}/leads/${lead.id}/notes`,
                {
                    content: `Status changed to ${newStatus}: ${statusNote}`
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state
            onStatusUpdate(statusResponse.data);

            // Reset state
            setStatusNote('');

            // Refresh data
            fetchLeadData();

        } catch (error) {
            console.error('Error updating lead status:', error);
            setError('Failed to update status');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Status badge color mapping
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'NEW':
                return 'bg-green-100 text-green-800';
            case 'CONTACTED':
                return 'bg-blue-100 text-blue-800';
            case 'QUALIFIED':
                return 'bg-purple-100 text-purple-800';
            case 'PROPOSAL':
                return 'bg-yellow-100 text-yellow-800';
            case 'NEGOTIATION':
                return 'bg-orange-100 text-orange-800';
            case 'WON':
                return 'bg-emerald-100 text-emerald-800';
            case 'LOST':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy - h:mm a');
        } catch (error) {
            return 'Invalid date';
        }
    };

    if (!lead) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center justify-between">
                        <span>Lead: {lead.firstName} {lead.lastName}</span>
                        <Badge variant="outline" className={getStatusBadgeColor(lead.status)}>
                            {lead.status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="followups">Follow-Ups</TabsTrigger>
                        <TabsTrigger value="status">Status History</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
                                <p className="text-sm">Email: {lead.email}</p>
                                <p className="text-sm">Phone: {lead.phone}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Lead Information</h4>
                                <p className="text-sm">Business Type: {lead.businessType || 'Not specified'}</p>
                                <p className="text-sm">Source: {lead.source}</p>
                                <p className="text-sm">Created: {formatDate(lead.createdAt)}</p>
                            </div>

                            {/* Message/Notes */}
                            <div className="col-span-2 mt-2">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                                <p className="text-sm border p-2 rounded-md bg-gray-50">
                                    {lead.message || 'No message provided'}
                                </p>
                            </div>

                            {/* Latest Follow-up Summary */}
                            <div className="col-span-2 mt-4 border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Follow-up Summary
                                </h4>

                                {isLoading ? (
                                    <p className="text-sm text-gray-500">Loading follow-ups...</p>
                                ) : followUps.length > 0 ? (
                                    <div className="space-y-2">
                                        {/* Next upcoming follow-up */}
                                        {followUps.filter(f => !f.completedDate).length > 0 && (
                                            <div className="flex items-start gap-2 border-l-4 border-blue-400 pl-2">
                                                <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">Next Follow-up:</p>
                                                    <p className="text-sm">
                                                        {formatDate(followUps.filter(f => !f.completedDate)[0].scheduledDate)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                        {followUps.filter(f => !f.completedDate)[0].notes || 'No notes'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Latest completed follow-up */}
                                        {followUps.filter(f => f.completedDate).length > 0 && (
                                            <div className="flex items-start gap-2 border-l-4 border-green-400 pl-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">Latest Completed:</p>
                                                    <p className="text-sm">
                                                        {formatDate(followUps.filter(f => f.completedDate)[0].completedDate)}
                                                    </p>
                                                    <p className="text-xs text-gray-700">
                                                        <strong>Outcome:</strong> {followUps.filter(f => f.completedDate)[0].outcome || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                                        No follow-ups scheduled yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Follow-Ups Tab */}
                    <TabsContent value="followups">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Follow-Ups</h3>
                                <Button size="sm" onClick={() => onScheduleFollowUp(lead)}>
                                    Schedule New Follow-Up
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
                                </div>
                            ) : followUps.length > 0 ? (
                                <div className="space-y-3">
                                    {followUps.map(followUp => (
                                        <div
                                            key={followUp.id}
                                            className={`p-3 rounded-md border ${
                                                followUp.completedDate
                                                    ? 'border-green-200 bg-green-50'
                                                    : new Date(followUp.scheduledDate) < new Date()
                                                        ? 'border-red-200 bg-red-50'
                                                        : 'border-blue-200 bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {formatDate(followUp.scheduledDate)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        By: {followUp.user?.name || 'Unknown'}
                                                    </p>
                                                </div>
                                                <Badge className={
                                                    followUp.completedDate
                                                        ? "bg-green-100 text-green-800"
                                                        : new Date(followUp.scheduledDate) < new Date()
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-blue-100 text-blue-800"
                                                }>
                                                    {followUp.completedDate
                                                        ? "Completed"
                                                        : new Date(followUp.scheduledDate) < new Date()
                                                            ? "Overdue"
                                                            : "Scheduled"}
                                                </Badge>
                                            </div>

                                            {followUp.notes && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-gray-500">Notes:</p>
                                                    <p className="text-sm">{followUp.notes}</p>
                                                </div>
                                            )}

                                            {followUp.completedDate && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-gray-500">Outcome:</p>
                                                    <p className="text-sm">{followUp.outcome || 'Not specified'}</p>

                                                    {followUp.nextSteps && (
                                                        <div className="mt-1">
                                                            <p className="text-xs font-medium text-gray-500">Next Steps:</p>
                                                            <p className="text-sm">{followUp.nextSteps}</p>
                                                        </div>
                                                    )}

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Completed on: {formatDate(followUp.completedDate)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-gray-50 rounded-md">
                                    No follow-ups found for this lead
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Status History Tab */}
                    <TabsContent value="status">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Status History</h3>

                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
                                </div>
                            ) : statusHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {statusHistory.map(note => (
                                        <div key={note.id} className="p-3 border border-gray-200 rounded-md">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium">{note.content}</p>
                                                <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-gray-50 rounded-md">
                                    No status history found
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Notes Tab */}
                    <TabsContent value="notes">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">All Notes</h3>

                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
                                </div>
                            ) : lead.notes && lead.notes.length > 0 ? (
                                <div className="space-y-3">
                                    {lead.notes.map(note => (
                                        <div key={note.id} className="p-3 border border-gray-200 rounded-md">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm">{note.content}</p>
                                                <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-gray-50 rounded-md">
                                    No notes found
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Status Update Section */}
                <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Update Status</h4>

                    <div className="mb-3">
                        <Textarea
                            placeholder="Add a note explaining this status change (required)"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            className="w-full text-sm"
                            rows={2}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'NEW' ? 'bg-green-100' : ''}
                            onClick={() => handleStatusUpdate('NEW')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            New
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'CONTACTED' ? 'bg-blue-100' : ''}
                            onClick={() => handleStatusUpdate('CONTACTED')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            Contacted
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'QUALIFIED' ? 'bg-purple-100' : ''}
                            onClick={() => handleStatusUpdate('QUALIFIED')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            Qualified
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'PROPOSAL' ? 'bg-yellow-100' : ''}
                            onClick={() => handleStatusUpdate('PROPOSAL')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            Proposal
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'NEGOTIATION' ? 'bg-orange-100' : ''}
                            onClick={() => handleStatusUpdate('NEGOTIATION')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            Negotiation
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'WON' ? 'bg-emerald-100' : ''}
                            onClick={() => handleStatusUpdate('WON')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            Won
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={lead.status === 'LOST' ? 'bg-red-100' : ''}
                            onClick={() => handleStatusUpdate('LOST')}
                            disabled={isSubmitting || !statusNote.trim()}
                        >
                            Lost
                        </Button>
                    </div>
                </div>

                <DialogFooter className="mt-4 flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => onScheduleFollowUp(lead)}
                    >
                        Schedule Follow-Up
                    </Button>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsDialog;