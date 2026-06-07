/**
 * Shared touch input for mobile flight. The on-screen joystick / buttons
 * write here; PlaneController reads it each frame and merges with keyboard.
 * Using a module singleton keeps it outside React render for zero-lag input.
 */
export const touchInput = {
  active: false,
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  up: false,
  down: false,
};

const THRESHOLD = 0.28;

/** Update steering from a normalized joystick vector (x,y in [-1,1], y up). */
export const setJoystick = (x, y) => {
  touchInput.active = true;
  touchInput.forward = y > THRESHOLD;
  touchInput.backward = y < -THRESHOLD;
  touchInput.rightward = x > THRESHOLD;
  touchInput.leftward = x < -THRESHOLD;
};

export const resetJoystick = () => {
  touchInput.forward = false;
  touchInput.backward = false;
  touchInput.leftward = false;
  touchInput.rightward = false;
};

export const setClimb = (v) => {
  touchInput.active = true;
  touchInput.up = v;
};

export const setDive = (v) => {
  touchInput.active = true;
  touchInput.down = v;
};
