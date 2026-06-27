import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

const TRENDING = ["Winter coats", "Knitwear", "Denim", "Accessories"];

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setTimeout(() => setQuery(""), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-50 flex items-start justify-center
            bg-black/30 backdrop-blur-sm
            p-3 sm:p-4 pt-10 sm:pt-20
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              w-full
              max-w-[95%] sm:max-w-xl lg:max-w-2xl
              rounded-2xl sm:rounded-3xl
              bg-white
              p-4 sm:p-6 lg:p-7
              shadow-2xl
            "
          >
            {/* INPUT */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 sm:pb-4">
              <Search size={18} className="text-gray-400 shrink-0" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, collections..."
                className="
                  flex-1
                  text-sm sm:text-base
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                "
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}

              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="pt-4 sm:pt-5">
              {query ? (
                <p className="py-10 sm:py-12 text-center text-sm text-gray-500">
                  No results yet — hook this up to your search logic
                </p>
              ) : (
                <>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Trending
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="
                          rounded-full border border-gray-200
                          px-3 py-1.5
                          text-xs sm:text-sm
                          text-gray-700
                          hover:bg-gray-50
                          transition
                        "
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;