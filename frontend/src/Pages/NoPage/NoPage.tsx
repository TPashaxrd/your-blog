import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiHomeAlt, BiGhost, BiArrowBack } from "react-icons/bi";

export default function NoPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#020202] text-white px-4 text-center overflow-hidden font-sans">
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-purple-500 mb-6 opacity-40"
      >
        <BiGhost size={80} />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-gradient-to-b from-white to-white/5 bg-clip-text text-transparent select-none drop-shadow-[0_0_30px_rgba(139,92,246,0.1)]"
      >
        404
      </motion.h1>

      <div className="relative z-10 -mt-8">
        <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight uppercase">
          Signal Lost.
        </h2>

        <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg font-medium leading-relaxed">
          The coordinates you are looking for do not exist in our database or have been purged from the system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl shadow-purple-600/20"
          >
            <BiHomeAlt size={22} className="group-hover:-translate-y-0.5 transition-transform" />
            Return to Base
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-bold transition-all border border-white/10 backdrop-blur-md"
          >
            <BiArrowBack size={20} />
            Go Back
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-20">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-gray-400 uppercase font-black">
          <div className="w-12 h-[1px] bg-gray-700" />
          System_Error: Resource_Not_Found
          <div className="w-12 h-[1px] bg-gray-700" />
        </div>
      </div>

    </div>
  );
}