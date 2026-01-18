import { useState, useRef } from 'react';
import { BiVolumeMute, BiRadio } from 'react-icons/bi';

const AmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioUrl = "https://cdn.pixabay.com/audio/2026/01/08/audio_4dab01b03c.mp3"; 
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        audioRef.current.volume = 0.15;
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-12 left-10 z-[100] flex items-center gap-5">
      <button 
        onClick={togglePlay}
        className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border ${
          isPlaying 
          ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
          : 'bg-white/5 border-white/10 hover:border-white/30'
        }`}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <BiRadio className="text-purple-500 animate-spin-slow" size={24} />
            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20"></span>
          </div>
        ) : (
          <BiVolumeMute className="text-gray-500 group-hover:text-white transition-colors" size={24} />
        )}

        <div className="absolute left-full ml-6 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap">
          <div className="bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-xl">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                {isPlaying ? "Frequency Active" : "Initialize Ambience"}
             </p>
          </div>
        </div>
      </button>

      <audio ref={audioRef} src={audioUrl} loop />
    </div>
  );
};

export default AmbientSound;