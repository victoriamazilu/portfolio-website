import { useState } from "react";

const MovementInstructions = ({ visible }) => {
  const [showControls, setShowControls] = useState(true);

  if (!visible) return null;

  return (
    <div className="absolute bottom-6 right-6 z-10 max-w-xs">
      <button
        type="button"
        onClick={() => setShowControls((prev) => !prev)}
        className="mb-2 text-xs font-semibold text-slate-600 bg-white/90 hover:bg-white px-3 py-1.5 rounded-lg shadow-md border border-white/60"
      >
        {showControls ? "Hide controls" : "Show controls"}
      </button>

      {showControls && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-white/60 p-4 text-xs text-slate-600 space-y-3">
          <p className="font-semibold text-slate-800">Fly the plane</p>
          <div className="grid grid-cols-3 gap-1 text-center font-mono max-w-[9rem] mx-auto">
            <span />
            <span className="bg-slate-100 rounded py-1">W</span>
            <span />
            <span className="bg-slate-100 rounded py-1">A</span>
            <span className="bg-slate-100 rounded py-1">S</span>
            <span className="bg-slate-100 rounded py-1">D</span>
          </div>
          <p>
            <span className="font-semibold">Space</span> — up ·{" "}
            <span className="font-semibold">Shift</span> — down
          </p>
          <p className="text-slate-500">Fly between the two islands to explore.</p>
        </div>
      )}
    </div>
  );
};

export default MovementInstructions;
