import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

function formatTime(ms: number) {
  const totalHundredths = Math.floor(ms / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Timer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [timerMode, setTimerMode] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60000);
  const [timerRemaining, setTimerRemaining] = useState(60000);
  const [startAt, setStartAt] = useState<number | null>(null);
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedTimer = localStorage.getItem("toprak-timer-state");
    const savedTodos = localStorage.getItem("toprak-todos");
    if (savedTimer) {
      const p = JSON.parse(savedTimer);
      setElapsed(p.elapsed || 0);
      setLaps(p.laps || []);
      setTimerDuration(p.timerDuration || 60000);
      setTimerRemaining(p.timerRemaining || 60000);
    }
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  useEffect(() => {
    localStorage.setItem("toprak-timer-state", JSON.stringify({ elapsed, laps, timerDuration, timerRemaining }));
  }, [elapsed, laps, timerDuration, timerRemaining]);

  useEffect(() => {
    localStorage.setItem("toprak-todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const now = performance.now();
      if (startAt == null) return;

      if (timerMode) {
        const remaining = Math.max(0, timerRemaining - (now - startAt));
        setTimerRemaining(remaining);
        if (remaining === 0) {
          setRunning(false);
          setStartAt(null);
          if (audioRef.current) audioRef.current.play().catch(() => {});
          alert("Süre Doldu!");
        }
      } else {
        const delta = now - startAt;
        setElapsed(prev => prev + delta);
        setStartAt(now);
      }
    }, 50);
    return () => clearInterval(id);
  }, [running, startAt, timerMode, timerRemaining]);

  const displayed = timerMode ? timerRemaining : elapsed;

  const handleStartStop = () => {
    if (running) {
      setRunning(false);
      setStartAt(null);
    } else {
      setStartAt(performance.now());
      setRunning(true);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setStartAt(null);
    if (timerMode) setTimerRemaining(timerDuration);
    else { setElapsed(0); setLaps([]); }
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-100 overflow-hidden font-sans">
      <Helmet>
        <title>Focus Mode | Toprak Blogs</title>
        <meta name="description" content="Zamanlayıcı ve yapılacaklar listesi ile odağını artır." />
      </Helmet>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <Header />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {timerMode ? "Timer" : "Stopwatch"}
              </h2>
              <button 
                onClick={() => { setTimerMode(!timerMode); handleReset(); }}
                className="text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all"
              >
                Switch to {timerMode ? "Stopwatch" : "Timer"}
              </button>
            </div>

            <div className="text-center mb-10">
              <div className="text-6xl sm:text-8xl font-mono font-black tracking-tighter text-white">
                {formatTime(displayed).split(".")[0]}
                <span className="text-2xl text-purple-500">.{formatTime(displayed).split(".")[1]}</span>
              </div>
            </div>

            {timerMode && (
               <div className="mb-8">
                  <p className="text-gray-500 text-xs uppercase mb-2 text-center">Set Duration (Seconds)</p>
                  <input 
                    type="range" min="10" max="3600" step="10"
                    value={timerDuration/1000}
                    onChange={(e) => {
                        const val = Number(e.target.value) * 1000;
                        setTimerDuration(val);
                        setTimerRemaining(val);
                    }}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-center mt-2 text-purple-400 font-bold">{timerDuration/1000}s</p>
               </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={handleStartStop}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg ${
                  running ? "bg-rose-500/20 text-rose-500 border border-rose-500/50 hover:bg-rose-500/30" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/30"
                }`}
              >
                {running ? "PAUSE" : "START"}
              </button>
              <button 
                onClick={handleReset}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl border border-white/5 transition-all"
              >
                RESET
              </button>
            </div>

            {!timerMode && laps.length > 0 && (
              <div className="mt-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {laps.map((l, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-white/5 text-sm">
                    <span className="text-gray-500">Lap {laps.length - i}</span>
                    <span className="font-mono text-purple-400">{formatTime(l)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl h-full">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              Daily Quests 
              <span className="text-xs bg-purple-600 px-2 py-1 rounded-md">{todos.length}</span>
            </h2>

            <form onSubmit={addTodo} className="relative mb-8">
              <input 
                type="text"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
              />
              <button type="submit" className="absolute right-3 top-2 bottom-2 px-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-bold transition-all">
                ADD
              </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {todos.length === 0 ? (
                <div className="text-center py-12 text-gray-600 italic">
                  No tasks for today. Take a rest!
                </div>
              ) : (
                todos.map(todo => (
                  <div 
                    key={todo.id}
                    className={`group flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      todo.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/5 hover:border-purple-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          todo.completed ? "bg-emerald-500 border-emerald-500" : "border-gray-600"
                        }`}
                      >
                        {todo.completed && <span className="text-black text-xs">✓</span>}
                      </button>
                      <span className={`text-sm font-medium transition-all ${todo.completed ? "line-through text-gray-600" : "text-gray-200"}`}>
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      <audio ref={audioRef} src="/alarm.mp3" />
      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b21a3; }
      `}</style>
    </div>
  );
}