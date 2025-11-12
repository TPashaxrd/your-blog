import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { BiSun } from "react-icons/bi";
import { FaSkull } from "react-icons/fa";

export default function Play() {
  const handlePlay = () => {
    window.location.href = "/start";
  };

  return (
    <>
     <Header />
     <title>Toprak - GiveAnswerFirst</title>
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white px-4">
      <div className="animate-fade-in-out-2 w-full max-w-2xl bg-gray-950/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 text-center shadow-[0_0_25px_rgba(255,255,255,0.05)]">
        
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Give Answer First
        </h1>
        
        <p className="text-gray-400 text-lg mb-10 font-light">
          <span className="text-gray-300 font-medium">Fast Think</span>, And do not be toxic! - Toprak
        </p>

        <button
          onClick={handlePlay}
          className="relative overflow-hidden px-12 py-4 font-semibold rounded-2xl group border border-gray-700 bg-black hover:border-gray-500 transition-all duration-300"
        >
          <span className="relative z-10 text-lg group-hover:text-gray-200 transition">
            Play Now
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-0 group-hover:opacity-100 transition duration-300"></span>
        </button>

        <div className="mt-8 text-gray-500 text-sm">
          <span className="block flex gap-1 text-center items-center justify-center"><BiSun /> IRL Questions</span>
          <span className="block flex gap-1 text-center items-center justiy-center"><FaSkull /> Gave first Answer, Take the point!</span>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}