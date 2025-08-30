import { BiMoon, BiWorld } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { DiGithubBadge } from "react-icons/di";

export default function BlogHeader() {
    return (
      <header className="font-space-grotesk flex flex-col md:flex-row items-center justify-between gap-4 rounded-b-xl py-4 px-6">
        
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-black"
          />
          <div>
            <h1 className="text-2xl font-montserrat ">YourBlog</h1>
          </div>
        </div>
  
        <div className="border border-black rounded-full gap-6 flex font-space-grotesk px-6 py-3">
            <button>Home</button>
            <button>About</button>
            <button>Contact</button>
            <button title="Thema"><BiMoon className="bg-black rounded-full text-white px-1 py-1" size={23} /></button>
        </div>


        <div className="gap-3 flex">
            <button title="Github"><DiGithubBadge size={35} /></button>
            <button title="Twitter"><BsTwitter size={30} /></button>
            <button title="Internet"><BiWorld size={30} /></button>
        </div>

        
      </header>
  )
}