import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Form schema for update tab
const updateSchema = z.object({
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    notes: z.string().min(1, 'Notes are required to track the purpose of this follow-up'),
});

// Form schema for complete tab
const completeSchema = z.object({
    outcome: z.string().min(1, 'Outcome is required'),
    nextSteps: z.string().min(1, 'Next steps are required to ensure proper follow-through'),
    updateLeadStatus: z.boolean().optional(),
    newStatus: z.string().optional(),
    scheduleNextFollowUp: z.boolean().optional(),
    nextFollowUpDate: z.string().optional(),
});

const FollowUpManagement = ({ isOpen, onClose, followUp, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('update');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [leadStatus, setLeadStatus] = useState('');
    const [scheduleNext, setScheduleNext] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);

    // Forms for the two tabs
    const updateForm = useForm({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            scheduledDate: followUp ? format(new Date(followUp.scheduledDate), "yyyy-MM-dd'T'HH:mm") : '',
            notes: followUp?.notes || ''
        }
    });

    const completeForm = useForm({
        resolver: zodResolver(completeSchema),
        defaultValues: {
            outcome: '',
            nextSteps: '',
            updateLeadStatus: false,
            newStatus: '',
            scheduleNextFollowUp: false,
            nextFollowUpDate: ''
        }
    });

    // Reset form when followUp changes
    useEffect(() => {
        if (followUp) {
            updateForm.reset({
                scheduledDate: format(new Date(followUp.scheduledDate), "yyyy-MM-dd'T'HH:mm"),
                notes: followUp.notes || '',
            });

            completeForm.reset({
                outcome: '',
                nextSteps: '',
                updateLeadStatus: false,
                newStatus: '',
                scheduleNextFollowUp: false,
                nextFollowUpDate: ''
            });

            // If the follow-up is already completed, start on the update tab
            if (followUp.completedDate) {
                setActiveTab('update');
            }

            // Set default next follow-up date to 3 days from now
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + 3);
            nextDate.setHours(10, 0, 0, 0);
            completeForm.setValue('nextFollowUpDate', format(nextDate, "yyyy-MM-dd'T'HH:mm"));

            // Get lead status
            if (followUp.lead?.status) {
                setLeadStatus(followUp.lead.status);
                completeForm.setValue('newStatus', followUp.lead.status);
            }
        }
    }, [followUp]);

    // Handle changes to the schedule next followup checkbox
    useEffect(() => {
        const subscription = completeForm.watch((value, { name }) => {
            if (name === 'scheduleNextFollowUp') {
                setScheduleNext(value.scheduleNextFollowUp);
            }
            if (name === 'updateLeadStatus') {
                setUpdateStatus(value.updateLeadStatus);
            }
        });
        return () => subscription.unsubscribe();
    }, [completeForm.watch]);

    // Handle Update form submission
    const handleUpdate = async (data) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            const response = await axios.put(
                `${baseUrl}/follow-ups/${followUp.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess('Follow-up updated successfully');

            // Notify parent component
            if (onUpdate) {
                onUpdate(response.data);
            }

            // Close after a brief delay so the user can see the success message
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error updating follow-up:', error);
            setError(error.response?.data?.message || 'Failed to update follow-up');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Complete form submission
    const handleComplete = async (data) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            // 1. Complete the follow-up
            const response = await axios.put(
                `${baseUrl}/follow-ups/${followUp.id}/complete`,
                {
                    outcome: data.outcome,
                    nextSteps: data.nextSteps
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // 2. Update lead status if requested
            if (data.updateLeadStatus && data.newStatus) {
                await axios.put(
                    `${baseUrl}/leads/${followUp.lead.id}/status`,
                    {
                        status: data.newStatus
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // Add a note about the status change
                await axios.post(
                    `${baseUrl}/leads/${followUp.lead.id}/notes`,
                    {
                        content: `Status changed to ${data.newStatus} after follow-up: ${data.outcome}`
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            // 3. Schedule next follow-up if requested
            if (data.scheduleNextFollowUp && data.nextFollowUpDate) {
                await axios.post(
                    `${baseUrl}/follow-ups`,
                    {
                        leadId: followUp.lead.id,
                        scheduledDate: data.nextFollowUpDate,
                        notes: `Follow-up scheduled after previous outcome: ${data.outcome}. Next steps: ${data.nextSteps}`
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            setSuccess('Follow-up marked as completed');

            // Notify parent component with the completed follow-up
            if (onUpdate) {
                onUpdate(response.data);
            }

            // Close after a brief delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error completing follow-up:', error);
            setError(error.response?.data?.message || 'Failed to complete follow-up');
        } finally {
            setIsSubmitting(false);
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

    // Get status badge color
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

    if (!followUp) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Follow-Up</DialogTitle>
                    <DialogDescription>
                        View, update, or complete this follow-up for {followUp.lead?.firstName} {followUp.lead?.lastName}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 border border-green-300 text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {success}
                    </div>
                )}

                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-900">
                        Follow-up for: {followUp.lead?.firstName} {followUp.lead?.lastName}
                    </h4>
                    <p className="text-sm text-blue-800">
                        {followUp.lead?.email} • {followUp.lead?.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-blue-600">
                            <strong>Scheduled for:</strong> {formatDate(followUp.scheduledDate)}
                        </p>
                        {followUp.lead?.status && (
                            <Badge className={getStatusBadgeColor(followUp.lead.status)}>
                                {followUp.lead.status}
                            </Badge>
                        )}
                    </div>
                    {followUp.completedDate && (
                        <p className="text-xs text-green-600 mt-1">
                            <strong>Completed on:</strong> {formatDate(followUp.completedDate)}
                        </p>
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="update" className="flex-1">Update</TabsTrigger>
                        <TabsTrigger
                            value="complete"
                            className="flex-1"
                            disabled={followUp.completedDate !== null}
                        >
                            Complete
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="update">
                        <Form {...updateForm}>
                            <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4">
                                <FormField
                                    control={updateForm.control}
                                    name="scheduledDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date & Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    disabled={followUp.completedDate !== null}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={updateForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Add notes about this follow-up (required)"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || followUp.completedDate !== null}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Follow-Up'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="complete">
                        <Form {...completeForm}>
                            <form onSubmit={completeForm.handleSubmit(handleComplete)} className="space-y-4">
                                <FormField
                                    control={completeForm.control}
                                    name="outcome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Outcome <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the outcome of this follow-up (required)"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={completeForm.control}
                                    name="nextSteps"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Next Steps <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe any next steps or actions (required)"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="p-3 bg-gray-50 rounded-md space-y-4">
                                    <FormField
                                        control={completeForm.control}
                                        name="updateLeadStatus"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Update lead status</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {updateStatus && (
                                        <FormField
                                            control={completeForm.control}
                                            name="newStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Status</FormLabel>
                                                    <FormControl>
                                                        <select
                                                            {...field}
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                                        >
                                                            <option value="NEW">New</option>
                                                            <option value="CONTACTED">Contacted</option>
                                                            <option value="QUALIFIED">Qualified</option>
                                                            <option value="NOT_QUALIFIED">Not Qualified</option>
                                                            <option value="PROPOSAL">Proposal</option>
                                                            <option value="NEGOTIATION">Negotiation</option>
                                                            <option value="WON">Won</option>
                                                            <option value="LOST">Lost</option>
                                                        </select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="p-3 bg-gray-50 rounded-md space-y-4">
                                    <FormField
                                        control={completeForm.control}
                                        name="scheduleNextFollowUp"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Schedule next follow-up</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {scheduleNext && (
                                        <FormField
                                            control={completeForm.control}
                                            name="nextFollowUpDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Next Follow-up Date & Time</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Completing...' : 'Mark as Completed'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default FollowUpManagement;