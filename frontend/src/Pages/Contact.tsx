import axios from "axios"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import { config } from "../components/config"

function Contact() {
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [IP_Address, setIP_Address] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [successfully, setSuccessfully] = useState("")

    useEffect(() => {
      const fetchIP = async () => {
        try {
          const res = await axios.get("https://api.ipify.org?format=json")
          setIP_Address(res.data.ip)
        } catch (error) {
          setError("Failed to fetch IP.")
        } finally {
          setLoading(false)
        }
      }
      fetchIP()
    }, [])
  
    async function Submit() {
      if (!title || !message || !email) {
        setError("All fields are required.")
        return
      }
  
      try {
        const res = await axios.post(`${config.api}/api/contact`, {
          title,
          email,
          message,
          IP_Address: IP_Address,
        })
        if(res.status == 201) {
            setSuccessfully("Successfully submitted.")
        }
        setError("")
        setTitle("")
        setMessage("")
        setEmail("")
        } catch (error: any) {
        if (axios.isAxiosError(error)) {
          setError(`Failed to submit form. ${error.response?.data?.message || error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
      
    }
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen text-purple-500 text-xl">
          Loading...
        </div>
      )
    }
  
    return (
      <>
        <Header />
        <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl">
          <h1 className="text-2xl font-bold text-purple-600 mb-4">Contact Us</h1>
  
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successfully && <p className="text-green-500 mb-4">{successfully}</p>}
  
          <input
            type="text"
            placeholder="Enter Title"
            className="w-full mb-3 p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full mb-3 p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            className="w-full mb-3 p-3 border rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={Submit}
            className="w-full bg-black text-white font-inter hover:bg-black/80 duration-300  hover:text-black/80 py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </div>
        <Footer />
      </>
    )
  }
  
  export default Contact
