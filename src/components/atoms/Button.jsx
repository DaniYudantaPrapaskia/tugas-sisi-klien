export default function Button({ children, className = "", ...props }) {
   return (
      <button
         className={`px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 ${className}`}
         {...props}
      >
         {children}
      </button>
   );
}
