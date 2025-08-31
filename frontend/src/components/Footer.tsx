import axios from "axios";
import { useEffect, useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("")
  const [IP_Address, setIP_Address] = useState("")
  const [error, setError] = useState("")

  async function Submit() {
    if (!email) {
      return setError("All fields are required.");
    }
  
    if (email.length < 11) {
      return setError("Write your real email.");
    }
  
    try {
      const res = await axios.post("http://localhost:5000/api/subs", {
        email,
        IP_Address,
      });
  
      if (res.status === 200 || res.status === 201) {
        setError("Successfully submitted!")
      } else {
        setError(`Unexpected status: ${res.status}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  }
  

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json")
        setIP_Address(res.data.ip)
      } catch (error) {
        setError("Failed to fetch IP.")
      } finally {
      }
    }
    fetchIP()
  }, [])

  return (
    <>
    <div className="border border-black"></div>
    <footer className="mt-10 mb-12 px-6">
      <div className="border-t border-gray-300"></div>

      <div className="max-w-9xl mx-auto bg-black/90 text-white py-10 px-6 flex flex-col items-center gap-6 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Interesting Stories | Updates | Guides
        </h1>

        <p className="text-gray-300 text-center max-w-2xl">
          Subscribe to learn about new technology and updates. Join over{" "}
          <span className="font-semibold text-yellow-400">5000+ members</span>{" "}
          community to stay up to date with latest news.
        </p>
        <span className={error?.includes("Successfully") ? "text-green-600" : "text-red-600"}>
          {error}
        </span>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full flex-1 px-4 py-2 rounded text-black focus:outline-none"
          />
          <button onClick={Submit} className="px-6 py-2 rounded hover:text-white/50 bg-black hover:bg-black/50 font-semibold text-white transition">
            Submit
          </button>
        </div>

        <div className="flex gap-4 mt-4">
          <a href="#" aria-label="LinkedIn">
            <svg
              className="w-6 h-6 text-blue-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          <a href="#" aria-label="Twitter">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.917 2.2-4.917 4.917 0 .386.043.762.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.732-.666 1.585-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.396 0-.788-.023-1.175-.068 2.187 1.405 4.788 2.224 7.561 2.224 9.054 0 14.002-7.496 14.002-13.986 0-.209 0-.42-.015-.63.961-.695 1.8-1.562 2.46-2.549l-.001-.011z"/>
            </svg>
          </a>

          <a href="#" aria-label="Heart">
            <svg
              className="w-6 h-6 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </a>
        </div>

        <div className="w-full border-t border-gray-700 pt-6 flex justify-between items-center gap-2 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} Cordision. All rights reserved.</span>
          <a href="/sitemap.xml" className="hover:text-yellow-400">
            sitemap.xml
          </a>
          <span>
            Made with <span className="text-red-500">♥</span> by Cordision
          </span>
        </div>
      </div>
    </footer>
   </>
  );
}