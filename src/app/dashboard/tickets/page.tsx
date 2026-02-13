"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/api/user";
import { Loader2, Ticket as TicketIcon, Calendar, MapPin, QrCode } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

    const fetchTickets = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await userApi.getTickets({ page: pageNum });
            setTickets(res.data);
            setMeta(res.meta);
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (!meta || newPage <= meta.last_page)) {
            fetchTickets(newPage);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/10 pb-20 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        View and manage your purchased event tickets.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
                ) : tickets.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tickets.map((pt) => pt.event && pt.ticket ? (
                                <div key={pt.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                    {/* Event Image / Header */}
                                    <div className="h-32 bg-muted relative overflow-hidden">
                                         {pt.event.image_url ? (
                                            <img src={pt.event.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                                 <TicketIcon className="w-8 h-8 opacity-50" />
                                             </div>
                                         )}
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                             <Link href={`/events/${pt.event.slug}`} className="text-white font-bold hover:underline truncate">
                                                 {pt.event.title}
                                             </Link>
                                         </div>
                                    </div>

                                    {/* Ticket Details */}
                                    <div className="p-5 flex-1 flex flex-col">
                                         <div className="flex justify-between items-start mb-4">
                                             <div>
                                                 <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                                                     {pt.ticket.title}
                                                 </span>
                                                 <h3 className="font-bold text-foreground mt-2">
                                                     {formatCurrency(pt.ticket.price)}
                                                 </h3>
                                             </div>
                                             <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                                 <QrCode className="w-8 h-8 text-black" />
                                             </div>
                                         </div>

                                         <div className="space-y-2 mb-6 flex-1">
                                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                 <Calendar className="w-4 h-4 shrink-0" />
                                                 <span>{new Date(pt.event.start_date).toLocaleDateString()} at {new Date(pt.event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                             </div>
                                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                 <MapPin className="w-4 h-4 shrink-0" />
                                                 <span className="truncate">{pt.event.location}</span>
                                             </div>
                                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                 <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">ID: #{pt.id}</span>
                                             </div>
                                         </div>

                                         <Link 
                                            href={`/events/${pt.event.slug}`}
                                            className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-center hover:bg-primary/90 transition-colors"
                                         >
                                             View Event Details
                                         </Link>
                                    </div>
                                </div>
                            ) : null)}
                        </div>

                        {/* Pagination Controls */}
                        {meta && meta.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button 
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1 text-sm border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-muted-foreground">
                                    Page {meta.current_page} of {meta.last_page}
                                </span>
                                <button 
                                     onClick={() => handlePageChange(page + 1)}
                                     disabled={page === meta.last_page}
                                     className="px-3 py-1 text-sm border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                     <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <TicketIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No Tickets Found</h3>
                        <p className="text-muted-foreground mt-2 mb-6">You haven't purchased any tickets yet.</p>
                        <Link href="/events" className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
                            Browse Events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
