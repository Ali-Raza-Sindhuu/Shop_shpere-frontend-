import { Calendar1, Clock } from "lucide-react";

const BlogCard = ({ blog, large = false }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-all duration-300 ${
        large ? "lg:h-[420px]" : "lg:h-[220px]"
      }`}
    >
      {/* IMAGE */}
      <div className="w-full sm:w-1/2 h-[200px] sm:h-auto flex-shrink-0 overflow-hidden cursor-pointer">
        <img
          src={blog.img}
          alt={blog.title}
          className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-300"
        />
      </div>

      {/* CONTENT */}
      <div
        className={`w-full sm:w-1/2 bg-[#eeeeee] flex flex-col justify-between ${
          large ? "p-5 sm:p-6 lg:p-8 gap-6 lg:gap-8" : "p-4 sm:p-5 gap-4"
        }`}
      >
        {/* CATEGORY */}
        <span className="inline-flex items-center self-start rounded-full border border-black/10 bg-white text-xs font-medium text-black shadow-sm">
          <span className="px-3 py-1.5">{blog.category}</span>
        </span>

        {/* TITLE + DESC */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <h2
            className={`leading-tight text-black ${
              large
                ? "text-xl sm:text-2xl lg:text-4xl font-medium"
                : "text-lg sm:text-xl font-medium"
            }`}
          >
            {blog.title}
          </h2>

          {large && (
            <p className="text-sm sm:text-base text-black/60 leading-relaxed">
              {blog.desc}
            </p>
          )}
        </div>

        {/* META */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-black/70">
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {blog.read}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1.5">
            <Calendar1 size={14} /> {blog.date}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;