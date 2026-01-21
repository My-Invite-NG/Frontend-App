"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { adminApi } from "@/api/admin";
import { MessageSquare, Filter, Search, Clock, CheckCircle } from "lucide-react";

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            if (searchTerm) params.search = searchTerm;
            
            const res = await adminApi.getTickets(params);
            setTickets(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]); // refetch on filter change

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTickets();
    };

    // Helper for badges
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'customer_reply': return 'bg-amber-100 text-amber-700 border-amber-200'; // Attention needed
            case 'agent_reply': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'closed': return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
                        <p className="text-slate-500">Manage user inquiries and disputes</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <select 
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="customer_reply">Pending Reply</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search by subject, user, or ID..." 
                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-violet-100 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-slate-50">
                        {tickets.map(ticket => (
                            <Link key={ticket.id} href={`/admin/support/${ticket.id}`} className="block hover:bg-slate-50 transition-colors group">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-12 rounded-full ${
                                            ticket.priority === 'urgent' ? 'bg-red-500' :
                                            ticket.priority === 'high' ? 'bg-orange-400' :
                                            'bg-slate-300'
                                        }`} />
                                        
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                                                    {ticket.subject}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(ticket.status)}`}>
                                                    {ticket.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="font-medium text-slate-700">{ticket.user?.first_name} {ticket.user?.last_name}</span>
                                                <span>•</span>
                                                <span className="capitalize">{ticket.category}</span>
                                                <span>•</span>
                                                <span>{new Date(ticket.updated_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs text-slate-400">Last updated</div>
                                            <div className="text-sm font-medium text-slate-700">{new Date(ticket.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        
                        {!loading && tickets.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                <p>No tickets found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
}
