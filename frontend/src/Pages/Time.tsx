import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function formatTime(ms: number) {
  const totalHundredths = Math.floor(ms / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${String(hundredths).padStart(2,"0")}`;
}

export default function Timer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [timerMode, setTimerMode] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60000);
  const [timerRemaining, setTimerRemaining] = useState(60000);
  const [startAt, setStartAt] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("merycron-state");
    if(saved){
      try{
        const p = JSON.parse(saved);
        setElapsed(p.elapsed||0);
        setLaps(Array.isArray(p.laps)?p.laps:[]);
        setHistory(Array.isArray(p.history)?p.history:[]);
        setTimerDuration(p.timerDuration||60000);
        setTimerRemaining(p.timerRemaining || p.timerDuration || 60000);
      }catch{}
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem("merycron-state", JSON.stringify({elapsed,laps,history,timerDuration,timerRemaining}));
  }, [elapsed,laps,history,timerDuration,timerRemaining]);

  useEffect(()=>{
    if(!running) return;
    const id = setInterval(()=>{
      const now = performance.now();
      if(startAt==null) return;

      if(timerMode){
        const remaining = Math.max(0, timerRemaining - (now-startAt));
        setTimerRemaining(remaining);
        if(remaining===0){
          setRunning(false);
          setStartAt(null);
          if(audioRef.current) audioRef.current.play().catch(()=>{});
        }
      } else {
        const delta = now - startAt;
        setElapsed(prev=>prev+delta);
        setStartAt(now);
      }
    },50);
    return ()=>clearInterval(id);
  }, [running, startAt, timerMode, timerRemaining]);

  const displayed = timerMode ? timerRemaining : elapsed;

  const handleStartStop = () => {
    if(running){
      if(!timerMode){
        const delta = performance.now() - (startAt||0);
        const total = elapsed + delta;
        setElapsed(total);
        setHistory(prev => [total,...prev].slice(0,30));
      } else {
        setTimerRemaining(prev => Math.max(0, prev - (performance.now()-(startAt||0))));
      }
      setRunning(false);
      setStartAt(null);
    } else {
      setStartAt(performance.now());
      setRunning(true);
    }
  }

  const handleReset = () => {
    setRunning(false);
    setStartAt(null);
    if(timerMode){
      setTimerRemaining(timerDuration);
    } else {
      setElapsed(0);
      setLaps([]);
      setHistory([]);
    }
  }

  const handleLap = () => {
    if(!timerMode){
      setLaps(prev=>[displayed,...prev].slice(0,50));
    }
  }

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const val = Number(e.target.value)*1000;
    setTimerDuration(val);
    setTimerRemaining(val);
    setTimerMode(true);
  }

  return (
    <>
    <Header/>
    <div className="min-h-screen flex items-center font-space-grotesk justify-center bg-gradient-to-b from-[#06060a] via-[#0b0b12] to-[#05050a] text-gray-100 p-6">
      <title>Toprak - Cronometre</title>
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">MeryCronometre</h1>
          <p className="mt-2 text-sm text-gray-400">Space=Start/Stop L=Lap R=Reset</p>
          <div className="mt-2">
            <label className="text-gray-400 mr-2">Timer (s):</label>
            <input 
              type="number" title="Number"
              className="text-black px-2 rounded focus:ring-2 focus:ring-purple-600" 
              value={Math.round(timerDuration/1000)} 
              onChange={handleTimerChange}
            />
          </div>
        </header>

        <main className="bg-gray-800/40 border border-purple-800/30 rounded-2xl shadow-2xl p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-baseline space-x-4">
              <span className="text-6xl sm:text-7xl font-mono">{formatTime(displayed).split(".")[0]}</span>
              <span className="text-2xl sm:text-3xl text-gray-400 font-mono">.{formatTime(displayed).split(".")[1]}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button 
              onClick={handleStartStop} 
              className={`px-4 py-2 rounded-md font-medium ${running?"bg-rose-600 hover:bg-rose-500":"bg-emerald-600 hover:bg-emerald-500"}`}>
              {running?"Stop":"Start"}
            </button>
            <button 
              onClick={handleLap} 
              disabled={!running || timerMode} 
              className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 text-sm disabled:opacity-40">
              Lap
            </button>
            <button 
              onClick={handleReset} 
              className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 text-sm">
              Reset
            </button>
          </div>

          <audio ref={audioRef} src="./alarm.mp3"/>

          {!timerMode && (
            <>
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-2">Laps</h2>
                <div className="max-h-40 overflow-auto space-y-1">
                  {laps.length===0 ? 
                    <p className="text-gray-500 text-sm">No laps yet.</p> :
                    laps.map((l,i) => (
                      <div key={i} className="flex justify-between p-2 bg-gray-900/30 rounded-md text-sm font-mono">
                        <span>Lap {laps.length-i}</span>
                        <span>{formatTime(l)}</span>
                      </div>
                    ))
                  }
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-gray-300 mb-2">History</h2>
                <div className="max-h-40 overflow-auto space-y-1">
                  {history.length===0 ? 
                    <p className="text-gray-500 text-sm">No history yet.</p> :
                    history.map((h,i)=>(
                      <div key={i} className="flex justify-between p-2 bg-gray-900/30 rounded-md text-sm font-mono">
                        <span>#{history.length-i}</span>
                        <span>{formatTime(h)}</span>
                      </div>
                    ))
                  }
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
    <Footer />
    </>
  );
}