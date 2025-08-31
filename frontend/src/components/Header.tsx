import { useState } from "react";
import { BiMoon, BiWorld, BiMenu, BiX } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { DiGithubBadge } from "react-icons/di";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="font-space-grotesk flex flex-col md:flex-row items-center justify-between gap-4 rounded-b-xl py-4 px-6">
      
      <div className="flex items-center gap-4 w-full md:w-auto justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-black"
          />
          <h1 onClick={() => window.location.href = "/" } className="text-2xl cursor-pointer font-bold font-montserrat">YourBlog</h1>
        </div>

        <button
          className="md:hidden text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <BiX /> : <BiMenu />}
        </button>
      </div>

      <div
        className={`
          ${isOpen ? "flex w-full text-xl px-1 py-1 rounded-xl gap-1" : "hidden"} 
          md:flex flex-col md:flex-row items-center gap-6 
          
          border border-black rounded-full font-space-grotesk px-6 py-3
        `}
      >
        <button onClick={() => window.location.href = "/" } className={`${isOpen && 'text-xl font-bold border-b border-black inline-block'}`}>Home</button>
        <button onClick={() => window.location.href = "/blog" } className={`${isOpen && 'text-xl font-bold border-b border-black inline-block'}`}>Blogs</button>
        <button onClick={() => window.location.href = "/contact" } className={`${isOpen && 'text-xl font-bold border-b border-black inline-block'}`}>Contact</button>
        <button title="Thema">
          <BiMoon
            className="bg-black rounded-full text-white p-1"
            size={23}
          />
        </button>
      </div>

      <div className="gap-3 flex">
        <button className={`${isOpen && 'hidden'}`} title="Github"><DiGithubBadge size={35} /></button>
        <button className={`${isOpen && 'hidden'}`} title="Twitter"><BsTwitter size={30} /></button>
        <button className={`${isOpen && 'hidden'}`} title="Internet"><BiWorld size={30} /></button>
      </div>
    </header>
  );
}
