import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AddLeadForm from '../components/AddLeadForm';
import ScheduleFollowUpForm from '../components/ScheduleFollowUpForm';
import LeadDetailsDialog from '../components/LeadDetailsDialog';

const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // For forcing refreshes

    // Get leads from API
    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                let url = `${baseUrl}/leads?page=${currentPage}&limit=10`;

                if (statusFilter && statusFilter !== 'all') {
                    url += `&status=${statusFilter}`;
                }

                if (sourceFilter && sourceFilter !== 'all') {
                    url += `&source=${sourceFilter}`;
                }

                if (searchTerm) {
                    url += `&search=${searchTerm}`;
                }

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setLeads(response.data.leads);
                setFilteredLeads(response.data.leads);
                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                console.error('Error fetching leads:', error);
                setError('Failed to load leads. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, [currentPage, statusFilter, sourceFilter, searchTerm, refreshKey]);

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

    // Handle status update
    const handleStatusUpdate = (updatedLead) => {
        // Update local state to reflect the change
        setLeads(leads.map(lead =>
            lead.id === updatedLead.id ? { ...lead, status: updatedLead.status } : lead
        ));

        setFilteredLeads(filteredLeads.map(lead =>
            lead.id === updatedLead.id ? { ...lead, status: updatedLead.status } : lead
        ));

        // Update selected lead if it's open
        if (selectedLead && selectedLead.id === updatedLead.id) {
            setSelectedLead({ ...selectedLead, status: updatedLead.status });
        }

        // Force refresh after a delay
        setTimeout(() => setRefreshKey(prev => prev + 1), 100);
    };

    // View lead details
    const viewLeadDetails = (lead) => {
        setSelectedLead(lead);
    };

    // Handle new lead added
    const handleLeadAdded = (newLead) => {
        // Add the new lead to the start of the list
        setLeads([newLead, ...leads]);
        setFilteredLeads([newLead, ...filteredLeads]);
    };

    // Handle follow-up scheduled
    const handleFollowUpScheduled = () => {
        // Force refresh data to ensure we have the latest
        setTimeout(() => setRefreshKey(prev => prev + 1), 100);
    };

    if (isLoading && leads.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
                <Button onClick={() => setIsAddModalOpen(true)}>Add Manual Lead</Button>
            </div>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                    <Input
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                            <SelectItem value="PROPOSAL">Proposal</SelectItem>
                            <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                            <SelectItem value="WON">Won</SelectItem>
                            <SelectItem value="LOST">Lost</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="WEBSITE">Website</SelectItem>
                            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                            <SelectItem value="REFERRAL">Referral</SelectItem>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Contact Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Business Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Source
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                            <tr key={lead.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {lead.firstName} {lead.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">{lead.email}</div>
                                    <div className="text-sm text-gray-500">{lead.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {lead.businessType || 'Not specified'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Badge variant="outline" className={getStatusBadgeColor(lead.status)}>
                                        {lead.status}
                                    </Badge>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {lead.source}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Button
                                        variant="ghost"
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => viewLeadDetails(lead)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                No leads found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{leads.length}</span> leads
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Lead Detail Modal (Enhanced version) */}
            {selectedLead && (
                <LeadDetailsDialog
                    lead={selectedLead}
                    isOpen={!!selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onStatusUpdate={handleStatusUpdate}
                    onScheduleFollowUp={(lead) => {
                        setSelectedLead(prevLead => prevLead);
                        setIsFollowUpModalOpen(true);
                    }}
                />
            )}

            {/* Add Lead Modal */}
            <AddLeadForm
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onLeadAdded={handleLeadAdded}
            />

            {/* Schedule Follow-up Modal */}
            {selectedLead && (
                <ScheduleFollowUpForm
                    isOpen={isFollowUpModalOpen}
                    onClose={() => {
                        setIsFollowUpModalOpen(false);
                        // Force refresh data after scheduling
                        setTimeout(() => setRefreshKey(prev => prev + 1), 100);
                    }}
                    lead={selectedLead}
                    onScheduled={handleFollowUpScheduled}
                />
            )}
        </div>
    );
};

export default LeadsPage;