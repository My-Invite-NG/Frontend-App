"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { adminApi } from "@/api/admin";

// Types
interface TrustTier {
  id: number;
  name: string;
  min_score: number;
  max_score: number;
  withdrawal_percent: number;
  days_prior: number;
}

interface TrustSetting {
  id: number;
  key: string;
  value: string;
  description: string;
}

export default function TrustScorePage() {
  const [tiers, setTiers] = useState<TrustTier[]>([]);
  const [settings, setSettings] = useState<TrustSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Tiers
      const tiersRes = await adminApi.getTrustTiers();
      setTiers(tiersRes.data);
      
      // Fetch Settings
      const settingsRes = await adminApi.getTrustScoreSettings();
      setSettings(settingsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load trust score data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTierChange = (index: number, field: keyof TrustTier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  const handleSettingChange = (index: number, value: string) => {
    const newSettings = [...settings];
    newSettings[index] = { ...newSettings[index], value: value };
    setSettings(newSettings);
  };

  const saveTiers = async () => {
    try {
      await adminApi.updateTrustTiers({ tiers });
      toast.success("Trust Tiers updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to update tiers");
    }
  };

  const saveSettings = async () => {
    try {
      const payload = settings.map(s => ({ key: s.key, value: s.value }));
      await adminApi.updateTrustScoreSettings({ settings: payload });
      toast.success("Gamification settings updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (loading && tiers.length === 0) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
         <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Trust Score Management</h1>
         <p className="text-slate-500 dark:text-slate-400">Configure tiers and gamification rules for host withdrawals.</p>
      </div>

      {/* Tiers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Trust Tiers</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Define benchmarks and withdrawal limits.</p>
        </CardHeader>
        <div className="p-0"> {/* Card wraps children in p-6 unless noPadding. But we want table. */}
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">Tier Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">Min Score</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">Max Score</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">Withdrawal %</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">Days Prior</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {tiers.map((tier, index) => (
                        <tr key={tier.id} className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                            <td className="p-4 align-middle font-medium">{tier.name}</td>
                            <td className="p-4 align-middle">
                                <Input 
                                    type="number" 
                                    value={tier.min_score} 
                                    onChange={(e) => handleTierChange(index, 'min_score', parseInt(e.target.value))}
                                    className="w-20"
                                />
                            </td>
                            <td className="p-4 align-middle">
                                <Input 
                                    type="number" 
                                    value={tier.max_score} 
                                    onChange={(e) => handleTierChange(index, 'max_score', parseInt(e.target.value))}
                                    className="w-20"
                                />
                            </td>
                            <td className="p-4 align-middle">
                                <div className="flex items-center gap-2">
                                    <Input 
                                        type="number" 
                                        value={tier.withdrawal_percent} 
                                        onChange={(e) => handleTierChange(index, 'withdrawal_percent', parseInt(e.target.value))}
                                        className="w-20"
                                    />
                                    <span>%</span>
                                </div>
                            </td>
                            <td className="p-4 align-middle">
                                <Input 
                                    type="number" 
                                    value={tier.days_prior} 
                                    onChange={(e) => handleTierChange(index, 'days_prior', parseInt(e.target.value))}
                                    className="w-20"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={saveTiers}>Save Tiers</Button>
          </div>
        </div>
      </Card>

      {/* Gamification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Gamification & Rules</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Points awarded or deducted for host actions.</p>
        </CardHeader>
        <div className="p-0">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.map((setting, index) => (
                 <div key={setting.key} className="flex flex-col gap-2 p-4 border rounded-lg">
                    <label className="font-semibold text-base">{setting.description || setting.key}</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Value:</span>
                        <Input 
                            value={setting.value}
                            onChange={(e) => handleSettingChange(index, e.target.value)}
                            className="w-full"
                        />
                    </div>
                 </div>
              ))}
           </div>
           <div className="mt-6 flex justify-end">
            <Button onClick={saveSettings}>Save Rules</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
