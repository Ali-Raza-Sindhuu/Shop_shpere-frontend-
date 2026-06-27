const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-[#eeeeee] bg-white p-5 ${className}`}>
    {children}
  </div>
);

export default Card