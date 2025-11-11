
import React, { useState, useEffect } from 'react';
import { config } from './config';

const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const GithubIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);


const Footer: React.FC = () => {
    const [email, setEmail] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchIP = async () => {
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            if (!res.ok) throw new Error("Failed to fetch IP.");
            const data = await res.json();
            setIpAddress(data.ip);
        } catch (error) {
            console.error("IP fetch error:", error);
        }
        };
        fetchIP();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const res = await fetch(`${config.api}/api/subs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, IP_Address: ipAddress }),
            });

            if (res.ok) {
                setMessage("Successfully subscribed! Thank you.");
                setEmail("");
            } else {
                const errorData = await res.json().catch(() => ({ message: "An unexpected error occurred." }));
                setMessage(errorData.message || `Error: ${res.statusText}`);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            console.error("Subscription error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-16 p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 text-center shadow-[0_0_25px_rgba(168,85,247,0.15)]">
            <h2 className="text-3xl font-bold text-white mb-2">Stay Ahead of the Curve</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                Subscribe for the latest articles, tech news, and exclusive content delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                aria-label="Email Address"
                disabled={isSubmitting}
                />
                <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)] disabled:bg-gray-600 disabled:scale-100 disabled:shadow-none"
                disabled={isSubmitting}
                >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-sm ${message.includes("Successfully") ? "text-green-400" : "text-red-400"}`}>
                {message}
                </p>
            )}
        </div>

        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
             <a href="/" className="text-3xl font-black text-white">
              Toprak
              <span className="text-purple-500">Blogs</span>
            </a>
            <p className="text-gray-400 text-base">
              A sleek, modern blog interface with a captivating dark theme.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <TwitterIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <span className="sr-only">GitHub</span>
                <GithubIcon />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Marketing</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Analytics</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Commerce</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Guides</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Jobs</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Claim</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-500 xl:text-center">&copy; 2024 MidnightBloom, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;