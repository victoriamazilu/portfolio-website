import { useEffect, useState } from "react";

const InstructionsModal = ({
  isOpen,
  onClose,
  assistEnabled,
  onAssistChange,
  isMobile = false,
}) => {
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div
        className={`bg-white/80 rounded-2xl shadow-2xl border border-white/60 p-8 max-w-md w-full text-center relative pointer-events-auto transition-all duration-300 ${
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Hi, I'm Victoria! 👋
        </h2>
        <p className="text-sm text-slate-700 mb-6 leading-relaxed">
          Welcome to my portfolio. You're the pilot! fly through the glowing
          hoops to unlock my experience and projects along the way.
        </p>

        {isMobile ? (
          <div className="flex items-center justify-center gap-5 mb-6 text-slate-700">
            <div className="text-xs text-slate-600">
              <span className="w-12 h-12 rounded-full bg-white/80 border border-white/80 flex items-center justify-center mx-auto">
                <span className="w-5 h-5 rounded-full bg-blue-500" />
              </span>
              <span className="text-slate-500 mt-0.5 block">steer</span>
            </div>
            <span className="text-slate-400">·</span>
            <div className="text-xs text-slate-600">
              <span className="bg-white/80 rounded py-1 px-2 font-mono block">▲</span>
              <span className="text-slate-500 mt-0.5 block">climb</span>
            </div>
            <div className="text-xs text-slate-600">
              <span className="bg-white/80 rounded py-1 px-2 font-mono block">▼</span>
              <span className="text-slate-500 mt-0.5 block">dive</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-5 mb-6 text-slate-700">
            <div className="grid grid-cols-3 gap-1 font-mono text-xs">
              <span />
              <span className="bg-white/80 rounded py-1 px-2">W</span>
              <span />
              <span className="bg-white/80 rounded py-1 px-2">A</span>
              <span className="bg-white/80 rounded py-1 px-2">S</span>
              <span className="bg-white/80 rounded py-1 px-2">D</span>
            </div>
            <span className="text-slate-400">·</span>
            <div className="text-xs text-slate-600">
              <span className="bg-white/80 rounded py-1 px-2 font-mono block">Space</span>
              <span className="text-slate-500 mt-0.5 block">climb</span>
            </div>
            <div className="text-xs text-slate-600">
              <span className="bg-white/80 rounded py-1 px-2 font-mono block">Shift</span>
              <span className="text-slate-500 mt-0.5 block">dive</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onAssistChange?.(!assistEnabled)}
          className="flex items-center justify-between gap-3 w-full border-t border-white/60 pt-4 mb-6"
          aria-pressed={assistEnabled}
        >
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">Flight assist</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {assistEnabled
                  ? "Gently steers you along the path"
                  : "Off — fully manual flying"}
              </p>
            </div>
            <span
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                assistEnabled ? "bg-blue-500" : "bg-slate-400"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  assistEnabled ? "translate-x-5" : ""
                }`}
              />
            </span>
          </button>

        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;
