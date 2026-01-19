import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BiLoaderAlt, BiUser, BiEnvelope, BiLockAlt, BiGlobe } from "react-icons/bi";
import { Helmet } from "react-helmet-async";
import { config } from "../../components/config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Popüler ülkeler listesi (Bayraklarla birlikte)
const countries = [
  { name: "Türkiye", code: "TR", flag: "🇹🇷" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "Russia", code: "RU", flag: "🇷🇺" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Italy", code: "IT", flag: "🇮🇹" },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "Türkiye"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${config.api}/api/auth/register`, 
        formData,
        { withCredentials: true }
      );

      if (res.status === 201) {
        navigate("/personal");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col overflow-x-hidden">
      <Helmet>
        <title>Create Account // Toprak Doğan</title>
      </Helmet>

      <Header />

      {/* Arka Plan Animasyonu */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px] bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Join the Network<span className="text-purple-600">.</span></h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Create your digital profile to get started.</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 gap-5">
            {/* Full Name */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-5 flex items-center text-gray-500 group-focus-within:text-purple-500 transition-colors">
                <BiUser size={20} />
              </span>
              <input 
                type="text"
                placeholder="FULL NAME"
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-purple-500/50 transition-all text-sm uppercase font-mono tracking-wider"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-5 flex items-center text-gray-500 group-focus-within:text-purple-500 transition-colors">
                <BiEnvelope size={20} />
              </span>
              <input 
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-purple-500/50 transition-all text-sm font-mono tracking-wider"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Country Selector with Flags */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-5 flex items-center text-gray-500 group-focus-within:text-purple-500 transition-colors font-mono">
                <BiGlobe size={20} />
              </span>
              <select 
                className="w-full bg-[#0D0D0D] border border-white/5 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-purple-500/50 transition-all text-sm appearance-none cursor-pointer"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.name} className="bg-[#0A0A0A]">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="relative group">
              <span className="absolute inset-y-0 left-5 flex items-center text-gray-500 group-focus-within:text-purple-500 transition-colors">
                <BiLockAlt size={20} />
              </span>
              <input 
                type="password"
                placeholder="PASSWORD"
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-purple-500/50 transition-all text-sm font-mono tracking-wider"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-purple-600/20 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <BiLoaderAlt className="animate-spin" /> : "Authorize Registration"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Already registered? <Link to="/login" className="text-purple-500 hover:underline">Log In</Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}