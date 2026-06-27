import { Calendar1, Clock, Handshake } from "lucide-react";
import blog1 from '../../assets/blog_01.avif'
import blog2 from '../../assets/blog_02.avif'
import blog3 from '../../assets/blog_03.avif'
import SectionHeader from "../SectionHeader";

const BlogSection = () => {
  return ( 
    <section className="bg-[#f8f8f8] py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">
      
      <SectionHeader
  badge="Wearix Voice"
  icon={<Handshake size={13} />}
  heading={<>Elevate your <br /> daily style journey</>}
  ctaLabel="Read all blogs"
  ctaLink="/blog"
/>

      {/* Blog Card */}
<div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden min-h-[300px] lg:h-[400px]">        
        {/* Image — takes up half */}
<div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] lg:h-auto flex-shrink-0 overflow-hidden">
          <img src={blog1} alt="Blog cover" className="w-full h-full object-cover object-top hover:scale-105  transition-all duration-300" />
        </div>

        {/* Content — sits flush against the image */}
       <div className="w-full lg:w-1/2 bg-[#eeeeee] p-5 sm:p-6 lg:p-8 flex flex-col gap-6 justify-between">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white text-xs font-medium text-black shadow-sm overflow-hidden">
              <span className="px-3 py-1.5">Style Guide</span>
            </span>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight tracking-wide text-black">
              How to master the art of minimal street style
            </h2>
            <p className="text-sm text-black/60 leading-relaxed max-w-100">
              Build a timeless, comfortable wardrobe with high-quality fabrics, muted tones, and effortless oversized fits.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-black">
            <span className="flex items-center gap-1.5"><Clock size={16}/> 8 min read</span>
            <span>|</span>
            <span className="flex items-center gap-1.5"><Calendar1 size={16}/> Jan 29, 2026</span>
          </div>
        </div>

      </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden min-h-[180px]">
        
        {/* Image — takes up half */}
       <div className="w-full sm:w-1/2 h-[220px] sm:h-auto overflow-hidden">
          <img src={blog2} alt="Blog cover" className="w-full h-full object-cover object-top hover:scale-105  transition-all duration-300" />
        </div>

        {/* Content — sits flush against the image */}
       <div className="w-full sm:w-1/2 bg-[#eeeeee] p-4 sm:p-5 flex flex-col gap-4 justify-between">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white text-xs font-medium text-black shadow-sm overflow-hidden">
              <span className="px-3 py-1.5">Fashion Tips</span>
            </span>
            <h2 className="text-lg sm:text-xl font-semibold leading-tight tracking-wide text-black">
Elevate everyday outfits using modern minimalist styling            </h2>
          

          <div className="flex items-center gap-2 text-sm text-black/70">
            <span className="flex items-center "><Clock size={16}/> 8 min read</span>
            <span>|</span>
            <span className="flex items-center"><Calendar1 size={16}/> 12/30/2026</span>
          </div>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden min-h-[180px]">
        
        {/* Image — takes up half */}
        <div className="w-full sm:w-1/2 h-[220px] sm:h-auto overflow-hidden">
          <img src={blog3} alt="Blog cover" className="w-full h-full object-cover object-top hover:scale-105  transition-all duration-300" />
        </div>

        {/* Content — sits flush against the image */}
       <div className="w-full sm:w-1/2 bg-[#eeeeee] p-4 sm:p-5 flex flex-col gap-4 justify-between">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white text-xs font-medium text-black shadow-sm overflow-hidden">
              <span className="px-3 py-1.5">Style Guide</span>
            </span>
            <h2 className="text-lg sm:text-xl font-semibold leading-tight tracking-wide text-black">
Build a capsule wardrobe that works year round
            </h2>
          

          <div className="flex items-center gap-2 text-sm text-black/70">
            <span className="flex items-center gap-1"><Clock size={16}/> 5 min read</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Calendar1 size={16}/> 11/22/2026</span>
          </div>
        </div>

      </div>
      </div>
</div>
    </section>
  )
}

export default BlogSection