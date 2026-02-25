import { useState } from "react";
import { userApi } from "@/api/user";
import { Loader2, Lock } from "lucide-react";

interface CreatePinModalProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export default function CreatePinModal({ isOpen, onSuccess }: CreatePinModalProps) {
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (pin.length !== 4) {
            setError("PIN must be 4 digits");
            return;
        }
        if (pin !== confirmPin) {
            setError("PINs do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await userApi.updateProfile({ transaction_pin: pin });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create PIN");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Transaction PIN</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        You need a PIN to secure your wallet transactions.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter 4-digit PIN
                        </label>
                        <input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-center tracking-widest text-lg text-gray-900 dark:text-gray-100"
                            placeholder="••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm PIN
                        </label>
                        <input
                            type="password"
                            maxLength={4}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-center tracking-widest text-lg text-gray-900 dark:text-gray-100"
                            placeholder="••••"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || pin.length !== 4 || confirmPin.length !== 4}
                        className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Set PIN & Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}
