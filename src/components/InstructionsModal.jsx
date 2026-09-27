import { useEffect, useState } from "react";

const Key = ({ children, wide = false }) => (
  <span className={`key${wide ? " key-wide" : ""}`}>{children}</span>
);

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
        className={`welcome-modal pointer-events-auto transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="welcome-title">Hi, I'm Victoria! 👋</h2>

        {isMobile ? (
          <div className="welcome-keys">
            <div className="welcome-key-col">
              <span className="key key-round">
                <span className="key-dot" />
              </span>
              <span className="welcome-key-label">steer</span>
            </div>
            <div className="welcome-key-col">
              <Key>▲</Key>
              <span className="welcome-key-label">climb</span>
            </div>
            <div className="welcome-key-col">
              <Key>▼</Key>
              <span className="welcome-key-label">dive</span>
            </div>
          </div>
        ) : (
          <div className="welcome-keys">
            <div className="welcome-wasd">
              <span />
              <Key>W</Key>
              <span />
              <Key>A</Key>
              <Key>S</Key>
              <Key>D</Key>
            </div>
            <div className="welcome-key-col">
              <Key wide>Space</Key>
              <span className="welcome-key-label">climb</span>
            </div>
            <div className="welcome-key-col">
              <Key wide>Shift</Key>
              <span className="welcome-key-label">dive</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onAssistChange?.(!assistEnabled)}
          className="welcome-assist hud-chip"
          aria-pressed={assistEnabled}
        >
          <span>Flight assist</span>
          <span className={`hud-state${assistEnabled ? " is-on" : ""}`}>
            {assistEnabled ? "On" : "Off"}
          </span>
        </button>

        <button type="button" onClick={onClose} className="welcome-start">
          Start
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;
