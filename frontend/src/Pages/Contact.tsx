import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { config } from "../components/config";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaEnvelope, FaTag, FaInfoCircle } from "react-icons/fa";

function Contact() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [IP_Address, setIP_Address] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successfully, setSuccessfully] = useState("");

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setIP_Address(res.data.ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIP();
  }, []);

  async function Submit() {
    setError("");
    setSuccessfully("");

    if (!title || !message || !email) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${config.api}/api/contact`, {
        title,
        email,
        message,
        IP_Address: IP_Address,
      });

      if (res.status === 201 || res.status === 200) {
        setSuccessfully("Your message has been sent successfully!");
        setTitle("");
        setMessage("");
        setEmail("");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(`Failed to send. ${error.response?.data?.message || error.message}`);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-gray-100 font-sans">
      <title>Contact | Toprak.xyz</title>
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-500/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-gray-400">
              Have a question or want to work together? Drop me a message!
            </p>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-800 shadow-2xl relative">
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 mb-6 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30 text-sm"
                >
                  <FaInfoCircle /> {error}
                </motion.div>
              )}
              {successfully && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 mb-6 bg-green-900/20 text-green-400 rounded-xl border border-green-500/30 text-sm"
                >
                  <FaPaperPlane /> {successfully}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="relative">
                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Subject Title"
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <textarea
                  placeholder="Your Message..."
                  rows={5}
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-500 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                onClick={Submit}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                  submitting 
                  ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                }`}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" /> Send Message
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;