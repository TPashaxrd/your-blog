import React from "react";
import { motion } from "framer-motion";
import { BiLockAlt } from "react-icons/bi";
import { Helmet } from "react-helmet-async";

const LockedScreen: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-gray-100 flex items-center justify-center font-sans">
      <Helmet>
        <title>Toprak Blogs - Restricted</title>
      </Helmet>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      <main className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(147,51,234,0.15)] bg-gray-900/40 backdrop-blur-md border border-white/5"
        >
          <div className="h-1 w-full bg-purple-600"></div>
          
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/10 rounded-full mb-8 border border-purple-600/20">
              <BiLockAlt size={40} className="text-purple-500" />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tighter">
              <span className="bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:100%_6px] bg-left-bottom bg-no-repeat pb-2">
                System Offline
              </span>
            </h1>

            <p className="text-white/70 text-base md:text-lg max-w-md mx-auto leading-relaxed">
               I'm currently working on some updates. 
               The blog will be back online shortly. 
               <br />
               <span className="text-purple-400 mt-4 block font-semibold italic">
                 "Toprak in everytime business"
               </span>
            </p>

            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
               <button
                 onClick={() => window.location.reload()}
                 className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg shadow-purple-600/20"
               >
                 Check Connection
               </button>
               
               <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase font-bold">
                 Toprak Doğan - 2026
               </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 opacity-20 flex gap-4">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
      </main>
    </div>
  );
};

export default LockedScreen;