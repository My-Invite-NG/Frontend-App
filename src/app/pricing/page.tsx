"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  CreditCard,
  Plus,
  Minus,
  Loader2,
  Sparkles,
  UserCheck,
  BaggageClaim,
  ArrowDownCircle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { eventsApi } from "@/api/events";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  const [meta, setMeta] = useState<{
    service_fee_percentage: number;
    tax_percentage: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const data = await eventsApi.getPricingMeta();
        setMeta(data);
      } catch (error) {
        console.error("Failed to fetch pricing meta", error);
        // Fallback to defaults if API fails
        setMeta({ service_fee_percentage: 5, tax_percentage: 8 });
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  const totalFee = meta
    ? meta.service_fee_percentage + meta.tax_percentage
    : 13;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAFAFE] selection:bg-violet-100 selection:text-violet-900 pt-16">
        {/* Header / Hero */}
        <header className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-200/30 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-bold mb-8 animate-bounce">
              <Sparkles className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
              The best way to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600">
                monetize your passion.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
              Powerful event management tools with a fee structure that scales
              with you. No hidden costs, just growth.
            </p>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="px-4 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Events Card */}
            <div className="relative group bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              <div className="mb-8">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <Check className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Free Events
                </h3>
                <p className="text-slate-500 font-medium">
                  Perfect for communities.
                </p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-6xl font-black text-slate-900">₦0</span>
                <span className="text-slate-400 font-bold">forever</span>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {[
                  "Unlimited free tickets",
                  "Basic attendee analytics",
                  "Standard support",
                  "RSVP tracking",
                  "Mobile check-in app",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-600 font-medium text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/events/create"
                className="w-full py-4 text-center bg-slate-50 text-slate-900 font-black rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                Start for Free
              </Link>
            </div>

            {/* Paid Events Card (Attendee Pays) */}
            <div className="relative group bg-white rounded-[3rem] p-10 border-4 border-violet-600 flex flex-col shadow-2xl shadow-violet-100 scale-105 z-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-violet-600 text-white text-xs font-black rounded-full uppercase tracking-widest ring-4 ring-white">
                Recommended
              </div>

              <div className="mb-8 font-sans">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-violet-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 italic">
                  Standard Plan
                </h3>
                <p className="text-slate-500 font-medium">
                  Platform fees paid by attendees.
                </p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-6xl font-black text-slate-900">
                  {totalFee}%
                </span>
                <span className="text-slate-400 font-bold">per ticket</span>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-3 text-slate-900 font-bold text-sm bg-violet-50 -mx-4 px-4 py-2 rounded-xl">
                  <Info className="w-4 h-4 text-violet-600" />
                  <span className="font-sans italic">
                    Host keeps 100% of price
                  </span>
                </li>
                {[
                  `${meta?.service_fee_percentage}% Global Service Fee`,
                  `${meta?.tax_percentage}% Standard Tax/VAT`,
                  "Attendee pays the difference",
                  "Real-time payout monitoring",
                  "Priority email support",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-600 font-medium text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-violet-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/events/create"
                className="w-full py-4 text-center bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200"
              >
                Create Paid Event
              </Link>
            </div>

            {/* Absorb Fees Card */}
            <div className="relative group bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              <div className="mb-8">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <UserCheck className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Professional
                </h3>
                <p className="text-slate-500 font-medium">
                  Host absorbs platform fees.
                </p>
              </div>

              <div className="mb-10 flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-slate-900">0%</span>
                  <span className="text-slate-400 font-bold">to attendee</span>
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">
                  Fixed ticket price
                </span>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {[
                  "Fees deducted from host revenue",
                  "Better checkout conversion",
                  "Clean pricing for VIP events",
                  "Detailed financial reports",
                  "Dedicated account manager",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-600 font-medium text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-blue-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="w-full py-4 text-center bg-white text-slate-900 font-black rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                Upgrade & Enable
              </Link>
            </div>
          </div>
        </section>

        {/* How it works comparison */}
        <section className="bg-slate-900 py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full"></div>

          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-white mb-6">
                Who pays the fees?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Choice is yours. Set fee absorption per event in your organizer
                dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
              {/* Comparison logic */}
              <div className="space-y-8">
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white shrink-0">
                      1
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      Attendee Pays (Standard)
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-400">
                      <span>Ticket Price</span>
                      <span className="text-white font-bold">₦10,000</span>
                    </div>
                    <div className="flex justify-between text-violet-400 font-medium">
                      <span>Platform Fees ({totalFee}%)</span>
                      <span>
                        + ₦{(10000 * (totalFee / 100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between">
                      <span className="text-white font-bold">Buyer Pays</span>
                      <span className="text-2xl font-black text-violet-500">
                        ₦{(10000 + 10000 * (totalFee / 100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-emerald-500/10 p-4 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 text-sm font-bold">
                        Organizer Payout: ₦10,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                      2
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      Organizer Absorbs
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-400">
                      <span>Ticket Price</span>
                      <span className="text-white font-bold">₦10,000</span>
                    </div>
                    <div className="flex justify-between text-blue-400 font-medium">
                      <span>Platform Fees ({totalFee}%)</span>
                      <span>(Included)</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between">
                      <span className="text-white font-bold">Buyer Pays</span>
                      <span className="text-2xl font-black text-blue-500">
                        ₦10,000
                      </span>
                    </div>
                    <div className="bg-blue-500/10 p-4 rounded-xl flex items-center gap-3">
                      <ArrowDownCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-500 text-sm font-bold">
                        Organizer Payout: ₦
                        {(10000 - 10000 * (totalFee / 100)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Trust */}
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                <ShieldCheck className="w-10 h-10 text-violet-600" />
              </div>
              <h5 className="text-xl font-black text-slate-900 mb-4">
                Secure & Compliant
              </h5>
              <p className="text-slate-500 font-medium">
                Enterprise-grade security and full regulatory compliance for
                every payment.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h5 className="text-xl font-black text-slate-900 mb-4">
                Fast Payouts
              </h5>
              <p className="text-slate-500 font-medium">
                Automated payouts distributed 24 hours after your event is
                marked complete.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                <Globe className="w-10 h-10 text-emerald-600" />
              </div>
              <h5 className="text-xl font-black text-slate-900 mb-4">
                Global Reach
              </h5>
              <p className="text-slate-500 font-medium">
                Accept local and international cards, bank transfers, and major
                wallets.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="pb-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-10 leading-tight italic font-serif">
                  Experience is the <br /> new currency.
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/signup"
                    className="px-10 py-5 bg-white text-violet-600 font-black rounded-3xl hover:bg-slate-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
                  >
                    Get Started for Free
                  </Link>
                  <Link
                    href="/contact"
                    className="px-10 py-5 bg-violet-500/20 text-white font-black rounded-3xl border border-white/30 backdrop-blur-md hover:bg-white/10 transition-all"
                  >
                    Talk to Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
