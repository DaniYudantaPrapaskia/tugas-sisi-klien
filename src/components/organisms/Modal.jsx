import { IoCloseCircleOutline } from "react-icons/io5";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Overlay klik untuk close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl transition"
        >
          <IoCloseCircleOutline />
        </button>

        {/* Content */}
        <div className="mt-2 ">{children}</div>
      </div>
    </div>
  );
}
