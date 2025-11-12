import { useState, useEffect } from "react";
import socket from "./socket";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

interface MatchData {
  roomId: string;
  question: Question;
}

const Start: React.FC = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [match, setMatch] = useState<MatchData | null>(null);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [opponentLeft, setOpponentLeft] = useState<string | null>(null);

  const handleLogin = () => {
    if (!username.trim()) return;
    setLoggedIn(true);
    socket.emit("setUsername", { username });
  };

  const joinMatch = () => {
    setOpponentLeft(null);
    socket.emit("joinQueue");
  };

  const submitAnswer = (index: number) => {
    if (!match) return;
    socket.emit("answer", { roomId: match.roomId, answer: index });
  };

  useEffect(() => {
    socket.on("waiting", (data: { message: string }) => setWaiting(data.message));
    socket.on("matchStart", (data: MatchData) => {
      setMatch(data);
      setRoundResult(null);
      setWaiting(null);
      setCountdown(0);
      setOpponentLeft(null);
    });
    socket.on("roundEnd", (data: { winner: string; correct: boolean }) => {
      setRoundResult(data.winner === socket.id ? "🎉 You won!" : "💀 You lost!");
      setMatch(null);
      setCountdown(5);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
    socket.on("opponentLeft", (data: { message: string }) => {
      setMatch(null);
      setRoundResult(null);
      setWaiting(null);
      setOpponentLeft(data.message);
    });

    return () => {
      socket.off("waiting");
      socket.off("matchStart");
      socket.off("roundEnd");
      socket.off("opponentLeft");
    };
  }, []);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 p-6">
        <div className="backdrop-blur-xl bg-white/5 p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_#111] w-full max-w-sm text-center">
          <h1 className="text-5xl font-extrabold text-white mb-8 tracking-wide">
            Give Answer First
          </h1>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 mb-6 rounded-xl bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
          />
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-bold rounded-2xl shadow-md transition transform hover:-translate-y-1 hover:scale-105"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 p-6">
      {!match && !roundResult && !waiting && !opponentLeft && (
        <button
          onClick={joinMatch}
          className="px-12 py-5 text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-3xl shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
        >
          Join Match 🚀
        </button>
      )}

      {waiting && (
        <div className="text-white text-3xl font-semibold animate-pulse mt-6">
          {waiting} ⏳
        </div>
      )}

      {opponentLeft && (
        <div className="text-red-500 text-3xl font-bold mt-6 animate-pulse text-center">
          {opponentLeft}
        </div>
      )}

      {match && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-[0_0_30px_#111] p-10 w-full max-w-md text-center mt-6">
          <h2 className="text-3xl font-bold mb-8 text-white">
            {match.question.question}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {match.question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => submitAnswer(idx)}
                className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold rounded-2xl shadow-sm transition transform hover:-translate-y-1 hover:scale-105"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {roundResult && (
        <div className="mt-8 text-center">
          <div
            className={`text-5xl font-extrabold ${
              roundResult.includes("won")
                ? "text-green-400 drop-shadow-[0_0_10px_#22c55e]"
                : "text-red-400 drop-shadow-[0_0_10px_#ef4444]"
            } animate-pulse`}
          >
            {roundResult}
          </div>
          {countdown > 0 && (
            <div className="mt-4 text-gray-300 text-xl">
              Next question in {countdown} seconds...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Start;