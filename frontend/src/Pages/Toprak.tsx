import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Header from '../components/Header';

const PROFILE_PIC_URL = "https://toprak-dogan.vercel.app/toprak.jpg";

const GALLERY_IMAGES = [
    "https://toprak-dogan.vercel.app/toprak.jpg",
    "https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/toprak-picture.jpg",
    "https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/toprak-banner-2.jpg"
];

const ABOUT_ME_CONTENT = "I’m a passionate and self-driven student focused on software, game development, and entrepreneurship. I enjoy building creative and functional solutions through technology, especially in game engines and full-stack development. I’m also interested in finance, history, and 3D design. My goal is to create innovative tools that impact real people.";

const SKILLS = [
    "Game Development (Unreal & Unity)",
    "Frontend Development (React, Vite, TypeScript)",
    "Backend APIs (Node.js, Express)",
    "3D Art & Design",
];

const HOBBIES = [
    "Creating Games",
    "Learning History & Philosophy",
    "Design & Visual Art",
    "Finance and Trading"
];

const EXPERIENCE = [
    {
        role: "Game Developer & Software Creator",
        company: "Independent Projects",
        period: "2024 – Present",
        description: "Developed several games and web platforms using Unreal Engine, Unity, and full-stack web technologies. Projects include simulation games, company websites, and creative tools for users.",
    },
];

const ORGANIZATIONS = [
    {
        name: "Ragberd Games",
        role: "Co-Founder / Game Company",
        period: "2025",
    },
    {
        name: "Linux Foundation",
        role: "Member",
        period: "Since 2025",
    },
    {
        name: "Google Developer Groups",
        role: "Active Participant",
        period: "Present",
    },
];

const EDUCATION = [
    {
        institution: "Şişli Vocational and Technical Anatolian High School",
        degree: "Electrical & Electronics Department",
        period: "2023 - Present",
    }
];

const CONTACT_INFO = {
    location: "Istanbul, Türkiye",
    email: "altintoprak@gmail.com",
    phone: "+90 501 12* ** **",
    github: "https://github.com/TPashaxrd",
    linkedin: "https://linkedin.com/in/",
};

const LANGUAGES = [
    { name: "Turkish", level: "Native" },
    { name: "English", level: "Intermediate – B1/B2" },
    { name: "Russian", level: "Basic A1"}
];

const COURSES = [
    { name: "Cybersecurity Fundamentals", provider: "Udemy" },
    { name: "Linux Foundation Certificate", provider: "Online" },
    { name: "Frontend Develop & React", provider: "Self-taught" },
    { name: "Backend Express.js & MongoDB", provider: "Self-taught" },
    { name: "3D Modelling & Animation - Blender", provider: "Self-taught" },
];

const SOFTWARE = [
    {
        name: "Schioz Eye",
        tech: "Unreal Engine 5.6",
        description: "A psychological story game about a man dealing with loss and schizophrenia.",
        url: "https://ragberdgames.com"
    },
    {
        name: "Cordision Notepadd",
        tech: "React & Electron.js",
        description: "A Better UI Notepadd - made by Cordision",
        url: "https://cordision.vercel.app"
    },
    {
        name: "IRCChat",
        tech: "Python & HTTP",
        description: "A IRC Chat on Terminal (cmd)",
        url: "https://github.com/TPashaxrd/IRC-Chat"
    }
];

const WEBSITES = [
    { name: "RagberdGames", description: "Official site for my game projects", url: "#" },
    { name: "Cordision", description: "Backend API & service logic showcase", url: "#" },
    { name: "Toprak.xyz", description: "for Toprak Personal & Blog Website", url: "https://toprak.xyz"}
];

const INTERESTS = [
    "Artificial Intelligence",
    "Cybersecurity & Software",
    "Game Mechanics & Narrative Design",
    "3D Modeling",
    "Entrepreneurship & Startups",
    "History, Religion & Philosophy"
];

const IconExternalLink: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);
const IconEmail: React.FC<{className?: string}> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const IconPhone: React.FC<{className?: string}> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const IconLocation: React.FC<{className?: string}> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HeaderTwo: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Education', href: '#education' },
        { name: 'Contact', href: '#contact' },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    }, [isMenuOpen]);

    const scrollTo = (id: string) => {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };
  
    const menuVariants = {
        opened: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        closed: { opacity: 0, y: "-100%" },
    };

    const linkVariants = {
        opened: { opacity: 1, y: 0 },
        closed: { opacity: 0, y: 20 },
    };

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-purple-500/20' : 'bg-transparent'}`}
                initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-2xl font-bold text-white hover:text-purple-400 transition-colors z-50">*</a>
                    <nav className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href); }} className="text-gray-300 hover:text-purple-400 transition-colors font-semibold relative group">
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                        ))}
                    </nav>
                    <div className="md:hidden z-50">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            <motion.div animate={isMenuOpen ? "opened" : "closed"} className="space-y-1.5">
                                <motion.span variants={{ closed: { rotate: 0, y: 0 }, opened: { rotate: 45, y: 7 } }} className="block w-6 h-0.5 bg-white"></motion.span>
                                <motion.span variants={{ closed: { opacity: 1 }, opened: { opacity: 0 } }} className="block w-6 h-0.5 bg-white"></motion.span>
                                <motion.span variants={{ closed: { rotate: 0, y: 0 }, opened: { rotate: -45, y: -7 } }} className="block w-6 h-0.5 bg-white"></motion.span>
                            </motion.div>
                        </button>
                    </div>
                </div>
            </motion.header>
            <AnimatePresence>
                {isMenuOpen && (
                   <motion.div variants={menuVariants} initial="closed" animate="opened" exit="closed" className="fixed inset-0 bg-gray-900/90 backdrop-blur-lg z-30 flex flex-col items-center justify-center space-y-8">
                        {navLinks.map((link) => (
                            <motion.a key={link.name} variants={linkVariants} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href); }} className="text-3xl font-semibold text-gray-200 hover:text-purple-400 transition-colors">{link.name}</motion.a>
                        ))}
                   </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const GalleryModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center overflow-auto p-6 backdrop-blur-sm">
                <button onClick={onClose} className="absolute top-6 right-6 text-white text-4xl font-bold hover:text-purple-500 transition-colors">&times;</button>
                <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }} className="text-4xl text-white mb-8">Myself</motion.h2>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                    {GALLERY_IMAGES.map((img, i) => (
                        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.05, rotate: 1, boxShadow: "0 0 20px #a78bfa" }} className="overflow-hidden rounded-xl shadow-lg cursor-pointer">
                            <img src={img} alt={`Gallery image ${i + 1}`} className="w-full h-48 object-cover transition-transform duration-500" />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const Section: React.FC<{id: string, title: string, children: React.ReactNode, className?: string}> = ({ id, title, children, className = '' }) => (
    <motion.section id={id} className={`container mx-auto px-4 sm:px-6 lg:px-8 py-16 ${className}`} initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 className="text-4xl font-bold text-white mb-12 text-center" variants={{ offscreen: { opacity: 0, y: -50 }, onscreen: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}>{title}</motion.h2>
        {children}
    </motion.section>
);

const TimelineItem: React.FC<{item: {title: string, subtitle: string, period: string, description?: string}}> = ({ item }) => (
    <motion.div className="relative" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="absolute -left-[49px] top-1 w-6 h-6 bg-purple-600 rounded-full border-4 border-gray-900"></div>
        <h3 className="text-xl font-bold text-purple-400">{item.title}</h3>
        <p className="font-semibold text-white">{item.subtitle} / {item.period}</p>
        {item.description && <p className="text-gray-400 mt-2">{item.description}</p>}
    </motion.div>
);

const InfoCard: React.FC<{item: {name: string, description: string, tech?: string, url: string}}> = ({ item }) => (
     <motion.div 
        className="bg-gray-800/40 rounded-xl p-6 border border-purple-800/30 flex flex-col"
        whileHover={{ scale: 1.05, y: -5, boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }}
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
    >
        <h3 className="text-xl font-bold text-white">{item.name}</h3>
        {item.tech && <p className="text-purple-400 text-sm mb-2">{item.tech}</p>}
        <p className="text-gray-400 flex-grow mb-4">{item.description}</p>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors mt-auto font-semibold">
            <IconExternalLink />
            <span>Visit Site</span>
        </a>
    </motion.div>
);


const App = () => {
  const [isGalleryOpen, setGalleryOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <title>Toprak - Information</title>
      <Header />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <HeaderTwo />
      
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen pt-32 pb-16">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:w-1/2 text-center lg:text-left">
            <span onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' }) } className='font-inter'>(Scroll to bottom)</span>
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 text-white">Toprak Doğan</h1>
            <h2 className="text-xl sm:text-2xl text-purple-400 font-semibold mb-6">Entrepreneur / Game & Software Developer</h2>
            <button className='font-space-grotesk text-gray-300 transition duration-300 hover:text-gray-300/60' onClick={() => window.location.href = "https://toprak-dogan.vercel.app"}>ToprakDogan CV</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:w-1/2 flex justify-center lg:justify-end cursor-pointer group" onClick={() => setGalleryOpen(true)}>
            <div className="relative">
              <img src={PROFILE_PIC_URL} alt="Toprak Doğan" className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-full shadow-2xl border-4 border-purple-600 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-full border-4 border-purple-600 animate-ping opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            </div>
          </motion.div>
        </div>

        <Section id="about" title="About Me">
            <motion.div variants={{ offscreen: { opacity: 0, y: 50 }, onscreen: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }} className="bg-gray-800/40 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto text-center border border-purple-800/30">
                <p className="text-gray-200 text-lg leading-relaxed">{ABOUT_ME_CONTENT}</p>
            </motion.div>
        </Section>
        
        <Section id="skills" title="Skills">
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {SKILLS.map((skill, idx) => (
              <motion.div key={skill} className="bg-gray-800/40 text-purple-300 font-semibold px-5 py-3 rounded-lg border border-purple-800/30"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                {skill}
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience & Organizations">
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-16">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-8 text-center md:text-left">Experience</h3>
                    <div className="space-y-12 relative border-l-2 border-purple-800/50 pl-10">
                        {EXPERIENCE.map((exp, idx) => <TimelineItem key={idx} item={{ title: exp.role, subtitle: exp.company, period: exp.period, description: exp.description }} />)}
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-8 text-center md:text-left">Organizations</h3>
                    <div className="space-y-12 relative border-l-2 border-purple-800/50 pl-10">
                        {ORGANIZATIONS.map((org, idx) => <TimelineItem key={idx} item={{ title: org.name, subtitle: org.role, period: org.period }} />)}
                    </div>
                </div>
            </div>
        </Section>
        
         <Section id="projects" title="Projects">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">General</h3>
                    <div className="grid gap-8">{SOFTWARE.map((item, idx) => <InfoCard key={idx} item={item} />)}</div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Websites</h3>
                    <div className="grid gap-8">{WEBSITES.map((item, idx) => <InfoCard key={idx} item={item} />)}</div>
                </div>
            </div>
        </Section>

        <Section id="education" title="Education & Learning">
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-16">
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-8 text-center md:text-left">Formal Education</h3>
                    <div className="space-y-12 relative border-l-2 border-purple-800/50 pl-10">
                        {EDUCATION.map((edu, idx) => <TimelineItem key={idx} item={{ title: edu.degree, subtitle: edu.institution, period: edu.period }} />)}
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-8 text-center md:text-left">Courses & Languages</h3>
                    <div className="space-y-6">
                        {COURSES.map((course, idx) => <div key={idx} className="bg-gray-800/40 p-3 rounded-lg border border-purple-800/30"><strong>{course.name}</strong> - <span className="text-gray-400">{course.provider}</span></div>)}
                        <div className="pt-4 mt-4 border-t border-purple-800/30">
                            {LANGUAGES.map((lang, idx) => <div key={idx} className="bg-gray-800/40 p-3 rounded-lg border border-purple-800/30 mt-2"><strong>{lang.name}</strong> - <span className="text-gray-400">{lang.level}</span></div>)}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
        
        <Section id="interests" title="Interests & Hobbies">
             <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Interests</h3>
                    <div className="flex flex-col items-center gap-2">
                        {INTERESTS.map((item, idx) => <p key={idx} className="text-gray-300">{item}</p>)}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Hobbies</h3>
                     <div className="flex flex-wrap justify-center gap-4">
                        {HOBBIES.map((hobby, idx) => (
                          <motion.div key={hobby} className="bg-gray-800/40 text-purple-300 font-semibold px-5 py-3 rounded-lg border border-purple-800/30"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                            {hobby}
                          </motion.div>
                        ))}
                      </div>
                </div>
            </div>
        </Section>

        <Section id="contact" title="Contact Me">
            <motion.div variants={{ offscreen: { opacity: 0, y: 50 }, onscreen: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }} className="bg-gray-800/40 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto text-center border border-purple-800/30">
                <p className="text-lg text-gray-300 mb-8">Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities.</p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-lg">
                    <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-purple-400 hover:underline"><IconEmail /><span>{CONTACT_INFO.email}</span></a>
                    <div className="flex items-center gap-3"><IconPhone /><span>{CONTACT_INFO.phone}</span></div>
                    <div className="flex items-center gap-3"><IconLocation /><span>{CONTACT_INFO.location}</span></div>
                </div>
            </motion.div>
        </Section>
      </main>

      <GalleryModal isOpen={isGalleryOpen} onClose={() => setGalleryOpen(false)} />
      <Footer />
    </div>
  );
}

export default App