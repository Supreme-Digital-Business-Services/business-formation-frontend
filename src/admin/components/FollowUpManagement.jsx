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
import { AlertTriangle, CheckCircle } from 'lucide-react';

// Form schema for update tab
const updateSchema = z.object({
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    notes: z.string().optional(),
});

// Form schema for complete tab
const completeSchema = z.object({
    outcome: z.string().min(1, 'Outcome is required'),
    nextSteps: z.string().optional(),
});

const FollowUpManagement = ({ isOpen, onClose, followUp, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('update');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            });

            // If the follow-up is already completed, start on the update tab
            if (followUp.completedDate) {
                setActiveTab('update');
            }
        }
    }, [followUp]);

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

            const response = await axios.put(
                `${baseUrl}/follow-ups/${followUp.id}/complete`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess('Follow-up marked as completed');

            // Notify parent component
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
                    <p className="text-xs text-blue-600 mt-1">
                        <strong>Scheduled for:</strong> {formatDate(followUp.scheduledDate)}
                    </p>
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
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Add notes about this follow-up"
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
                                                    placeholder="Describe the outcome of this follow-up"
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
                                            <FormLabel>Next Steps</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe any next steps or actions"
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