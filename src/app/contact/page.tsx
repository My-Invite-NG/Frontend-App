"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Message sent successfully! We'll get back to you soon.");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Failed to send message. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
      <>
      <Navbar />
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600">
                Have questions? We're here to help. Send us a message and we'll
                respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact info */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Get in touch
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          support@myinvite.co
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          +234 812 345 6789
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Office
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          Lagos, Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-violet-600 rounded-2xl p-8 text-white shadow-xl shadow-violet-200">
                  <h3 className="text-xl font-bold mb-4">Customer Support</h3>
                  <p className="text-violet-100 mb-6 underline">
                    Head over to our Help Center for quick answers to common
                    questions about ticketing, payments, and event hosting.
                  </p>
                  <button className="px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-violet-50 transition-colors">
                    Visit Help Center
                  </button>
                </div>
              </div>

              {/* Contact form */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
}
