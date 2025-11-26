import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import axios from 'axios'
interface BlogPost {
  slug: string;
}

async function getBlogSlugs() {
  const res = await axios.get('https://api.toprak.xyz/api/post')
  return res.data.map((post: BlogPost) => `/blog/${post.slug}`)
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'prerender-blog-posts',
      async buildStart() {
        const routes = await getBlogSlugs()
        console.log('Prerendering routes:', routes)
      }
    }
  ]
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,
//     port: 5173,
//     allowedHosts: ['toprak.xyz']
//   }
// })