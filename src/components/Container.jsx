export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-2xl mx-auto  sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
