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
          console.error("Failed to fetch IP:", error);
        } finally {
          setLoading(false)
        }
      }
      fetchIP()
    }, [])
  
    async function Submit() {
      setError("")
      setSuccessfully("")

      if (!title || !message || !email) {
        setError("All fields are required..")
        return
      }
  
      try {
        const res = await axios.post(`${config.api}/api/contact`, {
          title,
          email,
          message,
          IP_Address: IP_Address,
        })

        if(res.status === 201) {
            setSuccessfully("Mesajınız başarıyla gönderildi!")
        }
        
        setTitle("")
        setMessage("")
        setEmail("")
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          setError(`Gönderme işlemi başarısız. ${error.response?.data?.message || error.message}`);
        } else {
          setError("Beklenmedik bir hata oluştu.");
        }
      }
    }
  
    if (loading) {
    return (
      <div className="min-h-screen items-center justify-center flex flex-col">
        <div className="loader">
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="line"></div>
      </div>
      </div>
    );
    }
  
    return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-gray-100">
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
      <Header />
        
        <div className="max-w-xl mx-auto py-16 px-6 sm:px-8">
          <div className="p-8 bg-gray-800 shadow-2xl rounded-xl border border-gray-700">
            <h1 className="text-3xl font-extrabold text-indigo-400 mb-6 text-center">
              Contact with Us
            </h1>
    
            {error && (
              <p className="p-3 mb-4 bg-red-900/50 text-red-300 rounded-lg border border-red-700">
                ⚠️ Error: {error}
              </p>
            )}
            {successfully && (
              <p className="p-3 mb-4 bg-green-900/50 text-green-300 rounded-lg border border-green-700">
                Successfully: {successfully}
              </p>
            )}
    
            <input
              type="text"
              placeholder="Subject Title"
              className="w-full mb-4 p-4 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="email"
              placeholder="E-Mail address"
              className="w-full mb-4 p-4 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              placeholder="Your Message..."
              rows={5}
              className="w-full mb-6 p-4 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <button
              onClick={Submit}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01] shadow-lg shadow-indigo-600/50"
            >
              Submit Message
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  
  export default Contact