import { useState, useEffect } from "react";
import { BiMenu, BiX, BiLogOut, BiChevronDown } from "react-icons/bi";
import { BsInstagram } from "react-icons/bs";
import { DiGithubBadge } from "react-icons/di";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { config } from "./config";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AuthBanner from "./AuthBanner";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${config.api}/api/auth/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Toprak", path: "/toprak"},
    { name: "Personal", path: "/personal"},
    { name: "Time", path: "/time" },
    { name: "PrivNotes", path: "/repaste" },
    { name: "Game", path: "/game/play" },
  ];

  const socialLinks = [
    { icon: <DiGithubBadge size={22} />, url: "https://github.com/TPashaxrd" },
    { icon: <BsInstagram size={18} />, url: "https://instagram.com/toprak.altins" },
  ];

  const handleLogout = async () => {
    await axios.post(`${config.api}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 md:px-10">
      <AuthBanner user={user} />
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] px-4 py-2 shadow-2xl relative">
        
        <Link to="/" className="flex items-center gap-3 group pl-2">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 group-hover:border-purple-500/50 transition-all duration-500">
            <img
              src="https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/ToprakButGlassesIsAI.png"
              className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
              alt="Logo"
            />
          </div>
          <span className="text-sm font-black tracking-[0.3em] uppercase italic text-white hidden lg:block">
            {config.name?.split(' ')[0] || "TOPRAK"}<span className="text-purple-600">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-2xl p-1 border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                isActive(link.path)
                  ? "bg-white text-black shadow-xl shadow-white/10"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-4 mr-4 border-r border-white/10 pr-6">
            {socialLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" className="text-gray-500 hover:text-white transition-colors">
                {link.icon}
              </a>
            ))}
          </div>

          <div className="relative">
            {user ? (
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 p-1 pr-3 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <BiChevronDown className={`text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-500 shadow-lg shadow-white/5">
                Login
              </Link>
            )}

            <AnimatePresence>
              {profileOpen && user && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-56 bg-[#0D0D0D] border border-white/10 rounded-[1.5rem] p-3 shadow-3xl backdrop-blur-3xl"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Authorized User</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <BiLogOut size={18} /> Logout System
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="md:hidden p-2.5 text-white bg-white/5 rounded-xl border border-white/10" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-28 left-4 right-4 md:hidden bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 shadow-3xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-black uppercase tracking-[0.2em] p-4 rounded-2xl border transition-all ${
                    isActive(link.path) ? "bg-purple-600 border-purple-500 text-white" : "bg-white/5 border-white/5 text-gray-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}