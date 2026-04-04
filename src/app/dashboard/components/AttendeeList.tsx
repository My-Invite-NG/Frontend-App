"use client";

import { useState } from "react";
import { PurchasedTicket } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, CheckCircle2, User, Clock, QrCode } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { hostApi } from "@/api/host";
import { toast } from "sonner";

interface AttendeeListProps {
  attendees: any[];
  eventId: string;
  onRefresh: () => void;
}

export default function AttendeeList({ attendees, eventId, onRefresh }: AttendeeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkingIn, setCheckingIn] = useState<number | null>(null);

  const filteredAttendees = attendees.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckIn = async (ticketId: string, attendeeId: number) => {
    try {
      setCheckingIn(attendeeId);
      await hostApi.checkInAttendee(ticketId);
      toast.success("Guest checked in successfully");
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to check in guest");
    } finally {
      setCheckingIn(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search attendees by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4">
        {filteredAttendees.map((attendee) => (
          <Card key={attendee.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{attendee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{attendee.email}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-violet-500/10 text-violet-600">
                  {attendee.ticket_type}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                   <Clock className="w-3 h-3" />
                   {new Date(attendee.date).toLocaleDateString()}
                </div>
              </div>

              <div className="shrink-0">
                {attendee.scan_status === "scanned" ? (
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    Checked In
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleCheckIn(attendee.id, attendee.id)}
                    disabled={checkingIn === attendee.id}
                    className="gap-2"
                  >
                    {checkingIn === attendee.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <>Check In</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredAttendees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No attendees found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
