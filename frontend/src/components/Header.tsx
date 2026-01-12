import { useState } from "react";
import { BiWorld, BiMenu, BiX } from "react-icons/bi";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { DiGithubBadge } from "react-icons/di";
import { Link, useLocation } from "react-router-dom";
import { config } from "./config";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Time", path: "/time" },
    { name: "PrivNotes", path: "/repaste" },
    { name: "Game", path: "/game/play" },
  ];

  const socialLinks = [
    { icon: <BsInstagram size={20} />, url: "https://instagram.com/toprak.altins", title: "Instagram" },
    { icon: <DiGithubBadge size={26} />, url: "https://github.com/TPashaxrd", title: "Github" },
    { icon: <BsTwitter size={22} />, url: "https://x.com/toprakcordision", title: "Twitter" },
    { icon: <BiWorld size={24} />, url: "https://toprak.xyz", title: "Website" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[100] px-4 py-4 sm:px-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-3 shadow-2xl">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={`https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/ToprakButGlassesIsAI.png`}
              alt="Profile"
              crossOrigin="anonymous"
              className="w-10 h-10 rounded-full object-cover border border-purple-500/50 group-hover:border-purple-500 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white font-montserrat hidden sm:block">
            {config.name || "Toprak Blog"}
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-black/20 rounded-2xl p-1 border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                isActive(link.path)
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                title={link.title}
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <BiX size={28} /> : <BiMenu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 md:hidden bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 shadow-3xl z-[101] backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold p-3 rounded-2xl transition-all ${
                    isActive(link.path)
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5 my-2" />
              <div className="flex justify-around py-2">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="text-gray-400 hover:text-purple-400 p-2"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}