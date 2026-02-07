"use client";

import { ShieldAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleVerifyClick = () => {
      router.push('/dashboard/settings?tab=verification');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verification Required
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            To create events on our platform, you need to complete a basic identity verification. This helps us maintain a safe and trusted community.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleVerifyClick}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-violet-600/20"
            >
              Verify Identity Now
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
