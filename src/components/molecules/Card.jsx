export default function Card({ children }) {
   return (
      <div className="bg-white p-6 rounded-2xl shadow-md md:w-96 md:h-96">
         {children}
      </div>
   );
}
