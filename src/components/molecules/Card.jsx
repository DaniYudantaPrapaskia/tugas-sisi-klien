export default function Card({ children }) {
   return (
      <div className="bg-white p-8 rounded-xl shadow-lg md:w-[420px] animate-fadeIn">
         {children}
      </div>
   );
}
