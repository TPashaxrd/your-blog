import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BiCopy, BiLock } from "react-icons/bi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { config } from "../../components/config";

export default function ReadNote() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const readNote = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${config.api}/api/note/${id}`, { password });
      setText(res.data.text);
      setError("");
    } catch (err: any) {
      setText("");
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <div className="animate-fade-in-out-2 flex-grow flex justify-center items-start py-12 px-4">
        <div className="w-full max-w-lg bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-700">
          {!text ? (
            <>
              <h2 className="text-3xl font-extrabold text-emerald-400 mb-6 flex items-center gap-2 justify-center">
                Read and Destroy? <BiLock className="text-red-600" />
              </h2>

              <input
                type="text"
                placeholder="Password (if any)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 mb-4 rounded-xl border border-gray-700 bg-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 transition"
              />

              <button
                onClick={readNote}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition ${
                  loading
                    ? "text-gray-500 bg-gray-700 cursor-not-allowed"
                    : "text-white bg-emerald-500 hover:bg-emerald-400 hover:shadow-lg border border-emerald-500"
                }`}
              >
                {loading ? "Loading..." : "Read Note"}
              </button>

              {error && (
                <p className="mt-4 text-red-500 text-center">{error}</p>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-emerald-400 text-center">Note:</h2>

              <div className="bg-gray-900 text-white font-inter p-4 rounded-xl shadow-inner whitespace-pre-wrap border border-gray-700">
                {text}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 w-32 mx-auto py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 hover:shadow-lg transition font-semibold"
              >
                Copy <BiCopy size={20} />
              </button>

              {copied && (
                <span className="text-green-500 text-sm text-center animate-pulse">
                  Copied to clipboard!
                </span>
              )}
            </div>
          )}
        <button
        onClick={() => window.location.href = "/repaste"}
        className="mx-auto mt-4 px-6 py-1 rounded-xl bg-red-600 text-white font-bold text-lg shadow-lg hover:shadow-red-500/50 transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
        Wanna create PRIVATE Note?
        </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
