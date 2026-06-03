import { useCallback, useRef, useState } from "react";
import {
  setJoystick,
  resetJoystick,
  setClimb,
  setDive,
} from "../scene/touchControls";

const BASE_SIZE = 128;
const KNOB_SIZE = 56;
const MAX_RADIUS = (BASE_SIZE - KNOB_SIZE) / 2;

const Joystick = () => {
  const baseRef = useRef(null);
  const pointerId = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((clientX, clientY) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > MAX_RADIUS) {
      dx = (dx / dist) * MAX_RADIUS;
      dy = (dy / dist) * MAX_RADIUS;
    }
    setKnob({ x: dx, y: dy });
    // y is screen-down-positive; flip so pushing up = forward
    setJoystick(dx / MAX_RADIUS, -dy / MAX_RADIUS);
  }, []);

  const onPointerDown = (e) => {
    pointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX, e.clientY);
  };

  const onPointerMove = (e) => {
    if (pointerId.current !== e.pointerId) return;
    handleMove(e.clientX, e.clientY);
  };

  const onPointerEnd = (e) => {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    setKnob({ x: 0, y: 0 });
    resetJoystick();
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      className="relative rounded-full bg-white/25 border border-white/50 backdrop-blur-sm touch-none select-none"
      style={{ width: BASE_SIZE, height: BASE_SIZE }}
    >
      <div
        className="absolute rounded-full bg-white/80 shadow-lg"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
};

const AltButton = ({ label, onChange, glyph }) => {
  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(true);
  };
  const onUp = () => onChange(false);

  return (
    <button
      type="button"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      aria-label={label}
      className="w-16 h-16 rounded-full bg-white/25 border border-white/50 backdrop-blur-sm text-white text-2xl font-bold flex items-center justify-center touch-none select-none active:bg-white/40"
    >
      {glyph}
    </button>
  );
};

const TouchControls = () => (
  <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex items-end justify-between">
    <div className="pointer-events-auto">
      <Joystick />
    </div>
    <div className="pointer-events-auto flex flex-col gap-3">
      <AltButton label="Climb" glyph="▲" onChange={setClimb} />
      <AltButton label="Dive" glyph="▼" onChange={setDive} />
    </div>
  </div>
);

export default TouchControls;
