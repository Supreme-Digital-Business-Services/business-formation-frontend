import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../components/ui/dialog';

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

    // Get leads from API
    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

                let url = `${baseUrl}/leads?page=${currentPage}&limit=10`;

                if (statusFilter) {
                    url += `&status=${statusFilter}`;
                }

                if (sourceFilter) {
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
    }, [currentPage, statusFilter, sourceFilter, searchTerm]);

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

    // Update lead status
    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

            await axios.put(
                `${baseUrl}/leads/${leadId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state to reflect the change
            setLeads(leads.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            ));

            setFilteredLeads(filteredLeads.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            ));

            // Update selected lead if it's open
            if (selectedLead && selectedLead.id === leadId) {
                setSelectedLead({ ...selectedLead, status: newStatus });
            }

        } catch (error) {
            console.error('Error updating lead status:', error);
            // Show error notification
        }
    };

    // View lead details
    const viewLeadDetails = (lead) => {
        setSelectedLead(lead);
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
                <Button variant="outline">Add Manual Lead</Button>
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
                            <SelectItem value="">All Statuses</SelectItem>
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
                            <SelectItem value="">All Sources</SelectItem>
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

            {/* Lead Detail Modal */}
            {selectedLead && (
                <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                Lead Details: {selectedLead.firstName} {selectedLead.lastName}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div>
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Contact Information</h4>
                                <p className="text-sm">Email: {selectedLead.email}</p>
                                <p className="text-sm">Phone: {selectedLead.phone}</p>
                            </div>

                            <div>
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Lead Information</h4>
                                <p className="text-sm">Business Type: {selectedLead.businessType || 'Not specified'}</p>
                                <p className="text-sm">Source: {selectedLead.source}</p>
                                <p className="text-sm">
                                    Status: <Badge variant="outline" className={getStatusBadgeColor(selectedLead.status)}>{selectedLead.status}</Badge>
                                </p>
                            </div>

                            <div className="col-span-2">
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Message</h4>
                                <p className="text-sm">{selectedLead.message || 'No message provided'}</p>
                            </div>

                            <div className="col-span-2">
                                <h4 className="mb-1 text-sm font-medium text-gray-500">Update Status</h4>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'NEW' ? 'bg-green-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'NEW')}
                                    >
                                        New
                                    </Button>
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'CONTACTED' ? 'bg-blue-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'CONTACTED')}
                                    >
                                        Contacted
                                    </Button>
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'QUALIFIED' ? 'bg-purple-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'QUALIFIED')}
                                    >
                                        Qualified
                                    </Button>
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'PROPOSAL' ? 'bg-yellow-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'PROPOSAL')}
                                    >
                                        Proposal
                                    </Button>
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'NEGOTIATION' ? 'bg-orange-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'NEGOTIATION')}
                                    >
                                        Negotiation
                                    </Button>
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'WON' ? 'bg-emerald-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'WON')}
                                    >
                                        Won
                                    </Button>
                                    <Button
                                        variant="outline" size="sm"
                                        className={selectedLead.status === 'LOST' ? 'bg-red-100' : ''}
                                        onClick={() => updateLeadStatus(selectedLead.id, 'LOST')}
                                    >
                                        Lost
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setSelectedLead(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default LeadsPage;