"use client";

import { useState } from "react";
import { 
    Search, 
    Book, 
    Ticket, 
    Settings, 
    CreditCard, 
    MessageCircle,
    ChevronDown,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
    {
        category: "Getting Started",
        icon: <Book className="w-5 h-5 text-violet-600" />,
        questions: [
            {
                q: "What is MyInvite?",
                a: "MyInvite is a premium event discovery and ticketing platform. We connect organizers with attendees, providing seamless tools for creating, managing, and monetizing events."
            },
            {
                q: "How do I create an event?",
                a: "Simply sign up for an organizer account, head to your dashboard, and click 'Create Event'. You can set up free or paid tickets, add details, and start sharing your link in minutes."
            }
        ]
    },
    {
        category: "Ticketing & Payouts",
        icon: <Ticket className="w-5 h-5 text-emerald-600" />,
        questions: [
            {
                q: "What are the platform fees?",
                a: "We charge a standard 13% fee (5% Service + 8% Tax) on paid tickets. Organizers can choose to pass this fee to attendees or absorb it. Free events are always 100% free."
            },
            {
                q: "When do I get paid?",
                a: "Automated payouts are distributed 24 hours after your event has successfully concluded. Funds are sent directly to your linked bank account."
            }
        ]
    },
    {
        category: "Account Management",
        icon: <Settings className="w-5 h-5 text-blue-600" />,
        questions: [
            {
                q: "How do I verify my account?",
                a: "Account verification involves submitting a valid ID and completing a life-check. Verified accounts receive a higher Trust Score and priority support."
            },
            {
                q: "Can I transfer tickets?",
                a: "Currently, ticket transfers must be handled by contacting the event organizer directly through the platform's messaging system."
            }
        ]
    }
];

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState<string | null>("cat-0-q-0");

    const toggleAccordion = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-16 selection:bg-violet-100 selection:text-violet-900">
                {/* Hero Search Section */}
                <div className="bg-violet-600 pt-24 pb-32 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                            How can we help you?
                        </h1>
                        <p className="text-violet-200 text-lg mb-10">
                            Search our knowledge base or browse categories below.
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 rounded-full text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-violet-400/50 transition-all border-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 pb-24">
                    {/* Interactive FAQ Accordion */}
                    <div className="space-y-10">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((category, catIndex) => (
                                <div key={catIndex} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                                            {category.icon}
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900">{category.category}</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {category.questions.map((faq, qIndex) => {
                                            const id = `cat-${catIndex}-q-${qIndex}`;
                                            const isOpen = openIndex === id;
                                            return (
                                                <div 
                                                    key={qIndex} 
                                                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-violet-200 bg-violet-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                                >
                                                    <button 
                                                        onClick={() => toggleAccordion(id)}
                                                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                                                    >
                                                        <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
                                                        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-600' : ''}`} />
                                                    </button>
                                                    
                                                    <div 
                                                        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                                    >
                                                        <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                                                            {faq.a}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
                                <p className="text-slate-500">We couldn't find any articles matching "{searchQuery}".</p>
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="mt-6 text-violet-600 font-bold hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Support CTA */}
                    <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 blur-[80px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Still need help?</h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                Our support team is always ready to assist you. Send us a message and we'll get back to you within 24 hours.
                            </p>
                            <Link 
                                href="/contact" 
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-black/20"
                            >
                                Contact Support <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
