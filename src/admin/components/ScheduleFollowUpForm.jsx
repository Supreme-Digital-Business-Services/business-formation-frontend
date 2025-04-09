import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { format } from 'date-fns';

// Form validation schema
const followUpSchema = z.object({
    leadId: z.string().min(1, 'Lead ID is required'),
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    notes: z.string().optional(),
});

const ScheduleFollowUpForm = ({ isOpen, onClose, lead, onScheduled }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Set default date to tomorrow at 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const defaultDate = format(tomorrow, "yyyy-MM-dd'T'HH:mm");

    const form = useForm({
        resolver: zodResolver(followUpSchema),
        defaultValues: {
            leadId: lead?.id || '',
            scheduledDate: defaultDate,
            notes: '',
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            const response = await axios.post(
                `${baseUrl}/follow-ups`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Reset form
            form.reset();

            // Close modal and notify parent component
            onScheduled(response.data.followUp);
            onClose();
        } catch (error) {
            console.error('Error scheduling follow-up:', error);

            if (error.response && error.response.data) {
                setError(error.response.data.message || 'An error occurred while scheduling the follow-up');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Follow-Up</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-300 text-sm">
                        {error}
                    </div>
                )}

                {lead && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-900">
                            Follow-up for: {lead.firstName} {lead.lastName}
                        </h4>
                        <p className="text-sm text-blue-800">{lead.email} • {lead.phone}</p>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date & Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
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
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Scheduling...' : 'Schedule Follow-Up'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleFollowUpForm;