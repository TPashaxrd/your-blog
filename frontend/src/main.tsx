import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NoPage from './Pages/NoPage/NoPage.tsx'
import Blog from './Pages/Blog.tsx'
import Contact from './Pages/Contact.tsx'
import Blogs from './Pages/Blogs.tsx'
import CreateBlog from './Pages/Admin/Admin.tsx'
import Toprak from './Pages/Toprak.tsx'
import Stats from './Pages/Stats/Stats.tsx'
import Time from './Pages/Time.tsx'
import Repaste from './Pages/Repaste/Repaste.tsx'
import ReadNote from './Pages/Repaste/ReadNote.tsx'
import Play from './Pages/Game/Play.tsx'
import Start from './Pages/Game/Start.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<App/>}/>
    <Route path="/blog" element={<Blog/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/blog/:slug" element={<Blogs/>}/>

    <Route path='/time' element={<Time/>}/>

    {/* ADMIN */}
    <Route path="/admin" element={<CreateBlog/>}/>
    <Route path='/admin/stats' element={<Stats/>}/>

    {/* RePaste */}
    <Route path='/repaste' element={<Repaste/>}/>
    <Route path='/note/:id' element={<ReadNote/>}/>

    {/* GAME */}
    <Route path='/play' element={<Play/>}/>
    <Route path='/start' element={<Start/>}/>

    <Route path='/toprak' element={<Toprak/>}/>
    <Route path='/about' element={<Toprak/>}/>
    <Route path="*" element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)