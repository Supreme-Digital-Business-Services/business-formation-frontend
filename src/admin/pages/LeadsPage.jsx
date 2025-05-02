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
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [userFilter, setUserFilter] = useState('all');
    const [usersList, setUsersList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // For forcing refreshes
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // Fetch current user data
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                const response = await axios.get(`${baseUrl}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCurrentUser(response.data);
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch users for admin filter
    useEffect(() => {
        const fetchUsers = async () => {
            if (userRole === 'ADMIN') { // Only fetch users list if admin
                try {
                    const token = localStorage.getItem('token');
                    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                    const response = await axios.get(`${baseUrl}/users`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setUsersList(response.data || []);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        fetchUsers();
    }, [userRole]);

    // Get leads from API
    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

                let url = `${baseUrl}/leads?page=${currentPage}&limit=10`;

                // Add filter based on status
                if (statusFilter && statusFilter !== 'all') {
                    url += `&status=${statusFilter}`;
                }

                // Add filter based on source
                if (sourceFilter && sourceFilter !== 'all') {
                    url += `&source=${sourceFilter}`;
                }

                // Add filter based on assignment
                if (assignmentFilter === 'me') {
                    url += `&assigned=me`;
                } else if (assignmentFilter === 'mine') {
                    url += `&createdBy=me`;
                } else if (assignmentFilter === 'assigned') {
                    url += `&assignedBy=me`;
                } else if (assignmentFilter === 'unassigned') {
                    url += `&assigned=unassigned`;
                }

                // Add filter based on user (for admin)
                if (userFilter && userFilter !== 'all') {
                    if (userFilter === 'unassigned') {
                        url += `&assigned=unassigned`;
                    } else {
                        url += `&assignedToUser=${userFilter}`;
                    }
                }

                // Add search term
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

        if (currentUser) {
            fetchLeads();
        }
    }, [currentPage, statusFilter, sourceFilter, searchTerm, assignmentFilter, userFilter, refreshKey, currentUser]);

    // Listen for lead updated events from LeadDetailsDialog
    useEffect(() => {
        const handleLeadUpdated = (event) => {
            const updatedLead = event.detail.lead;
            console.log('Lead updated event received in LeadsPage:', updatedLead);

            // Update leads list with the updated lead
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
                )
            );

            setFilteredLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
                )
            );

            // Also update the selectedLead if it's the same lead
            if (selectedLead && selectedLead.id === updatedLead.id) {
                setSelectedLead(currentLead => ({
                    ...currentLead,
                    ...updatedLead
                }));
            }
        };

        window.addEventListener('leadUpdated', handleLeadUpdated);

        return () => {
            window.removeEventListener('leadUpdated', handleLeadUpdated);
        };
    }, [selectedLead]);

    // Status badge color mapping
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'NEW':
                return 'bg-green-100 text-green-800';
            case 'CONTACTED':
                return 'bg-blue-100 text-blue-800';
            case 'QUALIFIED':
                return 'bg-purple-100 text-purple-800';
            case 'NOT_QUALIFIED':
                return 'bg-rose-100 text-rose-800';
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
            lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
        ));

        setFilteredLeads(filteredLeads.map(lead =>
            lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
        ));

        // Update selected lead if it's open
        if (selectedLead && selectedLead.id === updatedLead.id) {
            setSelectedLead(prevLead => ({ ...prevLead, ...updatedLead }));
        }

        // Force refresh after a delay to ensure complete data
        setTimeout(() => setRefreshKey(prev => prev + 1), 100);
    };

    // View lead details - Simple and fast for good UX
    const viewLeadDetails = (lead) => {
        setSelectedLead(lead);
    };

    // Handle new lead added
    const handleLeadAdded = (newLead) => {
        // Add the new lead to the start of the list
        setLeads([newLead, ...leads]);
        setFilteredLeads([newLead, ...filteredLeads]);

        // Force a refresh to get complete data
        setTimeout(() => setRefreshKey(prev => prev + 1), 100);
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
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
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
                            <SelectItem value="NOT_QUALIFIED">Not Qualified</SelectItem>
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
                            <SelectItem value="GOOGLE_ADS">Google Ads</SelectItem>
                            <SelectItem value="REFERRAL">Referral</SelectItem>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by assignment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Leads</SelectItem>
                            <SelectItem value="me">Assigned to Me</SelectItem>
                            <SelectItem value="mine">Created by Me</SelectItem>
                            {userRole === 'ADMIN' && (
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                            )}
                            <SelectItem value="assigned">I Assigned to Others</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* User filter - only show for admins */}
                {userRole === 'ADMIN' && (
                    <div>
                        <Select value={userFilter} onValueChange={setUserFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by user" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {usersList.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
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
                            Assigned To
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
                                    {lead.assignedTo ? (
                                        <span>
                                            {lead.assignedTo.name}
                                            {currentUser && lead.assignedTo.id === currentUser.id && (
                                                <span className="ml-1 text-xs text-blue-600">(You)</span>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Unassigned</span>
                                    )}
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
                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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
                    userRole={userRole}
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