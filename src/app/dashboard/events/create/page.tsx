"use client";

import { useState, useEffect } from "react";
import { eventsApi } from "@/api/events";
import { userApi } from "@/api/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import VerificationModal from "@/components/ui/VerificationModal";
import EventWizard from "@/components/events/wizard/EventWizard";
import { ArrowLeft, Loader2, X } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // User Verification Logic
  const [user, setUser] = useState<any>(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await userApi.getUser();
        setUser(userData);
        
        // Check KYC Status
        if (!userData.kyc_status || userData.kyc_status === 'unverified') {
           setShowVerificationModal(true);
        }
      } catch (err) {
        console.error("Failed to fetch user for KYC check", err);
      } finally {
        setFetchingUser(false);
      }
    };
    checkUser();
  }, []);

  const handleSubmit = async (submissionData: FormData, deletedMediaIds: number[]) => {
    if (!user || (!user.kyc_status) || user.kyc_status === 'unverified') {
        setShowVerificationModal(true);
        return;
    }

    setLoading(true);
    setError("");

    try {
      await eventsApi.create(submissionData);
      success("Event created successfully!");
      router.push("/dashboard/events");
    } catch (err: any) {
      console.error("Create failed", err);
      setError(
        err.response?.data?.message ||
          "Failed to create event. Please check all fields."
      );
      toastError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
      return (
        <div className="min-h-screen bg-muted/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <VerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => router.push('/dashboard/events')} 
      />
      
      <div className={`max-w-4xl mx-auto px-4 md:px-0 py-8 ${showVerificationModal ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="mb-8">
           <Link href="/dashboard/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
           </Link>
          <h1 className="text-2xl font-bold text-foreground">Create New Event</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in the details below to publish your event.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-medium flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <EventWizard 
          onSubmit={handleSubmit} 
          loading={loading} 
          errorMsg={error} 
        />
      </div>
    </div>
  );
}
