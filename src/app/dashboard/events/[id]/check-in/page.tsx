"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { hostApi } from "@/api/host";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  QrCode,
  Users,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AttendeeList from "../../../components/AttendeeList";

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) fetchDetails();
  }, [eventId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await hostApi.getEventDetails(eventId);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  if (!data)
    return (
      <div className="p-8 text-center text-muted-foreground">Event not found</div>
    );

  const { event, stats, attendees } = data;

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/events/${eventId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Event
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Event Check-in</h1>
              <p className="text-muted-foreground mt-1">{event.title}</p>
            </div>
            <div className="flex items-center gap-2">
               <Button
                variant={isScanning ? "danger" : "primary"}
                onClick={() => setIsScanning(!isScanning)}
                className="gap-2"
                disabled // Disabled until scanner library is confirmed
              >
                <QrCode className="w-4 h-4" />
                {isScanning ? "Stop Scanning" : "Scan QR Code"}
              </Button>
              <Button variant="outline" onClick={fetchDetails} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
                <p className="text-xs text-muted-foreground uppercase font-bold">Total Sold</p>
                <p className="text-2xl font-bold">{stats.tickets_sold}</p>
            </Card>
            <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-600 uppercase font-bold">Checked In</p>
                <p className="text-2xl font-bold text-emerald-600">
                    {attendees.filter((a: any) => a.scan_status === 'scanned').length}
                </p>
            </Card>
            <Card className="p-4">
                <p className="text-xs text-muted-foreground uppercase font-bold">Remaining</p>
                <p className="text-2xl font-bold">
                    {stats.tickets_sold - attendees.filter((a: any) => a.scan_status === 'scanned').length}
                </p>
            </Card>
            <Card className="p-4">
                <p className="text-xs text-muted-foreground uppercase font-bold">Attendance</p>
                <p className="text-2xl font-bold">
                    {stats.tickets_sold > 0 
                        ? Math.round((attendees.filter((a: any) => a.scan_status === 'scanned').length / stats.tickets_sold) * 100)
                        : 0}%
                </p>
            </Card>
        </div>

        {/* Attendee List Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Guest List
                </h2>
                <span className="text-xs text-muted-foreground">
                    Click "Check In" to manually mark a guest as present.
                </span>
            </div>
            
            <AttendeeList 
                attendees={attendees} 
                eventId={eventId} 
                onRefresh={fetchDetails} 
            />
        </div>
      </div>
    </div>
  );
}
