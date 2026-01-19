import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BiLoaderAlt, BiLockOpenAlt, BiUser } from "react-icons/bi";
import { Helmet } from "react-helmet-async";
import { config } from "../../components/config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${config.api}/api/auth/login`, 
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        navigate("/personal");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col transition-colors duration-500 overflow-x-hidden">
      <Helmet>
        <title>Login // Toprak Doğan</title>
      </Helmet>

      <Header />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
            x: [0, -40, 0],
            y: [0, 60, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"
        />
      </div>

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <div className="w-full max-w-[450px]">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#0A0A0A]/60 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
          >
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-4">
                Sign In<span className="text-purple-600">.</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Authorized access only. Enter your credentials to manage your digital ecosystem.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-5 flex items-center text-gray-500">
                    <BiUser size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                  Security Key
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-5 flex items-center text-gray-500">
                    <BiLockOpenAlt size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-5 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold py-3 px-4 rounded-xl text-center uppercase tracking-wider"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-5 px-4 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50"
              >
                {loading ? <BiLoaderAlt className="animate-spin text-xl" /> : "Verify Identity"}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                New developer?{" "}
                <Link to="/contact" className="text-white hover:text-purple-500 transition-colors border-b border-white/20 hover:border-purple-500 pb-0.5">
                  Request Authorization
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}