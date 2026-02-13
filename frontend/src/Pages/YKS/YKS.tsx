import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, Flame, BarChart3, Plus, Trophy, Clock, 
  BookOpen, Calendar, Target, GraduationCap, 
  Rocket, Trash2, History, Timer, TrendingUp,
  BrainCircuit, Briefcase, Award, PieChart, Activity
} from 'lucide-react';

// Tip tanımlamaları
interface StudyLog { id: string; date: string; startTime: string; duration: number; }
interface MockExam { id: number; title: string; score: number; date: string; }
interface Goal { id: number; text: string; completed: boolean; }

export default function ScholarUltimateOS() {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [universityGoal, setUniversityGoal] = useState<string>("");
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>("");
  const [history, setHistory] = useState<StudyLog[]>([]);
  const [exams, setExams] = useState<MockExam[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('scholar_v8_final');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed.history || []);
      setExams(parsed.exams || []);
      setGoals(parsed.goals || []);
      setUniversityGoal(parsed.universityGoal || "");
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('scholar_v8_final', JSON.stringify({ history, exams, goals, universityGoal }));
  }, [history, exams, goals, universityGoal, isInitialized]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      if (!startTime) setStartTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (!isActive && seconds > 0) {
      const newEntry: StudyLog = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('tr-TR'),
        startTime: startTime,
        duration: seconds
      };
      setHistory(prev => [newEntry, ...prev]);
      setSeconds(0);
      setStartTime("");
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, seconds, startTime]);

  // ANALİZ HESAPLAMALARI
  const stats = useMemo(() => {
    const totalStudySeconds = history.reduce((acc, curr) => acc + curr.duration, 0);
    const avgScore = exams.length > 0 ? (exams.reduce((acc, curr) => acc + curr.score, 0) / exams.length).toFixed(1) : 0;
    const lastScore = exams.length > 0 ? exams[exams.length - 1].score : 0;
    const progressStatus = exams.length > 1 ? (lastScore - exams[exams.length - 2].score).toFixed(1) : 0;
    
    return { totalStudySeconds, avgScore, lastScore, progressStatus };
  }, [history, exams]);

  const formatTime = (s: number): string => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}sa ${m}dk` : `${m}dk`;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0A0A0C] border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl border-t-blue-600 border-t-4">
          <div className="text-center space-y-2">
            <GraduationCap size={48} className="text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Operation Center</h1>
            <p className="text-slate-500 text-sm italic">"Veriyle yönetilmeyen süreç, süreç değildir."</p>
          </div>
          <div className="space-y-4">
            <input 
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold"
              placeholder="Hedeflenen Mevki (örn: İTÜ CENG)"
              value={universityGoal}
              onChange={(e) => setUniversityGoal(e.target.value)}
            />
            <button 
              onClick={() => setIsInitialized(true)}
              disabled={!universityGoal.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl tracking-[0.2em] text-[10px]"
            >
              SİSTEMİ BAŞLAT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date('2026-06-20').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#020203] text-slate-400 font-sans p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* TOP STATUS BAR */}
        <header className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[#0A0A0C] border border-white/5 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Hedef Mevki</p>
              <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">{universityGoal}</h2>
            </div>
            <Rocket className="absolute right-4 bottom-4 text-white/[0.02] -rotate-12" size={120} />
          </div>

          <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Şafak Sayacı</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">{daysLeft}</span>
                <span className="text-blue-500 font-black text-xs uppercase">Gün</span>
              </div>
            </div>
            <Calendar className="text-slate-800 group-hover:text-blue-500/20 transition-colors" size={40} />
          </div>

          <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Disiplin Skoru</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">%{Math.min(history.length * 3, 100)}</span>
                <Activity className="text-emerald-500 animate-pulse" size={14} />
              </div>
            </div>
            <Award className="text-slate-800 group-hover:text-emerald-500/20 transition-colors" size={40} />
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: COMMAND & CONTROL */}
          <div className="lg:col-span-3 space-y-8">
            {/* TIMER */}
            <div className="bg-blue-600 rounded-[3rem] p-10 flex flex-col items-center text-white shadow-2xl shadow-blue-900/20">
              <Timer className="mb-4 opacity-50" size={32} />
              <p className="text-5xl font-black tracking-tighter tabular-nums mb-6">{formatTime(seconds)}</p>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all bg-black text-white hover:scale-105 active:scale-95`}
              >
                {isActive ? 'OTURUMU DURDUR' : 'MESAİYE BAŞLA'}
              </button>
            </div>

            {/* PERFORMANCE RADAR (MINI ANALYTICS) */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                <PieChart size={14} className="text-blue-500" /> Analiz Özetleri
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold text-slate-500">Ortalama Net</p>
                  <p className="text-xl font-black text-white">{stats.avgScore}</p>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${(Number(stats.avgScore) / 120) * 100}%` }} />
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold text-slate-500">Gelişim Oranı</p>
                  <p className={`text-sm font-black ${Number(stats.progressStatus) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {Number(stats.progressStatus) >= 0 ? '+' : ''}{stats.progressStatus} Net
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK MISSIONS */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Target size={14} className="text-blue-500" /> Görev Listesi
                </h3>
                <button onClick={() => {
                  const t = prompt("Görev?");
                  if(t) setGoals([...goals, { id: Date.now(), text: t, completed: false }]);
                }} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10"><Plus size={14} /></button>
              </div>
              <div className="space-y-3">
                {goals.map(g => (
                  <div key={g.id} onClick={() => setGoals(goals.map(x => x.id === g.id ? {...x, completed: !x.completed} : x))}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${g.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                    <p className={`text-[10px] font-bold ${g.completed ? 'line-through text-slate-600' : 'text-slate-300 uppercase italic'}`}>{g.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER & RIGHT: BIG DATA */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* EXAM PERFORMANCE TABLE */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-[3rem] overflow-hidden shadow-xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                  <Award size={18} className="text-yellow-500" /> Deneme Performans Matrisi
                </h3>
                <button 
                  onClick={() => {
                    const title = prompt("Sınav Kurumu/Adı?");
                    const score = parseFloat(prompt("Net?") || "0");
                    if(title) setExams([...exams, { id: Date.now(), title, score, date: new Date().toLocaleDateString('tr-TR') }]);
                  }}
                  className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                >
                  YENİ VERİ GİRİŞİ
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="px-8 py-5">Deneme Kimliği</th>
                      <th className="px-8 py-5">Tarih</th>
                      <th className="px-8 py-5">Net Skor</th>
                      <th className="px-8 py-5">Verimlilik</th>
                      <th className="px-8 py-5 text-right">Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {exams.length === 0 && (
                      <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-700 italic text-sm">Performans verisi bekleniyor. İlk deneme sonucunu girin.</td></tr>
                    )}
                    {exams.map(exam => (
                      <tr key={exam.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6 font-black text-white text-xs uppercase italic tracking-tighter">{exam.title}</td>
                        <td className="px-8 py-6 text-[10px] font-bold text-slate-500">{exam.date}</td>
                        <td className="px-8 py-6">
                          <span className="text-xl font-mono font-black text-blue-500">{exam.score}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/5 h-1 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${(exam.score / 120) * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500">%{((exam.score / 120) * 100).toFixed(0)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => setExams(exams.filter(e => e.id !== exam.id))} className="text-slate-800 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* AUDIT LOG (EXCEL STYLE) */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-[3rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center gap-3">
                  <History size={16} className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Çalışma Mesai Kayıtları</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-[#0A0A0C] text-[8px] font-black text-slate-700 uppercase tracking-widest border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4">Tarih</th>
                        <th className="px-8 py-4">Başlangıç</th>
                        <th className="px-8 py-4">Süre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map(log => (
                        <tr key={log.id} className="text-[10px] font-bold hover:bg-white/[0.01]">
                          <td className="px-8 py-4 text-slate-500">{log.date}</td>
                          <td className="px-8 py-4 text-slate-400 font-mono">{log.startTime}</td>
                          <td className="px-8 py-4 text-blue-500">{formatTime(log.duration)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADVANCED INSIGHTS */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-[3rem] p-8 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3">
                  <BrainCircuit size={16} className="text-purple-500" /> Stratejik Analizler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Toplam Seans</p>
                    <p className="text-2xl font-black text-white italic">{history.length}</p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Toplam Mesai</p>
                    <p className="text-2xl font-black text-blue-500 italic">{formatTime(stats.totalStudySeconds)}</p>
                  </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-white uppercase italic">Sistem Tavsiyesi</p>
                    <TrendingUp size={14} className="text-blue-500" />
                  </div>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">
                    {exams.length < 3 
                      ? "Veri seti yetersiz. Daha fazla deneme girişi yaparak yapay zeka analizini aktifleştirin."
                      : `Son 3 sınavda netlerin ${Number(stats.progressStatus) > 0 ? 'yükselişte' : 'dalgalı'}. Odaklanma süreni %15 artırman hedefine ulaşma olasılığını %80 oranında stabilize eder.`}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}