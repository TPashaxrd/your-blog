import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiX, BiUserPlus, BiLogInCircle } from "react-icons/bi";

export default function AuthBanner({ user }: { user: any }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setIsVisible(false);
      return;
    }

    const isHidden = localStorage.getItem("hideAuthPrompt");
    
    if (!isHidden) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hideAuthPrompt", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-10 md:w-[400px] z-[200]"
        >
          <div className="bg-[#0D0D0D]/90 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-3xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700" />
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <BiX size={24} />
            </button>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-1 italic">
                  Join the Network<span className="text-purple-600">.</span>
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Yorum yapmak, içerikleri kaydetmek ve tüm "intel" verilerine erişmek için sisteme dahil ol.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-500"
                >
                  <BiLogInCircle size={16} /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-500"
                >
                  <BiUserPlus size={16} /> Register
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}