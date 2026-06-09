import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, UserCircle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function SocialFeedWorkspace({ config }: { config: CareerConfig }) {
  const [posts, setPosts] = useState([
    { id: 1, author: 'Sara Jennings', handle: '@sara_j', time: '2m', content: 'Just launched our new ad campaign. The ROI so far is looking incredibly promising. #marketing #growth', likes: 124, comments: 12, rt: 5, sentiment: 'positive' },
    { id: 2, author: 'Tech Insider', handle: '@tech_insider', time: '15m', content: 'BREAKING: Major algorithm change coming to the main feed next week. Engagement metrics expected to drop by 15% across the board.', likes: 450, comments: 89, rt: 210, sentiment: 'negative' },
    { id: 3, author: 'Client Brand', handle: '@brand_official', time: '1h', content: 'We are loving the new creative direction! Great work from the agency team bringing our vision to life. 🚀🚀', likes: 890, comments: 45, rt: 12, sentiment: 'positive' },
    { id: 4, author: 'UX Daily', handle: '@ux_daily', time: '3h', content: 'Is copywriting the most underrated part of UX? We think so. A good microcopy can increase conversion by up to 20%.', likes: 2100, comments: 156, rt: 430, sentiment: 'neutral' },
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([{
      id: Date.now(),
      author: config.name,
      handle: `@${config.name.replace(/\s+/g, '').toLowerCase()}`,
      time: 'Just now',
      content: newPost,
      likes: 0,
      comments: 0,
      rt: 0,
      sentiment: 'neutral'
    }, ...posts]);
    setNewPost('');
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-[#15202b] text-white font-sans border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="w-[280px] hidden lg:flex flex-col border-r border-[#38444d] p-4 shrink-0">
         <div className="w-12 h-12 rounded-full bg-indigo-500 mb-6 flex items-center justify-center font-bold text-xl shadow-lg">
           {config.name.charAt(0)}
         </div>
         <div className="space-y-4 text-xl font-bold">
            <div className="flex items-center gap-4 hover:bg-[#253341] p-3 rounded-full cursor-pointer w-fit pr-6 transition">
              <span className="w-6 h-6 border-2 border-white rounded-full"></span> Home
            </div>
            <div className="flex items-center gap-4 hover:bg-[#253341] p-3 rounded-full cursor-pointer w-fit pr-6 transition text-indigo-400">
              <span className="w-6 h-6 border-2 border-indigo-400 rounded-full"></span> Mentions
            </div>
            <div className="flex items-center gap-4 hover:bg-[#253341] p-3 rounded-full cursor-pointer w-fit pr-6 transition text-zinc-400">
              <span className="w-6 h-6 border-2 border-zinc-400 rounded-full"></span> Analytics
            </div>
         </div>
         <button className="mt-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-full w-full transition shadow-lg">
           Post
         </button>
      </div>

      <div className="flex-1 border-r border-[#38444d] overflow-y-auto min-h-0 relative">
         <div className="sticky top-0 bg-[#15202b]/95 backdrop-blur-md p-4 border-b border-[#38444d] z-10">
           <h2 className="text-xl font-bold">Latest Mentions</h2>
         </div>
         
         <div className="p-4 border-b border-[#38444d]">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500 shrink-0"></div>
              <div className="flex-1">
                 <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="What's happening?" className="w-full bg-transparent text-xl font-medium outline-none resize-none placeholder-[#8899a6] mt-2 mb-4" rows={2}></textarea>
                 <div className="flex justify-between items-center border-t border-[#38444d] pt-4">
                   <div className="text-indigo-400 font-medium">Everyone can reply</div>
                   <button onClick={handlePost} disabled={!newPost.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed">
                     Post
                   </button>
                 </div>
              </div>
            </div>
         </div>

         <div className="pb-20">
           <AnimatePresence>
           {posts.map(post => (
             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} key={post.id} className="p-4 border-b border-[#38444d] hover:bg-[#1c2732] transition cursor-pointer flex gap-4">
               <div className="w-12 h-12 rounded-full bg-zinc-700 shrink-0 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-zinc-400" />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <div>
                       <span className="font-bold mr-1 hover:underline">{post.author}</span>
                       <span className="text-[#8899a6]">{post.handle} · {post.time}</span>
                     </div>
                     <MoreHorizontal className="w-5 h-5 text-[#8899a6]" />
                  </div>
                  <p className="mt-1 text-[15px] leading-snug">{post.content}</p>
                  <div className="flex justify-between mt-4 text-[#8899a6] max-w-md">
                     <div className="flex items-center gap-2 hover:text-indigo-400 transition group"><MessageCircle className="w-4 h-4 group-hover:bg-indigo-500/10 rounded-full" /> {post.comments}</div>
                     <div className="flex items-center gap-2 hover:text-emerald-400 transition group"><Share2 className="w-4 h-4 group-hover:bg-emerald-500/10 rounded-full" /> {post.rt}</div>
                     <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 hover:text-rose-400 transition group cursor-pointer"><Heart className="w-4 h-4 group-hover:bg-rose-500/10 rounded-full" /> {post.likes}</button>
                     <div className="flex items-center gap-2 hover:text-indigo-400 transition group"><Activity className="w-4 h-4 group-hover:bg-indigo-500/10 rounded-full" /></div>
                  </div>
               </div>
             </motion.div>
           ))}
           </AnimatePresence>
         </div>
      </div>

      <div className="w-[350px] hidden xl:flex flex-col p-4 shrink-0">
         <div className="bg-[#273340] rounded-full p-3 flex items-center gap-3 text-[#8899a6] focus-within:bg-[#15202b] focus-within:border focus-within:border-indigo-500 transition border border-transparent">
            <span className="w-5 h-5">🔍</span>
            <input type="text" placeholder="Search" className="bg-transparent outline-none w-full text-white" />
         </div>
         
         <div className="bg-[#1c2732] rounded-2xl p-4 mt-4">
            <h2 className="text-xl font-bold mb-4">Trends for you</h2>
            {[
              { category: 'Trending in Marketing', topic: '#SEO' },
              { category: 'Technology · Trending', topic: 'Algorithm Update' },
              { category: 'Business & Finance', topic: 'Q3 Earnings' }
            ].map((trend, i) => (
              <div key={i} className="mb-4 last:mb-0 hover:bg-[#253341] -mx-4 px-4 py-2 cursor-pointer transition">
                 <div className="text-[13px] text-[#8899a6] flex justify-between">
                   {trend.category} <MoreHorizontal className="w-4 h-4" />
                 </div>
                 <div className="font-bold text-[15px] mt-0.5">{trend.topic}</div>
              </div>
            ))}
         </div>
      </div>
    </motion.div>
  );
}
