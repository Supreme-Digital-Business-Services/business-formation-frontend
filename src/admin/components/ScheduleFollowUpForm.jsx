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
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema for scheduling a follow-up
const scheduleSchema = z.object({
    leadId: z.string().optional(),
    leadName: z.string().optional(),
    leadEmail: z.string().email('Invalid email address').optional(),
    leadPhone: z.string().optional(),
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    notes: z.string().min(1, 'Please add notes about this follow-up'),
});

const ScheduleFollowUpForm = ({ isOpen, onClose, lead, onScheduled }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    // Initialize form with default values
    const form = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            leadId: '',
            leadName: '',
            leadEmail: '',
            leadPhone: '',
            scheduledDate: '',
            notes: '',
        }
    });

    // Reset form and state when isOpen changes
    useEffect(() => {
        if (isOpen) {
            setError('');
            setSuccess('');
            setSearchTerm('');
            setSearchResults([]);

            // Set default date to tomorrow at 10:00 AM
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0);
            const defaultDate = tomorrow.toISOString().substring(0, 16); // Format for datetime-local input

            // If lead is provided, pre-fill the form
            if (lead) {
                setSelectedLead(lead);
                form.reset({
                    leadId: lead.id,
                    leadName: `${lead.firstName} ${lead.lastName}`,
                    leadEmail: lead.email,
                    leadPhone: lead.phone,
                    scheduledDate: defaultDate,
                    notes: '',
                });
            } else {
                setSelectedLead(null);
                form.reset({
                    leadId: '',
                    leadName: '',
                    leadEmail: '',
                    leadPhone: '',
                    scheduledDate: defaultDate,
                    notes: '',
                });
            }
        }
    }, [isOpen, lead, form]);

    // Handle form submission
    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            // Prepare request data
            const requestData = {
                leadId: selectedLead ? selectedLead.id : data.leadId,
                scheduledDate: data.scheduledDate,
                notes: data.notes,
            };

            // If no lead is selected and we have lead info, create a new lead
            if (!selectedLead && data.leadEmail) {
                // Extract first and last name from leadName
                let firstName = '';
                let lastName = '';
                if (data.leadName) {
                    const nameParts = data.leadName.trim().split(' ');
                    if (nameParts.length > 0) {
                        firstName = nameParts[0];
                        lastName = nameParts.slice(1).join(' ');
                    }
                }

                // Create a new lead first
                const leadResponse = await axios.post(
                    `${baseUrl}/leads`,
                    {
                        firstName,
                        lastName,
                        email: data.leadEmail,
                        phone: data.leadPhone,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // Use the new lead ID
                requestData.leadId = leadResponse.data.id;
            }

            // Create the follow-up
            const response = await axios.post(
                `${baseUrl}/follow-ups`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess('Follow-up scheduled successfully');

            // Notify parent component
            if (onScheduled) {
                onScheduled(response.data);
            }

            // Dispatch event to notify other components (like LeadDetailsDialog)
            window.dispatchEvent(new CustomEvent('followUpScheduled', {
                detail: response.data
            }));

            // Close after a brief delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error scheduling follow-up:', error);
            setError(error.response?.data?.message || 'Failed to schedule follow-up');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Search for leads
    const searchLeads = async (term) => {
        if (!term || term.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            const response = await axios.get(
                `${baseUrl}/leads/search?term=${encodeURIComponent(term)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSearchResults(response.data.leads || []);
        } catch (error) {
            console.error('Error searching leads:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Debounce search to avoid too many requests
        const handler = setTimeout(() => {
            searchLeads(term);
        }, 300);

        return () => clearTimeout(handler);
    };

    // Select a lead from search results
    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
        setSearchTerm(`${lead.firstName} ${lead.lastName}`);
        setSearchResults([]);

        form.setValue('leadId', lead.id);
        form.setValue('leadName', `${lead.firstName} ${lead.lastName}`);
        form.setValue('leadEmail', lead.email);
        form.setValue('leadPhone', lead.phone || '');
    };

    // Clear selected lead
    const handleClearLead = () => {
        setSelectedLead(null);
        setSearchTerm('');

        form.setValue('leadId', '');
        form.setValue('leadName', '');
        form.setValue('leadEmail', '');
        form.setValue('leadPhone', '');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule New Follow-Up</DialogTitle>
                    <DialogDescription>
                        Schedule a follow-up with a lead or contact
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {!selectedLead ? (
                            // Search or create lead section
                            <div className="space-y-4">
                                <div className="relative">
                                    <FormLabel>Search Lead</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Search by name or email"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full"
                                    />

                                    {/* Search results dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {searchResults.map((lead) => (
                                                <div
                                                    key={lead.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectLead(lead)}
                                                >
                                                    <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                                                    <div className="text-sm text-gray-600">{lead.email}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-sm text-gray-500">
                                    No results? Enter lead details manually:
                                </div>

                                <FormField
                                    control={form.control}
                                    name="leadName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lead Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="leadEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Email address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="leadPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone (optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : (
                            // Selected lead info
                            <div className="bg-blue-50 p-3 rounded-md mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-blue-900">
                                            {selectedLead.firstName} {selectedLead.lastName}
                                        </h4>
                                        <p className="text-sm text-blue-800">
                                            {selectedLead.email} {selectedLead.phone ? `• ${selectedLead.phone}` : ''}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearLead}
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date & Time <span className="text-red-500">*</span></FormLabel>
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
                                    <FormLabel>Notes <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add notes about this follow-up (purpose, what to discuss, etc.)"
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
                                disabled={isSubmitting || !form.formState.isValid}
                            >
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