"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/api/admin";
import { Send, ArrowLeft, Paperclip, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";

export default function AdminTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<any>(null); // Type 'any' for now, can perform stricter typing later
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    const ticketId = params?.id as string;

    const fetchTicket = async () => {
        try {
            if (!ticketId) return;
            const res = await adminApi.getTicket(ticketId);
            setTicket(res.data);
            setLoading(false);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load ticket", error);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await adminApi.replyTicket(ticketId, { message: newMessage });
            setNewMessage("");
            fetchTicket();
        } catch (error) {
            alert('Failed to send message');
        }
    };

    const updateStatus = async (status: string) => {
        if (!confirm(`Are you sure you want to mark this ticket as ${status.toUpperCase()}?`)) return;
        try {
            await adminApi.updateTicketStatus(ticketId, status);
            fetchTicket();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading ticket...</div>;
    if (!ticket) return <div className="min-h-screen flex items-center justify-center text-red-500">Ticket not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col h-screen">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-700">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-slate-900 text-lg">#{ticketId.substring(0,8)}</h1>
                            <span className="text-slate-300">|</span>
                            <span className="font-medium text-slate-700">{ticket.subject}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {ticket.user?.first_name} {ticket.user?.last_name} ({ticket.user?.email})
                            </span>
                            <span>•</span>
                            <span className="capitalize bg-slate-100 px-2 rounded">{ticket.category}</span>
                            <span>•</span>
                            <span className={`font-bold ${ticket.priority === 'urgent' ? 'text-red-500' : 'text-slate-500'}`}>
                                {ticket.priority.toUpperCase()} priority
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                        <button 
                            onClick={() => updateStatus('resolved')}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Resolve
                        </button>
                    )}
                    {ticket.status !== 'closed' && (
                         <button 
                            onClick={() => updateStatus('closed')}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            <XCircle className="w-4 h-4" />
                            Close
                        </button>
                    )}
                    {['closed', 'resolved'].includes(ticket.status) && (
                        <button 
                            onClick={() => updateStatus('open')}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Reopen
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                        {/* Transaction Context Card */}
                        {ticket.transaction && (
                            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 max-w-2xl mx-auto shadow-sm">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Linked Transaction</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-mono text-slate-700">{ticket.transaction.id}</div>
                                        <div className="text-slate-500">{new Date(ticket.transaction.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">${Number(ticket.transaction.total_amount).toFixed(2)}</div>
                                        <div className={`text-xs font-bold uppercase ${
                                            ticket.transaction.status === 'payment_successful' ? 'text-emerald-600' : 'text-slate-500'
                                        }`}>
                                            {ticket.transaction.status.replace(/_/g, ' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {ticket.messages?.map((msg: any) => (
                            <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col max-w-[75%] ${msg.is_admin ? 'items-end' : 'items-start'}`}>
                                    <div className={`rounded-2xl px-5 py-3 shadow-sm ${
                                        msg.is_admin ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                    }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                         <span className="text-[10px] text-slate-400 font-medium">
                                            {msg.is_admin ? 'You (Support)' : `${ticket.user?.first_name} ${ticket.user?.last_name}`}
                                         </span>
                                         <span className="text-[10px] text-slate-300">•</span>
                                         <span className="text-[10px] text-slate-400">
                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                         </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                         {ticket.status === 'closed' && (
                            <div className="flex justify-center py-6">
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                    Ticket closed on {new Date(ticket.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    {ticket.status !== 'closed' && (
                        <div className="bg-white border-t border-slate-200 p-4 shrink-0">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all pr-12 shadow-sm"
                                        placeholder="Type your reply..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim()}
                                    className="bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar (Optional - for future: User Stats, Past Tickets etc) */}
                {/* <div className="w-80 border-l border-slate-200 bg-white p-6 hidden xl:block">
                     <h3 className="font-bold text-slate-900 mb-4">User Details</h3>
                     ...
                </div> */}
            </div>
        </div>
    );
}
