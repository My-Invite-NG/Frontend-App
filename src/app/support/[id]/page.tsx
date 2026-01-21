"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation"; // Correct for Next.js App Router
import { supportApi, SupportTicket, SupportMessage } from "@/api/support"; // Adjust import path
import { Send, ArrowLeft, Paperclip } from "lucide-react";

export default function TicketDetailPage() {
    const params = useParams(); // returns { id: string } or undefined
    const router = useRouter();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Safely extract ID. params can be Promise in newest Next versions but usually simple obj in v13/14 client components unless async page.
    // In strict Next 15, params might need to be awaited if this was a server component, but this is "use client".
    // However, useParams() hook returns params directly.
    const ticketId = params?.id as string;

    const fetchTicket = async () => {
        try {
            if (!ticketId) return;
            const res = await supportApi.getTicket(ticketId);
            setTicket(res.data);
            setMessages(res.data.messages);
            setLoading(false);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load ticket", error);
            // router.push('/support'); // Redirect on error?
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
            await supportApi.replyTicket(ticketId, { message: newMessage });
            setNewMessage("");
            fetchTicket(); // Refresh to show new message and update status
        } catch (error) {
            alert('Failed to send message');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading conversation...</div>;
    if (!ticket) return <div className="min-h-screen flex items-center justify-center text-red-500">Ticket not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col h-screen">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-700">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-slate-900 text-lg">#{ticket.id.substring(0,8)} - {ticket.subject}</h1>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                                ticket.status === 'closed' ? 'bg-slate-100 text-slate-600' :
                                'bg-purple-100 text-purple-700'
                            }`}>
                                {ticket.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 capitalize">{ticket.category} • Priority: {ticket.priority}</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                            msg.is_admin ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-none' : 'bg-violet-600 text-white rounded-tr-none'
                        }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            <div className={`text-[10px] mt-1 opacity-70 ${msg.is_admin ? 'text-slate-400' : 'text-violet-200'}`}>
                                {msg.is_admin ? 'Support Agent' : 'You'} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </div>
                ))}
                
                {ticket.status === 'closed' && (
                    <div className="text-center py-4">
                        <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                            This ticket has been closed.
                        </span>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            {ticket.status !== 'closed' && (
                <div className="bg-white border-t border-slate-200 p-4 shrink-0">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
                         <button type="button" className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
