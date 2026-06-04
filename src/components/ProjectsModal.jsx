import { useEffect, useState } from "react";
import Projects from "../pages/Projects";

const ProjectsModal = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
    setShow(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative transition-all duration-300 ${
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-[16px] z-10 text-gray-400 hover:text-gray-700 text-3xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <Projects embedded />
      </div>
    </div>
  );
};

export default ProjectsModal;
