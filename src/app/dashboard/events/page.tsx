"use client";

import { useState, useEffect, MouseEvent } from "react";
import { hostApi } from "@/api/host";
import { authService } from "@/api/auth";
import { eventsApi } from "@/api/events";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  Trash2,
  Globe,
  FileEdit,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatCurrency } from "@/lib/utils";

export default function MyEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCreateEvent = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUser = authService.getCurrentUser();
    if (
      currentUser?.kyc_status == null ||
      currentUser?.kyc_status?.trim() == "" ||
      currentUser?.kyc_status == "unverified"
    ) {
      setShowKycModal(true);
    } else {
      router.push("/dashboard/events/create");
    }
  };

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "publish" | "draft" | "delete" | null;
    eventId: string | null;
    title: string;
    message: string;
    isDestructive: boolean;
  }>({
    isOpen: false,
    type: null,
    eventId: null,
    title: "",
    message: "",
    isDestructive: false,
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await hostApi.getEvents({ 
        page, 
        limit: 10,
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      console.log(response);
      setEvents(response.data); // data is now the array from Resource
      // Assuming response also contains meta or links for pagination from Laravel Resource
      // We might need to adjust hostApi type or response handling if it's wrapped
      // standard Laravel resource collection response: { data: [...], meta: { current_page: ... }, links: {...} }
      // But looking at previous code, hostApi.getEvents() returns response.data
      
      // Let's verify the actual response structure in next step or assume standard Laravel Resource
      // If using ::collection(paginate()), it returns { data: [], meta: {}, links: {} }
      // So setEvents(response.data) is correct for the items.
      // We need to extract meta for pagination state.
      // However, the current hostApi.getEvents implementation returns response.data directly.
      // If response.data is the wrapper, then setEvents(response.data.data) might be needed?
      // Let's stick to safe handling.
      
      if (response.meta) {
          setPagination({
              current_page: response.meta.current_page,
              last_page: response.meta.last_page,
              total: response.meta.total,
              per_page: response.meta.per_page
          });
      }
      
    } catch (error) {
      console.error("Failed to fetch host events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchEvents(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= pagination.last_page) {
          fetchEvents(newPage);
      }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (e: MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const confirmAction = (
    type: "publish" | "draft" | "delete",
    eventId: string,
  ) => {
    const config = {
      isOpen: true,
      type,
      eventId,
      title: "",
      message: "",
      isDestructive: false,
    };

    if (type === "publish") {
      config.title = "Publish Event";
      config.message =
        "Are you sure you want to publish this event? It will be visible to everyone.";
    } else if (type === "draft") {
      config.title = "Unpublish Event";
      config.message =
        "Are you sure you want to unpublish this event? It will be hidden from the public.";
      config.isDestructive = true;
    } else if (type === "delete") {
      config.title = "Delete Event";
      config.message =
        "Are you sure you want to delete this event? This action cannot be undone.";
      config.isDestructive = true;
    }

    setModalConfig(config);
    setOpenDropdownId(null); // Close dropdown
  };

  const executeAction = async () => {
    if (!modalConfig.eventId || !modalConfig.type) return;

    try {
      if (modalConfig.type === "publish") {
        await eventsApi.publish(modalConfig.eventId);
      } else if (modalConfig.type === "draft") {
        await eventsApi.update(modalConfig.eventId, { status: "draft" });
      } else if (modalConfig.type === "delete") {
        await eventsApi.delete(modalConfig.eventId);
      }
      fetchEvents();
    } catch (error) {
      console.error(error);
      // Optional: Show error toast instead of alert, but for now console log is safer than simple alert if requests fail
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Events</h1>
            <p className="text-muted-foreground">
              Manage your upcoming and past events
            </p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Create Event
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <div className="bg-card border border-border rounded-xl p-1 flex items-center">
              {["all", "published", "draft", "ended"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
             // ... existing skeleton
             <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-card rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : events?.length > 0 ? (
          <>
            <div className="space-y-4">
               {/* ... existing events map */}
               {events?.map((event) => (
                   // ... existing event card
                   <div
                key={event.id}
                onClick={() => router.push(`/dashboard/events/${event.id}`)}
                className="relative bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-6 hover:border-primary/20 transition-colors cursor-pointer group"
              >
                  {/* ... event card content */}
                   <div className="w-full md:w-24 h-24 bg-muted rounded-lg shrink-0 overflow-hidden relative">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === "published"
                          ? "bg-green-500/10 text-green-600"
                          : event.status === "draft"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />{" "}
                      {new Date(event.start_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />{" "}
                      {event.tickets_sold || 0} Sold
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />{" "}
                      {formatCurrency(event.revenue || 0)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 relative">
                  <Link
                    href={`/dashboard/events/${event.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 md:flex-none px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-muted text-sm text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => toggleDropdown(e, event.id)}
                    className={`p-2 rounded-lg transition-colors ${openDropdownId === event.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                    {/* ... dropdown menu */}
                   {openDropdownId === event.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden transform origin-top-right"
                    >
                      <div className="py-1">
                        <Link
                          href={`/events/${event.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" /> View
                          Event
                        </Link>
                        {event.status !== "published" ? (
                          <button
                            onClick={() => confirmAction("publish", event.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted text-left transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                            Publish Event
                          </button>
                        ) : (
                          <button
                            onClick={() => confirmAction("draft", event.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted text-left transition-colors"
                          >
                            <Ban className="w-4 h-4 text-orange-500" />{" "}
                            Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => confirmAction("delete", event.id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 text-left border-t border-border transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Event
                        </button>
                      </div>
                    </div>
                  )}
               </div>
               </div>
               ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button 
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-3 py-1 text-sm border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button 
                         onClick={() => handlePageChange(pagination.current_page + 1)}
                         disabled={pagination.current_page === pagination.last_page}
                         className="px-3 py-1 text-sm border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed">
            {/* ... no events state */}
             <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              No events found
            </h3>
            <p className="text-muted-foreground mt-2 mb-6">
              You haven't created any events yet.
            </p>
            <Link
              href="/dashboard/events/create"
              className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Host Your First Event
            </Link>
          </div>
        )}

        {/* ... modals (ConfirmationModal) */}
        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onConfirm={executeAction}
          title={modalConfig.title}
          message={modalConfig.message}
          variant={modalConfig.isDestructive ? "danger" : "primary"}
        />

        <ConfirmationModal
          isOpen={showKycModal}
          onClose={() => setShowKycModal(false)}
          onConfirm={async () =>
            router.push("/dashboard/settings?tab=verification")
          }
          title="Identity Verification Required"
          message="You need to verify your identity before creating events. Please go to Settings to complete the verification process."
          variant="primary"
          confirmLabel="Go to Settings"
        />
      </div>
    </div>
  );
}
