import axios from "axios";
import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { config } from "../../components/config";

export default function Repaste() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const createNote = async () => {
    try {
      const res = await axios.post(`${config.api}/api/note/create`, {
        text,
        password,
        email,
        readOnce: true,
        expireHours: 24,
      });

      setLink(res.data.link);
      setText("");
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  useEffect(() => {
    setIsDisabled(text.length <= 4);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${link}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <div className="animate-fade-in-out flex-grow flex justify-center items-start py-12 px-4">
        <div className="w-full max-w-lg bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-700">
          {!link ? (
            <>
              <h2 className="text-3xl font-extrabold text-center mb-6 text-emerald-400">
                Create a Private Note
              </h2>

              <textarea
                placeholder="Write your private note here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                className="w-full p-4 mb-4 rounded-xl border border-gray-700 bg-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 transition"
              />

              <input
                type="text"
                placeholder="Set Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 mb-4 rounded-xl border border-gray-700 bg-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 transition"
              />

              <input
                type="email"
                placeholder="Your Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 mb-4 rounded-xl border border-gray-700 bg-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 transition"
              />

              <button
                onClick={createNote}
                disabled={isDisabled}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition ${
                  isDisabled
                    ? "text-gray-500 bg-gray-700 cursor-not-allowed"
                    : "text-white bg-emerald-500 hover:bg-emerald-400 hover:shadow-lg border border-emerald-500"
                }`}
              >
                Create Note
              </button>

              {error && (
                <p className="mt-4 text-red-500 text-center">{error}</p>
              )}
            </>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-4">
              <span className="text-2xl font-bold text-emerald-400">
                Note link ready
              </span>

              <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 hover:bg-gray-800 transition w-full justify-between">
                <a
                  href={link}
                  className="text-emerald-300 font-medium truncate max-w-[70%]"
                >
                  {window.location.origin}{link}
                </a>
                <button
                  onClick={handleCopy}
                  title="Copy"
                  className="p-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <BiCopy size={26} />
                </button>
              </div>

              {copied && (
                <span className="text-green-500 text-sm mt-2 animate-pulse">
                  Copied to clipboard!
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
