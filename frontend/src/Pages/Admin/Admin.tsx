import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaBold, FaItalic, FaCode, FaLink, FaImage, FaPlus, FaNewspaper, FaEnvelope, FaUsers, FaSignOutAlt } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import Posts from "./components/Posts";
import { config } from "../../components/config";
import ContactsList from "./components/ContactList";
import SubscribersList from "./components/SubscribersList";

const CreateBlog = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subs, setSubs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCover(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

  const checkPassw = async () => {
    setError("");
    if (!username || !password) return setError("Lütfen tüm alanları doldurun.");

    try {
      setLoading(true);
      const [loginRes, subsRes, contactsRes] = await Promise.all([
        axios.post(`${config.api}/api/login`, { username, password }),
        axios.post(`${config.api}/api/admin/all-subs`, { username, password }),
        axios.post(`${config.api}/api/admin/all-contacts`, { username, password })
      ]);

      if (loginRes.data.success) {
        setIsLoggedIn(true);
        setSubs(subsRes.data);
        setContacts(contactsRes.data);
      } else {
        setError("Yetkisiz erişim.");
      }
    } catch (err: any) {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !content) return alert("Lütfen zorunlu alanları doldurun!");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slugify(title));
    formData.append("category", category);
    formData.append("content", content);
    if (cover) formData.append("cover", cover);

    try {
      await axios.post(`${config.api}/api/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog başarıyla yayınlandı!");
      setTitle(""); setContent(""); setCategory(""); setPreview(null);
      setActiveTab("posts");
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        activeTab === id ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
    >
      <Icon /> {label}
    </button>
  );

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-3xl font-bold mb-2 text-center">Admin Paneli</h2>
            <p className="text-gray-400 text-center mb-8">Devam etmek için kimliğinizi doğrulayın.</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                className="w-full px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none transition-all"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Şifre"
                className="w-full px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={checkPassw}
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-6">
          <TabButton id="create" icon={FaPlus} label="Yeni Yazı" />
          <TabButton id="posts" icon={FaNewspaper} label="Yazılarım" />
          <TabButton id="contacts" icon={FaEnvelope} label={`Mesajlar (${contacts.length})`} />
          <TabButton id="subs" icon={FaUsers} label={`Aboneler (${subs.length})`} />
          <button onClick={() => window.location.reload()} className="ml-auto text-gray-500 hover:text-red-400 flex items-center gap-2">
            <FaSignOutAlt /> Çıkış
          </button>
        </div>

        <div className="animate-in fade-in duration-500">
          {activeTab === "create" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
                <h3 className="text-xl font-semibold">İçerik Editörü</h3>
                <input
                  type="text"
                  placeholder="Başlık girin..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Kategori (örn: Teknoloji, Yaşam)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <div className="flex flex-wrap gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <button onClick={() => insertAtCursor("**Kalın**")} className="p-2 hover:bg-gray-700 rounded"><FaBold /></button>
                  <button onClick={() => insertAtCursor("_İtalik_")} className="p-2 hover:bg-gray-700 rounded"><FaItalic /></button>
                  <button onClick={() => insertAtCursor("```\nKod\n```")} className="p-2 hover:bg-gray-700 rounded"><FaCode /></button>
                  <button onClick={() => insertAtCursor("[Link](url)")} className="p-2 hover:bg-gray-700 rounded"><FaLink /></button>
                  <button onClick={() => insertAtCursor("![Alt](url)")} className="p-2 hover:bg-gray-700 rounded"><FaImage /></button>
                </div>

                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Hikayeni anlat..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 h-80 font-mono focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Kapak Görseli</label>
                  <input type="file" onChange={handleCoverChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer" />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  {loading ? "Yükleniyor..." : "Yayına Al"}
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-400">Canlı Önizleme</h3>
                <div className="bg-white text-gray-900 rounded-2xl p-8 min-h-[600px] shadow-2xl overflow-auto prose prose-indigo max-w-none">
                  {preview && <img src={preview} alt="Kapak" className="w-full h-64 object-cover rounded-xl mb-6" />}
                  <h1 className="text-4xl font-black mb-4">{title || "Başlık Buraya Gelecek"}</h1>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Henüz bir içerik yazılmadı...*"}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {activeTab === "posts" && <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800"><Posts /></div>}
          
          {activeTab === "contacts" && (
            <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
               <ContactsList contacts={contacts} onDelete={() => {}} />
            </div>
          )}

          {activeTab === "subs" && (
            <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
              <SubscribersList subscribers={subs} onDelete={() => {}} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateBlog;