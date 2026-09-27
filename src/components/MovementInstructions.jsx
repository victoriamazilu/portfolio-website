import { useState } from "react";

const MovementInstructions = ({ visible }) => {
  const [showControls, setShowControls] = useState(false);

  if (!visible) return null;

  return (
    <div className="ctrl-panel">
      <button
        type="button"
        onClick={() => setShowControls((prev) => !prev)}
        className="hud-chip"
      >
        {showControls ? "Hide controls" : "Show controls"}
      </button>

      {showControls && (
        <div className="ctrl-card">
          <div className="welcome-wasd ctrl-wasd">
            <span />
            <span className="key">W</span>
            <span />
            <span className="key">A</span>
            <span className="key">S</span>
            <span className="key">D</span>
          </div>
          <p className="ctrl-meta">
            Space — climb · Shift — dive
          </p>
        </div>
      )}
    </div>
  );
};

export default MovementInstructions;
